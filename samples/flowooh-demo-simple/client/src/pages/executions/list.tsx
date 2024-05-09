import { useRequest } from 'ahooks';
import { Button, Space, Table, TableProps, message } from 'antd';
import axios from 'axios';
import { useMemo } from 'react';
import SideLayout from '../../layouts/SideLayout';

const ExecutionListPage = () => {
  const { data = {}, refresh: refreshData } = useRequest(
    async () => {
      const res = await axios.get('http://localhost:3000/api/executions/todo');
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
        title: 'Workflow Definition',
        dataIndex: 'proc_definition_id',
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
                await axios.post(
                  'http://localhost:3000/api/execution/execute',
                  { executionId: record.id },
                );
                refreshData();
                message.success('Executed');
              }}
            >
              Execute
            </Button>
          </Space>
        ),
      },
    ];
  }, [refreshData]);

  return (
    <SideLayout>
      <Table
        rowKey="id"
        dataSource={data.list}
        columns={columns}
        pagination={false}
      />
    </SideLayout>
  );
};

export default ExecutionListPage;
