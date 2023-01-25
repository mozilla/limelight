/*
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

import { describe, expect, test } from "@jest/globals";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";

import FormRow from "../FormRow";
import LocalizableTextInput from "../../LocalizableTextInput";
import { RegisteredFormControl } from "../../RegisteredFormControl";
import TabbedInput, { RenderTabProps } from "../TabbedInput";
import { LocalizableTextFormData } from "../formData";

interface FormData<T> {
  content: {
    field: T;
  }[];
}

function Wrapper<T>({ children }: { children: ReactNode }) {
  const context = useForm<FormData<T>>();
  const { handleSubmit } = context;

  function onSubmit() {
    // Do nothing.
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...context}>{children}</FormProvider>
      <input type="submit" value="submit" />
    </form>
  );
}

function renderWrapped<T>(
  ...[ui, options]: Parameters<typeof render>
): ReturnType<typeof render> {
  return render(ui, { wrapper: Wrapper<T>, ...options });
}

const ADD_TAB_TEXT = "add tab";
const DELETE_TAB_TEXT = "delete tab";
const EMPTY_TABS_TEXT = "there are no tabs";
const FIELD_LABEL = "Field";
const FOCUS_FIELD_NAME = "field";
const CONTROL_PREFIX = "content";

function getFocusedElement() {
  // eslint-disable-next-line testing-library/no-node-access
  return document.activeElement;
}

describe("TabbedInput", () => {
  describe("rendering a simple field", () => {
    const defaults = () => ({ field: "" });

    function renderTab({
      handleDelete,
      index,
    }: RenderTabProps<FormData<string>, typeof CONTROL_PREFIX>) {
      const { register } = useFormContext<FormData<string>>();
      return (
        <>
          <FormRow
            label={FIELD_LABEL}
            controlId={`${CONTROL_PREFIX}.${index}.field`}
          >
            <RegisteredFormControl
              register={register}
              name={`${CONTROL_PREFIX}.${index}.field`}
              registerOptions={{ required: true }}
            />
          </FormRow>
          <button onClick={handleDelete}>{DELETE_TAB_TEXT}</button>
        </>
      );
    }

    const defaultProps = {
      controlPrefix: CONTROL_PREFIX,
      renderTab,
      emptyTabs: EMPTY_TABS_TEXT,
      defaults,
      focusName: FOCUS_FIELD_NAME,
      addText: ADD_TAB_TEXT,
    } as const;

    test("empty control", () => {
      renderWrapped(<TabbedInput {...defaultProps} />);
      screen.getByTitle(ADD_TAB_TEXT);
      screen.getByText(EMPTY_TABS_TEXT);
    });

    test("add and remove tabs", async () => {
      renderWrapped(<TabbedInput {...defaultProps} />);

      const addBtn = screen.getByTitle(ADD_TAB_TEXT);

      // Add a tab.
      await userEvent.click(addBtn);
      let tabs = screen.getAllByRole("tab");

      expect(screen.queryByText(EMPTY_TABS_TEXT)).toBeNull();

      // There should be one tab. It should be active.
      expect(tabs.length).toEqual(1);
      expect(tabs[0].classList).toContain("active");

      // Add a second tab.
      await userEvent.click(addBtn);
      tabs = screen.getAllByRole("tab");

      // There should be two tabs. The second tab should be active.
      expect(tabs.length).toEqual(2);
      expect(tabs[1].classList).toContain("active");

      // Add a third tab.
      await userEvent.click(addBtn);
      tabs = screen.getAllByRole("tab");

      // There should be three tabs. The third tab should be active.
      expect(tabs.length).toEqual(3);
      expect(tabs[2].classList).toContain("active");

      // Remove the third tab.
      await userEvent.click(screen.getAllByText(DELETE_TAB_TEXT)[2]);
      tabs = screen.getAllByRole("tab");

      // There should be two tabs. The second tab should be active.
      expect(tabs.length).toEqual(2);
      expect(tabs[1].classList).toContain("active");

      // Focus the first tab.
      await userEvent.click(tabs[0]);

      // It should be active.
      expect(tabs[0].classList).toContain("active");

      // Delete it.
      await userEvent.click(screen.getAllByText(DELETE_TAB_TEXT)[0]);

      // The tab should be removed.
      expect(tabs[0].isConnected).toEqual(false);

      // There should be one tab. It should be aftive.
      tabs = screen.getAllByRole("tab");
      expect(tabs.length).toEqual(1);
      expect(tabs[0].classList).toContain("active");

      // Remove the last tab.
      await userEvent.click(screen.getByText(DELETE_TAB_TEXT));

      // There should be no more tabs.
      expect(screen.queryAllByRole("tab")).toEqual([]);
      screen.getByText(EMPTY_TABS_TEXT);
    });

    test("focusing a field when adding a tab", async () => {
      renderWrapped(<TabbedInput {...defaultProps} />);

      const addBtn = screen.getByTitle(ADD_TAB_TEXT);

      // Add a tab.
      await userEvent.click(addBtn);

      // The field on the first tab should be focused.
      expect(getFocusedElement()).toBe(screen.getByLabelText(FIELD_LABEL));

      // Add a second tab.
      await userEvent.click(addBtn);

      // The field on the second tab should be focused.
      expect(getFocusedElement()).toBe(
        screen.getAllByLabelText(FIELD_LABEL)[1]
      );
    });

    test("focusing a field on an inactive tab", async () => {
      renderWrapped(<TabbedInput {...defaultProps} />);

      const addBtn = screen.getByTitle(ADD_TAB_TEXT);

      // Add two tabs.
      await userEvent.click(addBtn);
      await userEvent.click(addBtn);

      // The second tab should be focused.
      const tabs = screen.getAllByRole("tab");
      expect(tabs.length).toEqual(2);
      expect(tabs[1].classList).toContain("active");

      // Validate the form.
      await userEvent.click(screen.getByText("submit"));

      // The first tab should be focused.
      expect(tabs[1].classList).toContain("active");

      // The input element is not focused immediately because it has to wait for the transition to complete.
      await waitFor(() =>
        expect(getFocusedElement()).toBe(
          screen.getAllByLabelText(FIELD_LABEL)[0]
        )
      );
    });
  });

  describe("rendering a complex field (LocalizableTextInput)", () => {
    const defaults = () => ({
      field: {
        localized: false,
        value: "",
      },
    });
    const FOCUS_NAME = "field.value";
    const ADD_TAB_TEXT = "add tab";
    const DELETE_TAB_TEXT = "delete tab";

    function renderTab({
      handleDelete,
      index,
    }: RenderTabProps<
      FormData<LocalizableTextFormData>,
      typeof CONTROL_PREFIX
    >) {
      return (
        <>
          <FormRow label="Field">
            <LocalizableTextInput
              controlPrefix={`${CONTROL_PREFIX}.${index}.field`}
              label={FIELD_LABEL}
              required
            />
          </FormRow>
          <button onClick={handleDelete}>{DELETE_TAB_TEXT}</button>
        </>
      );
    }

    const defaultProps = {
      controlPrefix: CONTROL_PREFIX,
      renderTab,
      emptyTabs: EMPTY_TABS_TEXT,
      defaults,
      focusName: FOCUS_NAME,
      addText: ADD_TAB_TEXT,
    } as const;

    test("focusing a field when adding a tab", async () => {
      renderWrapped(<TabbedInput {...defaultProps} />);

      const addBtn = screen.getByTitle(ADD_TAB_TEXT);

      // Add a tab.
      await userEvent.click(addBtn);

      // The field on the first tab should be focused.
      // eslint-disable-next-line testing-library/no-node-access
      expect(getFocusedElement()).toBe(screen.getByLabelText("Text"));

      // Add a second tab.
      await userEvent.click(addBtn);

      // The field on the second tab should be focused.
      expect(getFocusedElement()).toBe(screen.getAllByLabelText("Text")[1]);
    });

    test("focusing a field on an inactive tab", async () => {
      renderWrapped(<TabbedInput {...defaultProps} />);

      const addBtn = screen.getByTitle(ADD_TAB_TEXT);

      // Add two tabs.
      await userEvent.click(addBtn);
      await userEvent.click(addBtn);

      // The second tab should be focused.
      const tabs = screen.getAllByRole("tab");
      expect(tabs.length).toEqual(2);
      expect(tabs[1].classList).toContain("active");

      // Validate the form.
      await userEvent.click(screen.getByText("submit"));

      // The first tab should be focused.
      expect(tabs[1].classList).toContain("active");

      // The input element is not focused immediately because it has to wait for the transition to complete.
      await waitFor(() =>
        expect(getFocusedElement()).toBe(screen.getAllByLabelText("Text")[0])
      );
    });

    test("LocalizableTextInput toggles correctly inside a TabbedInput", async () => {
      // Issue 56.

      renderWrapped(<TabbedInput {...defaultProps} />);

      // Add a tab.
      await userEvent.click(screen.getByTitle(ADD_TAB_TEXT));

      // There should be a text input and not a string ID input.
      screen.getByLabelText("Text");
      expect(screen.queryByLabelText("String ID")).toBeNull();

      // Toggle localization checkbox.
      await userEvent.click(screen.getByLabelText("Localized?"));

      // There should be a string ID input and no text input.
      screen.getByLabelText("String ID");
      expect(screen.queryByLabelText("Text")).toBeNull();

      // Toggle localization checkbox.
      await userEvent.click(screen.getByLabelText("Localized?"));

      // There should be a text input and not a string ID input.
      screen.getByLabelText("Text");
      expect(screen.queryByLabelText("String ID")).toBeNull();
    });
  });
});
