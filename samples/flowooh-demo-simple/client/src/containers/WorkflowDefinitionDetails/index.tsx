import { useRequest } from 'ahooks';
import { App, Card, Descriptions, Drawer, List, Space, Tag } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { forwardRef, useImperativeHandle, useState } from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import EditableView from '../../components/EditableView';

export interface WorkflowDefinitionDetailsProps {
  onDataChange?: () => void;
}

export interface WorkflowDefinitionDetailsRef {
  show: (recordId: string) => void;
}

const WorkflowDefinitionDetails = forwardRef<
  WorkflowDefinitionDetailsRef,
  WorkflowDefinitionDetailsProps
>((props, ref) => {
  const { modal } = App.useApp();
  const [recordId, setRecordId] = useState<string>();
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    show: (_recordId) => {
      setRecordId(_recordId);
      setOpen(true);
    },
  }));

  const { data, refresh: refreshData } = useRequest(
    async () => {
      if (!recordId) return Promise.resolve({ info: {}, versions: [] });
      const [info, versions] = await Promise.all([
        axios.get('http://localhost:3000/api/definition/info', {
          params: { id: recordId },
        }),
        axios.get('http://localhost:3000/api/definition/versions', {
          params: { id: recordId },
        }),
      ]);
      return { info: info.data, versions: versions.data };
    },
    { refreshDeps: [recordId] },
  );
  return (
    <Drawer
      width={640}
      title={'Workflow Definition Detail'}
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Descriptions layout="vertical" column={2}>
        <Descriptions.Item span={1} label="Id">
          {data?.info.id}
        </Descriptions.Item>
        <Descriptions.Item span={1} label="Name">
          <EditableView
            value={data?.info.name}
            onEdit={async (value) => {
              await axios.post(
                'http://localhost:3000/api/definition/editInfo',
                { id: recordId, info: { name: value } },
              );
              return true;
            }}
            afterEdit={() => {
              refreshData();
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Description">
          <EditableView
            value={data?.info.description}
            onEdit={async (value) => {
              await axios.post(
                'http://localhost:3000/api/definition/editInfo',
                { id: recordId, info: { description: value } },
              );
              return true;
            }}
            afterEdit={() => {
              refreshData();
              props.onDataChange?.();
            }}
          />
        </Descriptions.Item>
        <Descriptions.Item span={2} label="Versions">
          <Card style={{ width: '100%' }}>
            <List
              dataSource={data?.versions}
              style={{ width: '100%' }}
              renderItem={(item: {
                // TODO: types
                id: string;
                version: string;
                published: boolean;
                created_at: string;
                updated_at: string;
              }) => {
                return (
                  <List.Item>
                    <div>
                      <Tag>{item.version}</Tag>
                      <Tag color={item.published ? 'green' : 'default'}>
                        {item.published ? 'Published' : 'Draft'}
                      </Tag>
                      <div>
                        Created Time:{' '}
                        {item.created_at
                          ? dayjs(item.created_at).format('YYYY-MM-DD HH:mm:ss')
                          : 'Unknown'}
                      </div>
                      <div>
                        Updated Time:{' '}
                        {item.updated_at
                          ? dayjs(item.updated_at).format('YYYY-MM-DD HH:mm:ss')
                          : 'Unknown'}
                      </div>
                      <Space>
                        <a
                          onClick={async () => {
                            const res = await axios.get(
                              'http://localhost:3000/api/definition/version/content',
                              { params: { id: item.id } },
                            );
                            modal.info({
                              title: 'Raw Text',
                              width: '80vw',
                              content: (
                                <SyntaxHighlighter
                                  language="xml"
                                  wrapLines
                                  style={docco}
                                  customStyle={{ height: '60vh' }}
                                >
                                  {res.data.toString() || ''}
                                </SyntaxHighlighter>
                              ),
                            });
                          }}
                        >
                          View Raw Text
                        </a>
                      </Space>
                    </div>
                  </List.Item>
                );
              }}
            />
          </Card>
        </Descriptions.Item>
      </Descriptions>
    </Drawer>
  );
});

export default WorkflowDefinitionDetails;
