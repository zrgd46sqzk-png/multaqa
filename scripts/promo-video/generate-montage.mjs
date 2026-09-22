import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "../..");
const framesDir = path.join(__dirname, "frames");
const coversDir = path.join(root, "content/covers");
const outDir = path.join(root, "content/video");
mkdirSync(outDir, { recursive: true });

const W = 1080;
const H = 1920;
const FPS = 30;
const XFADE = 0.16; // transition duration between clips
const INK = "0x14110F";

// Ordered story: intro -> live homepage -> AI products -> courses -> couple games -> closing
const shots = [
  { file: path.join(framesDir, "00-intro.jpg"), dur: 1.2 },
  { file: path.join(framesDir, "01-home.jpg"), dur: 0.9 },
  { file: path.join(coversDir, "ai-prompt-pack-productivity.jpg"), dur: 0.55 },
  { file: path.join(coversDir, "beginners-guide-to-ai.jpg"), dur: 0.55 },
  { file: path.join(coversDir, "prompting-101-course.jpg"), dur: 0.55 },
  { file: path.join(coversDir, "professional-visual-prompts.jpg"), dur: 0.55 },
  { file: path.join(coversDir, "ai-marketing-course.jpg"), dur: 0.55 },
  { file: path.join(coversDir, "freelancing-course.jpg"), dur: 0.55 },
  { file: path.join(coversDir, "ai-ecommerce-course.jpg"), dur: 0.55 },
  { file: path.join(coversDir, "ai-productivity-course.jpg"), dur: 0.55 },
  { file: path.join(coversDir, "netaarafu-aktar.jpg"), dur: 0.55 },
  { file: path.join(coversDir, "jaraa-wa-sarahah.jpg"), dur: 0.55 },
  { file: path.join(coversDir, "kasr-al-rotine.jpg"), dur: 0.55 },
  { file: path.join(coversDir, "awal-maweed.jpg"), dur: 0.55 },
  { file: path.join(framesDir, "99-closing.jpg"), dur: 1.6 },
];

for (const s of shots) {
  if (!existsSync(s.file)) throw new Error(`Missing still: ${s.file}`);
}

const args = ["-y"];
for (const s of shots) {
  args.push("-loop", "1", "-i", s.file);
}

const filterParts = [];
shots.forEach((s, i) => {
  const frames = Math.round(s.dur * FPS);
  // alternate a slow push-in / push-out Ken Burns for visual variety
  const zoomExpr =
    i % 2 === 0
      ? `min(zoom+0.0030,1.12)`
      : `if(eq(on,1),1.12,max(zoom-0.0030,1.00))`;
  filterParts.push(
    `[${i}:v]scale=${W}:${H}:force_original_aspect_ratio=decrease,` +
      `pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=${INK},setsar=1,` +
      `zoompan=z='${zoomExpr}':d=${frames}:s=${W}x${H}:fps=${FPS},` +
      `trim=start_frame=0:end_frame=${frames},setpts=PTS-STARTPTS,` +
      `format=yuv420p[c${i}]`
  );
});

let cum = shots[0].dur;
let prevLabel = "c0";
for (let i = 1; i < shots.length; i++) {
  const offset = Math.max(cum - XFADE, 0);
  const outLabel = i === shots.length - 1 ? "vout" : `x${i}`;
  // Slide transitions push one frame out as the next comes in, instead of
  // cross-dissolving — dissolving two text-heavy cards on top of each other
  // reads as illegible double-exposed text, a slide never overlaps them.
  const transition = i % 2 === 0 ? "slideleft" : "slideright";
  filterParts.push(
    `[${prevLabel}][c${i}]xfade=transition=${transition}:duration=${XFADE}:offset=${offset.toFixed(3)}[${outLabel}]`
  );
  cum = cum + shots[i].dur - XFADE;
  prevLabel = outLabel;
}

const filterComplex = filterParts.join(";\n");
const totalDuration = cum;
console.log(`Estimated total duration: ${totalDuration.toFixed(2)}s`);

const outFile = path.join(outDir, "multaqa-montage.mp4");
args.push(
  "-filter_complex",
  filterComplex,
  "-map",
  "[vout]",
  "-r",
  String(FPS),
  "-c:v",
  "libx264",
  "-preset",
  "medium",
  "-crf",
  "19",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  outFile
);

execFileSync("ffmpeg", args, { stdio: "inherit" });
console.log("Montage written to", outFile);
