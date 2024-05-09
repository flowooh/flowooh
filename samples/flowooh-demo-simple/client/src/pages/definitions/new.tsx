import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import SideLayout from '../../layouts/SideLayout';

const DefinitionNewOne = () => {
  return (
    <SideLayout>
      <Form
        layout="vertical"
        onFinish={async (values) => {
          const res = await axios.post(
            'http://localhost:3000/api/definition/create',
            values,
          );
          if (res.data) {
            history.back();
            message.success('Create success');
          }
        }}
      >
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Content" name="content">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </SideLayout>
  );
};

export default DefinitionNewOne;
