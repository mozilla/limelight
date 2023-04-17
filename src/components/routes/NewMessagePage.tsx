/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Navigate, useLocation, useOutletContext } from "react-router-dom";

import OutletContext from "../App/context";
import Wizard from "../Wizard";
import { MessageTemplate } from "../Wizard/messageTypes";

export default function NewMessagePage() {
  const { savedMessages, nimbusEditor } = useOutletContext<OutletContext>();

  const { state } = useLocation() as {
    state: { id: string; template: MessageTemplate } | null;
  };

  if (state === null) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <Wizard
      savedMessages={savedMessages}
      nimbusEditor={nimbusEditor}
      messageId={state.id}
      template={state.template}
    />
  );
}
