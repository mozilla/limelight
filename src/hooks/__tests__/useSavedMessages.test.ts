/*
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

import { afterEach, beforeAll, describe, expect, test } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { useEffect } from "react";

import WizardFormData, {
  InfoBarWizardFormData,
} from "../../components/Wizard/formData";
import useSavedMessages from "../useSavedMessages";

describe("useSavedMessages", () => {
  beforeAll(() => {
    localStorage.clear();
    expect(localStorage.length).toEqual(0);
  });

  afterEach(() => {
    localStorage.clear();
    expect(localStorage.length).toEqual(0);
  });

  test("default value", () => {
    renderHook(() => {
      const { messages } = useSavedMessages();
      expect(messages).toEqual({});
    });
  });

  const FORM_DATA: WizardFormData = {
    content: {
      text: {
        localized: false,
        value: "hello, world",
      },
      buttons: [],
      type: "tab",
      priority: {
        enabled: false,
        value: 0,
      },
    },
    meta: {
      targeting: "true",
      groups: [],
      trigger: "{}",
      frequency: {
        lifetime: {
          enabled: false,
          value: 0,
        },

        custom: [],
      },
      priority: {
        enabled: false,
        value: 0,
        order: 0,
      },
    },
  } satisfies WizardFormData & InfoBarWizardFormData;

  test("setting messages", () => {
    const {
      result: { current: messages },
    } = renderHook(() => {
      const { messages, saveMessage } = useSavedMessages();

      useEffect(() => {
        saveMessage("message-id", "infobar", FORM_DATA);
      }, []);

      return messages;
    });

    expect(messages).toEqual({
      "message-id": {
        template: "infobar",
        formData: FORM_DATA,
      },
    });

    expect(localStorage.length).toEqual(1);

    const savedMessages = localStorage.getItem("savedMessages");
    expect(typeof savedMessages).toEqual("string");
    expect(JSON.parse(savedMessages as string)).toEqual({
      "message-id": { template: "infobar", formData: FORM_DATA },
    });
  });

  test("retrieving messages", () => {
    localStorage.setItem(
      "savedMessages",
      JSON.stringify({
        "message-id": {
          template: "infobar",
          formData: FORM_DATA,
        },
      })
    );

    const {
      result: {
        current: { messages },
      },
    } = renderHook(() => useSavedMessages());
    expect(messages).toEqual({
      "message-id": { template: "infobar", formData: FORM_DATA },
    });
  });

  test("deleting messages", () => {
    localStorage.setItem(
      "savedMessages",
      JSON.stringify({
        "message-id": {
          template: "infobar",
          formData: FORM_DATA,
        },
      })
    );

    const {
      result: { current: messages },
    } = renderHook(() => {
      const { messages, deleteMessage } = useSavedMessages();

      useEffect(() => {
        deleteMessage("message-id");
      }, []);

      return messages;
    });

    expect(messages).toEqual({});
  });
});
