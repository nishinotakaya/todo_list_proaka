import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('/users/sign_out', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        },
        credentials: 'include'
      });

      if (response.ok) {
        localStorage.removeItem('token');
        navigate('/signin');
      }
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  return (
    <header style={{
      padding: '1rem',
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor: '#f5f5f5',
      marginBottom: '1rem'
    }}>
      <button
        onClick={handleLogout}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ログアウト
      </button>
    </header>
  );
};

export default Header;
