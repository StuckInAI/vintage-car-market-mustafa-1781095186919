import { useListings } from '@/context/ListingsContext';
import AuctionCard from '@/components/AuctionCard';
import { Gavel } from 'lucide-react';

export default function AuctionPage() {
  const { auctions } = useListings();

  const now = Date.now();
  const liveAuctions = auctions.filter(a => a.auctionActive && now < a.auctionEndTime);
  const upcomingAuctions = auctions.filter(a => a.auctionActive && now >= a.auctionEndTime - 3600000 * 24 && now < a.auctionEndTime);
  const endedAuctions = auctions.filter(a => !a.auctionActive || now >= a.auctionEndTime);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>
          <Gavel size={28} /> Live Auctions
        </h1>
        <p className="text-sm mt-1" style={{ color: '#a0a0a0' }}>Bid on exceptional vintage automobiles in real time.</p>
        <div className="ornament-line mt-3"></div>
      </div>

      {liveAuctions.length === 0 && (
        <div className="text-center py-16" style={{ color: '#a0a0a0' }}>
          <p className="text-xl mb-2">No live auctions at this time.</p>
          <p className="text-sm">Check back soon or <a href="/sell" style={{ color: '#c9a227' }}>start your own auction</a>.</p>
        </div>
      )}

      {liveAuctions.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#e8e8e8' }}>Active Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveAuctions.map((a) => <AuctionCard key={a.id} auction={a} />)}
          </div>
        </section>
      )}

      {endedAuctions.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4" style={{ color: '#e8e8e8' }}>Ended Auctions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {endedAuctions.map((a) => <AuctionCard key={a.id} auction={a} />)}
          </div>
        </section>
      )}
    </div>
  );
}
