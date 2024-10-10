/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useCallback, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

import OutletContext from "../App/context";
import NewEditImportPane from "../NewEditImportPane";
import deserialize from "../Wizard/deserializers";
import WizardFormData from "../Wizard/formData";
import { MessageTemplate } from "../Wizard/messageTypes";

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const importJSON = urlSearchParams.has("postMessage");

    if (importJSON) {
      // post back a ready message
      (window.opener as WindowProxy | null)?.postMessage(
        "ready",
        "https://fxms-skylight.netlify.app/"
      );

      window.addEventListener(
        "message",
        (event: MessageEvent) => {
          const data = event.data as {
            type: string;
            value: Record<string, unknown>;
          };
          if (data.type === "import") {
            try {
              const result = deserialize(data.value);

              navigate("/import", {
                state: {
                  messageId: result.id,
                  template: result.template,
                  formData: result.formData,
                },
              });

              if (result.warnings.length) {
                console.warn(`Message ${result.id} imported with warnings: `);
                for (const { field, message } of result.warnings) {
                  console.warn(`[${field}]: ${message}`);
                }
              }
            } catch (e) {
              console.error("importJSON", {
                message: `Could not import message: ${String(e)}`,
              });
              return;
            }
          }
        },
        false
      );
    }
  }, [navigate]);

  const {
    savedMessages: { messages, deleteMessage },
  } = useOutletContext<OutletContext>();

  const handleNewMessage = useCallback(
    (id: string, template: MessageTemplate) => {
      navigate("/new", { state: { id, template } });
    },
    [navigate]
  );

  const handleEditMessage = useCallback(
    (id: string) => {
      navigate(`/edit/${id}`);
    },
    [navigate]
  );

  const handleImportMessage = useCallback(
    (
      messageId: string,
      template: MessageTemplate,
      formData: WizardFormData
    ) => {
      navigate(`/import`, {
        state: {
          messageId,
          template,
          formData,
        },
      });
    },
    [navigate]
  );

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
