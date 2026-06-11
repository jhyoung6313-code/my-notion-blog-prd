import { Card, Descriptions, Tag } from 'antd';
import useAuthStore from '../store/authStore';

// 로그인 후 진입하는 예제 대시보드
function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <Card title="대시보드">
      <Descriptions column={1} bordered>
        <Descriptions.Item label="아이디">{user?.username}</Descriptions.Item>
        <Descriptions.Item label="이름">{user?.displayName}</Descriptions.Item>
        <Descriptions.Item label="권한">
          <Tag color={user?.role === 'admin' ? 'red' : 'blue'}>{user?.role}</Tag>
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}

export default DashboardPage;
