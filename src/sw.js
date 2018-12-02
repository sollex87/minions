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
    "url": "banana.89e3a9c6.jpg",
    "revision": "9b72c45deb1cedeac131ac0fef56ae62"
  },
  {
    "url": "banana.d8643046.jpg",
    "revision": "9b72c45deb1cedeac131ac0fef56ae62"
  },
  {
    "url": "barley-cell.8310df6a.jpg",
    "revision": "1196f89726a27b81d40eded972acba15"
  },
  {
    "url": "barley-cell.ad37b941.jpg",
    "revision": "1196f89726a27b81d40eded972acba15"
  },
  {
    "url": "hangman.5c770db4.jpg",
    "revision": "654c8f4035c8b5597e690823a7a6e326"
  },
  {
    "url": "hangman.a989429e.jpg",
    "revision": "654c8f4035c8b5597e690823a7a6e326"
  },
  {
    "url": "index.html",
    "revision": "0c61be1440c2c46f449914d2a288f54c"
  },
  {
    "url": "src.78399e21.js",
    "revision": "83b6a2a81db0728f757e1fa770d146f3"
  },
  {
    "url": "src.ffd3c5be.js",
    "revision": "bd5bdeb19d1f1484fa9eba8d9884a6de"
  },
  {
    "url": "style.4735e379.css",
    "revision": "9e27d7076057f7a489b2105cf92051fb"
  },
  {
    "url": "style.e308ff8e.css",
    "revision": "eca5b01c5113d5765da2dc30a3d305c5"
  },
  {
    "url": "style.e308ff8e.js",
    "revision": "fd994dee49603de7c2a7000c02b81cc8"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute("index.html");
