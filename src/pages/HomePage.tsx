import { Link } from 'react-router-dom';
import { Search, Gavel, Car, TrendingUp, Shield, Award, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '@/context/ListingsContext';
import CarCard from '@/components/CarCard';
import AuctionCard from '@/components/AuctionCard';
import VCCPLogo from '@/components/VCCPLogo';

export default function HomePage() {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const { listings, auctions } = useListings();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/browse?search=${encodeURIComponent(searchText)}`);
  };

  const featuredListings = listings.slice(0, 3);
  const activeAuctions = auctions.filter((a) => Date.now() < a.auctionEndTime);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)', minHeight: '500px' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #c9a227 0, #c9a227 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="flex justify-center mb-6">
            <VCCPLogo size={80} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-wider" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>VCCP</h1>
          <p className="text-xl md:text-2xl mb-2 tracking-widest" style={{ color: '#e8e8e8' }}>VINTAGE CLASSIC CAR PORTAL</p>
          <div className="ornament-line mx-auto mb-6" style={{ maxWidth: '300px' }}></div>
          <p className="text-base mb-10" style={{ color: '#a0a0a0' }}>The premier marketplace for vintage and classic automobiles — buy, sell, and auction with confidence.</p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-0 rounded-lg overflow-hidden" style={{ border: '2px solid #c9a227' }}>
            <input
              type="text"
              placeholder="Search by make, model, year..."
              value={searchText}
              onChange={(e: any) => setSearchText(e.target.value)}
              className="flex-1 px-5 py-4 text-base outline-none"
              style={{ backgroundColor: '#1e1e32', color: '#e8e8e8' }}
            />
            <button type="submit" className="px-6 py-4 font-bold flex items-center gap-2 transition-colors" style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}>
              <Search size={18} /> Search
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link to="/browse" className="px-6 py-2 rounded-full text-sm font-semibold transition-all" style={{ border: '1px solid #c9a227', color: '#c9a227' }}>Browse All Cars</Link>
            <Link to="/auction" className="px-6 py-2 rounded-full text-sm font-semibold transition-all" style={{ border: '1px solid #e8e8e8', color: '#e8e8e8' }}>Live Auctions</Link>
            <Link to="/sell" className="px-6 py-2 rounded-full text-sm font-semibold transition-all" style={{ border: '1px solid #a0a0a0', color: '#a0a0a0' }}>Sell Your Car</Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ backgroundColor: '#1a1a2e', borderTop: '1px solid rgba(201,162,39,0.3)', borderBottom: '1px solid rgba(201,162,39,0.3)' }}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-8">
          {[
            { label: 'Active Listings', value: listings.length.toString() },
            { label: 'Live Auctions', value: activeAuctions.length.toString() },
            { label: 'Makes Available', value: '40+' },
            { label: 'Years Covered', value: '1900–1990' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold" style={{ color: '#c9a227' }}>{stat.value}</div>
              <div className="text-xs" style={{ color: '#a0a0a0' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#e8e8e8', fontFamily: 'Georgia, serif' }}>
            <span style={{ color: '#c9a227' }}>Featured</span> Listings
          </h2>
          <Link to="/browse" className="flex items-center gap-1 text-sm" style={{ color: '#c9a227' }}>View All <ChevronRight size={14} /></Link>
        </div>
        <div className="ornament-line mb-6"></div>
        {featuredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((car) => <CarCard key={car.id} car={car} />)}
          </div>
        ) : (
          <p style={{ color: '#a0a0a0' }}>No listings yet. <Link to="/sell" style={{ color: '#c9a227' }}>Be the first to list!</Link></p>
        )}
      </section>

      {/* Live Auctions */}
      {activeAuctions.length > 0 && (
        <section className="px-4 py-12" style={{ backgroundColor: '#111125' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: '#e8e8e8', fontFamily: 'Georgia, serif' }}>
                <Gavel style={{ color: '#c9a227' }} />
                <span style={{ color: '#c9a227' }}>Live</span> Auctions
              </h2>
              <Link to="/auction" className="flex items-center gap-1 text-sm" style={{ color: '#c9a227' }}>View All <ChevronRight size={14} /></Link>
            </div>
            <div className="ornament-line mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeAuctions.slice(0, 3).map((a) => <AuctionCard key={a.id} auction={a} />)}
            </div>
          </div>
        </section>
      )}

      {/* Why VCCP */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center mb-2" style={{ color: '#e8e8e8', fontFamily: 'Georgia, serif' }}>Why Choose <span style={{ color: '#c9a227' }}>VCCP</span></h2>
        <div className="ornament-line mx-auto mb-8" style={{ maxWidth: '200px' }}></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <Car size={32} style={{ color: '#c9a227' }} />, title: 'Curated Listings', desc: 'Hand-selected vintage and classic cars from verified sellers.' },
            { icon: <Gavel size={32} style={{ color: '#c9a227' }} />, title: 'Live Auctions', desc: 'Real-time bidding with transparent reserve prices and countdowns.' },
            { icon: <Shield size={32} style={{ color: '#c9a227' }} />, title: 'Secure Platform', desc: 'Authenticated sellers and bidders ensure safe transactions.' },
            { icon: <Award size={32} style={{ color: '#c9a227' }} />, title: 'Expert Community', desc: 'Connect with passionate collectors and vintage car enthusiasts.' },
          ].map((item) => (
            <div key={item.title} className="text-center p-6 rounded-lg" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
              <div className="flex justify-center mb-3">{item.icon}</div>
              <h3 className="font-bold mb-2" style={{ color: '#e8e8e8' }}>{item.title}</h3>
              <p className="text-sm" style={{ color: '#a0a0a0' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-12 text-center" style={{ backgroundColor: '#1a1a2e', borderTop: '1px solid rgba(201,162,39,0.3)' }}>
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#e8e8e8', fontFamily: 'Georgia, serif' }}>Ready to <span style={{ color: '#c9a227' }}>Buy or Sell?</span></h2>
        <p className="mb-6" style={{ color: '#a0a0a0' }}>Join the VCCP community and discover your next classic automobile.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/sell" className="px-8 py-3 rounded font-bold text-lg" style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}>List Your Car</Link>
          <Link to="/auction/create" className="px-8 py-3 rounded font-bold text-lg" style={{ border: '2px solid #c9a227', color: '#c9a227' }}>Start an Auction</Link>
        </div>
      </section>
    </div>
  );
}
