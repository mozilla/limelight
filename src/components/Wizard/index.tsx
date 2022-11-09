/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import JSONPretty from "react-json-pretty";

import NewEditImportPane from "./NewEditImportPane";
import { MessageTemplate } from "./messageTypes";
import InfoBarWizard from "./InfoBarWizard";

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

  if (typeof messageInfo === "undefined") {
    const handleNewMessage = (id: string, template: MessageTemplate) =>
      setMessageInfo({
        id,
        template,
      });

    return <NewEditImportPane onNewMessage={handleNewMessage} />;
  }

  let MessageWizard;
  switch (messageInfo.template) {
    case "infobar":
      MessageWizard = InfoBarWizard;
      break;

    case "cfr":
    case "multistage-spotlight":
    case "pbnewtab":
      return <></>;
  }

  const stopEditing = () => setMessageInfo(undefined);
  const closeModal = () => setPreviewJson(undefined);

  return (
    <>
      <MessageWizard
        id={messageInfo.id}
        stopEditing={stopEditing}
        setPreviewJson={setPreviewJson}
      />
      <JsonPreview data={previewJson} onHide={closeModal} />
    </>
  );
}
