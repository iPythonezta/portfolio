// Tiny dependency-free syntax highlighter (python-ish). Server-safe.
const KW = new Set(
  "def class return import from if else elif for while in not and or is None True False with as try except raise lambda yield async await pass break continue".split(" ")
);

const TOKEN = /(#.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_][A-Za-z0-9_]*)|(\s+|.)/g;

function tokenize(line: string, lang: string) {
  if (lang === "text") return [<span key="t">{line}</span>];
  const out: React.ReactNode[] = [];
  const re = new RegExp(TOKEN.source, "g");
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(line))) {
    const [t, com, str, num, id] = m;
    const k = i++;
    if (com) out.push(<span key={k} className="italic text-dim">{t}</span>);
    else if (str) out.push(<span key={k} className="text-amber">{t}</span>);
    else if (num) out.push(<span key={k} className="text-violet">{t}</span>);
    else if (id && KW.has(id)) out.push(<span key={k} className="text-pink">{t}</span>);
    else if (id && /^[A-Z]/.test(id)) out.push(<span key={k} className="text-sky">{t}</span>);
    else out.push(<span key={k}>{t}</span>);
  }
  return out;
}

export default function CodeBlock({ file, code, lang }: { file: string; code: string; lang: string }) {
  const lines = code.split("\n");
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-panel">
      <div className="flex items-center gap-2 border-b border-line px-4 py-2">
        <span className="h-3 w-3 rounded-full bg-pink/70" />
        <span className="h-3 w-3 rounded-full bg-amber/70" />
        <span className="h-3 w-3 rounded-full bg-accent/70" />
        <span className="ml-3 font-mono text-xs text-dim">{file}</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6">
        <code>
          {lines.map((l, i) => (
            <div key={i} className="flex">
              <span className="mr-4 w-6 shrink-0 select-none text-right text-dim/50">{i + 1}</span>
              <span className="whitespace-pre">{tokenize(l, lang)}</span>
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
}
