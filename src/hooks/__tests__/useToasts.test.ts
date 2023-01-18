/*
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

import { describe, expect, test } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { useEffect } from "react";

import useToasts from "../useToasts";

describe("useToasts", () => {
  test("default value", () => {
    const {
      result: {
        current: { toasts },
      },
    } = renderHook(() => useToasts());
    expect(toasts).toEqual([]);
  });

  test("addToasts", () => {
    const {
      result: { current: toasts },
    } = renderHook(() => {
      const { toasts, addToast } = useToasts();

      useEffect(() => {
        addToast("toast title", "toast body");
      }, []);

      return toasts;
    });
    expect(toasts.length).toEqual(1);
    expect(toasts[0].title).toEqual("toast title");
    expect(toasts[0].body).toEqual("toast body");
  });

  test("dismissToast", () => {
    const { result, rerender } = renderHook(
      ({ mode }) => {
        const { toasts, addToast, dismissToast } = useToasts();

        useEffect(() => {
          if (mode === "add") {
            addToast("toast title", "toast body");
          } else if (mode == "dismiss") {
            dismissToast(toasts[0].id);
          }
        }, [mode]);

        return toasts;
      },
      {
        initialProps: {
          mode: "add",
        },
      }
    );

    expect(result.current.length).toEqual(1);
    expect(result.current[0].title).toEqual("toast title");
    expect(result.current[0].body).toEqual("toast body");

    rerender({ mode: "dismiss" });

    expect(result.current).toEqual([]);
  });
});
