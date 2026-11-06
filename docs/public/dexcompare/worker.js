// Module Web Worker: runs the ported compare engine off the UI thread so
// large APKs don't freeze the page. Mirrors the desktop compare-worker.js
// protocol (compare / methodSmali / classSmali), over ArrayBuffers.
import { compareBuffers } from "./lib/compare.js";

let session = null;

self.onmessage = async (event) => {
  const msg = event.data;
  try {
    if (msg.type === "compare") {
      session = await compareBuffers(
        new Uint8Array(msg.left),
        new Uint8Array(msg.right),
        msg.leftName,
        msg.rightName,
        (progress) => self.postMessage({ id: msg.id, progress })
      );
      self.postMessage({ id: msg.id, result: session.result });
    } else if (msg.type === "methodSmali") {
      const result = session
        ? session.getMethodSmali(msg.side, msg.descriptor, msg.key)
        : null;
      self.postMessage({ id: msg.id, result });
    } else if (msg.type === "classSmali") {
      const result = session
        ? session.getClassSmali(msg.side, msg.descriptor)
        : null;
      self.postMessage({ id: msg.id, result });
    } else {
      throw new Error(`Unknown worker request: ${msg.type}`);
    }
  } catch (error) {
    self.postMessage({
      id: msg.id,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
