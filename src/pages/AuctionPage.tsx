import { useState } from 'react';
import { Gavel, Clock, TrendingUp, Plus } from 'lucide-react';
import { useListings } from '@/context/ListingsContext';
import { useAuth } from '@/hooks/useAuth';
import AuctionCard from '@/components/AuctionCard';
import { formatPrice } from '@/lib/utils';

export default function AuctionPage() {
  const { auctions, updateAuction } = useListings();
  const { user, isAuthenticated } = useAuth();
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState<{ text: string; success: boolean } | null>(null);

  const activeAuctions = auctions.filter((a) => a.auctionActive && Date.now() < a.auctionEndTime);
  const endedAuctions = auctions.filter((a) => !a.auctionActive || Date.now() >= a.auctionEndTime);

  const handleBid = (auctionId: string) => {
    if (!isAuthenticated || !user) {
      setBidMessage({ text: 'You must be signed in to bid.', success: false });
      return;
    }
    const auction = auctions.find((a) => a.id === auctionId);
    if (!auction) return;

    const amount = Number(bidAmount);
    if (isNaN(amount) || amount <= auction.currentBid) {
      setBidMessage({ text: `Bid must be greater than ${formatPrice(auction.currentBid)}.`, success: false });
      return;
    }

    const updatedAuction = {
      ...auction,
      currentBid: amount,
      currentBidder: user.id,
      currentBidderName: user.username,
      bids: [
        ...auction.bids,
        {
          id: `bid_${Date.now()}`,
          bidderId: user.id,
          bidderName: user.username,
          amount,
          timestamp: Date.now(),
        },
      ],
    };
    updateAuction(updatedAuction);
    setBidMessage({ text: `Bid of ${formatPrice(amount)} placed successfully!`, success: true });
    setBidAmount('');
    setTimeout(() => setBidMessage(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#e8e8e8', fontFamily: 'Georgia, serif' }}>
            Live <span style={{ color: '#c9a227' }}>Auctions</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#a0a0a0' }}>
            {activeAuctions.length} active auction{activeAuctions.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {bidMessage && (
        <div
          className="mb-6 p-4 rounded-lg text-sm font-semibold"
          style={{
            backgroundColor: bidMessage.success ? '#1a3a1a' : '#3a1a1a',
            color: bidMessage.success ? '#44ff44' : '#ff6666',
            border: `1px solid ${bidMessage.success ? '#44ff44' : '#ff4444'}`,
          }}
        >
          {bidMessage.text}
        </div>
      )}

      {/* Active */}
      {activeAuctions.length > 0 ? (
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#c9a227' }}>
            <Clock size={20} /> Active Auctions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAuctions.map((auction) => (
              <div key={auction.id}>
                <AuctionCard auction={auction} />
                {/* Bid Form */}
                <div className="mt-2 p-3 rounded-lg" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder={`Min: ${formatPrice(auction.currentBid + 1)}`}
                      value={selectedAuction === auction.id ? bidAmount : ''}
                      onChange={(e) => {
                        setSelectedAuction(auction.id);
                        setBidAmount(e.target.value);
                      }}
                      className="flex-1 px-3 py-2 rounded text-sm outline-none"
                      style={{ backgroundColor: '#111125', border: '1px solid rgba(201,162,39,0.3)', color: '#e8e8e8' }}
                    />
                    <button
                      onClick={() => handleBid(auction.id)}
                      className="px-4 py-2 rounded text-sm font-bold flex items-center gap-1 transition-colors"
                      style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
                    >
                      <Gavel size={14} /> Bid
                    </button>
                  </div>
                  <div className="mt-2 text-xs flex items-center gap-1" style={{ color: '#888' }}>
                    <TrendingUp size={11} /> {auction.bids.length} bids · Current: {formatPrice(auction.currentBid)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16" style={{ color: '#a0a0a0' }}>
          <Gavel size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg">No active auctions at this time.</p>
        </div>
      )}

      {/* Ended */}
      {endedAuctions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-6" style={{ color: '#888' }}>Ended Auctions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
            {endedAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      )}

      {/* Sell CTA */}
      <div className="mt-12 p-6 rounded-lg text-center" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)' }}>
        <Plus size={32} className="mx-auto mb-3" style={{ color: '#c9a227' }} />
        <h3 className="text-xl font-bold mb-2" style={{ color: '#e8e8e8' }}>Want to Auction Your Car?</h3>
        <p className="text-sm mb-4" style={{ color: '#a0a0a0' }}>List your classic for auction and reach thousands of bidders.</p>
        <a href="/sell" className="inline-block px-6 py-2 rounded font-semibold text-sm" style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}>
          Start an Auction
        </a>
      </div>
    </div>
  );
}
