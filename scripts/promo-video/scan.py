import re
import sys

log_path = sys.argv[1]
text = open(log_path).read()
times = [float(t) for t in re.findall(r"pts_time:([\d.]+)", text)]
yavgs = [float(y) for y in re.findall(r"YAVG=([\d.]+)", text)]

# A stuck browser error page (Chromium's own "can't be reached" screen,
# held on screen for several seconds while a navigation retries) shows up
# as a run of frames with an *identical* brightness value (nothing is
# animating) that is also bright (light background) — unlike our own
# dark-overlay holds, which are intentional but dark.
run_start = 0
bad = []
for i in range(1, len(yavgs)):
    same = abs(yavgs[i] - yavgs[run_start]) < 0.05
    if not same:
        run_len = i - run_start
        # Ignore the very start of the recording: a blank white canvas
        # before the first real paint is normal and unavoidable, not a
        # stuck error page.
        if run_len >= 4 and yavgs[run_start] > 180 and times[run_start] > 3.5:
            bad.append((times[run_start], times[i - 1], yavgs[run_start]))
        run_start = i
run_len = len(yavgs) - run_start
if run_len >= 4 and yavgs[run_start] > 180 and times[run_start] > 3.5:
    bad.append((times[run_start], times[-1], yavgs[run_start]))

if bad:
    print("SUSPECT_FROZEN_BRIGHT_SEGMENTS:")
    for t0, t1, y in bad:
        print(f"  {t0}s - {t1}s (YAVG={y})")
    sys.exit(1)
else:
    print("CLEAN")
    sys.exit(0)
