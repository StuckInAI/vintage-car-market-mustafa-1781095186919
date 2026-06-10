import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Gauge, Phone, Mail, Calendar, Tag, Share2 } from 'lucide-react';
import { useListings } from '@/context/ListingsContext';
import { formatPrice } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { listings, removeListing } = useListings();
  const { user } = useAuth();
  const navigate = useNavigate();

  const car = listings.find((c) => c.id === id);

  if (!car) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-xl mb-4" style={{ color: '#a0a0a0' }}>Listing not found.</p>
        <Link to="/browse" style={{ color: '#c9a227' }}>← Back to Browse</Link>
      </div>
    );
  }

  const isOwner = user?.id === car.sellerId;

  const handleDelete = () => {
    if (confirm('Are you sure you want to remove this listing?')) {
      removeListing(car.id);
      navigate('/browse');
    }
  };

  const mainImage = car.images && car.images.length > 0 ? car.images[0] : null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link to="/browse" className="flex items-center gap-2 text-sm hover:text-yellow-400 transition-colors" style={{ color: '#a0a0a0' }}>
          <ArrowLeft size={16} /> Back to Browse
        </Link>
        <div className="flex gap-2">
          {isOwner && (
            <button onClick={handleDelete} className="px-3 py-1 rounded text-sm" style={{ backgroundColor: '#8b1a1a', color: '#e8e8e8' }}>Remove Listing</button>
          )}
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="flex items-center gap-1 px-3 py-1 rounded text-sm"
            style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)', color: '#c9a227' }}
          >
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Image + Specs */}
        <div className="lg:col-span-2">
          {/* Main Image */}
          <div className="rounded-lg overflow-hidden mb-4" style={{ height: '350px', backgroundColor: '#111125' }}>
            {mainImage ? (
              <img src={mainImage} alt={`${car.year} ${car.make} ${car.model}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <svg width="120" height="75" viewBox="0 0 100 60" fill="none">
                  <path d="M5 50 L5 30 L20 10 L50 10 L65 20 L90 20 L95 35 L95 50 Z" stroke="#c9a227" strokeWidth="2" fill="none" />
                  <circle cx="22" cy="50" r="7" stroke="#c9a227" strokeWidth="2" fill="none" />
                  <circle cx="75" cy="50" r="7" stroke="#c9a227" strokeWidth="2" fill="none" />
                </svg>
                <span style={{ color: '#555' }}>No Images Available</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#e8e8e8', fontFamily: 'Georgia, serif' }}>
            {car.year} {car.make} {car.model} {car.trim}
          </h1>
          <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: '#a0a0a0' }}>
            <MapPin size={14} /> {car.location}
            <span>·</span>
            <Tag size={14} /> {car.condition}
          </div>

          {/* Specs Grid */}
          <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)' }}>
            <h2 className="font-bold mb-3 text-sm" style={{ color: '#c9a227' }}>VEHICLE SPECIFICATIONS</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              {[
                ['Make', car.make],
                ['Model', car.model],
                ['Year', String(car.year)],
                ['Mileage', `${car.mileage.toLocaleString()} mi`],
                ['Engine', `${car.engineSize} ${car.cylinders}`],
                ['Horsepower', car.horsepower ? `${car.horsepower} hp` : 'N/A'],
                ['Transmission', car.transmission],
                ['Fuel Type', car.fuelType],
                ['Drive Type', car.driveType],
                ['Body Style', car.bodyStyle],
                ['Color', car.color],
                ['Interior', car.interiorColor || 'N/A'],
                ['Doors', car.doors || 'N/A'],
                ['VIN', car.vin || 'N/A'],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="text-xs mb-1" style={{ color: '#888' }}>{label}</div>
                  <div style={{ color: '#e8e8e8' }}>{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          {car.features.length > 0 && (
            <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)' }}>
              <h2 className="font-bold mb-3 text-sm" style={{ color: '#c9a227' }}>FEATURES & OPTIONS</h2>
              <div className="flex flex-wrap gap-2">
                {car.features.map((f) => (
                  <span key={f} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(201,162,39,0.1)', color: '#c9a227', border: '1px solid rgba(201,162,39,0.3)' }}>{f}</span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="rounded-lg p-4" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)' }}>
            <h2 className="font-bold mb-3 text-sm" style={{ color: '#c9a227' }}>SELLER DESCRIPTION</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#d0d0d0' }}>{car.description}</p>
          </div>
        </div>

        {/* Right: Price + Contact */}
        <div>
          <div className="rounded-lg p-5 sticky top-24" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.5)' }}>
            <div className="mb-4">
              <div className="text-3xl font-bold" style={{ color: '#c9a227' }}>{formatPrice(car.price)}</div>
              {car.negotiable && <div className="text-sm mt-1" style={{ color: '#a0a0a0' }}>Price negotiable (OBO)</div>}
            </div>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex items-center gap-2" style={{ color: '#e8e8e8' }}>
                <Calendar size={14} style={{ color: '#c9a227' }} /> Listed {new Date(car.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2" style={{ color: '#e8e8e8' }}>
                <Gauge size={14} style={{ color: '#c9a227' }} /> {car.mileage.toLocaleString()} miles
              </div>
            </div>

            <div className="border-t pt-4" style={{ borderColor: 'rgba(201,162,39,0.3)' }}>
              <div className="font-semibold mb-3" style={{ color: '#c9a227' }}>{car.sellerName}</div>
              <a href={`tel:${car.sellerContact}`} className="flex items-center gap-2 mb-2 text-sm hover:text-yellow-400 transition-colors" style={{ color: '#e8e8e8' }}>
                <Phone size={14} /> {car.sellerContact}
              </a>
              <a href={`mailto:${car.sellerEmail}`} className="flex items-center gap-2 text-sm hover:text-yellow-400 transition-colors" style={{ color: '#e8e8e8' }}>
                <Mail size={14} /> {car.sellerEmail}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
