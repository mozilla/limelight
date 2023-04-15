/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import InfoBarWizardFormData from "../InfoBarWizard/formData";
import LocalizableTextFormData from "../inputs/LocalizableTextInput/formData";
import SpotlightWizardFormData from "../SpotlightWizard/formData";

export type { InfoBarWizardFormData };
export type { LocalizableTextFormData };
export type { SpotlightWizardFormData };

export interface BaseFormData {
  meta: {
    targeting: string;

    groups: string[];

    trigger: string;

    frequency: {
      lifetime: {
        enabled: boolean;
        value: number;
      };

      custom: {
        period: number;
        cap: number;
      }[];
    };

    priority: {
      enabled: boolean;
      value: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
      order: number;
    };
  };
}

interface WizardFormData extends BaseFormData {
  content:
    | InfoBarWizardFormData["content"]
    | SpotlightWizardFormData["content"];
}

export default WizardFormData;
