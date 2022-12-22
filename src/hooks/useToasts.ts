/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useState } from "react";

export type ToastBody = string | (() => JSX.Element);
export interface Toast {
  id: string;
  title: string;
  body: ToastBody;
}

export interface UseToasts {
  toasts: Toast[];
  addToast: (title: string, body: ToastBody) => void;
  dismissToast: (id: string) => void;
}

export default function useToasts(): UseToasts {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((title: string, body: ToastBody) => {
    setToasts((oldToasts) => [
      ...oldToasts,
      {
        id: window.crypto.randomUUID(),
        title,
        body,
      },
    ]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((oldToasts) => {
      const index = oldToasts.findIndex((t) => t.id === id);
      if (index === -1) {
        return oldToasts;
      }

      return [...oldToasts.slice(0, index), ...oldToasts.slice(index + 1)];
    });
  }, []);

  return {
    toasts,
    addToast,
    dismissToast,
  };
}
