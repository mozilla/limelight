/*
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

const nodeCrypto = require("node:crypto");

Object.defineProperties(globalThis, {
  crypto: {
    value: {
      randomUUID: () => nodeCrypto.randomUUID(),
    },
  },
  fetch: {
    value: () => {
      throw new Error("fetch was not mocked");
    },
    writable: true, // Allow mocking.
  },
  Response: {
    value: class Response {
      constructor(body) {
        this._body = body;
      }

      async json() {
        return JSON.parse(this._body);
      }
    },
  },
});
