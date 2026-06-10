import { useState } from 'react';
import { Gavel, Clock, TrendingUp } from 'lucide-react';
import { useListings } from '@/context/ListingsContext';
import { useAuth } from '@/hooks/useAuth';
import AuctionCard from '@/components/AuctionCard';
import { formatPrice, formatCountdown } from '@/lib/utils';
import type { AuctionListing } from '@/types';

export default function AuctionPage() {
  const { auctions, updateAuction } = useListings();
  const { user, isAuthenticated } = useAuth();
  const [selectedAuction, setSelectedAuction] = useState<AuctionListing | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');

  const activeAuctions = auctions.filter((a) => a.auctionActive && Date.now() < a.auctionEndTime);
  const endedAuctions = auctions.filter((a) => !a.auctionActive || Date.now() >= a.auctionEndTime);

  const placeBid = () => {
    if (!selectedAuction || !user) return;
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= selectedAuction.currentBid) {
      setBidMessage(`Bid must be higher than ${formatPrice(selectedAuction.currentBid)}`);
      return;
    }
    const newBid = {
      id: `bid_${Date.now()}`,
      bidderId: user.id,
      bidderName: user.username,
      amount,
      timestamp: Date.now(),
    };
    const updated: AuctionListing = {
      ...selectedAuction,
      currentBid: amount,
      currentBidder: user.id,
      currentBidderName: user.username,
      bids: [...selectedAuction.bids, newBid],
    };
    updateAuction(updated);
    setSelectedAuction(updated);
    setBidAmount('');
    setBidMessage(`Bid of ${formatPrice(amount)} placed successfully!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>
        <Gavel size={28} className="inline mr-2" /> Live Auctions
      </h1>
      <p className="mb-8" style={{ color: '#a0a0a0' }}>Bid on rare and collectible automobiles in real time.</p>

      {/* Active Auctions Grid */}
      {activeAuctions.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#e8e8e8' }}>
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: '#44ff44' }}></span>
            Active Auctions ({activeAuctions.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAuctions.map((auction) => (
              <div key={auction.id} onClick={() => { setSelectedAuction(auction); setBidMessage(''); }} className="cursor-pointer">
                <AuctionCard auction={auction} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Bid Modal */}
      {selectedAuction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" onClick={() => setSelectedAuction(null)}>
          <div
            className="rounded-lg p-6 w-full max-w-md mx-4"
            style={{ backgroundColor: '#1e1e32', border: '2px solid #c9a227' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-1" style={{ color: '#c9a227' }}>
              {selectedAuction.year} {selectedAuction.make} {selectedAuction.model}
            </h2>
            <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: '#a0a0a0' }}>
              <Clock size={14} /> Ends in: <span style={{ color: '#44ff44' }}>{formatCountdown(selectedAuction.auctionEndTime)}</span>
            </div>

            <div className="mb-4 p-3 rounded" style={{ backgroundColor: '#111125' }}>
              <div className="flex justify-between text-sm mb-1">
                <span style={{ color: '#a0a0a0' }}>Current Bid</span>
                <span className="font-bold" style={{ color: '#c9a227' }}>{formatPrice(selectedAuction.currentBid)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: '#a0a0a0' }}>Reserve</span>
                <span style={{ color: selectedAuction.currentBid >= selectedAuction.reservePrice ? '#44ff44' : '#ff4444' }}>
                  {selectedAuction.currentBid >= selectedAuction.reservePrice ? 'Met' : 'Not Met'}
                </span>
              </div>
            </div>

            {/* Bid History */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2" style={{ color: '#e8e8e8' }}>Bid History ({selectedAuction.bids.length})</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {[...selectedAuction.bids].reverse().map((bid) => (
                  <div key={bid.id} className="flex justify-between text-xs py-1" style={{ borderBottom: '1px solid rgba(201,162,39,0.1)', color: '#a0a0a0' }}>
                    <span>{bid.bidderName}</span>
                    <span style={{ color: '#c9a227' }}>{formatPrice(bid.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {isAuthenticated ? (
              <div>
                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    placeholder={`Min: ${formatPrice(selectedAuction.currentBid + 1)}`}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    className="flex-1 px-3 py-2 rounded text-sm outline-none"
                    style={{ backgroundColor: '#111125', border: '1px solid rgba(201,162,39,0.3)', color: '#e8e8e8' }}
                  />
                  <button
                    onClick={placeBid}
                    className="px-4 py-2 rounded font-semibold text-sm"
                    style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
                  >
                    <TrendingUp size={16} className="inline mr-1" /> Bid
                  </button>
                </div>
                {bidMessage && (
                  <p className="text-xs" style={{ color: bidMessage.includes('successfully') ? '#44ff44' : '#ff4444' }}>{bidMessage}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-center" style={{ color: '#a0a0a0' }}>Sign in to place a bid.</p>
            )}

            <button onClick={() => setSelectedAuction(null)} className="mt-4 w-full py-2 rounded text-sm" style={{ border: '1px solid rgba(201,162,39,0.3)', color: '#a0a0a0' }}>Close</button>
          </div>
        </div>
      )}

      {/* Ended Auctions */}
      {endedAuctions.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#888' }}>Ended Auctions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {endedAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </section>
      )}

      {auctions.length === 0 && (
        <div className="text-center py-16" style={{ color: '#a0a0a0' }}>
          <Gavel size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-xl">No auctions available</p>
        </div>
      )}
    </div>
  );
}
