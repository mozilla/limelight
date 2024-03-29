/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import {
  FieldArray,
  FieldArrayPath,
  FieldArrayWithId,
  FieldValues,
  FormProvider,
  Path,
  useFieldArray,
  UseFieldArrayProps,
  useFormContext,
  UseFormRegister,
} from "react-hook-form";

export interface RenderTabProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldArrayPath<TFieldValues>
> {
  field: FieldArrayWithId<TFieldValues, TFieldName>;
  index: number;
  handleDelete: () => void;
}

export interface TabbedInputProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldArrayPath<TFieldValues>
> {
  controlPrefix: TFieldName;
  className?: string;
  renderTab: (props: RenderTabProps<TFieldValues, TFieldName>) => JSX.Element;
  emptyTabs: string | (() => JSX.Element);
  focusName?: string;
  defaults: () => FieldArray<TFieldValues, TFieldName>;
  addText: string;
  rules?: UseFieldArrayProps["rules"];
}

export default function TabbedInput<
  TFieldValues extends FieldValues,
  TFieldName extends FieldArrayPath<TFieldValues>
>({
  className = undefined,
  controlPrefix,
  emptyTabs,
  renderTab,
  focusName,
  defaults,
  addText,
  rules = {},
}: TabbedInputProps<TFieldValues, TFieldName>) {
  const formContext = useFormContext<TFieldValues>();
  const { control, register } = formContext;
  const { fields, append, remove } = useFieldArray<TFieldValues, TFieldName>({
    control,
    name: controlPrefix,
    rules: rules,
  });

  // The currently active tab is stored as its index converted to a string.
  const [activeKey, setActiveKey] = useState<string | null>(
    fields.length ? "0" : null
  );

  const tabs = fields.map((field, idx) => (
    <Nav.Item key={field.id}>
      <Nav.Link eventKey={idx}>{idx}</Nav.Link>
    </Nav.Item>
  ));

  const handleAdd = () => {
    const index = fields.length.toString();
    setActiveKey(index);
    append(defaults(), {
      focusName: focusName
        ? `${controlPrefix}.${index}.${focusName}`
        : undefined,
    });
  };

  const tabContents = fields.length
    ? fields.map((field, index) => {
        const handleDelete = () => {
          if (activeKey && activeKey === String(index)) {
            if (index > 0) {
              setActiveKey((index - 1).toString());
            } else if (index === 0 && fields.length === 1) {
              setActiveKey(null);
            }
            // If we are deleting the first button and there is another button, we
            // just stay at the same tab and therefore don't have to change the
            // activeKey.
          }

          remove(index);
        };
        const focusTab = () => setActiveKey(index.toString());
        const proxiedContext = {
          ...formContext,
          register: proxyRegister<TFieldValues>(register, focusTab),
        };
        return (
          <FormProvider {...proxiedContext} key={index}>
            <TabContent
              field={field}
              index={index}
              handleDelete={handleDelete}
              renderTab={renderTab}
            />
          </FormProvider>
        );
      })
    : typeof emptyTabs === "string"
    ? emptyTabs
    : emptyTabs();

  return (
    <Card className={classNames("tabbed-input", className)}>
      <Tab.Container activeKey={activeKey ?? undefined} onSelect={setActiveKey}>
        <Card.Header>
          <Nav variant="tabs">
            {tabs}
            <div className="tabs-controls">
              <Nav.Item>
                <Button
                  onClick={handleAdd}
                  className="new-button"
                  title={addText}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </Nav.Item>
            </div>
          </Nav>
        </Card.Header>
        <Card.Body>
          <Tab.Content>{tabContents}</Tab.Content>
        </Card.Body>
      </Tab.Container>
    </Card>
  );
}

interface TabContentProps<
  TFieldValues extends FieldValues,
  TFieldName extends FieldArrayPath<TFieldValues>
> {
  field: FieldArrayWithId<TFieldValues, TFieldName>;
  index: number;
  handleDelete: () => void;
  renderTab: (props: RenderTabProps<TFieldValues, TFieldName>) => JSX.Element;
}

function TabContent<
  TFieldValues extends FieldValues,
  TFieldName extends FieldArrayPath<TFieldValues>
>({
  field,
  index,
  handleDelete,
  renderTab,
}: TabContentProps<TFieldValues, TFieldName>) {
  const content = renderTab({ field, handleDelete, index });

  return (
    <Tab.Pane eventKey={index} as="fieldset">
      {content}
    </Tab.Pane>
  );
}

type InputOrTextAreaElement = HTMLInputElement | HTMLTextAreaElement;

/**
 * A map of elements to their proxies to keep reference equality between
 * renders.
 */
const PROXIES = new WeakMap<InputOrTextAreaElement, InputOrTextAreaElement>();

/**
 * Return a wrapped register() function that will proxy the ref callback to
 * handle focusing elements not currently visible.
 */
function proxyRegister<TFieldValues extends FieldValues = FieldValues>(
  register: UseFormRegister<TFieldValues>,
  focusTab: () => void
): UseFormRegister<TFieldValues> {
  type GenericRegister<T extends Path<TFieldValues>> = typeof register<T>;

  return function <TFieldName extends Path<TFieldValues> = Path<TFieldValues>>(
    name: TFieldName,
    options: Parameters<GenericRegister<TFieldName>>[1]
  ) {
    const rv = register(name, options);

    return {
      ...rv,
      ref: (instance: InputOrTextAreaElement | null) =>
        rv.ref(makeFocusProxy(instance, focusTab)),
    };
  };
}

/**
 * Return a proxy around the original element that focuses the tab before
 * focusing the element.
 */
function makeFocusProxy(
  instance: InputOrTextAreaElement | null,
  focusTab: () => void
): InputOrTextAreaElement | null {
  if (instance) {
    // If we return a new Proxy each render(), they will not compare identical
    // to the old proxy. Hence we cache them in a a WeakMap, which will not keep
    // our references alive if they get removed from the DOM.
    //
    // If we don't do this, react-hook-form gets confused and starts
    // accumulating multiple refs for fields and will end up setting invalid
    // state (especially for checkbox fields, which will report a value of `[]`
    // instead of `false`).
    let proxy = PROXIES.get(instance);

    if (!proxy) {
      proxy = new Proxy(instance, {
        get(target, handler) {
          if (handler === "focus") {
            return () => {
              focusTab();

              // If we call target.focus() immediately, the tab won't actually be
              // active yet -- it will still be transitioning. Calling it after
              // the stack clears will correctly focus the element.
              setTimeout(() => target.focus(), 0);
            };
          }

          // ProxyHandler.get has a return type of any.  This won't really be type
          // checked anywhere because all the consumers won't know they're
          // consuming this Proxy.

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return Reflect.get(target, handler);
        },

        set(target, handler, newValue) {
          return Reflect.set(target, handler, newValue);
        },
      });

      PROXIES.set(instance, proxy);
    }

    return proxy;
  } else {
    return instance;
  }
}
