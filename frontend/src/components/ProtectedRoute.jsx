import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import useAuthStore from '../store/authStore';

// 로그인하지 않은 사용자는 /login으로 보낸다.
function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
