/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import LocalizableTextFormData from "../LocalizableTextInput/formData";
import WizardFormData from "./formData";
import InfoBarWizardFormData from "./InfoBarWizard/formData";
import { LocalizableText, Message, MessageTemplate } from "./messageTypes";

export default function serializeMessage(
  id: string,
  template: MessageTemplate,
  data: WizardFormData
): Message {
  if (template !== "infobar") {
    throw new Error("Unsupported");
  }

  const message: Message = {
    id,
    template,
    targeting: data.meta.targeting,
    groups: data.meta.groups,
    trigger: JSON.parse(data.meta.trigger) as object,

    content: {
      type: data.content.type,
      text: serializeLocalizableText(data.content.text),
      buttons: data.content.buttons.map(serializeInfoBarButton),
    },
  };

  if (data.content.priority.enabled) {
    message.content.priority = data.content.priority.value;
  }

  if (
    data.meta.frequency.lifetime.enabled ||
    data.meta.frequency.custom.length
  ) {
    message.frequency = {};
    if (data.meta.frequency.lifetime.enabled) {
      message.frequency.lifetime = data.meta.frequency.lifetime.value;
    }
    if (data.meta.frequency.custom.length) {
      message.frequency.custom = data.meta.frequency.custom;
    }
  }

  if (data.meta.priority.enabled) {
    message.priority = data.meta.priority.value;
    if (!isNaN(data.meta.priority.order)) {
      message.order = data.meta.priority.order;
    }
  }

  return message;
}

function serializeLocalizableText(
  data: LocalizableTextFormData
): LocalizableText {
  if (data.localized) {
    return { string_id: data.stringId };
  } else {
    return data.text;
  }
}

function serializeInfoBarButton({
  label,
  primary,
  accessKey,
  supportPage,
  action,
}: InfoBarWizardFormData["content"]["buttons"][number]): Message["content"]["buttons"][number] {
  return {
    label: serializeLocalizableText(label),
    ...(accessKey ? { accessKey } : {}),
    ...(primary ? { primary } : {}),
    ...(supportPage ? { supportPage } : {}),
    action: JSON.parse(action) as object,
  };
}
