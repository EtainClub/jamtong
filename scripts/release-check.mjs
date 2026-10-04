import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

/** 로컬 미추적 작업이 검사에 섞이지 않도록 HEAD만 검증한다. */
export function checkCommittedTree({ repository = process.cwd(), check } = {}) {
  const root = resolve(repository);
  const temporary = mkdtempSync(join(tmpdir(), "jamtong-release-"));
  const tree = join(temporary, "source");
  const git = (...args) => execFileSync("git", args, { cwd: root, stdio: "pipe" });
  let added = false;
  try {
    git("worktree", "add", "--detach", tree, "HEAD");
    added = true;
    symlinkSync(join(root, "node_modules"), join(tree, "node_modules"), "dir");
    if (check) check(tree);
    else {
      execFileSync("pnpm", ["exec", "next", "typegen"], { cwd: tree, stdio: "inherit" });
      execFileSync("pnpm", ["check"], { cwd: tree, stdio: "inherit" });
    }
  } finally {
    try {
      if (added) git("worktree", "remove", "--force", tree);
    } finally {
      rmSync(temporary, { recursive: true, force: true });
    }
  }
}
