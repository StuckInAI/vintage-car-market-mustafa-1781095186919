import { Link } from 'react-router-dom';
import VCCPLogo from '@/components/VCCPLogo';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a1a2e', borderTop: '2px solid #c9a227' }} className="mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <VCCPLogo size={40} />
              <div>
                <div className="text-xl font-bold" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>VCCP</div>
                <div className="text-xs" style={{ color: '#a0a0a0' }}>VINTAGE CLASSIC CAR PORTAL</div>
              </div>
            </div>
            <p className="text-sm" style={{ color: '#a0a0a0' }}>The premier destination for vintage and classic automobile enthusiasts.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3" style={{ color: '#c9a227' }}>Browse</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#a0a0a0' }}>
              <li><Link to="/browse" className="hover:text-yellow-400">All Listings</Link></li>
              <li><Link to="/browse?make=Ford" className="hover:text-yellow-400">Ford</Link></li>
              <li><Link to="/browse?make=Chevrolet" className="hover:text-yellow-400">Chevrolet</Link></li>
              <li><Link to="/browse?make=Porsche" className="hover:text-yellow-400">Porsche</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3" style={{ color: '#c9a227' }}>Services</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#a0a0a0' }}>
              <li><Link to="/sell" className="hover:text-yellow-400">List Your Car</Link></li>
              <li><Link to="/auction" className="hover:text-yellow-400">Live Auctions</Link></li>
              <li><Link to="/auction/create" className="hover:text-yellow-400">Start Auction</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3" style={{ color: '#c9a227' }}>About</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#a0a0a0' }}>
              <li>Established 2024</li>
              <li>Trusted by collectors</li>
              <li>Worldwide listings</li>
              <li style={{ color: '#c9a227' }}>info@vccp.com</li>
            </ul>
          </div>
        </div>
        <div className="ornament-line my-6"></div>
        <p className="text-center text-sm" style={{ color: '#a0a0a0' }}>© 2024 VCCP — Vintage Classic Car Portal. All rights reserved.</p>
      </div>
    </footer>
  );
}
