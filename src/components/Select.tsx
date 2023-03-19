import type { BaseDropdownProps } from '@bearei/react-dropdown';
import type { BaseInputProps, InputFixedProps } from '@bearei/react-input';
import type { BaseMenuProps, MenuOptions } from '@bearei/react-menu';
import * as array from '@bearei/react-util/lib/commonjs/array';
import { ReactNode, Ref, useCallback, useEffect, useId, useState } from 'react';

/**
 * Select options
 */
export interface SelectOptions {
  value?: string[];

  /**
   * Select the value that input will display when you are done
   */
  label?: string | string[];
}

/**
 * Base select props
 */
export interface BaseSelectProps<T>
  extends Partial<
    Omit<BaseDropdownProps<T> & BaseInputProps<T>, 'onSelect' | 'prefix'> &
      Pick<BaseInputProps<T>, 'prefix'> &
      Pick<
        BaseMenuProps<T>,
        'multiple' | 'items' | 'selectedKeys' | 'defaultSelectedKeys'
      >
  > {
  /**
   * Custom ref
   */
  ref?: Ref<T>;

  /**
   * Selector type
   */
  type?: 'dropdown' | 'modal' | 'cascade';

  /**
   * This function is called when the select value changes
   */
  onSelect?: (options: SelectOptions) => void;

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
  extends Omit<
    Omit<BaseSelectProps<T>, 'onSelect'> & Pick<BaseMenuProps<T>, 'onSelect'>,
    'ref'
  > {
  /**
   * Component unique ID
   */
  id: string;
  children?: ReactNode;
}

export type SelectFixedProps<T> = SelectChildrenProps<T> &
  Pick<InputFixedProps<T>, 'position'>;

export type SelectLabelProps<T> = SelectFixedProps<T>;
export type SelectMainProps<T> = SelectChildrenProps<T> &
  Pick<BaseSelectProps<T>, 'ref'>;

export type SelectContainerProps<T> = SelectChildrenProps<T>;

const Select = <T extends HTMLInputElement = HTMLInputElement>({
  ref,
  type,
  items = [],
  prefix,
  suffix,
  multiple,
  afterLabel,
  beforeLabel,
  selectedKeys,
  defaultSelectedKeys,
  onSelect,
  onValueChange,
  renderMain,
  renderFixed,
  renderLabel,
  renderContainer,
  ...args
}: SelectProps<T>) => {
  const id = useId();
  const [status, setStatus] = useState('idle');
  const [selectOptions, setSelectOptions] = useState<SelectOptions>({
    value: [],
    label: '',
  });

  const childrenProps = {
    ...args,
    id,
    type,
    items,
    multiple,
    selectedKeys: selectOptions.value,
  };

  const handleSelectOptionsChange = useCallback(
    (options: SelectOptions) => {
      onSelect?.(options);
      onValueChange?.(options.value);
    },
    [onSelect, onValueChange],
  );

  const handleLabel = useCallback(
    (keys: string[]) => {
      const handleMultiple = () =>
        keys
          .map(key => items.find(menu => menu.key === key)?.label)
          .filter(e => e) as string[];

      const handleSingle = () =>
        items.find(item => item.key && keys.includes(item.key))?.label;

      const handleCascade = () => {
        const findLabel = (
          items = [] as BaseMenuProps<T>['items'],
          labels = [] as string[],
        ): string[] =>
          items!
            .map(({ key, label: itemLabel, children }) => {
              const label = keys.includes(key!) ? itemLabel : undefined;
              const nextLabels = label ? [...labels, label] : labels;

              return children && label
                ? findLabel(children, nextLabels)
                : nextLabels;
            })
            .flat();

        return [...new Set(findLabel(items))];
      };

      if (type === 'cascade') {
        return handleCascade();
      }

      return multiple ? handleMultiple() : handleSingle();
    },
    [items, multiple, type],
  );

  const handleMenuSelect = useCallback(
    ({ selectedKeys = [] }: MenuOptions<T>) => {
      const options = {
        value: selectedKeys,
        label: handleLabel(selectedKeys),
      };

      setSelectOptions(options);
      handleSelectOptionsChange(options);
    },
    [handleLabel, handleSelectOptionsChange],
  );

  const prefixNode =
    prefix &&
    renderFixed?.({ ...childrenProps, position: 'before', children: prefix });

  const suffixNode =
    suffix &&
    renderFixed?.({ ...childrenProps, position: 'after', children: suffix });

  const beforeLabelNode =
    beforeLabel &&
    renderLabel?.({
      ...childrenProps,
      position: 'before',
      children: beforeLabel,
    });

  const afterLabelNode =
    afterLabel &&
    renderLabel?.({
      ...childrenProps,
      position: 'after',
      children: afterLabel,
    });

  const main = renderMain({
    ...childrenProps,
    ref,
    value: selectOptions.label,
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

  useEffect(() => {
    const nextValue =
      status !== 'idle' ? selectedKeys : defaultSelectedKeys ?? selectedKeys;

    if (typeof nextValue !== 'undefined') {
      setSelectOptions(currentlySelectOptions => {
        const isUpdate = !array.isEqual(
          currentlySelectOptions.value!,
          nextValue,
        );

        return isUpdate
          ? { value: nextValue, label: handleLabel(nextValue) }
          : currentlySelectOptions;
      });
    }

    status === 'idle' && setStatus('succeeded');
  }, [
    defaultSelectedKeys,
    handleLabel,
    handleMenuSelect,
    selectedKeys,
    status,
  ]);

  return <>{container}</>;
};

export default Select;
