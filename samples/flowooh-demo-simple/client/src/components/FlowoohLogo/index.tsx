import React from 'react';
import './index.css';

const FlowoohLogo: React.FC<{
  size?: number;
  inline?: boolean;
  style?: React.CSSProperties;
}> = (props) => {
  return (
    <div
      className="gradient-text"
      style={{
        fontSize: props.size || 24,
        display: props.inline ? 'inline' : 'block',
        ...(props.style || {}),
      }}
    >
      Flowooh
    </div>
  );
};

export default FlowoohLogo;
