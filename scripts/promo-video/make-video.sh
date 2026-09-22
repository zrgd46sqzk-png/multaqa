#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."

VIDEO_DIR="content/video"
MAX_ATTEMPTS=6

for attempt in $(seq 1 $MAX_ATTEMPTS); do
  echo "=== Attempt $attempt/$MAX_ATTEMPTS ==="
  rm -f "$VIDEO_DIR"/*.webm "$VIDEO_DIR"/*.mp4 2>/dev/null || true

  node scripts/promo-video/record.mjs

  WEBM=$(ls "$VIDEO_DIR"/*.webm | head -1)
  ffmpeg -y -i "$WEBM" -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -movflags +faststart \
    "$VIDEO_DIR/multaqa-intro.mp4" >/tmp/ffmpeg-convert.log 2>&1

  ffmpeg -i "$VIDEO_DIR/multaqa-intro.mp4" \
    -vf "select='not(mod(n\,5))',signalstats,metadata=print:key=lavfi.signalstats.YAVG" \
    -f null - 2>/tmp/scan.log

  if python3 scripts/promo-video/scan.py /tmp/scan.log; then
    echo "=== Clean recording on attempt $attempt ==="
    rm -f "$WEBM"
    exit 0
  else
    echo "=== Attempt $attempt had a suspect frozen/bright segment — retrying ==="
  fi
done

echo "Failed to get a clean recording after $MAX_ATTEMPTS attempts"
exit 1
