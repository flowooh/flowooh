import { App, ConfigProvider } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css';
import routes from './routes';

const router = createBrowserRouter(
  routes.map((r) => {
    return {
      path: r.path,
      lazy: async () => {
        const ele = (await import(`./pages${r.page}`)).default;
        return {
          element: React.createElement(ele),
        };
      },
    };
  }),
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App>
      <ConfigProvider
        theme={{
          components: {
            Layout: {
              headerBg: '#fff',
            },
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </App>
  </React.StrictMode>,
);
