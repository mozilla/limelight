/*
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

import { beforeEach, describe, expect, test } from "@jest/globals";

import DeserializationContext from "../../../Wizard/deserializers/context";
import deserializeLocalizableText from "../deserializers";
import { defaultLocalizableTextFormData } from "../formData";

const RICH_TEXT_PRESET = { zap: true };

describe("deserializeLocalizableText", () => {
  let ctx: DeserializationContext;

  beforeEach(() => {
    ctx = new DeserializationContext().field("field");
  });

  test("undefined", () => {
    expect(deserializeLocalizableText(ctx, undefined)).toEqual(
      defaultLocalizableTextFormData({ rich: false })
    );
    expect(ctx.warnings).toEqual([]);
  });

  test("plain string", () => {
    expect(deserializeLocalizableText(ctx, "Hello, world")).toEqual({
      localized: false,
      value: "Hello, world",
      rich: false,
    });
    expect(ctx.warnings).toEqual([]);
  });

  test("raw string", () => {
    expect(deserializeLocalizableText(ctx, { raw: "Hello, world" })).toEqual({
      localized: false,
      value: "Hello, world",
      rich: false,
    });
    expect(ctx.warnings).toEqual([]);
  });

  test("string ID", () => {
    expect(deserializeLocalizableText(ctx, { string_id: "string-id" })).toEqual(
      {
        localized: true,
        value: "string-id",
        rich: false,
      }
    );
    expect(ctx.warnings).toEqual([]);
  });

  test("plain string with rich text preset", () => {
    expect(
      deserializeLocalizableText(ctx, "foo", {
        richTextPreset: RICH_TEXT_PRESET,
      })
    ).toEqual({
      localized: false,
      value: "foo",
      rich: false,
    });

    expect(ctx.warnings.length).toEqual(1);
    expect(ctx.warnings[0]).toEqual({
      field: "field",
      message:
        "Expected { raw } object instead of literal string. Rich text presets are not supported on literal strings.",
    });
  });

  describe("raw string with rich text", () => {
    test("matching preset", () => {
      expect(
        deserializeLocalizableText(
          ctx,
          { raw: "foo", ...RICH_TEXT_PRESET },
          { richTextPreset: RICH_TEXT_PRESET }
        )
      ).toEqual({
        localized: false,
        value: "foo",
        rich: true,
      });
      expect(ctx.warnings).toEqual([]);
    });

    test("not matching preset", () => {
      expect(
        deserializeLocalizableText(
          ctx,
          { raw: "foo", fontSize: "100px" },
          { richTextPreset: RICH_TEXT_PRESET }
        )
      ).toEqual({
        localized: false,
        value: "foo",
        rich: true,
      });

      expect(ctx.warnings.length).toEqual(1);
      expect(ctx.warnings[0]).toEqual({
        field: "field",
        message:
          "Rich text properties did not match expected preset; deserializing as if they did",
      });
    });

    test("with no preset (rich text ignored)", () => {
      expect(
        deserializeLocalizableText(ctx, { raw: "foo", zap: true })
      ).toEqual({
        localized: false,
        value: "foo",
        rich: false,
      });

      expect(ctx.warnings.length).toEqual(1);
      expect(ctx.warnings[0]).toEqual({
        field: "field",
        message: "Rich text not supported",
      });
    });
  });

  describe("localized string with rich text", () => {
    test("matching preset", () => {
      expect(
        deserializeLocalizableText(
          ctx,
          { string_id: "string-id", ...RICH_TEXT_PRESET },
          { richTextPreset: RICH_TEXT_PRESET }
        )
      ).toEqual({
        localized: true,
        value: "string-id",
        rich: true,
      });
      expect(ctx.warnings).toEqual([]);
    });

    test("not matching preset", () => {
      expect(
        deserializeLocalizableText(
          ctx,
          { string_id: "string-id", fontSize: "100px" },
          { richTextPreset: RICH_TEXT_PRESET }
        )
      ).toEqual({
        localized: true,
        value: "string-id",
        rich: true,
      });

      expect(ctx.warnings.length).toEqual(1);
      expect(ctx.warnings[0]).toEqual({
        field: "field",
        message:
          "Rich text properties did not match expected preset; deserializing as if they did",
      });
    });

    test("with no preset (rich text ignored)", () => {
      expect(
        deserializeLocalizableText(ctx, { string_id: "string-id", zap: true })
      ).toEqual({
        localized: true,
        value: "string-id",
        rich: false,
      });

      expect(ctx.warnings.length).toEqual(1);
      expect(ctx.warnings[0]).toEqual({
        field: "field",
        message: "Rich text not supported",
      });
    });
  });
});
