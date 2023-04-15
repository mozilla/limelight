/*
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

import { describe, expect, test } from "@jest/globals";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useEffect } from "react";

import useToasts from "../../hooks/useToasts";
import Toasts from "../Toasts";

function Component() {
  const context = useToasts();
  const { addToast } = context;

  useEffect(() => {
    addToast("toast one title", "body of toast one");
    addToast("toast two title", () => <p>rich toast</p>);
    addToast("toast three title", "autohiding toast", { autohide: true });
  }, []);

  return (
    <Toasts.Provider context={context}>
      <Toasts />
    </Toasts.Provider>
  );
}

describe("Toasts", () => {
  test("lifecycle", async () => {
    render(<Component />);

    // All toasts should render.
    screen.getByText("toast one title");
    screen.getByText("body of toast one");
    screen.getByText("toast two title");
    screen.getByText("rich toast");
    screen.getByText("toast three title");
    screen.getByText("autohiding toast");

    // All toasts should have a close button.
    expect(screen.getAllByLabelText("Close").length).toEqual(3);

    // Remove the first toast.
    await userEvent.click(screen.getAllByLabelText("Close")[0]);

    // Only the second  and third toasts should render.
    expect(screen.queryByText("toast one title")).toBeNull();
    expect(screen.queryByText("body of toast one")).toBeNull();
    screen.getByText("toast two title");
    screen.getByText("rich toast");
    screen.getByText("toast three title");
    screen.getByText("autohiding toast");

    // Remove the second toast.
    await userEvent.click(screen.getAllByLabelText("Close")[0]);

    // Only the third toast should render.
    expect(screen.queryByText("toast two title")).toBeNull();
    expect(screen.queryByText("rich toast")).toBeNull();
    screen.getByText("toast three title");
    screen.getByText("autohiding toast");

    // Wait for the third toast to auto-dismiss
    await act(() => new Promise((resolve) => setTimeout(resolve, 3500)));

    // No toasts should render.
    expect(screen.queryByText("toast three title")).toBeNull();
    expect(screen.queryByText("autohiding toast")).toBeNull();
  });
});
