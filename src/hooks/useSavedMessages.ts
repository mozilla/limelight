/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback } from "react";

import { Message } from "../components/Wizard/messageTypes";
import useLocalStorage from "./useLocalStorage";

export type SavedMessages = Record<string, Message>;

export interface UseSavedMessages {
  messages: SavedMessages;
  saveMessage: (message: Message) => void;
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
    (message: Message) => {
      setMessages((oldMessages) => ({
        ...oldMessages,
        [message.id]: message,
      }));
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
