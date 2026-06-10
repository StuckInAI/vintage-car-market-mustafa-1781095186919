import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0f0f1a' }}>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
