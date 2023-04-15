/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import deserializeLocalizableText from "../inputs/LocalizableTextInput/deserializers";
import DeserializationContext from "../Wizard/deserializers/context";
import InfoBarWizardFormData from "./formData";
import InfoBarMessageContent from "./messageTypes";

export default function deserializeInfoBarContent(
  ctx: DeserializationContext,
  data: InfoBarMessageContent
): InfoBarWizardFormData["content"] {
  ctx.warnOnUnknown(data, ["text", "buttons", "type", "priority"]);

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
  return data.map((btn, index) => {
    const btnCtx = ctx.field(`${index}.label`);

    btnCtx.warnOnUnknown(btn, [
      "label",
      "primary",
      "accessKey",
      "action",
      "supportPage",
    ]);

    return {
      label: deserializeLocalizableText(btnCtx, btn.label),
      primary: btn.primary ?? false,
      accessKey: btn.accessKey ?? "",
      action: JSON.stringify(btn.action, undefined, 2),
      supportPage: btn.supportPage ?? "",
    };
  });
}
