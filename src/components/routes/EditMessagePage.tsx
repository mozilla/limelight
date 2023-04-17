/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useEffect, useMemo } from "react";
import { Navigate, useOutletContext, useParams } from "react-router-dom";

import { useToastsContext } from "../../hooks/useToasts";
import OutletContext from "../App/context";
import Wizard from "../Wizard";
import deserialize from "../Wizard/deserializers";

export default function EditMessagePage() {
  const { savedMessages, nimbusEditor } = useOutletContext<OutletContext>();
  const { addToast } = useToastsContext();
  const { messages } = savedMessages;
  const { messageId } = useParams();

  const result = useMemo(() => {
    if (!messageId) {
      return null;
    }
    const message = messages[messageId];
    if (!message) {
      return null;
    }

    let result;
    try {
      result = deserialize(message);
    } catch (e) {
      console.error(e);
      return null;
    }

    return result;
  }, [messages, messageId]);

  useEffect(() => {
    if (!result) {
      addToast(
        "Could not load message",
        "See browser console for full details"
      );
    } else if (result.warnings.length) {
      console.warn(`Message ${result.id} imported with warnings:`);
      for (const { field, message } of result.warnings) {
        console.warn(`[${field}]: ${message}`);
      }

      addToast(
        "Message imported with warnings",
        "See browser console for full details"
      );
    }
  }, [result]);

  if (!result) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <Wizard
      savedMessages={savedMessages}
      nimbusEditor={nimbusEditor}
      messageId={result.id}
      template={result.template}
      defaultValues={result.formData}
    />
  );
}
