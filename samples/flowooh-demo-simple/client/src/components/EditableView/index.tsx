import {
  CheckOutlined,
  EditOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { Input, Space } from 'antd';
import React, { useState } from 'react';

type EditableViewProps<T = unknown> = {
  value?: T;
  render?: (value: T | undefined) => React.ReactNode;
  renderEdit?: (props: {
    value?: T;
    onChange?: (v?: T) => void;
  }) => React.ReactNode;
  onEdit?: (value: T) => boolean | Promise<boolean>;
  afterEdit?: (result: boolean) => void;
};

function EditableView<T>(props: EditableViewProps<T>) {
  const [editing, setEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<T | undefined>(undefined);

  return (
    <Space>
      {editing ? (
        <div>
          {props.renderEdit ? (
            props.renderEdit({ value: editValue, onChange: setEditValue })
          ) : (
            <Input
              value={editValue as string}
              onChange={(e) => setEditValue(e.target.value as T)}
            />
          )}
        </div>
      ) : (
        <div>
          {props.render ? props.render(props.value) : props.value?.toString()}
        </div>
      )}
      {loading ? (
        <LoadingOutlined />
      ) : editing ? (
        <CheckOutlined
          onClick={async () => {
            try {
              if (!props.onEdit) {
                console.warn('onEdit is not defined');
                setEditing(false);
                return;
              }
              setLoading(true);
              const result = await props.onEdit(editValue as T);
              setLoading(false);
              props.afterEdit?.(result);
              if (result) {
                setEditing(false);
              }
            } catch (e) {
              console.error(e);
              setLoading(false);
              props.afterEdit?.(false);
            }
          }}
        />
      ) : (
        <EditOutlined
          onClick={() => {
            setEditing(true);
            setEditValue(props.value);
          }}
        />
      )}
    </Space>
  );
}

export default EditableView;
