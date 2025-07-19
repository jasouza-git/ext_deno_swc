import { decompress } from "jsr:@denosaurs/lz4@0.1.4";
import type {
  Config,
  ParseOptions,
  Program,
} from "./types.d.ts";
import { instantiate } from "./lib/deno_swc.generated.js";
import { wasmBytes } from "./lib/deno_swc_bg.wasm.bytes.ts";
import * as types from './types.d.ts';

export { types };

const { parseSync, printSync, transformSync } = await instantiate(decompress, wasmBytes);

export function parse(source: string, opts: ParseOptions): Program {
  return parseSync(source, opts);
}

export function print(program: Program, opts?: Config): { code: string } {
  return printSync(program, opts || {});
}

export function transform(source: string, opts: Config): { code: string } {
  return transformSync(source, opts);
}
