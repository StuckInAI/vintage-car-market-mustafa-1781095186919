import { Link } from 'react-router-dom';
import { Gavel, Car, ArrowRight, Star } from 'lucide-react';
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
        className="py-20 px-4 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)',
          borderBottom: '2px solid #c9a227',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 text-sm tracking-widest" style={{ color: '#c9a227' }}>
            ✦ WELCOME TO THE PREMIER VINTAGE & CLASSIC CAR MARKETPLACE ✦
          </div>
          <h1
            className="text-4xl md:text-6xl font-bold mb-6"
            style={{ color: '#e8e8e8', fontFamily: 'Georgia, serif', lineHeight: 1.2 }}
          >
            Discover Timeless
            <span style={{ color: '#c9a227' }}> Automobiles</span>
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#a0a0a0' }}>
            The world's most trusted marketplace for vintage, classic, and collector automobiles.
            Buy, sell, and auction with confidence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/browse"
              className="flex items-center gap-2 px-6 py-3 rounded font-semibold tracking-wide transition-colors"
              style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
            >
              <Car size={18} /> Browse Cars
            </Link>
            <Link
              to="/auction"
              className="flex items-center gap-2 px-6 py-3 rounded font-semibold tracking-wide border transition-colors hover:bg-yellow-900"
              style={{ borderColor: '#c9a227', color: '#c9a227' }}
            >
              <Gavel size={18} /> Live Auctions
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-4" style={{ backgroundColor: '#1a1a2e', borderBottom: '1px solid rgba(201,162,39,0.3)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Active Listings', value: listings.length + '+' },
            { label: 'Live Auctions', value: auctions.length + '+' },
            { label: 'Verified Sellers', value: '500+' },
            { label: 'Cars Sold', value: '10,000+' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold" style={{ color: '#c9a227' }}>{stat.value}</div>
              <div className="text-sm" style={{ color: '#a0a0a0' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>
              <Star size={20} /> Featured Listings
            </h2>
            <Link to="/browse" className="flex items-center gap-1 text-sm hover:text-yellow-400" style={{ color: '#a0a0a0' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-12 px-4" style={{ backgroundColor: '#0d0d1a' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>
              <Gavel size={20} /> Live Auctions
            </h2>
            <Link to="/auction" className="flex items-center gap-1 text-sm hover:text-yellow-400" style={{ color: '#a0a0a0' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center" style={{ backgroundColor: '#1a1a2e', borderTop: '2px solid #c9a227' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>Ready to List Your Classic?</h2>
          <p className="mb-6" style={{ color: '#a0a0a0' }}>Join thousands of sellers who trust VCCP to find the right buyer for their prized automobiles.</p>
          <Link
            to="/sell"
            className="inline-flex items-center gap-2 px-8 py-3 rounded font-semibold tracking-wide"
            style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
          >
            List Your Car <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
