/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RenderTabProps } from "../../TabbedInput";
import WizardFormData from "../../formData";

export enum SpotlightScreenKind {
  LogoAndTitle = "LOGO_AND_TITLE",
}

export interface ScreenComponentProps
  extends RenderTabProps<WizardFormData, "content.screens"> {
  controlPrefix: `content.screens.${number}.content`;
}
