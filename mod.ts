import { decompress } from "https://deno.land/x/lz4@v0.1.2/mod.ts";
import type {
  Config,
  ParseOptions,
  Program,
} from "https://esm.sh/@swc/core@1.2.212/types.d.ts";
import { instantiate } from "./lib/deno_swc.generated.js";
import wasm from "./lib/deno_swc_bg.wasm" with { type: "bytes" };

const { parseSync, printSync, transformSync } = await instantiate(decompress, wasm);

export function parse(source: string, opts: ParseOptions): Program {
  return parseSync(source, opts);
}

export function print(program: Program, opts?: Config): { code: string } {
  return printSync(program, opts || {});
}

export function transform(source: string, opts: Config): { code: string } {
  return transformSync(source, opts);
}
