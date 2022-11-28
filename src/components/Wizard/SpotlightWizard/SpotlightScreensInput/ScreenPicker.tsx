/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { useFieldArray, useFormContext } from "react-hook-form";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

import SpotlightWizardFormData from "../formData";
import LogoAndTitleScreen from "./LogoAndTitleScreen";
import ErrorMessage from "../../../ErrorMessage";

const SPOTLIGHT_SCREENS = [LogoAndTitleScreen] as const;

interface ScreenPickerProps {
  index: number;
}

export default function ScreenPicker({ index }: ScreenPickerProps) {
  const { control, formState, getFieldState, register } =
    useFormContext<SpotlightWizardFormData>();
  const { update } = useFieldArray({ control, name: "content.screens" });
  const { error } = getFieldState(`content.screens.${index}.kind`, formState);

  register(`content.screens.${index}.kind`, {
    required: "You must select a screen template.",
  });

  const onClick = (screen: typeof SPOTLIGHT_SCREENS[number]) => {
    update(index, {
      kind: screen.kind,
      screenId: "",
      ...screen.defaults(),
    });
  };

  const screens = SPOTLIGHT_SCREENS.map((screen) => (
    <li key={screen.kind}>
      <Button onClick={() => onClick(screen)}>
        {screen.title} <FontAwesomeIcon icon={faChevronRight} />
      </Button>
    </li>
  ));

  const className = error ? "is-invalid" : undefined;

  return (
    <div className="spotlight-screen-chooser">
      <h2>Choose a template</h2>
      <ul className={className}>{screens}</ul>
      <ErrorMessage name={`content.screens.${index}.kind`} />
    </div>
  );
}
