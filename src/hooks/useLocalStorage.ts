/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useCallback, useState } from "react";

export default function useLocalStorage<T>(
  key: string,
  guard: (value: unknown) => value is T,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [parsedValue, setParsedValue] = useState(() => {
    const rawValue = window.localStorage.getItem(key);
    if (rawValue) {
      let value;
      try {
        value = JSON.parse(rawValue) as unknown;
      } catch (e) {
        return defaultValue;
      }

      if (guard(value)) {
        return value;
      }
    }
    return defaultValue;
  });

  const setValue = useCallback(
    (newValue: React.SetStateAction<T>) => {
      setParsedValue((oldValue: T) => {
        const value =
          newValue instanceof Function ? newValue(oldValue) : newValue;
        window.localStorage.setItem(key, JSON.stringify(value));
        return value;
      });
    },
    [key]
  );

  return [parsedValue, setValue];
}
