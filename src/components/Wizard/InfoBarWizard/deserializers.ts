/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import DeserializationContext from "../deserializers/context";
import InfoBarWizardFormData from "./formData";
import InfoBarMessageContent from "./messageTypes";

import deserializeLocalizableText from "../../LocalizableTextInput/deserializers";

export default function deserializeInfoBarContent(
  ctx: DeserializationContext,
  data: InfoBarMessageContent
): InfoBarWizardFormData["content"] {
  return {
    text: deserializeLocalizableText(ctx.field("text"), data.text),
    buttons: deserializeInfoBarButtons(ctx.field("buttons"), data.buttons),
    type: data.type,
    priority: {
      enabled: Object.hasOwn(data, "priority"),
      value: data.priority ?? 0,
    },
  };
}

export function deserializeInfoBarButtons(
  ctx: DeserializationContext,
  data: InfoBarMessageContent["buttons"]
): InfoBarWizardFormData["content"]["buttons"] {
  return data.map((btn, index) => ({
    label: deserializeLocalizableText(ctx.field(`${index}.label`), btn.label),
    primary: btn.primary ?? false,
    accessKey: btn.accessKey ?? "",
    action: JSON.stringify(btn.action, undefined, 2),
    supportPage: btn.supportPage ?? "",
  }));
}
