/*
 * Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";
import { types } from "@mozilla/nimbus-shared";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";
import selectEvent from "react-select-event";

import useToasts from "../../../hooks/useToasts";
import Toasts from "../../Toasts";
import WizardFormData from "../../Wizard/formData";
import { MessageTemplate } from "../../Wizard/messageTypes";
import ExperimentImportMessageForm from "../ExperimentImportMessageForm";

type NimbusExperiment = types.experiments.NimbusExperiment;
type Branches = NimbusExperiment["branches"];

function recipe(slug: string, branches?: Branches): NimbusExperiment {
  const featureIds = new Set<string>();
  for (const branch of branches ?? []) {
    const features =
      "features" in branch ? branch["features"] : [branch["feature"]];
    for (const feature of features) {
      featureIds.add(feature.featureId);
    }
  }

  return {
    slug,
    id: slug,
    userFacingName: "Experiment",
    userFacingDescription: "Experiment description",
    schemaVersion: "1.9.0",
    appName: "firefox_desktop",
    appId: "firefox-desktop",
    channel: "nightly",
    branches: branches ?? [],
    isEnrollmentPaused: true,
    bucketConfig: {
      namespace: "limelight",
      randomizationUnit: "normandy_id",
      start: 0,
      count: 1000,
      total: 1000,
    },
    startDate: "1970-01-01",
    endDate: "1970-01-01",
    proposedEnrollment: 1,
    referenceBranch: "control",
    featureIds: Array.from(featureIds),
  };
}

function infobar(slug: string, branchSlug: string) {
  return {
    id: `${slug}:${branchSlug}`,
    targeting: "true",
    trigger: {
      id: "defaultBrowserCheck",
    },
    template: "infobar",
    content: {
      text: "Text",
      type: "tab",
      buttons: [],
    },
  };
}

const API_RESPONSE = [
  recipe("recipe-one-branch", [
    {
      slug: "control",
      features: [
        {
          featureId: "infobar",
          value: infobar("recipe-one-branch", "control"),
        },
      ],
      ratio: 1,
    },
  ]),
  recipe("recipe-multiple-branches", [
    {
      slug: "control",
      features: [
        {
          featureId: "infobar",
          value: infobar("recipe-multiple-branches", "control"),
        },
      ],
      ratio: 1,
    },
    {
      slug: "treatment",
      features: [
        {
          featureId: "infobar",
          value: infobar("recipe-multiple-branches", "treatment"),
        },
      ],
      ratio: 1,
    },
  ]),
  recipe("recipe-multiple-messages-per-branch", [
    {
      slug: "control",
      features: [
        {
          featureId: "infobar",
          value: infobar("recipe-multiple-messages-per-branch", "control-a"),
        },
        {
          featureId: "infobar",
          value: infobar("recipe-multiple-messages-per-branch", "control-b"),
        },
      ],
      ratio: 1,
    },
  ]),
  recipe("recipe-invalid-features", [
    {
      slug: "control",
      features: [
        {
          featureId: "unsupported",
          value: {},
        },
      ],
      ratio: 1,
    },
  ]),
  recipe("recipe-spotlight-logo-and-content", [
    {
      slug: "control",
      features: [
        {
          featureId: "spotlight",
          value: {
            id: "recipe-spotlight-logo-and-content:control",
            template: "spotlight",
            targeting: "true",
            trigger: {
              id: "defaultBrowserCheck",
            },
            content: {
              template: "logo-and-content",
            },
          },
        },
      ],
      ratio: 1,
    },
  ]),
  recipe("recipe-warn", [
    {
      slug: "unknown-property",
      features: [
        {
          featureId: "infobar",
          value: {
            ...infobar("recipe-warn", "unknown-property"),
            content: {
              ...infobar("recipe-warn", "unknown-property").content,
              unknownContentProperty: "unknown",
            },
            unknownProperty: "unknown",
          },
        },
      ],
      ratio: 1,
    },
  ]),
];

function Wrapper({ children }: { children: ReactNode }) {
  const context = useToasts();

  return (
    <Toasts.Provider context={context}>
      {children}
      <Toasts />
    </Toasts.Provider>
  );
}

function renderWrapped(
  ...[ui, options]: Parameters<typeof render>
): ReturnType<typeof render> {
  return render(ui, { wrapper: Wrapper, ...options });
}

describe("ExperimentImportMessageForm", () => {
  const onImportMessage: jest.MockedFunction<
    (
      messageId: string,
      messageTemplate: MessageTemplate,
      formData: WizardFormData
    ) => void
  > = jest.fn();

  let fetchSpy: jest.SpiedFunction<typeof fetch>;
  let consoleWarnSpy: jest.SpiedFunction<typeof console.warn>;

  beforeEach(() => {
    fetchSpy = jest
      .spyOn(window, "fetch")
      .mockImplementation(
        () =>
          new Promise((resolve) =>
            resolve(new Response(JSON.stringify(API_RESPONSE)))
          )
      );
    consoleWarnSpy = jest.spyOn(console, "warn").mockReturnValue(undefined);
  });

  afterEach(() => {
    onImportMessage.mockReset();
    fetchSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    localStorage.clear();
  });

  describe("rendering", () => {
    test("no cache", async () => {
      renderWrapped(
        <ExperimentImportMessageForm onImportMessage={onImportMessage} />
      );

      // Expect a disabled input (because there are no options).
      const experimentSlug: HTMLInputElement =
        screen.getByLabelText("Experiment");
      expect(experimentSlug.disabled).toEqual(true);

      const messageId: HTMLInputElement = screen.getByLabelText("Message ID");
      expect(messageId.disabled).toEqual(true);

      const submit: HTMLButtonElement = screen.getByRole("button");
      expect(submit.disabled).toEqual(true);

      // Wait for fetch() results to cause a DOM change.
      await waitFor(() => expect(experimentSlug.disabled).toBe(false));
      expect(messageId.disabled).toEqual(true);

      // Check the cache was created.
      expect(
        JSON.parse(localStorage.getItem("experiments") as string) as unknown
      ).toEqual(API_RESPONSE);

      // Enumerate options.
      selectEvent.openMenu(experimentSlug);

      screen.getByText("recipe-one-branch");
      screen.getByText("recipe-multiple-branches");
      screen.getByText("recipe-multiple-messages-per-branch");
      screen.getByText("recipe-warn");

      experimentSlug.blur();

      expect(screen.queryByText("recipe-one-branch:control")).toBeNull();
      expect(screen.queryByText("recipe-multiple-branches:control")).toBeNull();
      expect(
        screen.queryByText("recipe-multiple-branches:treatment")
      ).toBeNull();
      expect(
        screen.queryByText("recipe-multiple-messages-per-branch:control-3a")
      ).toBeNull();
      expect(
        screen.queryByText("recipe-multiple-messages-per-branch:control-3b")
      ).toBeNull();
      expect(screen.queryByText("recipe-warn:unknown-property")).toBeNull();

      await selectEvent.select(experimentSlug, "recipe-one-branch");
      expect(messageId.disabled).toEqual(false);
      expect(submit.disabled).toEqual(true);

      selectEvent.openMenu(messageId);
      screen.getByText("recipe-one-branch:control");
      expect(screen.queryByText("recipe-multiple-branches:control")).toBeNull();
      expect(
        screen.queryByText("recipe-multiple-branches:treatment")
      ).toBeNull();
      expect(
        screen.queryByText("recipe-multiple-messages-per-branch:control-a")
      ).toBeNull();
      expect(
        screen.queryByText("recipe-multiple-messages-per-branch:control-b")
      ).toBeNull();
      expect(screen.queryByText("recipe-warn:unknown-property")).toBeNull();
      messageId.blur();

      await selectEvent.select(experimentSlug, "recipe-multiple-branches");
      expect(submit.disabled).toEqual(true);

      selectEvent.openMenu(messageId);
      expect(screen.queryByText("recipe-one-branch:control")).toBeNull();
      screen.getByText("recipe-multiple-branches:control");
      screen.getByText("recipe-multiple-branches:treatment");
      expect(
        screen.queryByText("recipe-multiple-messages-per-branch:control-a")
      ).toBeNull();
      expect(
        screen.queryByText("recipe-multiple-messages-per-branch:control-b")
      ).toBeNull();
      expect(screen.queryByText("recipe-warn:unknown-property")).toBeNull();
      messageId.blur();

      await selectEvent.select(
        experimentSlug,
        "recipe-multiple-messages-per-branch"
      );
      expect(submit.disabled).toEqual(true);

      selectEvent.openMenu(messageId);
      expect(screen.queryByText("recipe-one-branch:control-1")).toBeNull();
      expect(screen.queryByText("recipe-multiple-branches:control")).toBeNull();
      expect(
        screen.queryByText("recipe-multiple-branches:treatment")
      ).toBeNull();
      screen.getByText("recipe-multiple-messages-per-branch:control-a");
      screen.getByText("recipe-multiple-messages-per-branch:control-b");
      expect(screen.queryByText("recipe-warn:unknown-property")).toBeNull();
      messageId.blur();

      await selectEvent.select(
        messageId,
        "recipe-multiple-messages-per-branch:control-a"
      );
      expect(submit.disabled).toEqual(false);

      // Changing experiments should clear the selected message ID.
      await selectEvent.select(experimentSlug, "recipe-warn");

      expect(submit.disabled).toEqual(true);
      expect(
        screen.queryByText("recipe-multiple-message-per-branch:control-a")
      ).toBeNull();
      screen.getByText("Select...");
    });

    test("pre-populated cache", async () => {
      localStorage.setItem(
        "experiments",
        JSON.stringify(API_RESPONSE.slice(0, 2))
      );

      renderWrapped(
        <ExperimentImportMessageForm onImportMessage={onImportMessage} />
      );

      // Expect an enabled input (because there are options).
      const experimentSlug: HTMLInputElement =
        screen.getByLabelText("Experiment");
      expect(experimentSlug.disabled).toEqual(false);

      const messageId: HTMLInputElement = screen.getByLabelText("Message ID");
      expect(messageId.disabled).toEqual(true);

      const submit: HTMLButtonElement = screen.getByRole("button");
      expect(submit.disabled).toEqual(true);

      // Enumerate options.
      selectEvent.openMenu(experimentSlug);

      screen.getByText("recipe-one-branch");
      screen.getByText("recipe-multiple-branches");
      expect(
        screen.queryByText("recipe-multiple-messages-per-branch")
      ).toBeNull();
      expect(screen.queryByText("recipe-warn")).toBeNull();

      // Wait for fetch() results to cause a DOM change.
      await screen.findByText("recipe-multiple-messages-per-branch");
      screen.getByText("recipe-warn");

      experimentSlug.blur();
    });
  });

  describe("importing", () => {
    test("successfully", async () => {
      renderWrapped(
        <ExperimentImportMessageForm onImportMessage={onImportMessage} />
      );

      const experimentSlug: HTMLInputElement =
        screen.getByLabelText("Experiment");
      const messageId: HTMLInputElement = screen.getByLabelText("Message ID");
      const submit: HTMLButtonElement = screen.getByRole("button");

      expect(experimentSlug.disabled).toEqual(true);
      await waitFor(() => expect(experimentSlug.disabled).toEqual(false));

      selectEvent.openMenu(experimentSlug);
      await selectEvent.select(experimentSlug, "recipe-one-branch");
      await selectEvent.select(messageId, "recipe-one-branch:control");

      await userEvent.click(submit);

      expect(onImportMessage).toBeCalledWith(
        "recipe-one-branch:control",
        "infobar",
        {
          meta: {
            targeting: "true",
            groups: [],
            trigger: JSON.stringify({ id: "defaultBrowserCheck" }, null, 2),
            frequency: {
              lifetime: {
                enabled: false,
                value: 1,
              },
              custom: [],
            },
            priority: {
              enabled: false,
              value: 0,
              order: 0,
            },
          },
          content: {
            text: {
              localized: false,
              value: "Text",
              rich: false,
            },
            buttons: [],
            type: "tab",
            priority: {
              enabled: false,
              value: 0,
            },
          },
        }
      );

      // There should be no toasts.
      expect(screen.queryByText("Message imported with warnings")).toBeNull();

      // No warnings should have been logged.
      expect(consoleWarnSpy).not.toHaveBeenCalled();
    });

    test("with warnings", async () => {
      renderWrapped(
        <ExperimentImportMessageForm onImportMessage={onImportMessage} />
      );

      const experimentSlug: HTMLInputElement =
        screen.getByLabelText("Experiment");
      const messageId: HTMLInputElement = screen.getByLabelText("Message ID");
      const submit: HTMLButtonElement = screen.getByRole("button");

      expect(experimentSlug.disabled).toEqual(true);
      await waitFor(() => expect(experimentSlug.disabled).toEqual(false));

      selectEvent.openMenu(experimentSlug);
      await selectEvent.select(experimentSlug, "recipe-warn");
      await selectEvent.select(messageId, "recipe-warn:unknown-property");

      await userEvent.click(submit);

      // There should be a toast.
      expect(screen.queryByText("Message imported with warnings")).toBeNull();

      // Two warnings should have been logged.
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "Message recipe-warn:unknown-property imported with warnings: "
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "[unknownProperty]: Field was not deserialized"
      );
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "[content.unknownContentProperty]: Field was not deserialized"
      );
    });
  });
});
