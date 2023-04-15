/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { typeGuards, types } from "@mozilla/nimbus-shared";
import { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
  useWatch,
} from "react-hook-form";
import Select from "react-select";

import { useToastsContext } from "../../hooks/useToasts";
import FormRow from "../FormRow";
import deserialize from "../Wizard/deserializers";
import { ImportMessageFormProps } from "./propTypes";

type NimbusExperiment = types.experiments.NimbusExperiment;

const EXPERIMENTS_API_URL =
  "https://experimenter.services.mozilla.com/api/v6/experiments/";
const EXPERIMENT_CACHE_KEY = "experiments";

interface ExperimentOption {
  value: string;
  label: string;
}

/**
 * Experimenter Feature IDs that we should filter by.
 */
const FEATURE_IDS = [
  "cfr",
  "fxms-message-1",
  "fxms-message-2",
  "fxms-message-3",
  "infobar",
  "moments-page",
  "pbNewtab",
  "spotlight",
];

/**
 * The templates we support importing.
 */
const SUPPORTED_TEMPLATES = ["infobar", "spotlight"];

interface ExperimentMessage {
  experimentSlug: string;
  branchSlug: string;
  messageId: string;
  template: string;
  json: Record<string, unknown>;
  recipe: NimbusExperiment;
}

/**
 * Extract ExperimentMessages from a NimbusExperiment.
 *
 * Each experiment may have a message per feature per branch.
 */
function extractExperimentMessages(
  recipe: NimbusExperiment
): ExperimentMessage[] {
  if (
    !recipe.featureIds?.some((featureId) => FEATURE_IDS.includes(featureId))
  ) {
    return [];
  }

  const messages: ExperimentMessage[] = [];

  for (const branch of recipe.branches) {
    const features = "features" in branch ? branch.features : [branch.feature];

    for (const feature of features) {
      if (!FEATURE_IDS.includes(feature.featureId)) {
        continue;
      }
      if (
        "template" in feature.value &&
        typeof feature.value.template === "string"
      ) {
        let potentialMessages: Record<string, unknown>[];

        if (
          feature.value.template === "multi" &&
          "messages" in feature.value &&
          Array.isArray(feature.value.messages) &&
          feature.value.messages.every(
            (message) => typeof message === "object" && message !== null
          )
        ) {
          potentialMessages = feature.value.messages as Record<
            string,
            unknown
          >[];
        } else {
          potentialMessages = [feature.value];
        }

        for (const message of potentialMessages) {
          if (
            "id" in message &&
            typeof message.id === "string" &&
            "template" in message &&
            typeof message.template === "string" &&
            SUPPORTED_TEMPLATES.includes(message.template)
          ) {
            if (
              message.template === "spotlight" &&
              "content" in message &&
              typeof message.content === "object" &&
              message.content !== null &&
              "template" in message.content &&
              message.content?.template !== "multistage"
            ) {
              continue;
            }

            messages.push({
              experimentSlug: recipe.slug,
              branchSlug: branch.slug,
              messageId: message.id,
              template: message.template,
              json: message,
              recipe: recipe,
            });
          }
        }
      }
    }
  }

  return messages;
}

type ExperimentMessageState =
  | { state: "PENDING" }
  | { state: "ERROR"; error: Error }
  | {
      state: "AVAILABLE";
      messagesByExperiment: {
        [slug: string]: ExperimentMessage[];
      };
    };

function processApiResponse(json: unknown): ExperimentMessageState {
  if (typeof json !== "object") {
    return {
      state: "ERROR",
      error: new TypeError(`expected array, not ${typeof json}`),
    };
  }

  if (json === null) {
    return {
      state: "ERROR",
      error: new TypeError("expected array, not null"),
    };
  }

  if (!Array.isArray(json)) {
    return {
      state: "ERROR",
      error: new TypeError("expected array, not object"),
    };
  }

  const messages = json
    .filter<NimbusExperiment>(typeGuards.experiments_isNimbusExperiment)
    .flatMap(extractExperimentMessages);

  const messagesByExperiment: { [slug: string]: ExperimentMessage[] } = {};
  for (const message of messages) {
    if (!(message.experimentSlug in messagesByExperiment)) {
      messagesByExperiment[message.experimentSlug] = [];
    }
    messagesByExperiment[message.experimentSlug].push(message);
  }

  return {
    state: "AVAILABLE",
    messagesByExperiment,
  };
}

function getCachedExperimentMessages(): ExperimentMessageState {
  const raw = localStorage.getItem(EXPERIMENT_CACHE_KEY);

  if (!raw) {
    return { state: "PENDING" };
  }

  let json: unknown;
  try {
    json = JSON.parse(raw) as unknown;
  } catch (e: unknown) {
    return {
      state: "ERROR",
      error: e as Error,
    };
  }

  const processed = processApiResponse(json);
  if (processed.state === "ERROR") {
    return { state: "PENDING" };
  }

  return processed;
}

async function fetchExperimentMessages(): Promise<ExperimentMessageState> {
  const rsp = await fetch(EXPERIMENTS_API_URL);
  const json = (await rsp.json()) as unknown;

  localStorage.setItem(EXPERIMENT_CACHE_KEY, JSON.stringify(json));

  return processApiResponse(json);
}

interface ImportExperimentBranchFormData {
  experimentSlug: string | null;
  messageId: string | null;
}

export default function ExperimentImportMessageForm({
  onImportMessage,
}: ImportMessageFormProps) {
  const { addToast } = useToastsContext();
  const formContext = useForm<ImportExperimentBranchFormData>({
    defaultValues: {
      experimentSlug: null,
      messageId: null,
    },
  });

  const { control, handleSubmit, setValue } = formContext;

  const experimentSlug = useWatch({ control, name: "experimentSlug" });
  const messageId = useWatch({ control, name: "messageId" });

  // Clear branchSlug when experimentSlug changes.
  useEffect(() => {
    setValue("messageId", null);
  }, [experimentSlug]);

  const [experiments, setExperiments] = useState<ExperimentMessageState>({
    state: "PENDING",
  });

  useEffect(() => {
    const result = getCachedExperimentMessages();

    if (result.state === "AVAILABLE") {
      setExperiments(result);
    } else if (result.state === "ERROR") {
      console.error(result.error);
      return;
    }

    void fetchExperimentMessages().then((result) => {
      if (result.state === "AVAILABLE") {
        setExperiments(result);
      } else if (result.state === "ERROR") {
        console.error(result.error);
        return;
      }
    });
  }, [setExperiments]);

  const experimentOptions = useMemo(() => {
    if (experiments.state !== "AVAILABLE") {
      return [];
    }

    return Object.keys(experiments.messagesByExperiment).map((key) => ({
      label: key,
      value: key,
    }));
  }, [experiments]);

  const messageOptions = useMemo(() => {
    if (experiments.state !== "AVAILABLE" || experimentSlug === null) {
      return [];
    }

    return experiments.messagesByExperiment[experimentSlug].map((msg) => ({
      label: msg.messageId,
      value: msg.messageId,
    }));
  }, [experiments, experimentSlug]);

  const onSubmit: SubmitHandler<ImportExperimentBranchFormData> = (data) => {
    if (!data.experimentSlug || !data.messageId) return;
    if (experiments.state !== "AVAILABLE") return;

    const msg = experiments.messagesByExperiment[data.experimentSlug].find(
      (msg) => msg.messageId === data.messageId
    );
    if (!msg) return;

    const result = deserialize(msg.json);

    if (result.warnings.length) {
      console.warn(`Message ${result.id} imported with warnings: `);
      for (const { field, message } of result.warnings) {
        console.warn(`[${field}]: ${message}`);
      }

      addToast(
        "Message imported with warnings",
        "See browser console for full details"
      );
    }

    onImportMessage(result.id, result.template, result.formData);
  };

  return (
    <>
      <Card.Title>Import an Experiment Branch</Card.Title>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        className="experiment-import-message-form"
      >
        <FormProvider {...formContext}>
          <FormRow label="Experiment" controlId="experimentSlug">
            <Controller
              control={control}
              name="experimentSlug"
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Select<ExperimentOption, false>
                  options={experimentOptions}
                  isDisabled={experiments.state === "PENDING"}
                  onBlur={onBlur}
                  onChange={(newValue) => {
                    setValue("messageId", null);
                    onChange(newValue?.value);
                  }}
                  ref={ref}
                  value={value ? { value, label: value } : null}
                  name={name}
                  classNamePrefix="react-select"
                  inputId={name}
                />
              )}
            />
          </FormRow>
          <FormRow label="Message ID" controlId="messageId">
            <Controller
              control={control}
              name="messageId"
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <Select
                  options={messageOptions}
                  isDisabled={
                    experiments.state === "PENDING" || experimentSlug === null
                  }
                  onBlur={onBlur}
                  onChange={(value) => onChange(value?.value)}
                  ref={ref}
                  value={value ? { value, label: value } : null}
                  name={name}
                  classNamePrefix="react-select"
                  className="messageId-select"
                  inputId={name}
                />
              )}
            />
          </FormRow>

          <div className="form-row form-buttons">
            <Button type="submit" disabled={messageId === null}>
              Next
            </Button>
          </div>
        </FormProvider>
      </Form>
    </>
  );
}
