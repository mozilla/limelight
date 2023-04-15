/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SavedMessages } from "../../hooks/useSavedMessages";
import WizardFormData from "../Wizard/formData";
import { MessageTemplate } from "../Wizard/messageTypes";

export interface ImportMessageFormProps {
  onImportMessage: (
    messageId: string,
    messageTemplate: MessageTemplate,
    formData: WizardFormData
  ) => void;
}

export interface EditMessageFormProps {
  onEditMessage: (id: string) => void;
  onDeleteMessage: (key: string) => void;
  messages: SavedMessages;
}

export interface NewMessageFormProps {
  onNewMessage: (id: string, template: MessageTemplate) => void;
}

type NewEditImportPaneProps = NewMessageFormProps &
  EditMessageFormProps &
  ImportMessageFormProps;

export default NewEditImportPaneProps;
