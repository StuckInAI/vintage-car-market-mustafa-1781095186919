import { Link } from 'react-router-dom';
import { useListings } from '@/context/ListingsContext';
import CarCard from '@/components/CarCard';
import AuctionCard from '@/components/AuctionCard';
import VCCPLogo from '@/components/VCCPLogo';
import { Gavel, Car, TrendingUp, Shield } from 'lucide-react';

export default function HomePage() {
  const { listings, auctions } = useListings();
  const featuredListings = listings.slice(0, 3);
  const activeAuctions = auctions.filter((a) => a.auctionActive && Date.now() < a.auctionEndTime).slice(0, 2);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative py-20 px-4 text-center"
        style={{
          background: 'linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)',
          borderBottom: '1px solid rgba(201,162,39,0.3)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <VCCPLogo size={96} />
          </div>
          <h1
            className="text-5xl font-bold mb-4 tracking-widest"
            style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}
          >
            VCCP
          </h1>
          <p className="text-xl mb-2 tracking-widest" style={{ color: '#e8e8e8' }}>
            VINTAGE CLASSIC CAR PORTAL
          </p>
          <p className="text-base mb-8" style={{ color: '#a0a0a0' }}>
            The premier destination for buying, selling, and auctioning the world's finest vintage and classic automobiles.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/browse"
              className="px-8 py-3 rounded font-semibold tracking-wide text-base transition-colors"
              style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
            >
              Browse Cars
            </Link>
            <Link
              to="/auction"
              className="px-8 py-3 rounded font-semibold tracking-wide text-base transition-colors"
              style={{ border: '2px solid #c9a227', color: '#c9a227' }}
            >
              Live Auctions
            </Link>
            <Link
              to="/sell"
              className="px-8 py-3 rounded font-semibold tracking-wide text-base transition-colors"
              style={{ border: '1px solid rgba(201,162,39,0.5)', color: '#e8e8e8' }}
            >
              List Your Car
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-4" style={{ backgroundColor: '#1a1a2e', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { icon: <Car size={24} />, value: listings.length, label: 'Active Listings' },
            { icon: <Gavel size={24} />, value: auctions.length, label: 'Live Auctions' },
            { icon: <TrendingUp size={24} />, value: '$2.4M+', label: 'Cars Sold' },
            { icon: <Shield size={24} />, value: '100%', label: 'Verified Sellers' },
          ].map((stat, i) => (
            <div key={i} className="py-4">
              <div className="flex justify-center mb-2" style={{ color: '#c9a227' }}>{stat.icon}</div>
              <div className="text-2xl font-bold" style={{ color: '#e8e8e8' }}>{stat.value}</div>
              <div className="text-xs" style={{ color: '#a0a0a0' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>
              Featured Listings
            </h2>
            <Link to="/browse" className="text-sm hover:text-yellow-400 transition-colors" style={{ color: '#a0a0a0' }}>
              View All →
            </Link>
          </div>
          {featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <p style={{ color: '#a0a0a0' }}>No listings yet. <Link to="/sell" style={{ color: '#c9a227' }}>List your car</Link>.</p>
          )}
        </div>
      </section>

      {/* Active Auctions */}
      {activeAuctions.length > 0 && (
        <section className="py-12 px-4" style={{ backgroundColor: '#0d0d1a' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>
                <Gavel size={24} className="inline mr-2" />
                Live Auctions
              </h2>
              <Link to="/auction" className="text-sm hover:text-yellow-400 transition-colors" style={{ color: '#a0a0a0' }}>
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
