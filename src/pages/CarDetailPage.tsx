import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Gauge, Calendar, Tag, Phone, Mail, ArrowLeft, Trash2 } from 'lucide-react';
import { useListings } from '@/context/ListingsContext';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/lib/utils';

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { listings, removeListing } = useListings();
  const { user } = useAuth();
  const navigate = useNavigate();

  const car = listings.find((c) => c.id === id);

  if (!car) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-lg mb-4" style={{ color: '#a0a0a0' }}>Listing not found.</p>
        <Link to="/browse" style={{ color: '#c9a227' }}>← Back to Browse</Link>
      </div>
    );
  }

  const canDelete = user?.id === car.sellerId || user?.role === 'admin';

  const handleDelete = () => {
    if (confirm('Remove this listing?')) {
      removeListing(car.id);
      navigate('/browse');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <Link to="/browse" className="flex items-center gap-2 text-sm hover:text-yellow-400" style={{ color: '#a0a0a0' }}>
          <ArrowLeft size={16} /> Back to Browse
        </Link>
        {canDelete && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-sm px-3 py-1 rounded border hover:bg-red-900 transition-colors"
            style={{ borderColor: '#8b1a1a', color: '#ff6666' }}
          >
            <Trash2 size={14} /> Remove Listing
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2">
          {/* Image */}
          <div className="rounded-lg overflow-hidden mb-6" style={{ backgroundColor: '#111125', minHeight: '300px', border: '1px solid rgba(201,162,39,0.3)' }}>
            {car.images && car.images.length > 0 ? (
              <img src={car.images[0]} alt={`${car.year} ${car.make} ${car.model}`} className="w-full h-80 object-cover" />
            ) : (
              <div className="w-full h-80 flex flex-col items-center justify-center gap-4">
                <svg width="120" height="75" viewBox="0 0 100 60" fill="none">
                  <path d="M5 50 L5 30 L20 10 L50 10 L65 20 L90 20 L95 35 L95 50 Z" stroke="#c9a227" strokeWidth="2" fill="none" />
                  <circle cx="22" cy="50" r="7" stroke="#c9a227" strokeWidth="2" fill="none" />
                  <circle cx="75" cy="50" r="7" stroke="#c9a227" strokeWidth="2" fill="none" />
                </svg>
                <span style={{ color: '#555' }}>No Images Available</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-1" style={{ color: '#e8e8e8', fontFamily: 'Georgia, serif' }}>
            {car.year} {car.make} {car.model}
          </h1>
          {car.trim && <p className="text-lg mb-4" style={{ color: '#a0a0a0' }}>{car.trim}</p>}

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm" style={{ color: '#a0a0a0' }}>
            <span className="flex items-center gap-1"><Gauge size={14} /> {car.mileage.toLocaleString()} miles</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> {car.year}</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> {car.location}</span>
            <span className="flex items-center gap-1"><Tag size={14} /> {car.condition}</span>
          </div>

          {/* Description */}
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: '#c9a227' }}>Description</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#c8c8c8' }}>{car.description}</p>
          </div>

          {/* Specs */}
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
            <h2 className="text-lg font-bold mb-3" style={{ color: '#c9a227' }}>Specifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              {[
                { label: 'Make', value: car.make },
                { label: 'Model', value: car.model },
                { label: 'Year', value: car.year },
                { label: 'Trim', value: car.trim || 'N/A' },
                { label: 'Body Style', value: car.bodyStyle },
                { label: 'Transmission', value: car.transmission },
                { label: 'Engine', value: `${car.engineSize} ${car.cylinders}` },
                { label: 'Horsepower', value: car.horsepower ? `${car.horsepower} hp` : 'N/A' },
                { label: 'Fuel Type', value: car.fuelType },
                { label: 'Drive Type', value: car.driveType },
                { label: 'Color', value: car.color },
                { label: 'Interior', value: car.interiorColor || 'N/A' },
                { label: 'Mileage', value: `${car.mileage.toLocaleString()} mi` },
                { label: 'VIN', value: car.vin || 'N/A' },
                { label: 'Doors', value: car.doors || 'N/A' },
              ].map((spec) => (
                <div key={spec.label}>
                  <div className="text-xs" style={{ color: '#888' }}>{spec.label}</div>
                  <div style={{ color: '#e8e8e8' }}>{spec.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
              <h2 className="text-lg font-bold mb-3" style={{ color: '#c9a227' }}>Features</h2>
              <div className="flex flex-wrap gap-2">
                {car.features.map((f) => (
                  <span key={f} className="px-3 py-1 rounded-full text-xs" style={{ backgroundColor: 'rgba(201,162,39,0.1)', color: '#c9a227', border: '1px solid rgba(201,162,39,0.3)' }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Price */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.4)' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: '#c9a227' }}>
              {formatPrice(car.price)}
              {car.negotiable && <span className="text-sm ml-2" style={{ color: '#a0a0a0' }}>(OBO)</span>}
            </div>
            <div className="text-sm" style={{ color: '#a0a0a0' }}>{car.condition} Condition</div>
          </div>

          {/* Seller */}
          <div className="p-4 rounded-lg" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
            <h3 className="font-bold mb-3" style={{ color: '#c9a227' }}>Seller Information</h3>
            <div className="space-y-2 text-sm">
              <div style={{ color: '#e8e8e8' }}>{car.sellerName}</div>
              <a href={`tel:${car.sellerContact}`} className="flex items-center gap-2 hover:text-yellow-400" style={{ color: '#a0a0a0' }}>
                <Phone size={14} /> {car.sellerContact}
              </a>
              <a href={`mailto:${car.sellerEmail}`} className="flex items-center gap-2 hover:text-yellow-400" style={{ color: '#a0a0a0' }}>
                <Mail size={14} /> {car.sellerEmail}
              </a>
              <div className="flex items-center gap-2" style={{ color: '#a0a0a0' }}>
                <MapPin size={14} /> {car.location}
              </div>
            </div>
          </div>

          <Link
            to="/browse"
            className="block text-center py-2 rounded text-sm"
            style={{ backgroundColor: 'rgba(201,162,39,0.1)', color: '#c9a227', border: '1px solid rgba(201,162,39,0.3)' }}
          >
            ← Back to Listings
          </Link>
        </div>
      </div>
    </div>
  );
}
