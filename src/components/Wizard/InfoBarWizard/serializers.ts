/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import InfoBarWizardFormData from "./formData";
import InfoBarMessageContent from "./messageTypes";
import serializeLocalizableText from "../../LocalizableTextInput/serializers";

export default function serializeInfoBarContent(
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
