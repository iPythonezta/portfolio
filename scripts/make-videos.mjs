// Builds web-sized demo clips from the raw screen recordings.
// Only the reviewed, clean segments are used: browser chrome + taskbar are cropped out,
// audio is dropped, and anything showing credentials / third-party data is excluded.
// Usage: node scripts/make-videos.mjs [slug]
import { spawnSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";
import ffmpeg from "ffmpeg-static";

const SRC = "D:/Project Demo Vids";
const OUT = path.resolve("public/media");
const CROP = "crop=1918:900:0:110"; // removes tab strip, address bar, taskbar

const jobs = [
  {
    slug: "acord-form-filler",
    file: "Accord Form Filler - Initial Demo.mp4",
    segments: [[21, 34], [104, 111]],
    loop: [21, 33, 1],
    // sidebar footer shows an agency name -> paint over it with the sidebar colour
    extra: "drawbox=x=0:y=855:w=325:h=45:color=0x0e0c22:t=fill",
  },
  {
    slug: "fb-lead-radar",
    file: "FBLeadRadar - NewDemo.mp4",
    segments: [[106, 155]],
    loop: [112, 150, 2.5],
  },
  {
    slug: "x-automation-suite",
    file: "XComBotDemo.mp4",
    segments: [[130, 178]],
    loop: [130, 160, 2],
  },
];

const only = process.argv[2];
const run = (args) => {
  const r = spawnSync(ffmpeg, ["-y", "-hide_banner", "-loglevel", "error", ...args], { stdio: "inherit" });
  if (r.status !== 0) throw new Error("ffmpeg failed: " + args.join(" "));
};
const mb = (f) => (statSync(f).size / 1048576).toFixed(1) + " MB";

for (const j of jobs) {
  if (only && only !== j.slug) continue;
  const dir = path.join(OUT, j.slug);
  mkdirSync(dir, { recursive: true });
  const input = path.join(SRC, j.file);
  const post = [CROP, j.extra].filter(Boolean).join(",");

  // full cut: concatenate the clean segments
  const parts = j.segments.map(
    ([a, b], i) => `[0:v]trim=start=${a}:end=${b},setpts=PTS-STARTPTS,${post},scale=1280:-2,fps=24[v${i}]`
  );
  const concat = `${j.segments.map((_, i) => `[v${i}]`).join("")}concat=n=${j.segments.length}:v=1:a=0[out]`;
  run([
    "-i", input, "-filter_complex", `${parts.join(";")};${concat}`, "-map", "[out]",
    "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "28", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", path.join(dir, "demo.mp4"),
  ]);

  // short muted loop
  const [ls, le, speed] = j.loop;
  run([
    "-ss", String(ls), "-to", String(le), "-i", input,
    "-vf", `${post},setpts=PTS/${speed},scale=960:-2,fps=20`,
    "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "32", "-pix_fmt", "yuv420p",
    "-movflags", "+faststart", path.join(dir, "loop.mp4"),
  ]);

  // poster from the middle of the loop
  run([
    "-ss", String((ls + le) / 2), "-i", input, "-frames:v", "1",
    "-vf", `${post},scale=1280:-2`, "-q:v", "4", path.join(dir, "poster.jpg"),
  ]);

  console.log(j.slug, "demo", mb(path.join(dir, "demo.mp4")), "loop", mb(path.join(dir, "loop.mp4")));
}
