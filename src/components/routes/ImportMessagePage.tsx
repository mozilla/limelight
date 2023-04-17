/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Navigate, useLocation, useOutletContext } from "react-router-dom";

import OutletContext from "../App/context";
import Wizard from "../Wizard";
import WizardFormData from "../Wizard/formData";
import { MessageTemplate } from "../Wizard/messageTypes";

export interface EditMessagePageState {
  messageId: string;
  template: MessageTemplate;
  formData: WizardFormData;
}

export default function EditMessagePage() {
  const { savedMessages, nimbusEditor } = useOutletContext<OutletContext>();
  const { state } = useLocation() as { state: EditMessagePageState | null };

  if (state === null) {
    return <Navigate to="/" replace={true} />;
  }

  return (
    <Wizard
      savedMessages={savedMessages}
      nimbusEditor={nimbusEditor}
      messageId={state.messageId}
      template={state.template}
      defaultValues={state.formData}
    />
  );
}
