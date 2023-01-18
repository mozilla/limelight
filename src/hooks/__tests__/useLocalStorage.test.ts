/*
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

import { afterEach, beforeAll, describe, expect, test } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { useEffect } from "react";

import useLocalStorage from "../useLocalStorage";

describe("useLocalStorage", () => {
  beforeAll(() => {
    localStorage.clear();
    expect(localStorage.length).toEqual(0);
  });

  afterEach(() => {
    localStorage.clear();
    expect(localStorage.length).toEqual(0);
  });

  type RecordT = Record<string, string>;
  function isRecordT(v: unknown): v is RecordT {
    return (
      typeof v === "object" &&
      !Array.isArray(v) &&
      v !== null &&
      Object.values(v).every((x) => typeof x === "string")
    );
  }

  test("use default value", () => {
    renderHook(() => {
      const [value] = useLocalStorage("key", isRecordT, { hello: "world" });
      expect(value).toEqual({ hello: "world" });
      expect(localStorage.length).toEqual(0);
    });
  });

  test("restore value", () => {
    localStorage.setItem("key", JSON.stringify({ goodbye: "world" }));

    renderHook(() => {
      const [value] = useLocalStorage("key", isRecordT, {});
      expect(value).toEqual({ goodbye: "world" });
    });
  });

  test("restore invalid value", () => {
    localStorage.setItem("key", "bogus");

    renderHook(() => {
      const [value] = useLocalStorage("key", isRecordT, { foo: "bar" });
      expect(value).toEqual({ foo: "bar" });
    });
  });

  test("set value", () => {
    const { result } = renderHook(() => {
      const [value, setValue] = useLocalStorage("key", isRecordT, {
        value: "default",
      });

      useEffect(() => {
        setValue({ value: "changed" });
      }, []);

      return value;
    });

    expect(result.current).toEqual({ value: "changed" });

    const storageValue = localStorage.getItem("key");
    expect(typeof storageValue).toBe("string");
    expect(JSON.parse(storageValue as string)).toEqual({ value: "changed" });
  });
});
