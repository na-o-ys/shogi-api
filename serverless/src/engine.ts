import { copySync, chmodSync } from "fs-extra";
import * as path from "path";
import * as childProcess from "child_process";

const ENGINE_SRC_DIR = "engine";
const ENGINE_DIR = "/tmp/engine";
const EVAL_SRC_DIR = "eval";
export const EVAL_DIR = "/tmp/eval";

export function setup(engine: string) {
  copySync(ENGINE_SRC_DIR, ENGINE_DIR);
  copySync(EVAL_SRC_DIR, EVAL_DIR);
  chmodSync(path.resolve(ENGINE_DIR, engine), 0o755);
}

export function spawn(engine: string): childProcess.ChildProcess {
  return childProcess.spawn(`./${engine}`, [], {
    cwd: ENGINE_DIR
  });
}
