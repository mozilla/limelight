/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from "react";

import { MessageTemplate } from "../components/Wizard/messageTypes";
import useLocalStorage from "./useLocalStorage";
import WizardFormData from "../components/Wizard/formData";

export interface SavedMessage {
  template: MessageTemplate;
  formData: WizardFormData;
}
export type SavedMessages = Record<string, SavedMessage>;

export interface UseSavedMessages {
  messages: SavedMessages;
  saveMessage: (
    id: string,
    template: MessageTemplate,
    formData: WizardFormData
  ) => void;
  deleteMessage: (id: string) => void;
}

function isSavedMessages(value: unknown): value is SavedMessages {
  return true; // TODO
}

export default function useSavedMessages(): UseSavedMessages {
  const [messages, setMessages] = useLocalStorage(
    "savedMessages",
    isSavedMessages,
    {}
  );

  const saveMessage = useCallback(
    (id: string, template: MessageTemplate, formData: WizardFormData) => {
      setMessages((oldMessages) => {
        const newMessages = { ...oldMessages };
        newMessages[id] = { template, formData };
        return newMessages;
      });
    },
    [setMessages]
  );

  const deleteMessage = useCallback(
    (id: string) => {
      setMessages((oldMessages) => {
        const newMessages = { ...oldMessages };
        delete newMessages[id];
        return newMessages;
      });
    },
    [setMessages]
  );

  return { messages, saveMessage, deleteMessage };
}
