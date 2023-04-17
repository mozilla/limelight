/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { UseSavedMessages } from "../../hooks/useSavedMessages";

/**
 * The global contex type passed to all routes.
 */
export default interface OutletContext {
  savedMessages: UseSavedMessages;
  nimbusEditor?: {
    branchSlug: string;
  };
}
