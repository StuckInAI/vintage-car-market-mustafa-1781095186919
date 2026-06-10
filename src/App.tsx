import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ListingsProvider } from '@/context/ListingsContext';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import BrowsePage from '@/pages/BrowsePage';
import CarDetailPage from '@/pages/CarDetailPage';
import SellPage from '@/pages/SellPage';
import AuctionPage from '@/pages/AuctionPage';
import AuctionDetailPage from '@/pages/AuctionDetailPage';
import CreateAuctionPage from '@/pages/CreateAuctionPage';
import AuthPage from '@/pages/AuthPage';

export default function App() {
  return (
    <AuthProvider>
      <ListingsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="browse" element={<BrowsePage />} />
              <Route path="car/:id" element={<CarDetailPage />} />
              <Route path="sell" element={<SellPage />} />
              <Route path="auction" element={<AuctionPage />} />
              <Route path="auction/:id" element={<AuctionDetailPage />} />
              <Route path="auction/create" element={<CreateAuctionPage />} />
              <Route path="auth" element={<AuthPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ListingsProvider>
    </AuthProvider>
  );
}
