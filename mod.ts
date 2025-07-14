import { decompress } from "https://deno.land/x/lz4@v0.1.2/mod.ts";
import type {
  Config,
  ParseOptions,
  Program,
} from "https://esm.sh/@swc/core@1.2.212/types.d.ts";
import { imports } from "./lib/deno_swc.generated.js";
import data from './lib/deno_swc_bg.wasm' with { type: 'bytes' };
const wasmCode = decompress(data);
const { instance } = await WebAssembly.instantiate(wasmCode, imports);


export function parse(source: string, opts: ParseOptions): Program {
  // @ts-ignore `parseSync` is part of export unless different wasm
  return instance.exports.parseSync(source, opts);
}

export function print(program: Program, opts?: Config): { code: string } {
  // @ts-ignore `printSync` is part of export unless different wasm
  return instance.exports.printSync(program, opts || {});
}

export function transform(source: string, opts: Config): { code: string } {
  // @ts-ignore `transformSync` is part of export unless different wasm
  return instance.exports.transformSync(source, opts);
}
