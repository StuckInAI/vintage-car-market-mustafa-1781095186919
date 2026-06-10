import { useState } from 'react';
import { useListings } from '@/context/ListingsContext';
import { useAuth } from '@/hooks/useAuth';
import AuctionCard from '@/components/AuctionCard';
import { formatPrice } from '@/lib/utils';
import { Gavel } from 'lucide-react';

export default function AuctionPage() {
  const { auctions, updateAuction } = useListings();
  const { user } = useAuth();
  const [selectedAuction, setSelectedAuction] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMsg, setBidMsg] = useState('');

  const activeAuctions = auctions.filter((a) => a.auctionActive && Date.now() < a.auctionEndTime);
  const endedAuctions = auctions.filter((a) => !a.auctionActive || Date.now() >= a.auctionEndTime);

  const handleBid = (auctionId: string) => {
    const auction = auctions.find((a) => a.id === auctionId);
    if (!auction) return;
    const amount = parseInt(bidAmount);
    if (isNaN(amount) || amount <= auction.currentBid) {
      setBidMsg(`Bid must be higher than ${formatPrice(auction.currentBid)}`);
      return;
    }
    const bidderName = user?.username || 'Anonymous';
    const bidderId = user?.id || 'anon';
    const updated = {
      ...auction,
      currentBid: amount,
      currentBidder: bidderId,
      currentBidderName: bidderName,
      bids: [
        ...auction.bids,
        { id: `bid_${Date.now()}`, bidderId, bidderName, amount, timestamp: Date.now() },
      ],
    };
    updateAuction(updated);
    setBidMsg(`Bid of ${formatPrice(amount)} placed successfully!`);
    setBidAmount('');
    setTimeout(() => setBidMsg(''), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>
        <Gavel size={28} className="inline mr-2" />
        Live Auctions
      </h1>
      <p className="mb-8 text-sm" style={{ color: '#a0a0a0' }}>Bid on rare and collectible classic vehicles.</p>

      {selectedAuction && (() => {
        const auction = auctions.find((a) => a.id === selectedAuction);
        if (!auction) return null;
        const isEnded = !auction.auctionActive || Date.now() >= auction.auctionEndTime;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
            <div className="w-full max-w-lg rounded-lg p-6" style={{ backgroundColor: '#1e1e32', border: '2px solid #c9a227' }}>
              <h2 className="text-xl font-bold mb-1" style={{ color: '#c9a227' }}>{auction.year} {auction.make} {auction.model}</h2>
              <p className="text-sm mb-4" style={{ color: '#a0a0a0' }}>{auction.location}</p>
              <div className="mb-4">
                <div className="text-xs mb-1" style={{ color: '#a0a0a0' }}>Current Bid</div>
                <div className="text-3xl font-bold" style={{ color: '#c9a227' }}>{formatPrice(auction.currentBid)}</div>
                <div className="text-xs mt-1" style={{ color: '#888' }}>by {auction.currentBidderName} · {auction.bids.length} total bids</div>
              </div>
              {!isEnded && (
                <div className="mb-4">
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Min bid: ${formatPrice(auction.currentBid + 1)}`}
                    className="w-full px-3 py-2 rounded text-sm outline-none mb-2"
                    style={{ backgroundColor: '#111125', border: '1px solid rgba(201,162,39,0.4)', color: '#e8e8e8' }}
                  />
                  <button
                    onClick={() => handleBid(auction.id)}
                    className="w-full py-2 rounded font-bold text-sm"
                    style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
                  >
                    Place Bid
                  </button>
                  {bidMsg && <p className="text-xs mt-2 text-center" style={{ color: bidMsg.includes('success') ? '#44ff44' : '#ff6666' }}>{bidMsg}</p>}
                </div>
              )}
              <div className="mb-4">
                <div className="text-xs font-semibold mb-2" style={{ color: '#a0a0a0' }}>Bid History</div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {[...auction.bids].reverse().map((bid) => (
                    <div key={bid.id} className="flex justify-between text-xs" style={{ color: '#a0a0a0' }}>
                      <span>{bid.bidderName}</span>
                      <span style={{ color: '#c9a227' }}>{formatPrice(bid.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => setSelectedAuction(null)} className="w-full py-2 rounded text-sm" style={{ border: '1px solid rgba(201,162,39,0.4)', color: '#c9a227' }}>Close</button>
            </div>
          </div>
        );
      })()}

      {activeAuctions.length > 0 ? (
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#e8e8e8' }}>Active ({activeAuctions.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {activeAuctions.map((auction) => (
              <div key={auction.id} onClick={() => setSelectedAuction(auction.id)} className="cursor-pointer">
                <AuctionCard auction={auction} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center py-12" style={{ color: '#a0a0a0' }}>No active auctions at the moment.</p>
      )}

      {endedAuctions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4" style={{ color: '#e8e8e8' }}>Ended ({endedAuctions.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {endedAuctions.map((auction) => (
              <div key={auction.id} onClick={() => setSelectedAuction(auction.id)} className="cursor-pointer">
                <AuctionCard auction={auction} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
