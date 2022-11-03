/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from "react";

import NewEditImportPane from "./NewEditImportPane";
import { MessageTemplate } from "./messageTypes";
import InfoBarWizard from "./InfoBarWizard";

type MessageInfo = {
  id: string;
  template: MessageTemplate;
};

export default function Wizard() {
  const [messageInfo, setMessageInfo] = useState<MessageInfo | undefined>(
    undefined
  );

  if (typeof messageInfo === "undefined") {
    const handleNewMessage = (id: string, template: MessageTemplate) =>
      setMessageInfo({
        id,
        template,
      });

    return <NewEditImportPane onNewMessage={handleNewMessage} />;
  }

  let MessageWizard;
  switch (messageInfo.template) {
    case "infobar":
      MessageWizard = InfoBarWizard;
      break;

    case "cfr":
    case "multistage-spotlight":
    case "pbnewtab":
      return <></>;
  }

  const stopEditing = () => setMessageInfo(undefined);
  return <MessageWizard id={messageInfo.id} stopEditing={stopEditing} />;
}
