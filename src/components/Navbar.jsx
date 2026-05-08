import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, BarChart3, User } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="glass-card" style={{ padding: '1rem 2rem', margin: '1rem', borderRadius: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '1rem', zIndex: 100 }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'hsl(var(--primary))', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.25rem' }}>
        <div style={{ background: 'hsl(var(--primary))', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          M
        </div>
        ICFES Master
      </Link>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#666', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: '500' }}>
          <LayoutDashboard size={18} /> Dashboard
        </Link>
        <Link to="/stats" style={{ textDecoration: 'none', color: '#666', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: '500' }}>
          <BarChart3 size={18} /> Estadísticas
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'hsl(var(--accent))', padding: '0.4rem 0.8rem', borderRadius: '2rem' }}>
          <User size={16} />
          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user.username}</span>
        </div>
        <button onClick={handleLogoutClick} className="btn btn-outline" style={{ padding: '0.4rem', borderRadius: '50%' }}>
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
