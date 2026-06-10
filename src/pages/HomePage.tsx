import { Link } from 'react-router-dom';
import { ArrowRight, Gavel, Shield, Search } from 'lucide-react';
import { useListings } from '@/context/ListingsContext';
import CarCard from '@/components/CarCard';
import AuctionCard from '@/components/AuctionCard';
import VCCPLogo from '@/components/VCCPLogo';

export default function HomePage() {
  const { listings, auctions } = useListings();

  const featuredListings = listings.slice(0, 3);
  const activeAuctions = auctions.filter((a) => a.auctionActive && Date.now() < a.auctionEndTime).slice(0, 2);

  return (
    <div>
      {/* Hero */}
      <section className="py-20 px-4 text-center" style={{ background: 'linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 100%)', borderBottom: '1px solid rgba(201,162,39,0.3)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <VCCPLogo size={80} />
          </div>
          <h1 className="text-5xl font-bold mb-4" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>
            Vintage Classic Car Portal
          </h1>
          <p className="text-lg mb-8" style={{ color: '#a0a0a0' }}>
            The premier marketplace for classic and vintage automobiles. Buy, sell, and auction the world's finest collector cars.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/browse"
              className="flex items-center gap-2 px-6 py-3 rounded font-semibold transition-colors"
              style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
            >
              <Search size={18} /> Browse Cars <ArrowRight size={16} />
            </Link>
            <Link
              to="/sell"
              className="flex items-center gap-2 px-6 py-3 rounded font-semibold transition-colors"
              style={{ backgroundColor: 'transparent', color: '#c9a227', border: '2px solid #c9a227' }}
            >
              List Your Car
            </Link>
            <Link
              to="/auction"
              className="flex items-center gap-2 px-6 py-3 rounded font-semibold transition-colors"
              style={{ backgroundColor: 'transparent', color: '#e8e8e8', border: '2px solid rgba(255,255,255,0.2)' }}
            >
              <Gavel size={18} /> Live Auctions
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-4" style={{ backgroundColor: '#1a1a2e', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            [String(listings.length), 'Listings'],
            [String(auctions.filter((a) => a.auctionActive).length), 'Live Auctions'],
            ['50+', 'Makes & Models'],
            ['Worldwide', 'Reach'],
          ].map(([value, label]) => (
            <div key={label}>
              <div className="text-2xl font-bold" style={{ color: '#c9a227' }}>{value}</div>
              <div className="text-sm" style={{ color: '#a0a0a0' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      {featuredListings.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>Featured Listings</h2>
            <Link to="/browse" className="flex items-center gap-1 text-sm hover:text-yellow-400 transition-colors" style={{ color: '#a0a0a0' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((car) => <CarCard key={car.id} car={car} />)}
          </div>
        </section>
      )}

      {/* Active Auctions */}
      {activeAuctions.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12" style={{ borderTop: '1px solid rgba(201,162,39,0.2)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>
              <Gavel size={24} /> Live Auctions
            </h2>
            <Link to="/auction" className="flex items-center gap-1 text-sm hover:text-yellow-400 transition-colors" style={{ color: '#a0a0a0' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeAuctions.map((auction) => <AuctionCard key={auction.id} auction={auction} />)}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-12 px-4" style={{ backgroundColor: '#1a1a2e', borderTop: '1px solid rgba(201,162,39,0.2)' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>Why Choose VCCP?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Shield size={32} />, title: 'Trusted Marketplace', desc: 'All listings are reviewed for authenticity. Buyer and seller protection built in.' },
              { icon: <Gavel size={32} />, title: 'Live Auctions', desc: 'Participate in real-time auctions for rare and collectible automobiles.' },
              { icon: <Search size={32} />, title: 'Advanced Search', desc: 'Find exactly what you are looking for with our detailed filtering system.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-lg" style={{ backgroundColor: '#0f0f1a', border: '1px solid rgba(201,162,39,0.2)' }}>
                <div className="flex justify-center mb-3" style={{ color: '#c9a227' }}>{icon}</div>
                <h3 className="font-bold mb-2" style={{ color: '#e8e8e8' }}>{title}</h3>
                <p className="text-sm" style={{ color: '#a0a0a0' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
