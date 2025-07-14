import type {
  Config,
  ParseOptions,
  Program,
} from "https://esm.sh/@swc/core@1.2.212/types.d.ts";
import { wasm } from './swc.ts';


export function parse(source: string, opts: ParseOptions): Program {
  // @ts-ignore `parseSync` is part of export unless different wasm
  return wasm.parseSync(source, opts);
}

export function print(program: Program, opts?: Config): { code: string } {
  // @ts-ignore `printSync` is part of export unless different wasm
  return wasm.printSync(program, opts || {});
}

export function transform(source: string, opts: Config): { code: string } {
  // @ts-ignore `transformSync` is part of export unless different wasm
  return wasm.transformSync(source, opts);
}
