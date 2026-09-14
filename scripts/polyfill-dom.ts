// polyfill-dom.ts
class DOMMatrix {
  a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;
}
(globalThis as any).DOMMatrix = DOMMatrix;

if (!(Promise as any).try) {
  (Promise as any).try = function (fn: any, ...args: any[]) {
    return new Promise((resolve) => resolve(fn(...args)));
  };
}

(globalThis as any).window = globalThis;

if (!(Uint8Array.prototype as any).toHex) {
  (Uint8Array.prototype as any).toHex = function () {
    return Array.from(this)
      .map((b: any) => b.toString(16).padStart(2, '0'))
      .join('');
  };
}

if (!(Map.prototype as any).getOrInsertComputed) {
  (Map.prototype as any).getOrInsertComputed = function (key: any, callbackFn: any) {
    if (this.has(key)) {
      return this.get(key);
    }
    const value = callbackFn(key);
    this.set(key, value);
    return value;
  };
}

if (typeof (globalThis as any).URL !== 'undefined') {
  if (typeof (globalThis as any).URL.createObjectURL !== 'function') {
    (globalThis as any).URL.createObjectURL = (_blob: any) => `blob:mock-url-${Date.now()}`;
  }
  if (typeof (globalThis as any).URL.revokeObjectURL !== 'function') {
    (globalThis as any).URL.revokeObjectURL = () => {};
  }
}


