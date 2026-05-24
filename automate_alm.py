import os
import sys
import subprocess
import argparse
import shutil

# Configuration Defaults
DEFAULT_SOLUTION = "VibeApp"
DEFAULT_ZIP_PATH = "./VibeApp.zip"
DEFAULT_SRC_FOLDER = "./src"

def check_command(cmd):
    """Check if a CLI command is available on the system PATH."""
    return shutil.which(cmd) is not None

def run_command(cmd, shell=(sys.platform == "win32")):
    """Run a system command and print output."""
    print(f"Executing: {' '.join(cmd) if isinstance(cmd, list) else cmd}")
    result = subprocess.run(cmd, shell=shell, text=True, capture_output=True)
    if result.returncode != 0:
        print(f"❌ Error (Code {result.returncode}):")
        print(result.stderr)
        return False
    print(result.stdout)
    return True

def export_solution(env_url, solution_name, zip_path):
    """Export the solution using pac solution export."""
    if not check_command("pac"):
        print("❌ Error: Power Platform CLI ('pac') is not installed or not in your PATH.")
        print("Please install it from: https://learn.microsoft.com/power-platform/developer/cli/introduction")
        return False

    print(f"📦 Starting export of solution '{solution_name}'...")
    cmd = [
        "pac", "solution", "export",
        "--name", solution_name,
        "--path", zip_path,
        "--managed", "false",  # Export unmanaged for source control
        "--overwrite"          # Overwrite the zip file if it exists
    ]
    if env_url:
        print(f"Target environment URL: {env_url}")
        cmd.extend(["--environment", env_url])

    return run_command(cmd)

def unpack_solution(zip_path, src_folder):
    """Unpack the solution zip using pac solution unpack."""
    if not check_command("pac"):
        print("❌ Error: Power Platform CLI ('pac') is not installed.")
        return False

    if not os.path.exists(zip_path):
        print(f"❌ Error: Solution zip file not found at '{zip_path}'. Run export first.")
        return False

    print(f"📂 Unpacking '{zip_path}' to '{src_folder}'...")
    os.makedirs(src_folder, exist_ok=True)
    
    cmd = [
        "pac", "solution", "unpack",
        "--zipfile", zip_path,
        "--folder", src_folder,
        "--allowDelete", "true"  # Syncs deletion of components in source control
    ]
    return run_command(cmd)

def pack_solution(zip_path, src_folder):
    """Pack the solution folder back into a solution zip using pac solution pack."""
    if not check_command("pac"):
        print("❌ Error: Power Platform CLI ('pac') is not installed or not in your PATH.")
        return False

    print(f"📦 Packing '{src_folder}' back into '{zip_path}'...")
    cmd = [
        "pac", "solution", "pack",
        "--zipfile", zip_path,
        "--folder", src_folder
    ]
    return run_command(cmd)

def import_solution(env_url, zip_path):
    """Import the solution zip using pac solution import."""
    if not check_command("pac"):
        print("❌ Error: Power Platform CLI ('pac') is not installed or not in your PATH.")
        return False

    if not os.path.exists(zip_path):
        print(f"❌ Error: Solution zip file not found at '{zip_path}'. Pack first.")
        return False

    print(f"📥 Importing solution from '{zip_path}'...")
    cmd = [
        "pac", "solution", "import",
        "--path", zip_path
    ]
    if env_url:
        print(f"Target environment URL: {env_url}")
        cmd.extend(["--environment", env_url])

    return run_command(cmd)

def git_commit_and_push(src_folder, commit_message, push):
    """Commit changes to Git and optionally push to GitHub."""
    if not check_command("git"):
        print("❌ Error: Git is not installed or not in your PATH.")
        return False

    print("🐙 Syncing with Git source control...")
    is_windows = (sys.platform == "win32")

    if not os.path.exists(".git"):
        print("Initializing new Git repository...")
        if not run_command(["git", "init"]):
            return False

    if not os.path.exists(".gitignore"):
        with open(".gitignore", "w") as f:
            f.write("*.zip\n*.log\n.bin/\nobj/\nbin/\n")
        print("Created default .gitignore file.")

    if not run_command(["git", "add", "."]):
        return False

    status = subprocess.run(["git", "status", "--porcelain"], shell=is_windows, capture_output=True, text=True)
    if not status.stdout.strip():
        print("✅ No changes detected in the source repository. Git is up to date.")
        return True

    if not run_command(["git", "commit", "-m", commit_message]):
        return False

    if push:
        remote_check = subprocess.run(["git", "remote"], shell=is_windows, capture_output=True, text=True)
        if not remote_check.stdout.strip():
            print("⚠️ Warning: No Git remote configured. Cannot push. Configure one with:")
            print("   git remote add origin <github-repo-url>")
            return True
        
        branch_result = subprocess.run(["git", "branch", "--show-current"], shell=is_windows, capture_output=True, text=True)
        branch = branch_result.stdout.strip() or "main"
        print(f"Pushing changes to remote branch: {branch}...")
        return run_command(["git", "push", "origin", branch])

    return True

def main():
    parser = argparse.ArgumentParser(description="Power Apps Vibe ALM Automation Script (Conda compatible)")
    parser.add_argument("--export", action="store_true", help="Export the solution from Power Platform")
    parser.add_argument("--unpack", action="store_true", help="Unpack the solution zip into source folder")
    parser.add_argument("--pack", action="store_true", help="Pack the source folder into a solution zip")
    parser.add_argument("--import-sol", action="store_true", help="Import the solution zip into Power Platform")
    parser.add_argument("--commit", action="store_true", help="Commit unpacked files to Git")
    parser.add_argument("--push", action="store_true", help="Push committed changes to GitHub remote")
    parser.add_argument("--solution-name", default=DEFAULT_SOLUTION, help=f"Name of the solution (default: {DEFAULT_SOLUTION})")
    parser.add_argument("--env-url", help="Power Platform Environment URL")
    parser.add_argument("--zip-path", default=DEFAULT_ZIP_PATH, help=f"Path to solution ZIP file (default: {DEFAULT_ZIP_PATH})")
    parser.add_argument("--src-folder", default=DEFAULT_SRC_FOLDER, help=f"Path to destination folder for unpacking (default: {DEFAULT_SRC_FOLDER})")
    parser.add_argument("--message", default="updates: sync Vibe app to source control", help="Git commit message")

    args = parser.parse_args()

    if not (args.export or args.unpack or args.pack or args.import_sol or args.commit or args.push):
        parser.print_help()
        sys.exit(0)

    success = True

    if args.export:
        success = export_solution(args.env_url, args.solution_name, args.zip_path)
        if not success:
            sys.exit(1)

    if args.unpack:
        success = unpack_solution(args.zip_path, args.src_folder)
        if not success:
            sys.exit(1)

    if args.pack:
        success = pack_solution(args.zip_path, args.src_folder)
        if not success:
            sys.exit(1)

    if args.import_sol:
        success = import_solution(args.env_url, args.zip_path)
        if not success:
            sys.exit(1)

    if args.commit or args.push:
        success = git_commit_and_push(args.src_folder, args.message, args.push)
        if not success:
            sys.exit(1)

    print("🎉 ALM Process completed successfully!")

if __name__ == "__main__":
    main()
