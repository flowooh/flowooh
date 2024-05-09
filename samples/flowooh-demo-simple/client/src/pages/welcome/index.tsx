import { Button } from 'antd';
import FlowoohLogo from '../../components/FlowoohLogo';

const Welcome: React.FC = () => {
  return (
    <div
      style={{
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        margin: 'auto',
        padding: 'auto',
      }}
    >
      <FlowoohLogo size={64} />
      <h3>Welcome to Flowooh!</h3>
      <Button href="/definitions">Let's OOOOH!!!</Button>
    </div>
  );
};

export default Welcome;
