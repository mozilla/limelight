/*
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

import { describe, expect, test } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import userEvent from "@testing-library/user-event";

import Toasts from "../Toasts";
import useToasts from "../../hooks/useToasts";

function Component() {
  const context = useToasts();
  const { addToast } = context;

  useEffect(() => {
    addToast("toast one title", "body of toast one");
    addToast("toast two title", () => <p>rich toast</p>);
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

    // Both toasts should render.
    screen.getByText("toast one title");
    screen.getByText("body of toast one");
    screen.getByText("toast two title");
    screen.getByText("rich toast");

    // Both toasts should have a close button.
    expect(screen.getAllByLabelText("Close").length).toEqual(2);

    // Remove the first toast.
    await userEvent.click(screen.getAllByLabelText("Close")[0]);

    // Only the second toast should render.
    expect(screen.queryByText("toast one title")).toBeNull();
    expect(screen.queryByText("body of toast one")).toBeNull();
    screen.getByText("toast two title");
    screen.getByText("rich toast");

    // Remove the second toast.
    await userEvent.click(screen.getByLabelText("Close"));

    // No toasts should render.
    expect(screen.queryByText("toast two title")).toBeNull();
    expect(screen.queryByText("rich toast")).toBeNull();
  });
});
