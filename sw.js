/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "0000.a84df5db.jpg",
    "revision": "3da33ca8e0506fb93a69ed8064f9ea43"
  },
  {
    "url": "0001.5f9808ec.jpg",
    "revision": "85d59fcac93715ff86cdbb9ab72cfeab"
  },
  {
    "url": "0002.e6ebd137.jpg",
    "revision": "2ddb6e89eb3c6f126117de5e9720da07"
  },
  {
    "url": "0003.87bba5fd.jpg",
    "revision": "7bd4803cb8f676d9965d5b15d58164fa"
  },
  {
    "url": "0004.7a7d138b.jpg",
    "revision": "d673815e817304c0f939c6f31e7b7c6a"
  },
  {
    "url": "0005.a54a5b5d.jpg",
    "revision": "375eb7db4ea526853dbaf2236c4d1c5b"
  },
  {
    "url": "0006.cfa108a2.jpg",
    "revision": "07b7432097143131cf8e3e8899ea671e"
  },
  {
    "url": "0007.ab61af33.jpg",
    "revision": "4268f97b2522b54a8ff713b13453c16e"
  },
  {
    "url": "back.b4c8cf1e.jpg",
    "revision": "e7b8b5cb2ceb92acffb54914edffce8b"
  },
  {
    "url": "barley-cell.8310df6a.jpg",
    "revision": "1196f89726a27b81d40eded972acba15"
  },
  {
    "url": "hangman_0.f0e45d3d.jpg",
    "revision": "33671654fd6ae08ee3aa2a52ba5522ad"
  },
  {
    "url": "hangman.5c770db4.jpg",
    "revision": "654c8f4035c8b5597e690823a7a6e326"
  },
  {
    "url": "index.html",
    "revision": "8f077d49cf44cba9d6a54b3d2297b101"
  },
  {
    "url": "loss_case.971297ef.jpg",
    "revision": "2dafd4362bf5d8264d23d83eaee02650"
  },
  {
    "url": "src.e8af5a65.js",
    "revision": "a008f7f07e5c6e3a16c5a2c83de3e055"
  },
  {
    "url": "start.7e6503d5.jpg",
    "revision": "efd476bbc6a68b6205dc02a85d9d5797"
  },
  {
    "url": "style.93ccadac.css",
    "revision": "56fd51887165825afc37fb5aa3873d56"
  },
  {
    "url": "win_case.b80b6976.jpg",
    "revision": "660b594ac66cbfba73997f40bcebb974"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute("index.html");
