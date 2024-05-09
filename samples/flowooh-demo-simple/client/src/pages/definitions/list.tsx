import { useRequest } from 'ahooks';
import { Button, Space, Table, TableProps, message } from 'antd';
import axios from 'axios';
import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import WorkflowDefinitionDetails, {
  WorkflowDefinitionDetailsRef,
} from '../../containers/WorkflowDefinitionDetails';
import SideLayout from '../../layouts/SideLayout';

const DefinitionListPage = () => {
  const navTo = useNavigate();
  const r = useRef<WorkflowDefinitionDetailsRef>(null);

  const { data, refresh: refreshData } = useRequest(
    async () => {
      const res = await axios.get('http://localhost:3000/api/definitions');
      return res.data;
    },
    { refreshDeps: [] },
  );

  const columns = useMemo<TableProps['columns']>(() => {
    return [
      {
        title: 'Id',
        dataIndex: 'id',
      },
      {
        title: 'Name',
        dataIndex: 'name',
      },
      {
        title: 'Description',
        dataIndex: 'description',
      },
      {
        title: 'Version',
        dataIndex: 'version',
      },
      {
        title: 'Updated Time',
        dataIndex: 'updated_at',
        render: (v) => new Date(v).toLocaleString(),
      },
      {
        title: 'Created Time',
        dataIndex: 'created_at',
        render: (v) => new Date(v).toLocaleString(),
      },
      {
        title: 'Options',
        render: (_, record) => (
          <Space>
            <Button
              type="link"
              onClick={async (e) => {
                e.stopPropagation();
                await axios.post('http://localhost:3000/api/execution/start', {
                  definitionId: record.id,
                });
                message.success('Launched');
              }}
            >
              Launch
            </Button>
          </Space>
        ),
      },
    ];
  }, []);

  return (
    <SideLayout>
      <div style={{ marginBottom: 8 }}>
        <Space>
          <Button
            onClick={() => {
              navTo('/definitions/new');
            }}
          >
            Add New
          </Button>
        </Space>
      </div>
      <Table
        rowKey="id"
        dataSource={data}
        columns={columns}
        pagination={false}
        onRow={(data) => {
          return {
            onClick: () => {
              r.current?.show(data.id);
            },
          };
        }}
      />
      <WorkflowDefinitionDetails
        ref={r}
        onDataChange={() => {
          refreshData();
        }}
      />
    </SideLayout>
  );
};

export default DefinitionListPage;
