import { Link } from 'react-router-dom';
import { Car, Gavel, Shield, Star } from 'lucide-react';
import { useListings } from '@/context/ListingsContext';
import CarCard from '@/components/CarCard';
import AuctionCard from '@/components/AuctionCard';

export default function HomePage() {
  const { listings, auctions } = useListings();
  const featuredListings = listings.slice(0, 3);
  const featuredAuctions = auctions.slice(0, 2);

  return (
    <div>
      {/* Hero */}
      <section
        className="relative py-24 px-4 text-center"
        style={{
          background: 'linear-gradient(180deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)',
          borderBottom: '1px solid rgba(201,162,39,0.3)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 text-sm tracking-[0.3em] uppercase" style={{ color: '#c9a227' }}>
            The Premier Marketplace
          </div>
          <h1
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{ color: '#e8e8e8', fontFamily: 'Georgia, serif', lineHeight: 1.1 }}
          >
            Vintage &amp; Classic
            <br />
            <span style={{ color: '#c9a227' }}>Automobiles</span>
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#a0a0a0' }}>
            Discover exceptional vintage and classic cars from trusted sellers worldwide.
            Buy, sell, and auction the finest automobiles from every era.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/browse"
              className="px-8 py-3 rounded font-semibold text-lg transition-colors"
              style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
            >
              Browse Cars
            </Link>
            <Link
              to="/auction"
              className="px-8 py-3 rounded font-semibold text-lg transition-colors border"
              style={{ borderColor: '#c9a227', color: '#c9a227' }}
            >
              Live Auctions
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-4" style={{ backgroundColor: '#1a1a2e', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Cars Listed', value: listings.length.toString() },
            { label: 'Live Auctions', value: auctions.filter((a) => a.auctionActive).length.toString() },
            { label: 'Makes Available', value: '30+' },
            { label: 'Years Covered', value: '1900s–1990s' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold" style={{ color: '#c9a227' }}>{stat.value}</div>
              <div className="text-sm" style={{ color: '#a0a0a0' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      {featuredListings.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold" style={{ color: '#e8e8e8', fontFamily: 'Georgia, serif' }}>
                Featured <span style={{ color: '#c9a227' }}>Listings</span>
              </h2>
              <Link to="/browse" className="text-sm hover:text-yellow-400" style={{ color: '#a0a0a0' }}>
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredListings.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Auctions */}
      {featuredAuctions.length > 0 && (
        <section className="py-12 px-4" style={{ backgroundColor: '#0d0d1a' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold" style={{ color: '#e8e8e8', fontFamily: 'Georgia, serif' }}>
                Live <span style={{ color: '#c9a227' }}>Auctions</span>
              </h2>
              <Link to="/auction" className="text-sm hover:text-yellow-400" style={{ color: '#a0a0a0' }}>
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredAuctions.map((auction) => (
                <AuctionCard key={auction.id} auction={auction} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: '#e8e8e8', fontFamily: 'Georgia, serif' }}>
            Why Choose <span style={{ color: '#c9a227' }}>VCCP</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Car size={32} />, title: 'Curated Listings', desc: 'Every listing is reviewed for quality and accuracy.' },
              { icon: <Gavel size={32} />, title: 'Live Auctions', desc: 'Bid in real-time on rare and collectible automobiles.' },
              { icon: <Shield size={32} />, title: 'Trusted Sellers', desc: 'Connect with verified collectors and dealers.' },
            ].map((f) => (
              <div key={f.title} className="text-center p-6 rounded-lg" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
                <div className="flex justify-center mb-4" style={{ color: '#c9a227' }}>{f.icon}</div>
                <h3 className="text-lg font-bold mb-2" style={{ color: '#e8e8e8' }}>{f.title}</h3>
                <p className="text-sm" style={{ color: '#a0a0a0' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center" style={{ backgroundColor: '#1a1a2e', borderTop: '1px solid rgba(201,162,39,0.3)' }}>
        <div className="max-w-2xl mx-auto">
          <Star size={40} className="mx-auto mb-4" style={{ color: '#c9a227' }} />
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#e8e8e8', fontFamily: 'Georgia, serif' }}>Ready to Sell Your Classic?</h2>
          <p className="mb-6" style={{ color: '#a0a0a0' }}>List your vintage automobile and reach thousands of passionate collectors.</p>
          <Link
            to="/sell"
            className="inline-block px-10 py-3 rounded font-semibold text-lg"
            style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
          >
            List Your Car
          </Link>
        </div>
      </section>
    </div>
  );
}
