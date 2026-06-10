import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gavel, Plus } from 'lucide-react';
import { useListings } from '@/context/ListingsContext';
import AuctionCard from '@/components/AuctionCard';

export default function AuctionPage() {
  const { auctions } = useListings();
  const [showActive, setShowActive] = useState(true);

  const filtered = auctions.filter((a) =>
    showActive ? a.auctionActive && Date.now() < a.auctionEndTime : !a.auctionActive || Date.now() >= a.auctionEndTime
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>
          <Gavel size={28} /> Live Auctions
        </h1>
        <Link
          to="/sell"
          className="flex items-center gap-2 px-4 py-2 rounded font-semibold text-sm transition-colors"
          style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
        >
          <Plus size={16} /> List for Auction
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setShowActive(true)}
          className="px-4 py-2 rounded text-sm font-semibold transition-colors"
          style={{
            backgroundColor: showActive ? '#c9a227' : 'transparent',
            color: showActive ? '#1a1a2e' : '#c9a227',
            border: '1px solid #c9a227',
          }}
        >
          Active Auctions ({auctions.filter((a) => a.auctionActive && Date.now() < a.auctionEndTime).length})
        </button>
        <button
          onClick={() => setShowActive(false)}
          className="px-4 py-2 rounded text-sm font-semibold transition-colors"
          style={{
            backgroundColor: !showActive ? '#c9a227' : 'transparent',
            color: !showActive ? '#1a1a2e' : '#c9a227',
            border: '1px solid #c9a227',
          }}
        >
          Ended Auctions
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: '#a0a0a0' }}>
          <Gavel size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-xl">No {showActive ? 'active' : 'ended'} auctions found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((auction) => (
            <AuctionCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
}
