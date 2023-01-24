/*
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

import { beforeEach, describe, expect, test } from "@jest/globals";

import deserializeSpotlightContent, {
  DEFAULT_LOGO_URL,
  deserializeSpotlightScreen,
  deserializeSpotlightLogo,
  deserializeSpotlightButton,
  deserializeSpotlightDismissButton,
} from "../deserializers";
import {
  defaultSpotlightButtonFormData,
  LogoAndTitleScreenFormData,
} from "../formData";
import DeserializationContext from "../../deserializers/context";

import { LogoAndTitleScreenContent } from "../messageTypes";
import { SpotlightScreenKind } from "../SpotlightScreensInput/screens";
import { defaultLocalizableTextFormData } from "../../../LocalizableTextInput/formData";

const SCREEN_GENERATORS = {
  [SpotlightScreenKind.LogoAndTitle]: {
    screen: (content: Partial<LogoAndTitleScreenContent> = {}) => {
      return {
        id: "LOGO_AND_TITLE",
        content: {
          logo: {},
          title: { raw: "Title" },
          primary_button: {
            label: { raw: "Button" },
            action: {
              navigate: true,
            },
          },
          ...content,
        },
      };
    },

    screenFormData: (content: Partial<LogoAndTitleScreenFormData> = {}) => {
      return {
        screenId: "LOGO_AND_TITLE",
        kind: SpotlightScreenKind.LogoAndTitle,
        content: {
          logo: {
            hasImageURL: true,
            imageURL: DEFAULT_LOGO_URL,
            height: "",
          },
          background: "",
          title: {
            localized: false,
            value: "Title",
            rich: false,
          },
          titleStyle: "",
          subtitle: defaultLocalizableTextFormData({ rich: true }),
          primaryButton: {
            ...defaultSpotlightButtonFormData({ enabled: true }),
            label: {
              localized: false,
              value: "Button",
              rich: false,
            },
          },
          secondaryButton: defaultSpotlightButtonFormData({ enabled: false }),
          dismissButton: {
            enabled: false,
          },
          ...content,
        },
      };
    },
  },
} as const;

let ctx: DeserializationContext;

beforeEach(() => void (ctx = new DeserializationContext()));

describe("deserializeSpotlightButton", () => {
  beforeEach(
    () => void (ctx = ctx.field("content.screens.0.content.primary_button"))
  );

  test("buttons omitted", () => {
    expect(deserializeSpotlightButton(ctx, undefined)).toEqual(
      defaultSpotlightButtonFormData({ enabled: false })
    );

    expect(ctx.warnings).toEqual([]);
  });

  test("with plain string label", () => {
    expect(
      deserializeSpotlightButton(ctx, {
        label: "button",
        action: {
          navigate: true,
        },
      })
    ).toEqual({
      enabled: true,
      label: {
        localized: false,
        value: "button",
        rich: false,
      },
      action: {
        navigate: true,
        dismiss: false,
        type: "",
        data: "",
      },
    });
    expect(ctx.warnings).toEqual([]);
  });

  test("with raw label", () => {
    expect(
      deserializeSpotlightButton(ctx, {
        label: { raw: "button" },
        action: {
          navigate: true,
        },
      })
    ).toEqual({
      enabled: true,
      label: {
        localized: false,
        value: "button",
        rich: false,
      },
      action: {
        navigate: true,
        dismiss: false,
        type: "",
        data: "",
      },
    });
    expect(ctx.warnings).toEqual([]);
  });

  test("with rich raw label (ignored)", () => {
    expect(
      deserializeSpotlightButton(ctx, {
        label: { raw: "button", zap: true },
        action: {
          navigate: true,
        },
      })
    ).toEqual({
      enabled: true,
      label: {
        localized: false,
        value: "button",
        rich: false,
      },
      action: {
        navigate: true,
        dismiss: false,
        type: "",
        data: "",
      },
    });
    expect(ctx.warnings).toEqual([
      {
        field: "content.screens.0.content.primary_button.label",
        message: "Rich text not supported",
      },
    ]);
  });

  test("with localized label", () => {
    expect(
      deserializeSpotlightButton(ctx, {
        label: { string_id: "string-id" },
        action: { navigate: true },
      })
    ).toEqual({
      enabled: true,
      label: {
        localized: true,
        value: "string-id",
        rich: false,
      },
      action: {
        navigate: true,
        dismiss: false,
        type: "",
        data: "",
      },
    });
    expect(ctx.warnings).toEqual([]);
  });

  test("with rich localized label (ignored)", () => {
    expect(
      deserializeSpotlightButton(ctx, {
        label: { string_id: "string-id", zap: true },
        action: {
          navigate: true,
        },
      })
    ).toEqual({
      enabled: true,
      label: {
        localized: true,
        value: "string-id",
        rich: false,
      },
      action: {
        navigate: true,
        dismiss: false,
        type: "",
        data: "",
      },
    });
    expect(ctx.warnings).toEqual([
      {
        field: "content.screens.0.content.primary_button.label",
        message: "Rich text not supported",
      },
    ]);
  });

  test("with action type", () => {
    expect(
      deserializeSpotlightButton(ctx, {
        label: "button",
        action: {
          type: "SET_DEFAULT_BROWSER",
        },
      })
    ).toEqual({
      enabled: true,
      label: {
        localized: false,
        value: "button",
        rich: false,
      },
      action: {
        navigate: false,
        dismiss: false,
        type: "SET_DEFAULT_BROWSER",
        data: "",
      },
    });
    expect(ctx.warnings).toEqual([]);
  });

  test("with action type and data", () => {
    expect(
      deserializeSpotlightButton(ctx, {
        label: "button",
        action: {
          type: "SHOW_FIREFOX_ACCOUNTS",
          data: {
            entrypoint: "activity-stream-firstrun",
          },
        },
      })
    ).toEqual({
      enabled: true,
      label: {
        localized: false,
        value: "button",
        rich: false,
      },
      action: {
        navigate: false,
        dismiss: false,
        type: "SHOW_FIREFOX_ACCOUNTS",
        data: JSON.stringify(
          {
            entrypoint: "activity-stream-firstrun",
          },
          null,
          2
        ),
      },
    });
    expect(ctx.warnings).toEqual([]);
  });

  test("with dismiss and navigate", () => {
    expect(
      deserializeSpotlightButton(ctx, {
        label: "button",
        action: {
          dismiss: true,
          navigate: true,
        },
      })
    ).toEqual({
      enabled: true,
      label: {
        localized: false,
        value: "button",
        rich: false,
      },
      action: {
        navigate: false,
        dismiss: true,
        type: "",
        data: "",
      },
    });
    expect(ctx.warnings).toEqual([]);
  });
});

describe("deserializeSpotlightDismissButton", () => {
  beforeEach(
    () => void (ctx = ctx.field("content.screens.0.content.dismiss_button"))
  );

  test("undefined", () => {
    expect(deserializeSpotlightDismissButton(ctx, undefined)).toEqual({
      enabled: false,
    });
    expect(ctx.warnings).toEqual([]);
  });

  test("dismiss: undefined", () => {
    expect(deserializeSpotlightDismissButton(ctx, { action: {} })).toEqual({
      enabled: false,
    });
    expect(ctx.warnings).toEqual([]);
  });

  test("dismiss: false", () => {
    expect(
      deserializeSpotlightDismissButton(ctx, { action: { dismiss: false } })
    ).toEqual({ enabled: false });
    expect(ctx.warnings).toEqual([]);
  });

  test("dismiss: true", () => {
    expect(
      deserializeSpotlightDismissButton(ctx, { action: { dismiss: true } })
    ).toEqual({ enabled: true });
    expect(ctx.warnings).toEqual([]);
  });
});

describe("deserializeSpotlightLogo", () => {
  beforeEach(() => void (ctx = ctx.field("content.screens.0.content.logo")));
  test("without image URL or height", () => {
    expect(deserializeSpotlightLogo(ctx, {})).toEqual({
      hasImageURL: true,
      imageURL: DEFAULT_LOGO_URL,
      height: "",
    });
    expect(ctx.warnings).toEqual([]);
  });

  test("with 'none' image URL", () => {
    expect(
      deserializeSpotlightLogo(ctx, {
        imageURL: "none",
      })
    ).toEqual({
      hasImageURL: false,
      imageURL: "",
      height: "",
    });
    expect(ctx.warnings).toEqual([]);
  });

  test("with image URL", () => {
    expect(
      deserializeSpotlightLogo(ctx, {
        imageURL:
          "chrome://activity-stream/content/data/content/assets/remote/umbrella.png",
      })
    ).toEqual({
      hasImageURL: true,
      imageURL:
        "chrome://activity-stream/content/data/content/assets/remote/umbrella.png",
      height: "",
    });
    expect(ctx.warnings).toEqual([]);
  });

  test("with height", () => {
    expect(
      deserializeSpotlightLogo(ctx, {
        height: "150px",
      })
    ).toEqual({
      hasImageURL: true,
      imageURL: DEFAULT_LOGO_URL,
      height: "150px",
    });
    expect(ctx.warnings).toEqual([]);
  });
});

describe("deserializeSpotlightScreen", () => {
  beforeEach(() => void (ctx = ctx.field("content.screens.0")));

  test("Unknown screen", () => {
    expect(
      deserializeSpotlightScreen(ctx, {
        id: "UNKNOWN",
        content: {},
      })
    ).toEqual({});
  });

  describe("LogoAndTitleScreen", () => {
    const { screen, screenFormData } =
      SCREEN_GENERATORS[SpotlightScreenKind.LogoAndTitle];

    test("minimal screen", () => {
      expect(deserializeSpotlightScreen(ctx, screen())).toEqual(
        screenFormData()
      );
      expect(ctx.warnings).toEqual([]);
    });

    describe("title style", () => {
      test("fancy", () => {
        expect(
          deserializeSpotlightScreen(ctx, screen({ title_style: "fancy" }))
        ).toEqual(screenFormData({ titleStyle: "fancy" }));
        expect(ctx.warnings).toEqual([]);
      });

      test("fancy shine", () => {
        expect(
          deserializeSpotlightScreen(
            ctx,
            screen({ title_style: "fancy shine" })
          )
        ).toEqual(screenFormData({ titleStyle: "fancy shine" }));
        expect(ctx.warnings).toEqual([]);
      });
    });

    test("with background", () => {
      expect(
        deserializeSpotlightScreen(
          ctx,
          screen({
            background: "red",
          })
        )
      ).toEqual(
        screenFormData({
          background: "red",
        })
      );
      expect(ctx.warnings).toEqual([]);
    });

    test("with secondary button", () => {
      expect(
        deserializeSpotlightScreen(
          ctx,
          screen({
            secondary_button: {
              label: "Secondary",
              action: {
                navigate: true,
              },
            },
          })
        )
      ).toEqual(
        screenFormData({
          secondaryButton: {
            ...defaultSpotlightButtonFormData({ enabled: true }),
            label: {
              localized: false,
              value: "Secondary",
              rich: false,
            },
          },
        })
      );
      expect(ctx.warnings).toEqual([]);
    });

    test("with dismiss button", () => {
      expect(
        deserializeSpotlightScreen(
          ctx,
          screen({
            dismiss_button: { action: { dismiss: true } },
          })
        )
      ).toEqual(
        screenFormData({
          dismissButton: { enabled: true },
        })
      );
    });

    test("with unknown properties", () => {
      expect(
        deserializeSpotlightScreen(
          ctx,
          screen({
            extra: "unknown key",
          })
        )
      ).toEqual(screenFormData());
      expect(ctx.warnings).toEqual([
        {
          field: "content.screens.0.content.extra",
          message: "Field was not deserialized",
        },
      ]);
    });
  });
});

describe("deserializeSpotlightContent", () => {
  const { screen, screenFormData } =
    SCREEN_GENERATORS[SpotlightScreenKind.LogoAndTitle];

  beforeEach(() => void (ctx = ctx.field("content")));

  test("logo-and-content", () => {
    expect(() =>
      deserializeSpotlightContent(ctx, {
        template: "logo-and-content",
        screens: [],
      })
    ).toThrow("content.template: Only multistage Spotlight is supported");
  });

  test("minimal", () => {
    expect(
      deserializeSpotlightContent(ctx, {
        template: "multistage",
        screens: [],
      })
    ).toEqual({
      modal: "tab",
      backdrop: "",
      transitions: false,
      screens: [],
    });
    expect(ctx.warnings).toEqual([]);
  });

  test("with one screen", () => {
    expect(
      deserializeSpotlightContent(ctx, {
        template: "multistage",
        screens: [screen()],
      })
    ).toEqual({
      modal: "tab",
      backdrop: "",
      transitions: false,
      screens: [screenFormData()],
    });
    expect(ctx.warnings).toEqual([]);
  });

  test("with multiple screens", () => {
    expect(
      deserializeSpotlightContent(ctx, {
        template: "multistage",
        screens: [
          screen(),
          {
            ...screen(),
            id: "SCREEN_2",
          },
        ],
      })
    ).toEqual({
      modal: "tab",
      backdrop: "",
      transitions: false,
      screens: [
        screenFormData(),
        {
          ...screenFormData(),
          screenId: "SCREEN_2",
        },
      ],
    });
    expect(ctx.warnings).toEqual([]);
  });

  describe("with modal", () => {
    test("with tab modal", () => {
      expect(
        deserializeSpotlightContent(ctx, {
          template: "multistage",
          screens: [],
          modal: "tab",
        })
      ).toEqual({
        modal: "tab",
        backdrop: "",
        transitions: false,
        screens: [],
      });
      expect(ctx.warnings).toEqual([]);
    });

    test("with global modal", () => {
      expect(
        deserializeSpotlightContent(ctx, {
          template: "multistage",
          screens: [],
          modal: "global",
        })
      ).toEqual({
        modal: "global",
        backdrop: "",
        transitions: false,
        screens: [],
      });
      expect(ctx.warnings).toEqual([]);
    });
  });

  describe("with transitions", () => {
    test("true", () => {
      expect(
        deserializeSpotlightContent(ctx, {
          template: "multistage",
          screens: [],
          transitions: true,
        })
      ).toEqual({
        modal: "tab",
        backdrop: "",
        transitions: true,
        screens: [],
      });
      expect(ctx.warnings).toEqual([]);
    });

    test("false", () => {
      expect(
        deserializeSpotlightContent(ctx, {
          template: "multistage",
          screens: [],
          transitions: false,
        })
      ).toEqual({
        modal: "tab",
        backdrop: "",
        transitions: false,
        screens: [],
      });
      expect(ctx.warnings).toEqual([]);
    });
  });
});
