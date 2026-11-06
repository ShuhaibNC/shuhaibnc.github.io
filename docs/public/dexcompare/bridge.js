"use strict";
// Web bridge: implements the window.dexapi interface renderer.js expects,
// backed by the module Web Worker running the ported engine. Files are read
// locally with File.arrayBuffer() and transferred to the worker — nothing is
// uploaded anywhere.
const __worker = new Worker("worker.js", { type: "module" });
let __nextId = 1;
const __pending = new Map();
let __progressCb = () => {};

__worker.onmessage = (event) => {
  const m = event.data;
  const req = __pending.get(m.id);
  if (!req) return;
  if (m.progress) { __progressCb(m.progress); return; }
  __pending.delete(m.id);
  if (m.error) req.reject(new Error(m.error));
  else req.resolve(m.result);
};
__worker.onerror = (event) => {
  const err = new Error("Comparison worker failed: " + (event.message || "unknown error"));
  for (const req of __pending.values()) req.reject(err);
  __pending.clear();
};

function __callWorker(type, payload, transfer) {
  return new Promise((resolve, reject) => {
    const id = __nextId++;
    __pending.set(id, { resolve, reject });
    __worker.postMessage({ id, type, ...payload }, transfer || []);
  });
}

window.dexapi = {
  openDex: (side) => new Promise((resolve) => {
    const input = document.getElementById(side === "left" ? "leftFile" : "rightFile");
    input.value = "";
    input.onchange = () => resolve(input.files[0] || null);
    input.click();
  }),
  compare: async (leftFile, rightFile) => {
    const lb = await leftFile.arrayBuffer();
    const rb = await rightFile.arrayBuffer();
    return __callWorker(
      "compare",
      { left: lb, right: rb, leftName: leftFile.name, rightName: rightFile.name },
      [lb, rb]
    );
  },
  onCompareProgress: (cb) => { __progressCb = cb; },
  methodSmali: (side, descriptor, key) =>
    __callWorker("methodSmali", { side, descriptor, key }),
  classSmali: (side, descriptor) =>
    __callWorker("classSmali", { side, descriptor }),
  aboutInfo: async () => ({
    version: "1.1.0 (web)",
    platform: navigator.platform || "web",
    electron: "— (web build)",
    chromium: "— (web build)",
    node: "— (web build)",
  }),
};
