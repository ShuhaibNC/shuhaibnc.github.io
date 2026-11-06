// BBuf: a Uint8Array with the small set of Node Buffer read helpers the
// DEX/ZIP engine uses (readUInt16LE / readInt16LE / readUInt32LE /
// readInt32LE / readBigUInt64LE / toString("latin1"|"utf8")). The engine
// code itself is unchanged from the desktop version — it just receives a
// BBuf instead of a Buffer. Works in browsers and in Node.

export class BBuf extends Uint8Array {
  _dv() {
    if (!this.__dv) this.__dv = new DataView(this.buffer, this.byteOffset, this.byteLength);
    return this.__dv;
  }
  readUInt16LE(o) { return this._dv().getUint16(o, true); }
  readInt16LE(o) { return this._dv().getInt16(o, true); }
  readUInt32LE(o) { return this._dv().getUint32(o, true); }
  readInt32LE(o) { return this._dv().getInt32(o, true); }
  readBigUInt64LE(o) { return this._dv().getBigUint64(o, true); }
  toString(enc, start, end) {
    const s = start === undefined ? 0 : start;
    const e = end === undefined ? this.length : end;
    if (enc === "utf8" || enc === "utf-8") {
      return new TextDecoder("utf-8").decode(this.subarray(s, e));
    }
    // latin1 (binary): one char per byte
    let out = "";
    for (let i = s; i < e; i += 8192) {
      const chunk = this.subarray(i, Math.min(e, i + 8192));
      out += String.fromCharCode.apply(null, chunk);
    }
    return out;
  }
}

// Wrap any Uint8Array/ArrayBuffer view as a BBuf sharing the same memory.
export function wrap(u8) {
  if (u8 instanceof BBuf) return u8;
  if (u8 instanceof ArrayBuffer) return new BBuf(u8);
  return new BBuf(u8.buffer, u8.byteOffset, u8.byteLength);
}
