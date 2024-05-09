import type { MenuProps } from 'antd';
import { Layout, Menu, theme } from 'antd';
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import FlowoohLogo from '../../components/FlowoohLogo';
import BaseLayout from '../BaseLayout';
import './index.css';
import routes from '../../routes';

const { Header, Content, Sider } = Layout;

const items: MenuProps['items'] = routes
  .filter((v) => v.name)
  .map((v) => {
    return { key: v.path, label: v.name || '' };
  });

const SideLayout: React.FC<React.PropsWithChildren> = (props) => {
  const location = useLocation();
  const navTo = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <BaseLayout>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Link to="/">
          <FlowoohLogo size={24} />
        </Link>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            selectedKeys={[location?.pathname || '']}
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
            onClick={(e) => {
              navTo(e.key);
            }}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </BaseLayout>
  );
};

export default SideLayout;
