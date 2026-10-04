import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { checkCommittedTree } from "./release-check.mjs";

test("미추적 작업을 제외하고 HEAD를 검사하며 실패해도 임시 worktree를 정리한다", () => {
  const root = mkdtempSync(join(tmpdir(), "jamtong-release-test-"));
  const git = (...args) => execFileSync("git", args, { cwd: root, stdio: "pipe" }).toString();
  try {
    git("init");
    git("config", "user.name", "Release Test");
    git("config", "user.email", "release@example.invalid");
    writeFileSync(join(root, "tracked.txt"), "committed");
    git("add", "tracked.txt");
    git("commit", "-m", "test fixture");
    mkdirSync(join(root, "node_modules"));
    writeFileSync(join(root, "unfinished.ts"), "unfinished work");
    let checkedTree;
    assert.throws(() => checkCommittedTree({ repository: root, check(tree) {
      checkedTree = tree;
      assert.equal(readFileSync(join(tree, "tracked.txt"), "utf8"), "committed");
      assert.equal(existsSync(join(tree, "unfinished.ts")), false);
      assert.equal(existsSync(join(tree, "node_modules")), true);
      throw new Error("check failed");
    } }), /check failed/);
    assert.equal(existsSync(checkedTree), false);
    assert.equal(git("worktree", "list", "--porcelain").match(/^worktree /gm)?.length, 1);
    assert.equal(readFileSync(join(root, "unfinished.ts"), "utf8"), "unfinished work");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
