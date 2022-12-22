/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import WizardFormData, {
  BaseFormData,
  InfoBarWizardFormData,
  SpotlightWizardFormData,
} from "./formData";
import { Message, MessageTemplate, BaseMessage } from "./messageTypes";
import serializeInfoBarContent from "./InfoBarWizard/serializers";
import serializeSpotlightContent from "./SpotlightWizard/serializers";

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
