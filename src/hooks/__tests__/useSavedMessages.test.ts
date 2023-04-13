/*
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

import { afterEach, beforeAll, describe, expect, test } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { useEffect } from "react";

import useSavedMessages from "../useSavedMessages";
import { Message } from "../../components/Wizard/messageTypes";

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

  const MESSAGE: Message = {
    id: "message-id",
    targeting: "true",
    template: "infobar",
    content: {
      type: "tab",
      text: "Hello, world",
      buttons: [],
    },
  };

  test("setting messages", () => {
    const {
      result: { current: messages },
    } = renderHook(() => {
      const { messages, saveMessage } = useSavedMessages();

      useEffect(() => {
        saveMessage(MESSAGE);
      }, []);

      return messages;
    });

    expect(messages).toEqual({
      "message-id": MESSAGE,
    });

    expect(localStorage.length).toEqual(1);

    const savedMessages = localStorage.getItem("savedMessages");
    expect(typeof savedMessages).toEqual("string");
    expect(JSON.parse(savedMessages as string)).toEqual({
      "message-id": MESSAGE,
    });
  });

  test("retrieving messages", () => {
    localStorage.setItem(
      "savedMessages",
      JSON.stringify({
        "message-id": MESSAGE,
      })
    );

    const {
      result: {
        current: { messages },
      },
    } = renderHook(() => useSavedMessages());
    expect(messages).toEqual({
      "message-id": MESSAGE,
    });
  });

  test("deleting messages", () => {
    localStorage.setItem(
      "savedMessages",
      JSON.stringify({
        "message-id": MESSAGE,
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
