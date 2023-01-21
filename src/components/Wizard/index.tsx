/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useForm, FormProvider } from "react-hook-form";
import Card from "react-bootstrap/Card";
import CloseButton from "react-bootstrap/CloseButton";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import JSONPretty from "react-json-pretty";

import NewEditImportPane from "./NewEditImportPane";
import { MessageTemplate } from "./messageTypes";
import InfoBarWizard from "./InfoBarWizard";
import SpotlightWizard from "./SpotlightWizard";
import WizardFormData from "./formData";
import { WizardMetaSection } from "./WizardSections";
import serializeMessage from "./serializers";
import useSavedMessages from "../../hooks/useSavedMessages";

type MessageInfo = {
  id: string;
  template: MessageTemplate;
};

interface JsonPreviewProps {
  data: object | undefined;
  onHide: () => void;
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

export default function Wizard() {
  const [messageInfo, setMessageInfo] = useState<MessageInfo | undefined>(
    undefined
  );
  const [previewJson, setPreviewJson] = useState<object | undefined>(undefined);
  const { messages, saveMessage, deleteMessage } = useSavedMessages();
  const formContext = useForm<WizardFormData>();
  const { reset, setValue } = formContext;

  if (typeof messageInfo === "undefined") {
    const handleNewMessage = (id: string, template: MessageTemplate) =>
      setMessageInfo({
        id,
        template,
      });

    const handleEditMessage = (id: string) => {
      const data = messages[id];
      setMessageInfo({
        id: id,
        template: data.template,
      });
      for (const [key, value] of Object.entries(data.formData)) {
        setValue(
          key as keyof WizardFormData,
          value as WizardFormData[keyof WizardFormData]
        );
      }
    };

    const handleImportMessage = (
      id: string,
      template: MessageTemplate,
      formData: WizardFormData
    ) => {
      setMessageInfo({ id, template });
      for (const [key, value] of Object.entries(formData)) {
        setValue(
          key as keyof WizardFormData,
          value as WizardFormData[keyof WizardFormData]
        );
      }
    };

    return (
      <NewEditImportPane
        onNewMessage={handleNewMessage}
        onEditMessage={handleEditMessage}
        onDeleteMessage={deleteMessage}
        onImportMessage={handleImportMessage}
        messages={messages}
      />
    );
  }

  let MessageContentWizard;
  switch (messageInfo.template) {
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
    setMessageInfo(undefined);
    reset();
  };
  const closeModal = () => setPreviewJson(undefined);

  const { trigger, getValues } = formContext;

  const validate = async (): Promise<object | null> => {
    if (await trigger(undefined, { shouldFocus: true })) {
      return serializeMessage(
        messageInfo.id,
        messageInfo.template,
        getValues()
      );
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

        return navigator.clipboard.writeText(uri);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveMessage = () => {
    try {
      const json = getValues();
      if (json) {
        alert("Message Saved!");
        saveMessage(messageInfo.id, messageInfo.template, json);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const triggerRequired = ["infobar", "cfr"].includes(messageInfo.template);

  return (
    <>
      <Container className="wizard">
        <Card>
          <Card.Header className="d-flex justify-content-between">
            <Card.Title className="mb-0">
              Editing Message:{" "}
              <span className="message-id">{messageInfo.id}</span>
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
    </>
  );
}
