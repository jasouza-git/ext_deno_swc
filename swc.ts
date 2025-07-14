// deno-lint-ignore-file
import wasm_data from './lib/deno_swc_bg.wasm' with { type: 'bytes' };
import { decompress } from "https://deno.land/x/lz4@v0.1.2/mod.ts";


/* ----- VARIABLES ----- */
const heap = new Array(32).fill(undefined);
heap.push(undefined, null, true, false);
let heap_next = heap.length;
const cachedTextEncoder = new TextEncoder();
let cachedUint8Memory0:Uint8Array = new Uint8Array();
let cachedInt32Memory0:Int32Array = new Int32Array();;
let WASM_VECTOR_LEN = 0;
const encodeString = function (arg:string, view:Uint8Array) {
  return cachedTextEncoder.encodeInto(arg, view);
};
const cachedTextDecoder = new TextDecoder("utf-8", {
  ignoreBOM: true,
  fatal: true,
});
cachedTextDecoder.decode();

/* ----- FUNCTIONS ----- */
function getUint8Memory0() {
  if (cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}
function getInt32Memory0() {
  if (cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachedInt32Memory0;
}
function addHeapObject(obj:object|string) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];

  heap[idx] = obj;
  return idx;
}
function getObject(idx:number) {
  return heap[idx];
}
function dropObject(idx:number) {
  if (idx < 36) return;
  heap[idx] = heap_next;
  heap_next = idx;
}
function takeObject(idx:number) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}
function passStringToWasm0(arg:string, malloc:(n:number)=>number, realloc?:(p:number, l:number, o:number) => number) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length);
    getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }

  let len = arg.length;
  let ptr = malloc(len);

  const mem = getUint8Memory0();

  let offset = 0;

  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7F) break;
    mem[ptr + offset] = code;
  }

  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3);
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);

    offset += ret.written;
  }

  WASM_VECTOR_LEN = offset;
  return ptr;
}
function getStringFromWasm0(ptr:number, len:number) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}


/* ----- EXPORT ----- */
export const imports = {
  __wbindgen_placeholder__: {
    __wbg_new0_6b49a1fca8534d39: function () {
      const ret = new Date();
      return addHeapObject(ret);
    },
    __wbg_getTimezoneOffset_d7a89256f8181a06: function (arg0:number) {
      const ret = getObject(arg0).getTimezoneOffset();
      return ret;
    },
    __wbindgen_object_drop_ref: function (arg0:number) {
      takeObject(arg0);
    },
    __wbg_getTime_7c8d3b79f51e2b87: function (arg0:number) {
      const ret = getObject(arg0).getTime();
      return ret;
    },
    __wbg_new_693216e109162396: function () {
      const ret = new Error();
      return addHeapObject(ret);
    },
    __wbg_stack_0ddaca5d1abfb52f: function (arg0:number, arg1:number) {
      const ret = getObject(arg1).stack;
      const ptr0 = passStringToWasm0(
        ret,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      getInt32Memory0()[arg0 / 4 + 1] = len0;
      getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    },
    __wbg_error_09919627ac0992f5: function (arg0:number, arg1:number) {
      try {
        console.error(getStringFromWasm0(arg0, arg1));
      } finally {
        wasm.__wbindgen_free(arg0, arg1);
      }
    },
    __wbindgen_string_new: function (arg0:number, arg1:number) {
      const ret = getStringFromWasm0(arg0, arg1);
      return addHeapObject(ret);
    },
    __wbindgen_json_serialize: function (arg0:number, arg1:number) {
      const obj = getObject(arg1);
      const ret = JSON.stringify(obj === undefined ? null : obj);
      const ptr0 = passStringToWasm0(
        ret,
        wasm.__wbindgen_malloc,
        wasm.__wbindgen_realloc,
      );
      const len0 = WASM_VECTOR_LEN;
      getInt32Memory0()[arg0 / 4 + 1] = len0;
      getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    },
    __wbindgen_json_parse: function (arg0:number, arg1:number) {
      const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
      return addHeapObject(ret);
    },
    __wbindgen_throw: function (arg0:number, arg1:number) {
      throw new Error(getStringFromWasm0(arg0, arg1));
    },
  },
};

/* ----- WASM ----- */
const wasmCode = decompress(wasm_data);
const { instance } = await WebAssembly.instantiate(wasmCode, imports);
export const wasm = instance.exports as WebAssembly.Exports & {
   '__wbindgen_malloc':  (n: number) => number,
   '__wbindgen_realloc': (p: number, l: number, o: number) => number,
   '__wbindgen_free': (ptr:number, len:number) => void,
   'memory': Uint8Array
};