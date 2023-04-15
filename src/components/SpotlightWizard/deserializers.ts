/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RichTextPresets } from "../inputs/LocalizableTextInput";
import deserializeLocalizableText from "../inputs/LocalizableTextInput/deserializers";
import DeserializerContext from "../Wizard/deserializers/context";
import SpotlightWizardFormData, {
  LogoAndTitleScreenFormData,
  SpotlightButtonFormData,
  SpotlightLogoFormData,
  SpotlightScreenFormData,
  defaultSpotlightButtonFormData,
  SpotlightDismissButtonFormData,
} from "./formData";
import SpotlightMessageContent, {
  LogoAndTitleScreenContent,
  SpotlightButton,
  SpotlightDismissButton,
  SpotlightLogo,
  SpotlightScreen,
} from "./messageTypes";
import { SpotlightScreenKind } from "../inputs/SpotlightScreensInput/screens";

export default function deserializeSpotlightContent(
  ctx: DeserializerContext,
  data: SpotlightMessageContent
): SpotlightWizardFormData["content"] {
  if (data.template !== "multistage") {
    throw ctx.error("template", "Only multistage Spotlight is supported");
  }

  ctx.warnOnUnknown(data, [
    "modal",
    "backdrop",
    "transitions",
    "screens",
    "template",
  ]);

  return {
    modal: data.modal ?? "tab",
    backdrop: data.backdrop ?? "",
    transitions: data.transitions ?? false,
    screens: data.screens.map((screenData, index) =>
      deserializeSpotlightScreen(ctx.field(`screens.${index}`), screenData)
    ),
  };
}

// TODO: Use type guards.
const SCREEN_PROPERTIES = new Map([
  [
    SpotlightScreenKind.LogoAndTitle,
    {
      requiredProperties: ["logo", "title", "primary_button"],
      optionalProperties: [
        "background",
        "title_style",
        "subtitle",
        "secondary_button",
      ],
    },
  ],
]);

export function deserializeSpotlightScreen(
  ctx: DeserializerContext,
  data: SpotlightScreen
): SpotlightScreenFormData {
  let screenKind: SpotlightScreenKind | null = null;

  const fieldCtx = ctx.field("content");

  for (const [
    kind,
    { optionalProperties, requiredProperties },
  ] of SCREEN_PROPERTIES.entries()) {
    let missingProperties = false;

    for (const property of requiredProperties) {
      if (!Object.hasOwn(data.content, property)) {
        missingProperties = true;
        break;
      }
    }

    if (missingProperties) {
      continue;
    }

    fieldCtx.warnOnUnknown(data.content, [
      ...requiredProperties,
      ...optionalProperties,
    ]);

    screenKind = kind;
    break;
  }

  let content: LogoAndTitleScreenFormData;
  switch (screenKind) {
    case SpotlightScreenKind.LogoAndTitle:
      // Safety: We checked the required properties above.
      content = deserializeSpotlightLogoAndTitleScreen(
        fieldCtx,
        data.content as unknown as LogoAndTitleScreenContent
      );
      break;

    case null:
      ctx.warn("Unknown screen type: could not deserialize");
      return { kind: undefined };
  }

  // TODO: Deserialize extra keys not present.

  return {
    screenId: data.id,
    kind: screenKind,
    content,
  };
}

function deserializeSpotlightLogoAndTitleScreen(
  ctx: DeserializerContext,
  data: LogoAndTitleScreenContent
): LogoAndTitleScreenFormData {
  return {
    logo: deserializeSpotlightLogo(ctx.field("logo"), data.logo),
    background: data.background ?? "",
    title: deserializeLocalizableText(ctx.field("title"), data.title, {
      richTextPreset: RichTextPresets.TITLE,
    }),
    titleStyle: data.title_style ?? "",
    subtitle: deserializeLocalizableText(ctx.field("subtitle"), data.subtitle, {
      richTextPreset: RichTextPresets.SUBTITLE,
    }),
    primaryButton: deserializeSpotlightButton(
      ctx.field("primary_button"),
      data.primary_button
    ),
    secondaryButton: deserializeSpotlightButton(
      ctx.field("secondary_button"),
      data.secondary_button
    ),
    dismissButton: deserializeSpotlightDismissButton(
      ctx.field("dimiss_button"),
      data.dismiss_button
    ),
  };
}

export const DEFAULT_LOGO_URL = "chrome://branding/content/about-logo.svg";

export function deserializeSpotlightLogo(
  ctx: DeserializerContext,
  data: SpotlightLogo
): SpotlightLogoFormData {
  const hasImageURL = data.imageURL !== "none";

  ctx.warnOnUnknown(data, ["imageURL", "height"]);

  return {
    hasImageURL,
    imageURL: hasImageURL ? data.imageURL || DEFAULT_LOGO_URL : "",
    height: data.height ?? "",
  };
}

export function deserializeSpotlightButton(
  ctx: DeserializerContext,
  data: SpotlightButton | undefined
): SpotlightButtonFormData {
  if (typeof data === "undefined") {
    return defaultSpotlightButtonFormData({ enabled: false });
  }

  ctx.warnOnUnknown(data, ["label", "action"]);

  return {
    enabled: true,
    label: deserializeLocalizableText(ctx.field("label"), data.label),
    action: {
      navigate: data.action.dismiss ? false : data.action.navigate ?? false,
      dismiss: data.action.dismiss ?? false,
      type: data.action.type ?? "",
      data:
        data.action.type && data.action.data
          ? JSON.stringify(data.action.data, null, 2)
          : "",
    },
  };
}

export function deserializeSpotlightDismissButton(
  ctx: DeserializerContext,
  data: SpotlightDismissButton | undefined
): SpotlightDismissButtonFormData {
  if (typeof data === "object" && data !== null) {
    ctx.warnOnUnknown(data, ["action"]);
  }

  return {
    enabled: data?.action?.dismiss === true,
  };
}
