import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, theme as antTheme } from 'antd';
import koKR from 'antd/locale/ko_KR';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import useThemeStore from './store/themeStore';
import './index.css';

dayjs.locale('ko');

const PRIMARY_COLOR = '#1677ff';
const BORDER_RADIUS = 6;
const BASE_FONT_SIZE = 15;

function Root() {
  const isDark = useThemeStore((s) => s.isDark);

  return (
    <ConfigProvider
      locale={koKR}
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: PRIMARY_COLOR,
          borderRadius: BORDER_RADIUS,
          fontSize: BASE_FONT_SIZE,
        },
      }}
    >
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </React.StrictMode>
);
