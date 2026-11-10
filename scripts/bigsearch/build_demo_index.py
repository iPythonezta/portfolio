"""
Builds a SMALL base index for BigSearchServer from the sample documents shipped with the
BigSearch repo (100 crawled web pages + 100 CORD-19 papers), so the real server can start
and answer real queries on a laptop that does not have the full 48k-page corpus.

It uses the server's own FileHandler (the same code that produces hit lists at index time),
and writes the same on-disk layout the server loads:

    data/mem_barrels/barrel_<id>/postings.bin + offsets.json   (msgpack postings, byte offsets)
    data/barrels/barrels_index.json                            (word -> [barrel_id, index])
    data/mappings/{ind_to_url,docid_to_title,rps_info}.json
    data/rankings/page_rank_dict.json                          (real PageRank, rescaled to 1-10)

Usage:
    python build_demo_index.py <server_dir> <bigsearch_repo_dir>
"""
import csv, json, os, shutil, sys, tempfile, zlib
from collections import defaultdict
from urllib.parse import urlparse

import ormsgpack

server_dir, repo = sys.argv[1], sys.argv[2]
sys.path.insert(0, server_dir)
os.chdir(server_dir)
from FileHandler.file_handler import FileHandler  # noqa: E402

N_BARRELS = 4
data = os.path.join(server_dir, "data")
for d in ("mem_barrels", "barrels", "mappings", "semantic", "models", "uploads"):
    shutil.rmtree(os.path.join(data, d), ignore_errors=True)
    os.makedirs(os.path.join(data, d), exist_ok=True)

html_dir = os.path.join(repo, "Data", "Files", "raw", "sample")
json_dir = os.path.join(repo, "Data", "Cord 19", "document_parses", "pdf_json", "sample")
ind_to_url_full = json.load(open(os.path.join(repo, "Data", "ind_to_url.json"), encoding="utf-8"))

postings = defaultdict(list)  # word -> [hitlist, ...]
doc_id_to_url, doc_id_to_title, rps_info = {}, {}, {}

# ---- web pages -------------------------------------------------------------------------------
tmp = tempfile.mkdtemp()
html_ids = sorted(int(f[:-5]) for f in os.listdir(html_dir) if f.endswith(".html"))
for n in html_ids:
    url = ind_to_url_full.get(str(n), f"https://example.org/{n}")
    path = os.path.join(tmp, f"H{n}.html")
    shutil.copyfile(os.path.join(html_dir, f"{n}.html"), path)
    try:
        hitlists, title, meta, _text = FileHandler.process_html_file(path, url, f"H{n}")
    except Exception as e:  # skip pages the parser cannot handle
        print("skip html", n, e)
        continue
    for w, hl in hitlists.items():
        postings[w].append(hl)
    doc_id_to_url[str(n)] = url
    doc_id_to_title[str(n)] = [title, meta]

# ---- research papers (CORD-19) -------------------------------------------------------------------
meta_rows = {}
with open(os.path.join(repo, "Data", "Cord 19", "metadata_cleaned.csv"), encoding="utf-8", newline="") as f:
    for row in csv.DictReader(f):
        try:
            meta_rows[int(row["id"])] = (row["title"], row["url"])
        except ValueError:
            pass
json_ids = sorted(int(f[:-5]) for f in os.listdir(json_dir) if f.endswith(".json"))
for n in json_ids:
    path = os.path.join(tmp, f"P{n}.json")
    shutil.copyfile(os.path.join(json_dir, f"{n}.json"), path)
    try:
        hitlists = FileHandler.process_json_file(path)
    except Exception as e:
        print("skip json", n, e)
        continue
    for w, hl in hitlists.items():
        postings[w].append(hl)
    rps_info[str(n)] = list(meta_rows.get(n, ("", "")))

# ---- barrels -------------------------------------------------------------------------------------
buckets = defaultdict(list)
for w in sorted(postings):
    buckets[zlib.crc32(w.encode("utf-8")) % N_BARRELS].append(w)

barrels_index = {}
for bid in range(N_BARRELS):
    bdir = os.path.join(data, "mem_barrels", f"barrel_{bid}")
    os.makedirs(bdir, exist_ok=True)
    offsets, cursor = {}, 0
    with open(os.path.join(bdir, "postings.bin"), "wb") as bf:
        for idx, w in enumerate(buckets[bid]):
            blob = ormsgpack.packb(postings[w])
            bf.write(blob)
            offsets[str(idx)] = [cursor, len(blob)]
            cursor += len(blob)
            barrels_index[w] = [bid, idx]
    json.dump(offsets, open(os.path.join(bdir, "offsets.json"), "w"))

json.dump(barrels_index, open(os.path.join(data, "barrels", "barrels_index.json"), "w", encoding="utf-8"))
json.dump(doc_id_to_url, open(os.path.join(data, "mappings", "ind_to_url.json"), "w", encoding="utf-8"))
json.dump(doc_id_to_title, open(os.path.join(data, "mappings", "docid_to_title.json"), "w", encoding="utf-8"))
json.dump(rps_info, open(os.path.join(data, "mappings", "rps_info.json"), "w", encoding="utf-8"))

# ---- PageRank for the sample pages (real scores from the full crawl, rescaled to 1-10) -------------
scores = {}
with open(os.path.join(repo, "Page Rank Results", "page_rank_output.csv"), newline="") as f:
    for row in csv.reader(f):
        try:
            scores[row[0]] = float(row[1])
        except (ValueError, IndexError):
            pass
ordered = sorted(scores.values())
def pct(v):
    import bisect
    return bisect.bisect_left(ordered, v) / max(1, len(ordered))
page_rank = {doc_id_to_url[k]: round(1 + 9 * pct(scores[k]), 2) for k in doc_id_to_url if k in scores}
json.dump(page_rank, open(os.path.join(data, "rankings", "page_rank_dict.json"), "w"))

json.dump(
    {"last_html_id": len(html_ids), "last_json_id": len(json_ids), "total_documents": len(html_ids) + len(json_ids)},
    open(os.path.join(data, "engine_state.json"), "w"),
)
shutil.rmtree(tmp, ignore_errors=True)
print(f"built: {len(html_ids)} pages + {len(json_ids)} papers, {len(barrels_index)} terms, {N_BARRELS} barrels")
