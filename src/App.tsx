import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ListingsProvider } from '@/context/ListingsContext';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import BrowsePage from '@/pages/BrowsePage';
import CarDetailPage from '@/pages/CarDetailPage';
import SellCarPage from '@/pages/SellCarPage';
import AuctionPage from '@/pages/AuctionPage';

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
              <Route path="sell" element={<SellCarPage />} />
              <Route path="auction" element={<AuctionPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ListingsProvider>
    </AuthProvider>
  );
}
