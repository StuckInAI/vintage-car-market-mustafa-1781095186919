import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, LogOut, User, Gavel, Car } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import VCCPLogo from '@/components/VCCPLogo';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: '#1a1a2e', borderBottom: '2px solid #c9a227' }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <VCCPLogo size={48} />
          <div>
            <div className="text-2xl font-bold tracking-widest" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>VCCP</div>
            <div className="text-xs tracking-widest" style={{ color: '#a0a0a0' }}>VINTAGE CLASSIC CAR PORTAL</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/browse" className="text-sm tracking-wide hover:text-yellow-400 transition-colors" style={{ color: '#e8e8e8' }}>Browse Cars</Link>
          <Link to="/sell" className="text-sm tracking-wide hover:text-yellow-400 transition-colors" style={{ color: '#e8e8e8' }}>List Your Car</Link>
          <Link to="/auction" className="text-sm tracking-wide hover:text-yellow-400 transition-colors flex items-center gap-1" style={{ color: '#e8e8e8' }}>
            <Gavel size={14} /> Live Auctions
          </Link>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm" style={{ color: '#c9a227' }}>
                <User size={14} className="inline mr-1" />
                {user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm px-3 py-1 rounded border hover:bg-red-900 transition-colors"
                style={{ borderColor: '#8b1a1a', color: '#e8e8e8' }}
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="text-sm px-4 py-2 rounded font-semibold tracking-wide transition-colors"
              style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button className="md:hidden" style={{ color: '#c9a227' }} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col gap-3" style={{ backgroundColor: '#1a1a2e' }}>
          <Link to="/browse" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2" style={{ color: '#e8e8e8', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
            <Car size={16} /> Browse Cars
          </Link>
          <Link to="/sell" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2" style={{ color: '#e8e8e8', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
            List Your Car
          </Link>
          <Link to="/auction" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 py-2" style={{ color: '#e8e8e8', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
            <Gavel size={16} /> Live Auctions
          </Link>
          {isAuthenticated ? (
            <>
              <span style={{ color: '#c9a227' }}>{user?.username}</span>
              <button onClick={handleLogout} style={{ color: '#e8e8e8' }} className="text-left">Logout</button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setMenuOpen(false)} style={{ color: '#c9a227' }} className="font-semibold">Sign In / Register</Link>
          )}
        </div>
      )}
    </header>
  );
}
