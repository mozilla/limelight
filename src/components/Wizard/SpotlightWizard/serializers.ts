/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import SpotlightWizardFormData, {
  SpotlightButtonFormData,
  SpotlightDismissButtonFormData,
  SpotlightLogoFormData,
  SpotlightScreenFormData,
} from "./formData";
import SpotlightMessageContent from "./messageTypes";
import { RichTextPresets } from "../../LocalizableTextInput";
import serializeLocalizableText from "../../LocalizableTextInput/serializers";
import { SpotlightScreenKind } from "./SpotlightScreensInput/screens";

export default function serializeSpotlightContent(
  data: SpotlightWizardFormData
): SpotlightMessageContent {
  const content: SpotlightMessageContent = {
    template: "multistage",
    modal: data.content.modal,
    screens: [],
  };

  if (data.content.transitions) {
    content.transitions = data.content.transitions;
  }

  if (data.content.backdrop) {
    content.backdrop = data.content.backdrop;
  }

  for (const screen of data.content.screens) {
    if (!screen.kind) {
      throw new Error("Screen must have a kind");
    }

    content.screens.push({
      id: screen.screenId,
      content: serializeSpotlightScreenContent(screen),
    });
  }

  return content;
}

function serializeSpotlightScreenContent(data: SpotlightScreenFormData) {
  switch (data.kind) {
    case SpotlightScreenKind.LogoAndTitle:
      return Object.assign(
        {
          logo: serializeSpotlightLogo(data.content.logo),
          title: serializeLocalizableText(
            data.content.title,
            RichTextPresets.TITLE
          ),
          dismiss_button: serializeSpotlightDismissButton(
            data.content.dismissButton
          ),
          primary_button: serializeSpotlightButton(data.content.primaryButton),
        },
        data.content.titleStyle ? { title_style: data.content.titleStyle } : {},
        data.content.background.length
          ? { background: data.content.background }
          : {},
        data.content.subtitle?.value?.length
          ? {
              subtitle: serializeLocalizableText(
                data.content.subtitle,
                RichTextPresets.SUBTITLE
              ),
            }
          : {},
        data.content.secondaryButton.enabled
          ? {
              secondary_button: serializeSpotlightButton(
                data.content.secondaryButton
              ),
            }
          : {}
      ) as Record<string, unknown>;

    default:
      throw new Error("Unsupported screen kind");
  }
}

function serializeSpotlightLogo(data: SpotlightLogoFormData) {
  const imageURL = data.hasImageURL ? data.imageURL : "none";

  const logo: Record<string, string> = { imageURL };

  if (data.height.length) {
    logo.height = data.height;
  }

  return logo;
}

function serializeSpotlightButton(data: SpotlightButtonFormData) {
  return {
    label: serializeLocalizableText(data.label),
    action: Object.assign(
      data.action.navigate ? { navigate: true } : {},
      data.action.dismiss ? { dismiss: true } : {},
      data.action.type ? { type: data.action.type } : {},
      data.action.type && data.action.data
        ? { data: JSON.parse(data.action.data) as unknown }
        : {}
    ),
  };
}
function serializeSpotlightDismissButton(data: SpotlightDismissButtonFormData) {
  if (data.enabled) {
    return {
      action: { dismiss: true },
    };
  }
  return undefined;
}
