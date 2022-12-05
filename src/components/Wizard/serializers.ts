/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

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
  };

  if (data.content.transitions) {
    content.transitions = data.content.transitions;
  }

  if (data.content.backdrop) {
    content.backdrop = data.content.backdrop;
  }

  return content;
}

function serializeLocalizableText(
  data: LocalizableTextFormData,
  rich = false
): LocalizableText {
  if (!rich && !data.localized) {
    return data.value;
  }

  let text: LocalizableText;
  if (data.localized) {
    text = { string_id: data.value };
  } else {
    text = { raw: data.value };
  }

  if ("rich" in data) {
    text.rich = { ...data.rich };
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
