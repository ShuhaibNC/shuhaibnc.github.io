# DexCompare — web version

Runs the desktop dex-compare tool (https://github.com/ShuhaibNC/dex-compare,
v1.1.0) entirely in the browser at `/dexcompare/`. Pick two APK / XAPK /
APKS / APKM / ZIP / DEX files and compare them: class, method and field
diffs with Smali detail, same theme as the desktop app. Files are read
locally and compared in a Web Worker — nothing is uploaded.

## How it was ported

The desktop app is Electron + Node. The engine (`lib/`) is the same code,
converted from CommonJS to ES modules with three changes:

- `lib/buf.js` (new): a `Uint8Array` subclass providing the few Node
  `Buffer` read helpers the engine uses.
- `lib/zip.js`: `zlib.inflateRawSync` replaced by async
  `DecompressionStream("deflate-raw")`, so zip extraction is async.
- `lib/dex.js`: catch-handler list size is read as **SLEB128**, as the DEX
  spec requires (desktop JS reads ULEB128 — same fix as the Android port).
- `lib/dexset.js` / `lib/compare.js`: `fs`/`path` removed; loading works
  from in-memory buffers (`compareBuffers`, `loadSideFromBuffer`).

`renderer.js` is the desktop UI logic with file picking changed from
Electron dialogs to `<input type="file">` + drag & drop; `bridge.js`
implements the `window.dexapi` interface the renderer expects, backed by
`worker.js` (module Web Worker). `styles.css` is the desktop theme plus a
mobile layout.

## Regenerating

Transform scripts + parity tests live in the DexCompare goal workspace
(`goals/dexcompare-android-app/hidden_files/web-port/`):
`transform.py` (lib), `transform_ui.py` (renderer/index/styles),
`parity.mjs` (engine vs desktop CLI), `worker_test.mjs` (worker protocol).

## Verification (2026-11-06)

Web engine output is byte-for-byte identical to the desktop CLI
(`node cli.js`) on: IPFinder v1.4 vs v1.5, Counter v1.0 vs CounterPro v2.0,
MorpheLite r2 vs MorpheClone dev.5 (28,323 classes), raw `classes.dex` vs
its APK, and a synthetic `.apks` bundle. The worker protocol
(compare + progress + methodSmali/classSmali) was tested through the real
`worker.js`. A live click-through in a real browser could not be run from
this sandbox (the test browser cannot reach localhost) — first live test
happens on the published page.

Also linked here: `DexCompare-v1.1.0.apk` (Android app, v1.1.0).
