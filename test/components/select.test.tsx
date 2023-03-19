import Dropdown from '@bearei/react-dropdown';
import Input from '@bearei/react-input';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Select from '../../src/components/Select';
import { render } from '../utils/test-utils';

const items = [
  {
    label: 'label1',
    key: 'item-1',
    children: [
      {
        label: 'label1-1',
        key: 'item-1-1',
        children: [{ label: 'label1-1-1', key: 'item-1-1-1' }],
      },
    ],
  },
  { label: 'label2', key: 'item-2' },
  { label: 'label3', key: 'item-3' },
];

describe('test/components/Select.test.ts', () => {
  test('It should be a render select', async () => {
    const { getByDataCy } = render(
      <Select
        prefix="before"
        suffix="after"
        afterLabel="after"
        beforeLabel="before"
        items={items}
        defaultValue={[]}
        renderLabel={({ position, children }) => (
          <span data-cy={`label-${position}`}>{children}</span>
        )}
        renderFixed={({ position, children }) => (
          <span data-cy={`fixed-${position}`}>{children}</span>
        )}
        renderMain={({ id, onSelect, multiple, ...props }) => (
          <Dropdown
            menu={{ items, onSelect, multiple }}
            renderMain={() => (
              <div
                data-cy="menu"
                tabIndex={1}
                onClick={() => {
                  onSelect?.({ selectedKeys: ['item-1'] });
                }}
              >
                <div data-cy="input" tabIndex={1}>
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
                    renderFixed={({ children, position, id }) => (
                      <div key={`${id}_${position}_fixed`}>{children}</div>
                    )}
                    renderMain={({
                      suffix,
                      prefix,
                      afterLabel,
                      beforeLabel,
                    }) => (
                      <>
                        {beforeLabel}
                        {prefix}
                        {<input data-id={id} />}
                        {suffix}
                        {afterLabel}
                      </>
                    )}
                    renderContainer={({ children }) => children}
                  />
                </div>
              </div>
            )}
            renderContainer={({ children }) => children}
          />
        )}
        renderContainer={({ children }) => (
          <div data-cy="container" tabIndex={1}>
            {children}
          </div>
        )}
      />,
    );

    expect(getByDataCy('container')).toHaveAttribute('tabIndex');
    expect(getByDataCy('fixed-before')).toHaveTextContent('before');
    expect(getByDataCy('fixed-after')).toHaveTextContent('after');
    expect(getByDataCy('label-before')).toHaveTextContent('before');
    expect(getByDataCy('label-after')).toHaveTextContent('after');
    expect(getByDataCy('input')).toHaveAttribute('tabIndex');
    expect(getByDataCy('menu')).toHaveAttribute('tabIndex');
  });

  test('It should be a single select', async () => {
    const user = userEvent.setup();
    let value!: string | string[] | undefined;
    let label!: string | string[] | undefined;

    const { getByDataCy } = render(
      <Select
        prefix="before"
        suffix="after"
        afterLabel="after"
        beforeLabel="before"
        onSelect={options => {
          value = options.value;
          label = options.label;
        }}
        items={items}
        renderLabel={({ position, children }) => (
          <span data-cy={`label-${position}`}>{children}</span>
        )}
        renderFixed={({ position, children }) => (
          <span data-cy={`fixed-${position}`}>{children}</span>
        )}
        renderMain={({ id, onSelect, multiple, ...props }) => (
          <Dropdown
            menu={{ items, onSelect, multiple }}
            renderMain={() => (
              <div
                data-cy="menu"
                tabIndex={1}
                onClick={() => {
                  onSelect?.({ selectedKeys: ['item-1'] });
                }}
              >
                <div data-cy="input" tabIndex={1}>
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
                    renderFixed={({ children, position, id }) => (
                      <div key={`${id}_${position}_fixed`}>{children}</div>
                    )}
                    renderMain={({
                      children,
                      suffix,
                      prefix,
                      afterLabel,
                      beforeLabel,
                    }) => (
                      <>
                        {beforeLabel}
                        {prefix}
                        {children}
                        {suffix}
                        {afterLabel}
                      </>
                    )}
                    renderContainer={({ children }) => children}
                  />
                </div>
              </div>
            )}
            renderContainer={({ children }) => children}
          />
        )}
        renderContainer={({ children }) => (
          <div data-cy="container" tabIndex={1}>
            {children}
          </div>
        )}
      />,
    );

    await user.click(getByDataCy('menu'));
    expect(value).toEqual(['item-1']);
    expect(label).toEqual('label1');
  });

  test('It should be a multiple select', async () => {
    const user = userEvent.setup();
    let value!: string | string[] | undefined;
    let label!: string | string[] | undefined;

    const { getByDataCy } = render(
      <Select
        prefix="before"
        suffix="after"
        afterLabel="after"
        beforeLabel="before"
        onSelect={options => {
          value = options.value;
          label = options.label;
        }}
        items={items}
        multiple={true}
        renderLabel={({ position, children }) => (
          <span data-cy={`label-${position}`}>{children}</span>
        )}
        renderFixed={({ position, children }) => (
          <span data-cy={`fixed-${position}`}>{children}</span>
        )}
        renderMain={({ id, onSelect, multiple, ...props }) => (
          <Dropdown
            menu={{ items, onSelect, multiple }}
            renderMain={() => (
              <div
                data-cy="menu"
                tabIndex={1}
                onClick={() => {
                  onSelect?.({ selectedKeys: ['item-1'] });
                }}
              >
                <div data-cy="input" tabIndex={1}>
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
                    renderFixed={({ children, position, id }) => (
                      <div key={`${id}_${position}_fixed`}>{children}</div>
                    )}
                    renderMain={({
                      suffix,
                      prefix,
                      afterLabel,
                      beforeLabel,
                    }) => (
                      <>
                        {beforeLabel}
                        {prefix}
                        {<input data-id={id} />}
                        {suffix}
                        {afterLabel}
                      </>
                    )}
                    renderContainer={({ children }) => children}
                  />
                </div>
              </div>
            )}
            renderContainer={({ children }) => children}
          />
        )}
        renderContainer={({ children }) => (
          <div data-cy="container" tabIndex={1}>
            {children}
          </div>
        )}
      />,
    );

    await user.click(getByDataCy('menu'));
    expect(value).toEqual(['item-1']);
    expect(label).toEqual(['label1']);
  });

  test('It should be a cascade select', async () => {
    const user = userEvent.setup();
    let value!: string | string[] | undefined;
    let label!: string | string[] | undefined;

    const { getByDataCy } = render(
      <Select
        prefix="before"
        suffix="after"
        afterLabel="after"
        beforeLabel="before"
        onSelect={options => {
          value = options.value;
          label = options.label;
        }}
        items={items}
        multiple={true}
        type={'cascade'}
        renderLabel={({ position, children }) => (
          <span data-cy={`label-${position}`}>{children}</span>
        )}
        renderFixed={({ position, children }) => (
          <span data-cy={`fixed-${position}`}>{children}</span>
        )}
        renderMain={({ id, onSelect, multiple, ...props }) => (
          <Dropdown
            menu={{ items, onSelect, multiple }}
            renderMain={() => (
              <div
                data-cy="menu"
                tabIndex={1}
                onClick={() => {
                  onSelect?.({
                    selectedKeys: ['item-1', 'item-1-1', 'item-1-1-1'],
                  });
                }}
              >
                <div data-cy="input" tabIndex={1}>
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
                    renderFixed={({ children, position, id }) => (
                      <div key={`${id}_${position}_fixed`}>{children}</div>
                    )}
                    renderMain={({
                      suffix,
                      prefix,
                      afterLabel,
                      beforeLabel,
                    }) => (
                      <>
                        {beforeLabel}
                        {prefix}
                        {<input data-id={id} />}
                        {suffix}
                        {afterLabel}
                      </>
                    )}
                    renderContainer={({ children }) => children}
                  />
                </div>
              </div>
            )}
            renderContainer={({ children }) => children}
          />
        )}
        renderContainer={({ children }) => (
          <div data-cy="container" tabIndex={1}>
            {children}
          </div>
        )}
      />,
    );

    await user.click(getByDataCy('menu'));

    expect(value).toEqual(['item-1', 'item-1-1', 'item-1-1-1']);
    expect(label).toEqual(['label1', 'label1-1', 'label1-1-1']);
  });
});
