import subprocess

print("=== Searching git history for ts/tsx files ===")
cmd = ["git", "log", "--all", "--name-only", "--pretty=format:"]
result = subprocess.run(cmd, shell=True, capture_output=True, text=True)

ts_files = set()
for line in result.stdout.splitlines():
    line = line.strip()
    if line.endswith(".ts") or line.endswith(".tsx"):
        ts_files.add(line)

print("Found TS/TSX files in history:")
for f in sorted(ts_files):
    print(f"- {f}")
