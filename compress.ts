import { compress } from "https://deno.land/x/lz4@v0.1.2/mod.ts";
import deno_swc_bg from "./lib/deno_swc_bg.wasm" with { type: "bytes" };

Deno.writeFileSync(name, compress(Deno.readFileSync(name)));
