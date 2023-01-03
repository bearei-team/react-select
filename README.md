# react-select

Base select components that support React and React native

## Installation

> yarn add @bearei/react-select --save

## Parameters

#### Select Options

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| value | `string` | ✘ | Select value |
| event | `unknown` | ✘ | Triggers an event when a select option changes |

#### Select

| Name | Type | Required | Description |
| :-- | --: | --: | :-- |
| value | `string` `string[]` | ✘ | Select value |
| defaultValue | `string` `string[]` | ✘ | The default value for the select |
| noStyle | `boolean` | ✘ | no style select |
| afterLabel | `ReactNode` | ✘ | The label at the back of the select |
| beforeLabel | `ReactNode` | ✘ | The label in front of the select |
| prefix | `ReactNode` | ✘ | Select prefix |
| suffix | `ReactNode` | ✘ | Select suffix |
| disabled | `boolean` | ✘ | Whether to disable select |
| loading | `boolean` | ✘ | Whether or not to disable the select |
| size | `small` `medium` `large` | ✘ | Select size |
| shape | `square` `circle` `round` | ✘ | Select shape |
| status | `normal` `error` `warning` | ✘ | Select status |
| onSelect | `(options: SelectOptions) => void` | ✘ | This function is called when the select option changes |
| onFocus | `(e: React.FocusEvent) => void` | ✘ | This function is called when the select gets the focus |
| onBlur | `(e: React.FocusEvent) => void` | ✘ | This function is called when the select loses focus |
| onValueChange | `(value:string) => void` | ✘ | This function is called when the select value changes |
| visible | `boolean` | ✘ | Select visible state |
| defaultVisible | `boolean` | ✘ | The default visible state for the select |
| items | `(BaseMenuItemProps & {key?: string})[]` | ✘ | Select items -- [Menu](https://github.com/bear-ei/react-menu) |
| multiple | `boolean` | ✘ | Allow multiple select items to be selected |
| disabled | `boolean` | ✘ | Whether or not to disable the select |
| loading | `boolean` | ✘ | Whether or not the select is loading |
| onVisible | `(options: DropdownOptions) => void` | ✘ | This function is called when the select visible state changes -- [Dropdown](https://github.com/bear-ei/react-dropdown) |
| onClose | `(options: DropdownOptions) => void` | ✘ | This function is called when the select is closed -- [Dropdown](https://github.com/bear-ei/react-dropdown) |
| onClick | `(e: React.MouseEvent) => void` | ✘ | This function is called when select is clicked |
| onTouchEnd | `(e: React.TouchEvent) => void` | ✘ | This function is called when the select is pressed |
| onPress | `(e: GestureResponderEvent) => void` | ✘ | This function is called when the select is pressed -- react native |
| renderLabel | `(props: SelectLabelProps) => void` | ✘ | Render the select label |
| renderFixed | `(props: SelectFixedProps) => void` | ✘ | Render the select fixed |
| renderMain | `(props: SelectMainProps) => void` | ✔ | Render the select main |
| renderContainer | `(props: SelectContainerProps) => void` | ✔ | Render the select container |

## Use

```typescript
import React from 'React';
import ReactDOM from 'react-dom';
import Select from '@bearei/react-select';
import Input from '@bearei/react-input';
import Dropdown from '@bearei/react-dropdown';
import Menu from '@bearei/react-menu';

const items = [
  { label: 'label1', key: 'item-1' },
  { label: 'label2', key: 'item-2' },
  { label: 'label3', key: 'item-3' },
];

const select = (
  <Select
    prefix="before"
    suffix="after"
    afterLabel="after"
    beforeLabel="before"
    items={items}
    defaultValue={[]}
    renderLabel={({ position, children }) => <span>{children}</span>}
    renderFixed={({ position, children }) => <span>{children}</span>}
    renderMain={({ id, ...props }) => (
      <div tabIndex={1}>
        <Input
          key={id}
          value={props.value}
          prefix={props.prefix}
          suffix={props.suffix}
          afterLabel={props.afterLabel}
          beforeLabel={props.beforeLabel}
          renderLabel={({ children, position, id }) => (
            <div key={`${id}_${position}_label`}>{children}</div>
          )}
          renderFixed={({ children, position }) => (
            <div key={`${id}_${position}_fixed`}>{children}</div>
          )}
          renderMain={({ children }) => children}
          renderContainer={({ children }) => children}
        />
      </div>
    )}
    renderContainer={({ children, items, onSelect, multiple }) => (
      <div tabIndex={1}>
        <Dropdown
          menu={{ items, onSelect, multiple }}
          renderMain={() => (
            <div tabIndex={1}>
              {children}
              {<Menu items={items} />}
            </div>
          )}
          renderContainer={({ children }) => children}
        />
      </div>
    )}
  />
);

ReactDOM.render(select, container);
```
