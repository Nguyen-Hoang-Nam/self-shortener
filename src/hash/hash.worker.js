import * as Comlink from "comlink";

// Wasm may need some time to load
const hashFunction = async url => {
  const encoder = new TextEncoder();
  const data = encoder.encode(url);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const byteArray = Array.from(new Uint8Array(hash));
  const hashHex = byteArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex
}

Comlink.expose(hashFunction)