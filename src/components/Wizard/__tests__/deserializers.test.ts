/*
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

import { beforeEach, describe, expect, test } from "@jest/globals";

import deserialize, { deserializeBaseMessage } from "../deserializers";
import DeserializationContext from "../deserializers/context";
import WizardFormData from "../formData";
import { BaseMessage } from "../messageTypes";

function baseMessage(data: Partial<BaseMessage> = {}): BaseMessage {
  return {
    id: "message-id",
    targeting: "true",
    trigger: {
      id: "defaultBrowserCheck",
    },
    ...data,
  };
}

function metaFormData(
  data: Partial<WizardFormData["meta"]> = {}
): WizardFormData["meta"] {
  return {
    targeting: "true",
    groups: [],
    trigger: JSON.stringify({ id: "defaultBrowserCheck" }, null, 2),
    frequency: {
      lifetime: {
        enabled: false,
        value: 1,
      },
      custom: [],
    },
    priority: {
      enabled: false,
      value: 0,
      order: 0,
    },
    ...data,
  };
}

describe("deserializeBaseMessage", () => {
  let ctx: DeserializationContext;
  beforeEach(() => void (ctx = new DeserializationContext()));

  test("minimal message", () => {
    expect(deserializeBaseMessage(ctx, baseMessage())).toEqual(metaFormData());
    expect(ctx.warnings).toEqual([]);
  });

  describe("with groups", () => {
    test("empty groups", () => {
      expect(
        deserializeBaseMessage(
          ctx,
          baseMessage({
            groups: [],
          })
        )
      ).toEqual(metaFormData());
      expect(ctx.warnings).toEqual([]);
    });

    test("one group", () => {
      expect(
        deserializeBaseMessage(
          ctx,
          baseMessage({
            groups: ["cfr"],
          })
        )
      ).toEqual(
        metaFormData({
          groups: ["cfr"],
        })
      );
      expect(ctx.warnings).toEqual([]);
    });

    test("multiple groups", () => {
      expect(
        deserializeBaseMessage(
          ctx,
          baseMessage({
            groups: ["cfr", "eco"],
          })
        )
      ).toEqual(
        metaFormData({
          groups: ["cfr", "eco"],
        })
      );
      expect(ctx.warnings).toEqual([]);
    });
  });

  describe("with priority", () => {
    test("only priority", () => {
      expect(
        deserializeBaseMessage(
          ctx,
          baseMessage({
            priority: 7,
          })
        )
      ).toEqual(
        metaFormData({
          priority: {
            enabled: true,
            value: 7,
            order: 0,
          },
        })
      );
      expect(ctx.warnings).toEqual([]);
    });

    test("priority and order", () => {
      expect(
        deserializeBaseMessage(
          ctx,
          baseMessage({
            priority: 7,
            order: 1,
          })
        )
      ).toEqual(
        metaFormData({
          priority: {
            enabled: true,
            value: 7,
            order: 1,
          },
        })
      );
      expect(ctx.warnings).toEqual([]);
    });

    test("only order", () => {
      expect(
        deserializeBaseMessage(
          ctx,
          baseMessage({
            order: 1,
          })
        )
      ).toEqual(
        metaFormData({
          priority: {
            enabled: false,
            value: 0,
            order: 0,
          },
        })
      );
      expect(ctx.warnings).toEqual([]);
    });
  });

  describe("with frequency", () => {
    test("empty", () => {
      expect(
        deserializeBaseMessage(
          ctx,
          baseMessage({
            frequency: {},
          })
        )
      ).toEqual(metaFormData());
      expect(ctx.warnings).toEqual([]);
    });

    test("lifetime", () => {
      expect(
        deserializeBaseMessage(
          ctx,
          baseMessage({
            frequency: {
              lifetime: 1,
            },
          })
        )
      ).toEqual(
        metaFormData({
          frequency: {
            lifetime: {
              enabled: true,
              value: 1,
            },
            custom: [],
          },
        })
      );
      expect(ctx.warnings).toEqual([]);
    });

    test("one custom", () => {
      expect(
        deserializeBaseMessage(
          ctx,
          baseMessage({
            frequency: {
              custom: [{ period: 1, cap: 1 }],
            },
          })
        )
      ).toEqual(
        metaFormData({
          frequency: {
            lifetime: {
              enabled: false,
              value: 1,
            },
            custom: [{ period: 1, cap: 1 }],
          },
        })
      );
      expect(ctx.warnings).toEqual([]);
    });

    test("multiple custom", () => {
      expect(
        deserializeBaseMessage(
          ctx,
          baseMessage({
            frequency: {
              custom: [
                { period: 1, cap: 1 },
                { period: 2, cap: 2 },
              ],
            },
          })
        )
      ).toEqual(
        metaFormData({
          frequency: {
            lifetime: {
              enabled: false,
              value: 1,
            },
            custom: [
              { period: 1, cap: 1 },
              { period: 2, cap: 2 },
            ],
          },
        })
      );
      expect(ctx.warnings).toEqual([]);
    });
  });
});

describe("deserialize", () => {
  describe("missing required fields", () => {
    test("id", () => {
      expect(() => deserialize({ targeting: "true" })).toThrow(
        "id: Missing required field"
      );
    });

    test("targeting", () => {
      expect(() => deserialize({ id: "message-id" })).toThrow(
        "targeting: Missing required field"
      );
    });
  });

  describe("InfoBar", () => {
    describe("missing required fields", () => {
      test("trigger", () => {
        expect(() =>
          deserialize({
            id: "message-id",
            targeting: "true",
            template: "infobar",
          })
        ).toThrow("trigger: Missing required field");
      });
    });

    test("minimal message", () => {
      expect(
        deserialize({
          ...baseMessage(),
          template: "infobar",
          content: {
            text: "Hello, world",
            buttons: [],
            type: "tab",
          },
        })
      ).toEqual({
        id: "message-id",
        template: "infobar",
        formData: {
          content: {
            text: {
              localized: false,
              value: "Hello, world",
            },
            buttons: [],
            type: "tab",
            priority: {
              enabled: false,
              value: 0,
            },
          },
          meta: metaFormData(),
        },
        warnings: [],
      });
    });
  });

  test("unknown template", () => {
    expect(() =>
      deserialize({
        id: "message-id",
        targeting: "true",
        template: "bogus",
      })
    ).toThrow("template: Unsupported message template: 'bogus'");
  });

  test("with unknown properties", () => {
    expect(
      deserialize({
        ...baseMessage(),
        template: "infobar",
        content: {
          text: "Hello, world",
          buttons: [],
          type: "tab",
        },
        unknown: "unknown",
      })
    ).toEqual({
      id: "message-id",
      template: "infobar",
      formData: {
        content: {
          text: {
            localized: false,
            value: "Hello, world",
          },
          buttons: [],
          type: "tab",
          priority: {
            enabled: false,
            value: 0,
          },
        },
        meta: metaFormData(),
      },
      warnings: [{ field: "unknown", message: "Field was not deserialized" }],
    });
  });
});
