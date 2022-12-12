import {useState, useEffect, useId, useCallback, Ref, ReactNode} from 'react';
import {BaseInputProps, InputFixedProps} from '@bearei/react-input';
import {BaseDropdownProps} from '@bearei/react-dropdown';
import {MenuOptions, BaseMenuProps} from '@bearei/react-menu';
import * as array from '@bearei/react-util/lib/array';

/**
 * Select options
 */
export interface SelectOptions<E = unknown> extends Pick<BaseSelectProps, 'value'> {
  /**
   * Select the value that input will display when you are done
   */
  inputValue?: string | string[];

  /**
   * Triggers an event when a select option changes
   */
  event?: E;
}

/**
 * Base select props
 */
export interface BaseSelectProps<T = HTMLElement>
  extends Omit<
    Omit<BaseDropdownProps<T> & BaseInputProps, 'onSelect' | 'prefix'> &
      Pick<BaseInputProps, 'prefix'> &
      Pick<BaseMenuProps<T>, 'multiple' | 'items'>,
    'ref' | 'menu'
  > {
  /**
   * Custom ref
   */
  ref?: Ref<T>;

  /**
   * This function is called when the select value changes
   */
  onSelect?: <E>(options: SelectOptions<E>) => void;

  /**
   * Call back this function when the select value changes
   */
  onValueChange?: (value?: string | string[]) => void;
}

export interface SelectProps<T> extends BaseSelectProps<T> {
  /**
   * Render the select label
   */
  renderLabel?: (props: SelectLabelProps<T>) => ReactNode;

  /**
   * Render the select fixed
   */
  renderFixed?: (props: SelectFixedProps<T>) => ReactNode;

  /**
   * Render the select main
   */
  renderMain: (props: SelectMainProps<T>) => ReactNode;

  /**
   * Render the select container
   */
  renderContainer: (props: SelectContainerProps<T>) => ReactNode;
}

export interface SelectChildrenProps<T>
  extends Omit<Omit<BaseSelectProps<T>, 'onSelect'> & Pick<BaseMenuProps, 'onSelect'>, 'ref'> {
  /**
   * Component unique ID
   */
  id: string;
  children?: ReactNode;
}

export type SelectFixedProps<T> = SelectChildrenProps<T> & Pick<InputFixedProps, 'position'>;
export type SelectLabelProps<T> = SelectFixedProps<T>;
export type SelectMainProps<T> = SelectChildrenProps<T> & Pick<BaseSelectProps<T>, 'ref'>;
export type SelectContainerProps<T> = SelectChildrenProps<T>;

const Select = <T extends HTMLElement>({
  ref,
  items = [],
  value,
  prefix,
  suffix,
  multiple,
  afterLabel,
  beforeLabel,
  defaultValue,
  onSelect,
  onValueChange,
  renderFixed,
  renderLabel,
  renderMain,
  renderContainer,
  ...args
}: SelectProps<T>) => {
  const id = useId();
  const [status, setStatus] = useState('idle');
  const [selectOptions, setSelectOptions] = useState<SelectOptions>({value: '', inputValue: ''});
  const childrenProps = {...args, id, multiple, items};

  const handleSelectOptionsChange = useCallback(
    <E,>(options: SelectOptions<E>) => {
      onSelect?.(options);
      onValueChange?.(options.value);
    },
    [onSelect, onValueChange],
  );

  const handleMenuSelect = useCallback(
    ({selectedKeys = [], event}: MenuOptions) => {
      const handleInputValue = (keys: string | string[]) => {
        const handleMultiple = () =>
          Array.isArray(keys)
            ? (keys
                .map(key => items.find(menu => menu.key === key)?.label)
                .filter(e => e) as string[])
            : [];

        const handleSingle = () => items.find(item => item.key && keys.includes(item.key))?.label;

        return multiple ? handleMultiple() : handleSingle();
      };

      const value = multiple ? selectedKeys : selectedKeys[0];
      const options = {value, event, inputValue: handleInputValue(selectedKeys)};

      setSelectOptions(options);
      handleSelectOptionsChange(options);
    },
    [handleSelectOptionsChange, items, multiple],
  );

  useEffect(() => {
    const nextValue = status !== 'idle' ? value : defaultValue ?? value;

    nextValue &&
      setSelectOptions(currentOptions => {
        const isUpdate =
          Array.isArray(nextValue) && Array.isArray(currentOptions.value)
            ? !array.isEqual(currentOptions.value, nextValue)
            : currentOptions.value !== nextValue && status === 'succeeded';

        isUpdate &&
          handleMenuSelect({selectedKeys: Array.isArray(nextValue) ? nextValue : [nextValue]});

        return {value: nextValue};
      });

    status === 'idle' && setStatus('succeeded');
  }, [defaultValue, handleMenuSelect, status, value]);

  const prefixNode =
    prefix && renderFixed?.({...childrenProps, position: 'before', children: prefix});

  const suffixNode =
    suffix && renderFixed?.({...childrenProps, position: 'after', children: suffix});

  const beforeLabelNode =
    beforeLabel &&
    renderLabel?.({
      ...childrenProps,
      position: 'before',
      children: beforeLabel,
    });

  const afterLabelNode =
    afterLabel && renderLabel?.({...childrenProps, position: 'after', children: afterLabel});

  const main = renderMain({
    ...childrenProps,
    ref,
    value: selectOptions.inputValue,
    prefix: prefixNode,
    suffix: suffixNode,
    beforeLabel: beforeLabelNode,
    afterLabel: afterLabelNode,
    onSelect: handleMenuSelect,
  });

  const container = renderContainer({
    ...childrenProps,
    children: main,
  });

  return <>{container}</>;
};

export default Select;
