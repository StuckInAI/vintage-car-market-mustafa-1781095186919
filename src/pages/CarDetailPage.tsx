import { useParams, Link, useNavigate } from 'react-router-dom';
import { useListings } from '@/context/ListingsContext';
import { formatPrice, formatDate } from '@/lib/utils';
import { MapPin, Gauge, Calendar, Phone, Mail, ArrowLeft, Trash2 } from 'lucide-react';
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
        <p className="text-xl" style={{ color: '#a0a0a0' }}>Listing not found.</p>
        <Link to="/browse" className="mt-4 inline-block" style={{ color: '#c9a227' }}>← Back to Browse</Link>
      </div>
    );
  }

  const canDelete = user?.id === car.sellerId;

  const handleDelete = () => {
    if (confirm('Remove this listing?')) {
      removeListing(car.id);
      navigate('/browse');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/browse" className="inline-flex items-center gap-2 mb-6 text-sm hover:text-yellow-400" style={{ color: '#a0a0a0' }}>
        <ArrowLeft size={16} /> Back to Browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2">
          {/* Image */}
          <div className="rounded-lg overflow-hidden mb-6" style={{ height: '360px', backgroundColor: '#111125' }}>
            {car.images && car.images.length > 0 ? (
              <img src={car.images[0]} alt={`${car.year} ${car.make} ${car.model}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <svg width="120" height="75" viewBox="0 0 100 60" fill="none">
                  <path d="M5 50 L5 30 L20 10 L50 10 L65 20 L90 20 L95 35 L95 50 Z" stroke="#c9a227" strokeWidth="2" fill="none" />
                  <circle cx="22" cy="50" r="7" stroke="#c9a227" strokeWidth="2" fill="none" />
                  <circle cx="75" cy="50" r="7" stroke="#c9a227" strokeWidth="2" fill="none" />
                </svg>
                <span style={{ color: '#555' }}>No Image Available</span>
              </div>
            )}
          </div>

          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#e8e8e8' }}>
                {car.year} {car.make} {car.model}
              </h1>
              {car.trim && <p className="text-lg" style={{ color: '#a0a0a0' }}>{car.trim}</p>}
            </div>
            {canDelete && (
              <button onClick={handleDelete} className="flex items-center gap-1 px-3 py-1 rounded text-sm" style={{ backgroundColor: '#2a0000', border: '1px solid #8b1a1a', color: '#ff6666' }}>
                <Trash2 size={14} /> Remove
              </button>
            )}
          </div>

          <div className="text-3xl font-bold mb-4" style={{ color: '#c9a227' }}>
            {formatPrice(car.price)}
            {car.negotiable && <span className="text-base ml-2" style={{ color: '#a0a0a0' }}>(Negotiable)</span>}
          </div>

          <div className="flex flex-wrap gap-4 mb-6 text-sm" style={{ color: '#a0a0a0' }}>
            <span className="flex items-center gap-1"><Gauge size={14} /> {car.mileage.toLocaleString()} miles</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> {car.year}</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> {car.location}</span>
          </div>

          <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
            <h3 className="font-semibold mb-3" style={{ color: '#c9a227' }}>Specifications</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Condition', car.condition],
                ['Body Style', car.bodyStyle],
                ['Transmission', car.transmission],
                ['Fuel Type', car.fuelType],
                ['Drive Type', car.driveType],
                ['Engine', car.engineSize],
                ['Cylinders', car.cylinders],
                ['Horsepower', car.horsepower ? `${car.horsepower} hp` : 'N/A'],
                ['Exterior Color', car.color],
                ['Interior Color', car.interiorColor || 'N/A'],
                ['Doors', car.doors || 'N/A'],
                ['VIN', car.vin || 'N/A'],
              ].map(([label, value]) => (
                <div key={label}>
                  <span style={{ color: '#a0a0a0' }}>{label}: </span>
                  <span style={{ color: '#e8e8e8' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {car.features && car.features.length > 0 && (
            <div className="rounded-lg p-4 mb-6" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
              <h3 className="font-semibold mb-3" style={{ color: '#c9a227' }}>Features</h3>
              <div className="flex flex-wrap gap-2">
                {car.features.map((f) => (
                  <span key={f} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: 'rgba(201,162,39,0.1)', border: '1px solid rgba(201,162,39,0.3)', color: '#c9a227' }}>{f}</span>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-lg p-4" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
            <h3 className="font-semibold mb-3" style={{ color: '#c9a227' }}>Description</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#e8e8e8' }}>{car.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="rounded-lg p-4 sticky top-24" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.3)' }}>
            <h3 className="font-semibold mb-4" style={{ color: '#c9a227' }}>Seller Information</h3>
            <p className="font-semibold mb-3" style={{ color: '#e8e8e8' }}>{car.sellerName}</p>
            <a href={`tel:${car.sellerContact}`} className="flex items-center gap-2 text-sm mb-3 hover:text-yellow-400" style={{ color: '#a0a0a0' }}>
              <Phone size={14} /> {car.sellerContact}
            </a>
            <a href={`mailto:${car.sellerEmail}`} className="flex items-center gap-2 text-sm mb-6 hover:text-yellow-400" style={{ color: '#a0a0a0' }}>
              <Mail size={14} /> {car.sellerEmail}
            </a>
            <p className="text-xs" style={{ color: '#666' }}>Listed {formatDate(car.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
