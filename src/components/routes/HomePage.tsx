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
    const importJSON = urlSearchParams.get("importJSON");

    if (importJSON) {
      try {
        const parsed = JSON.parse(importJSON) as Record<string, unknown>;
        const result = deserialize(parsed);

        navigate("/import", {
          state: {
            messageId: parsed.id,
            template: parsed.template,
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
