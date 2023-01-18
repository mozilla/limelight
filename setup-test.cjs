/*
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

const nodeCrypto = require("node:crypto");

Object.defineProperty(globalThis, "crypto", {
  value: {
    randomUUID: () => nodeCrypto.randomUUID(),
  },
});
