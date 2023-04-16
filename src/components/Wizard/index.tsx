/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import CloseButton from "react-bootstrap/CloseButton";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Modal from "react-bootstrap/Modal";
import { FormProvider, useForm } from "react-hook-form";
import JSONPretty from "react-json-pretty";
import { useNavigate } from "react-router-dom";

import { UseSavedMessages } from "../../hooks/useSavedMessages";
import { useToastsContext } from "../../hooks/useToasts";
import InfoBarWizard from "../InfoBarWizard";
import SpotlightWizard from "../SpotlightWizard";
import WizardFormData from "./formData";
import { Message, MessageTemplate } from "./messageTypes";
import serializeMessage from "./serializers";
import { WizardMetaSection } from "./WizardSections";

interface JsonPreviewProps {
  data: object | undefined;
  onHide: () => void;
}

interface SaveModalProps {
  message: Message | undefined;
  onHide: () => void;
  saveMessage: UseSavedMessages["saveMessage"];
}

function JsonPreview({ data, onHide }: JsonPreviewProps) {
  const handleCopy = () =>
    void navigator.clipboard.writeText(JSON.stringify(data));
  const show = typeof data !== "undefined";

  return (
    <Modal show={show} onHide={onHide} className="json-modal">
      {show && (
        <>
          <Modal.Header closeButton>
            <Modal.Title>Preview JSON</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <JSONPretty data={data} />
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={handleCopy} className="button-copy">
              Copy to Clipboard
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}

function SaveModal({ message, onHide, saveMessage }: SaveModalProps) {
  const handleSave = () => {
    if (message !== undefined) {
      saveMessage(message);
      onHide();
    }
  };
  const show = typeof message !== "undefined";

  return (
    <Modal show={show} onHide={onHide}>
      {show && (
        <>
          <Modal.Header closeButton>
            <Modal.Title>Save Over Existing Message?</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            A saved message with this ID already exists. Do you want to
            overwrite it?
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={onHide} className="button-secondary btn-danger">
              Don&apos;t Save
            </Button>
            <Button onClick={handleSave} className="button-primary">
              Save Anyway
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}

export interface WizardProps {
  savedMessages: UseSavedMessages;
  messageId: string;
  template: MessageTemplate;
  defaultValues?: WizardFormData;
}

export default function Wizard({
  savedMessages: { messages, saveMessage },
  messageId,
  template,
  defaultValues,
}: WizardProps) {
  const navigate = useNavigate();
  const [saveModalData, setSaveModalData] = useState<Message | undefined>(
    undefined
  );
  const [previewJson, setPreviewJson] = useState<object | undefined>(undefined);

  const formContext = useForm<WizardFormData>({
    defaultValues,
  });
  const { reset } = formContext;
  const { addToast } = useToastsContext();

  let MessageContentWizard;
  switch (template) {
    case "infobar":
      MessageContentWizard = InfoBarWizard;
      break;

    case "spotlight":
      MessageContentWizard = SpotlightWizard;
      break;

    case "cfr":
    case "pbnewtab":
      return <></>;
  }

  const stopEditing = () => {
    reset();
    navigate("/", { replace: true });
  };
  const closeModal = () => setPreviewJson(undefined);

  const closeSaveModal = () => setSaveModalData(undefined);

  const { trigger, getValues } = formContext;

  const validate = async (): Promise<Message | null> => {
    if (await trigger(undefined, { shouldFocus: true })) {
      return serializeMessage(messageId, template, getValues());
    }

    return null;
  };

  const handleShowJson = async (): Promise<void> => {
    try {
      const json = await validate();
      if (json) {
        setPreviewJson(json);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePreview = async (): Promise<void> => {
    try {
      const json = await validate();
      if (json) {
        const jsonStr = JSON.stringify(json);
        const uri = `about:messagepreview?json=${btoa(jsonStr)}`;
        addToast("Success", "Copied!", { autohide: true });

        return navigator.clipboard.writeText(uri);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveMessage = async (): Promise<void> => {
    try {
      const messageIds = Object.keys(messages);
      const json = await validate();

      if (json) {
        if (messageIds.includes(messageId)) {
          setSaveModalData(json);
        } else {
          addToast("Success", "Message Saved!", { autohide: true });
          saveMessage(json);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const triggerRequired = ["infobar", "cfr"].includes(template);

  return (
    <>
      <Container className="wizard">
        <Card>
          <Card.Header className="d-flex justify-content-between">
            <Card.Title className="mb-0">
              Editing Message: <span className="message-id">{messageId}</span>
            </Card.Title>
            <CloseButton onClick={stopEditing} title="Stop Editing" />
          </Card.Header>

          <FormProvider {...formContext}>
            <Form>
              <ListGroup variant="flush">
                <MessageContentWizard />

                <WizardMetaSection triggerRequired={triggerRequired} />

                <ListGroup.Item className="wizard-buttons">
                  <Button onClick={() => void handleShowJson()}>
                    Show JSON
                  </Button>
                  <Button
                    onClick={() => void handlePreview()}
                    className="copy-button"
                  >
                    Copy Preview Link
                  </Button>
                  <Button onClick={() => void handleSaveMessage()}>
                    Save Message
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Form>
          </FormProvider>
        </Card>
      </Container>
      <JsonPreview data={previewJson} onHide={closeModal} />
      <SaveModal
        message={saveModalData}
        onHide={closeSaveModal}
        saveMessage={saveMessage}
      />
    </>
  );
}
