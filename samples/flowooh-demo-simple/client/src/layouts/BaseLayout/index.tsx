import { Layout } from 'antd';

const BaseLayout: React.FC<React.PropsWithChildren> = (props) => {
  return <Layout style={{ height: '100vh' }}>{props.children}</Layout>;
};

export default BaseLayout;
