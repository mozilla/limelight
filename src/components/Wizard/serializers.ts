/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RichTextPresets } from "../LocalizableTextInput";
import { RichTextProperties } from "../LocalizableTextInput/messageTypes";
import WizardFormData, {
  BaseFormData,
  InfoBarWizardFormData,
  LocalizableTextFormData,
  SpotlightWizardFormData,
} from "./formData";
import {
  Message,
  InfoBarMessageContent,
  LocalizableText,
  MessageTemplate,
  SpotlightMessageContent,
  BaseMessage,
} from "./messageTypes";
import {
  SpotlightButtonFormData,
  SpotlightDismissButtonFormData,
  SpotlightLogoFormData,
  SpotlightScreenFormData,
} from "./SpotlightWizard/formData";
import { SpotlightScreenKind } from "./SpotlightWizard/SpotlightScreensInput/screens";

export default function serializeMessage(
  id: string,
  template: MessageTemplate,
  data: WizardFormData
): Message {
  if (template !== "infobar" && template !== "spotlight") {
    throw new Error("Unsupported");
  }

  const message: Message = {
    ...serializeBaseMessage(id, template, data),
    ...serializeMessageContent(template, data),
  };

  return message;
}

function serializeBaseMessage(
  id: string,
  template: MessageTemplate,
  data: BaseFormData
): BaseMessage {
  const base: BaseMessage = {
    id,
    targeting: data.meta.targeting,
    groups: data.meta.groups,
    trigger: JSON.parse(data.meta.trigger) as object,
  };

  if (
    data.meta.frequency.lifetime.enabled ||
    data.meta.frequency.custom.length
  ) {
    base.frequency = {};
    if (data.meta.frequency.lifetime.enabled) {
      base.frequency.lifetime = data.meta.frequency.lifetime.value;
    }
    if (data.meta.frequency.custom.length) {
      base.frequency.custom = data.meta.frequency.custom;
    }
  }

  if (data.meta.priority.enabled) {
    base.priority = data.meta.priority.value;
    if (!isNaN(data.meta.priority.order)) {
      base.order = data.meta.priority.order;
    }
  }

  return base;
}

function serializeMessageContent(
  template: MessageTemplate,
  data: WizardFormData
) {
  switch (template) {
    case "infobar":
      return {
        template,
        content: serializeInfoBarContent(data as InfoBarWizardFormData),
      };

    case "spotlight":
      return {
        template,
        content: serializeSpotlightContent(data as SpotlightWizardFormData),
      };

    case "cfr":
    case "pbnewtab":
      throw new Error("Unsupported");
  }
}

function serializeInfoBarContent(
  data: InfoBarWizardFormData
): InfoBarMessageContent {
  const content: InfoBarMessageContent = {
    type: data.content.type,
    text: serializeLocalizableText(data.content.text),
    buttons: data.content.buttons.map(serializeInfoBarButton),
  };

  if (data.content.priority.enabled) {
    content.priority = data.content.priority.value;
  }

  return content;
}

function serializeSpotlightContent(
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

function serializeSpotlightDismissButton(data: SpotlightDismissButtonFormData) {
  if (data.enabled) {
    return {
      action: { dismiss: true },
    };
  }
  return undefined;
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

function serializeLocalizableText(
  data: LocalizableTextFormData,
  richTextPreset?: RichTextProperties
): LocalizableText {
  if (!richTextPreset && !data.localized) {
    return data.value;
  }

  let text: LocalizableText;
  if (data.localized) {
    text = { string_id: data.value };
  } else {
    text = { raw: data.value };
  }

  if (data.rich) {
    Object.assign(text, richTextPreset);
  }

  return text;
}

function serializeInfoBarButton({
  label,
  primary,
  accessKey,
  supportPage,
  action,
}: InfoBarWizardFormData["content"]["buttons"][number]): InfoBarMessageContent["buttons"][number] {
  return {
    label: serializeLocalizableText(label),
    ...(accessKey ? { accessKey } : {}),
    ...(primary ? { primary } : {}),
    ...(supportPage ? { supportPage } : {}),
    action: JSON.parse(action) as object,
  };
}
