import { Link } from 'react-router-dom';
import { Gavel, Clock, TrendingUp, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { AuctionListing } from '@/types';
import { formatPrice, formatCountdown } from '@/lib/utils';

type AuctionCardProps = { auction: AuctionListing };

export default function AuctionCard({ auction }: AuctionCardProps) {
  const [timeLeft, setTimeLeft] = useState(formatCountdown(auction.auctionEndTime));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(formatCountdown(auction.auctionEndTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [auction.auctionEndTime]);

  const isEnded = Date.now() > auction.auctionEndTime;
  const reserveMet = auction.currentBid >= auction.reservePrice;

  return (
    <Link to={`/auction/${auction.id}`} className="block group">
      <div className="rounded-lg overflow-hidden transition-transform duration-200 group-hover:-translate-y-1" style={{ background: 'linear-gradient(135deg, #1e1e32 0%, #16162a 100%)', border: '1px solid rgba(201,162,39,0.4)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        {/* Header */}
        <div className="px-4 py-2 flex items-center justify-between" style={{ backgroundColor: isEnded ? '#2a0000' : '#1a2a1a', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
          <div className="flex items-center gap-2">
            <Gavel size={14} style={{ color: '#c9a227' }} />
            <span className="text-xs font-semibold" style={{ color: '#c9a227' }}>LIVE AUCTION</span>
          </div>
          <div className={`flex items-center gap-1 text-xs font-bold ${isEnded ? '' : 'auction-pulse'}`} style={{ color: isEnded ? '#ff4444' : '#44ff44' }}>
            <Clock size={12} />
            {isEnded ? 'ENDED' : timeLeft}
          </div>
        </div>

        {/* Image */}
        <div className="relative" style={{ height: '180px', backgroundColor: '#111125' }}>
          {auction.images && auction.images.length > 0 ? (
            <img src={auction.images[0]} alt={`${auction.year} ${auction.make} ${auction.model}`} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <svg width="80" height="50" viewBox="0 0 100 60" fill="none">
                <path d="M5 50 L5 30 L20 10 L50 10 L65 20 L90 20 L95 35 L95 50 Z" stroke="#c9a227" strokeWidth="2" fill="none" />
                <circle cx="22" cy="50" r="7" stroke="#c9a227" strokeWidth="2" fill="none" />
                <circle cx="75" cy="50" r="7" stroke="#c9a227" strokeWidth="2" fill="none" />
              </svg>
              <span className="text-xs" style={{ color: '#555' }}>No Image</span>
            </div>
          )}
          {reserveMet && (
            <div className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: '#1a5c1a', color: '#44ff44', border: '1px solid #44ff44' }}>
              RESERVE MET
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-base font-bold mb-1" style={{ color: '#e8e8e8' }}>
            {auction.year} {auction.make} {auction.model}
          </h3>
          <div className="flex items-center gap-1 text-xs mb-3" style={{ color: '#a0a0a0' }}>
            <MapPin size={11} /> {auction.location}
          </div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs mb-1" style={{ color: '#a0a0a0' }}>Current Bid</div>
              <div className="text-xl font-bold flex items-center gap-1" style={{ color: '#c9a227' }}>
                <TrendingUp size={16} /> {formatPrice(auction.currentBid)}
              </div>
              <div className="text-xs mt-1" style={{ color: '#888' }}>{auction.bids.length} bids · {auction.currentBidderName}</div>
            </div>
            <div className="text-right">
              <div className="text-xs" style={{ color: '#a0a0a0' }}>Starting Bid</div>
              <div className="text-sm" style={{ color: '#888' }}>{formatPrice(auction.startingBid)}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
