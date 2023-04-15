/*
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

import { beforeEach, describe, expect, test } from "@jest/globals";

import deserializeInfoBarContent, {
  deserializeInfoBarButtons,
} from "../deserializers";
import DeserializationContext from "../../Wizard/deserializers/context";

let ctx: DeserializationContext;

beforeEach(() => void (ctx = new DeserializationContext()));

describe("deserializeInfobarButtons", () => {
  beforeEach(() => void (ctx = ctx.field("content.buttons")));

  test("empty", () => {
    expect(deserializeInfoBarButtons(ctx, [])).toEqual([]);
    expect(ctx.warnings).toEqual([]);
  });

  test("minimal button", () => {
    expect(
      deserializeInfoBarButtons(ctx, [
        {
          label: "Label",
          action: { type: "SET_DEFAULT_BROWSER" },
        },
      ])
    ).toEqual([
      {
        label: {
          localized: false,
          value: "Label",
          rich: false,
        },
        primary: false,
        accessKey: "",
        supportPage: "",
        action: JSON.stringify({ type: "SET_DEFAULT_BROWSER" }, null, 2),
      },
    ]);
    expect(ctx.warnings).toEqual([]);
  });

  test("primary button", () => {
    expect(
      deserializeInfoBarButtons(ctx, [
        {
          label: "Label",
          action: { type: "SET_DEFAULT_BROWSER" },
          primary: true,
        },
      ])
    ).toEqual([
      {
        label: {
          localized: false,
          value: "Label",
          rich: false,
        },
        primary: true,
        accessKey: "",
        supportPage: "",
        action: JSON.stringify({ type: "SET_DEFAULT_BROWSER" }, null, 2),
      },
    ]);
    expect(ctx.warnings).toEqual([]);
  });

  test("button with accessKey", () => {
    expect(
      deserializeInfoBarButtons(ctx, [
        {
          label: "Label",
          action: { type: "SET_DEFAULT_BROWSER" },
          accessKey: "l",
        },
      ])
    ).toEqual([
      {
        label: {
          localized: false,
          value: "Label",
          rich: false,
        },
        primary: false,
        accessKey: "l",
        supportPage: "",
        action: JSON.stringify({ type: "SET_DEFAULT_BROWSER" }, null, 2),
      },
    ]);
    expect(ctx.warnings).toEqual([]);
  });

  test("button with supportPage", () => {
    expect(
      deserializeInfoBarButtons(ctx, [
        {
          label: "Label",
          supportPage: "storage-permissions",
          action: { type: "CANCEL" },
        },
      ])
    ).toEqual([
      {
        label: {
          localized: false,
          value: "Label",
          rich: false,
        },
        primary: false,
        accessKey: "",
        supportPage: "storage-permissions",
        action: JSON.stringify({ type: "CANCEL" }, null, 2),
      },
    ]);
    expect(ctx.warnings).toEqual([]);
  });

  test("button with all fields", () => {
    expect(
      deserializeInfoBarButtons(ctx, [
        {
          label: "Label",
          action: { type: "CANCEL" },
          primary: true,
          accessKey: "l",
          supportPage: "storage-permissions",
        },
      ])
    ).toEqual([
      {
        label: {
          localized: false,
          value: "Label",
          rich: false,
        },
        primary: true,
        accessKey: "l",
        supportPage: "storage-permissions",
        action: JSON.stringify({ type: "CANCEL" }, null, 2),
      },
    ]);
    expect(ctx.warnings).toEqual([]);
  });

  test("button with localized text", () => {
    expect(
      deserializeInfoBarButtons(ctx, [
        {
          label: { string_id: "string-id" },
          primary: true,
          accessKey: "l",
          action: {
            type: "SET_DEFAULT_BROWSER",
          },
        },
      ])
    ).toEqual([
      {
        label: {
          localized: true,
          value: "string-id",
          rich: false,
        },
        primary: true,
        accessKey: "l",
        supportPage: "",
        action: JSON.stringify({ type: "SET_DEFAULT_BROWSER" }, null, 2),
      },
    ]);
    expect(ctx.warnings).toEqual([]);
  });

  test("button with rich localized text (ignored)", () => {
    expect(
      deserializeInfoBarButtons(ctx, [
        {
          label: { string_id: "string-id", zap: true },
          primary: true,
          accessKey: "l",
          action: { type: "SET_DEFAULT_BROWSER" },
        },
      ])
    ).toEqual([
      {
        label: {
          localized: true,
          value: "string-id",
          rich: false,
        },
        primary: true,
        accessKey: "l",
        supportPage: "",
        action: JSON.stringify({ type: "SET_DEFAULT_BROWSER" }, null, 2),
      },
    ]);
    expect(ctx.warnings.length).toEqual(1);
    expect(ctx.warnings[0]).toEqual({
      field: "content.buttons.0.label",
      message: "Rich text not supported",
    });
  });

  test("multiple buttons", () => {
    expect(
      deserializeInfoBarButtons(ctx, [
        {
          label: "Primary",
          action: { type: "SET_DEFAULT_BROWSER" },
          primary: true,
          accessKey: "p",
        },
        {
          label: "Cancel",
          action: { type: "CANCEL" },
          accessKey: "c",
        },
      ])
    ).toEqual([
      {
        label: {
          localized: false,
          value: "Primary",
          rich: false,
        },
        primary: true,
        accessKey: "p",
        supportPage: "",
        action: JSON.stringify({ type: "SET_DEFAULT_BROWSER" }, null, 2),
      },
      {
        label: {
          localized: false,
          value: "Cancel",
          rich: false,
        },
        primary: false,
        accessKey: "c",
        supportPage: "",
        action: JSON.stringify({ type: "CANCEL" }, null, 2),
      },
    ]);
    expect(ctx.warnings).toEqual([]);
  });
});

describe("deserializeInfoBarContent", () => {
  beforeEach(() => void (ctx = ctx.field("content")));

  test("minimal", () => {
    expect(
      deserializeInfoBarContent(ctx, {
        text: "Hello, world",
        buttons: [],
        type: "tab",
      })
    ).toEqual({
      text: {
        localized: false,
        value: "Hello, world",
        rich: false,
      },
      buttons: [],
      type: "tab",
      priority: {
        enabled: false,
        value: 0,
      },
    });

    expect(ctx.warnings).toEqual([]);
  });

  test("with global type", () => {
    expect(
      deserializeInfoBarContent(ctx, {
        text: "Hello, world",
        buttons: [],
        type: "global",
      })
    ).toEqual({
      text: {
        localized: false,
        value: "Hello, world",
        rich: false,
      },
      buttons: [],
      type: "global",
      priority: {
        enabled: false,
        value: 0,
      },
    });

    expect(ctx.warnings).toEqual([]);
  });

  test("with priority", () => {
    expect(
      deserializeInfoBarContent(ctx, {
        text: "Hello, world",
        buttons: [],
        type: "tab",
        priority: 1,
      })
    ).toEqual({
      text: {
        localized: false,
        value: "Hello, world",
        rich: false,
      },
      buttons: [],
      type: "tab",
      priority: {
        enabled: true,
        value: 1,
      },
    });

    expect(ctx.warnings).toEqual([]);
  });

  test("with buttons", () => {
    const buttons = [
      {
        label: "Primary",
        action: { type: "SET_DEFAULT_BROWSER" },
        primary: true,
        accessKey: "p",
      },
      {
        label: "Cancel",
        action: { type: "CANCEL" },
        accessKey: "c",
      },
    ];

    expect(
      deserializeInfoBarContent(ctx, {
        text: "Hello, world",
        buttons,
        type: "tab",
        priority: 1,
      })
    ).toEqual({
      text: {
        localized: false,
        value: "Hello, world",
        rich: false,
      },
      // Use a separate context so that ctx is not polluted.
      buttons: deserializeInfoBarButtons(new DeserializationContext(), buttons),
      type: "tab",
      priority: {
        enabled: true,
        value: 1,
      },
    });

    expect(ctx.warnings).toEqual([]);
  });
});
