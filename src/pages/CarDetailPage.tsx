import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Gauge, Calendar, Tag, CheckCircle2, ChevronLeft } from 'lucide-react';
import { useListings } from '@/context/ListingsContext';
import { formatPrice } from '@/lib/utils';

export default function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { listings } = useListings();
  const car = listings.find((c) => c.id === id);

  if (!car) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4" style={{ color: '#c9a227' }}>Listing Not Found</h2>
        <Link to="/browse" className="text-sm" style={{ color: '#a0a0a0' }}><ChevronLeft size={14} className="inline" /> Back to Browse</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link to="/browse" className="flex items-center gap-1 text-sm mb-6 hover:text-yellow-400" style={{ color: '#a0a0a0' }}>
        <ChevronLeft size={14} /> Back to Browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images & Details */}
        <div className="lg:col-span-2">
          {/* Image */}
          <div className="rounded-lg overflow-hidden mb-6" style={{ height: '400px', backgroundColor: '#111125', border: '1px solid rgba(201,162,39,0.3)' }}>
            {car.images && car.images.length > 0 ? (
              <img src={car.images[0]} alt={`${car.year} ${car.make} ${car.model}`} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <svg width="150" height="90" viewBox="0 0 200 120" fill="none">
                  <path d="M10 100 L10 60 L40 20 L100 20 L130 40 L180 40 L190 70 L190 100 Z" stroke="#c9a227" strokeWidth="3" fill="none" />
                  <circle cx="45" cy="100" r="15" stroke="#c9a227" strokeWidth="3" fill="none" />
                  <circle cx="155" cy="100" r="15" stroke="#c9a227" strokeWidth="3" fill="none" />
                </svg>
                <p className="mt-4 text-sm" style={{ color: '#555' }}>No Images Available</p>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-1" style={{ color: '#e8e8e8', fontFamily: 'Georgia, serif' }}>
            {car.year} {car.make} {car.model}
          </h1>
          {car.trim && <p className="text-lg mb-4" style={{ color: '#c9a227' }}>{car.trim}</p>}

          <div className="ornament-line mb-6"></div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Mileage', value: `${car.mileage.toLocaleString()} mi` },
              { label: 'Condition', value: car.condition },
              { label: 'Year', value: car.year.toString() },
              { label: 'Location', value: car.location },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 rounded" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
                <div className="text-sm font-bold" style={{ color: '#c9a227' }}>{s.value}</div>
                <div className="text-xs mt-1" style={{ color: '#888' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mb-6 p-4 rounded" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
            <h3 className="font-bold mb-3" style={{ color: '#c9a227' }}>Description</h3>
            <p className="text-sm leading-relaxed" style={{ color: '#e8e8e8' }}>{car.description}</p>
          </div>

          {/* Specs */}
          <div className="mb-6 p-4 rounded" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
            <h3 className="font-bold mb-4" style={{ color: '#c9a227' }}>Vehicle Specifications</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'Body Style', value: car.bodyStyle },
                { label: 'Engine', value: `${car.engineSize} ${car.cylinders}` },
                { label: 'Horsepower', value: car.horsepower ? `${car.horsepower} hp` : 'N/A' },
                { label: 'Transmission', value: car.transmission },
                { label: 'Drive Type', value: car.driveType },
                { label: 'Fuel Type', value: car.fuelType },
                { label: 'Doors', value: car.doors },
                { label: 'Ext. Color', value: car.color },
                { label: 'Int. Color', value: car.interiorColor },
                { label: 'VIN', value: car.vin || 'N/A' },
              ].map((spec) => (
                <div key={spec.label} className="p-2 rounded" style={{ backgroundColor: '#111125' }}>
                  <div className="text-xs" style={{ color: '#888' }}>{spec.label}</div>
                  <div className="text-sm font-semibold mt-1" style={{ color: '#e8e8e8' }}>{spec.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div className="p-4 rounded" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
              <h3 className="font-bold mb-4" style={{ color: '#c9a227' }}>Features & Options</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {car.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm" style={{ color: '#e8e8e8' }}>
                    <CheckCircle2 size={14} style={{ color: '#c9a227', flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Price & Contact */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg p-6" style={{ backgroundColor: '#1e1e32', border: '2px solid #c9a227' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: '#c9a227' }}>
              {formatPrice(car.price)}
            </div>
            {car.negotiable && <div className="text-sm mb-4" style={{ color: '#a0a0a0' }}>Price negotiable</div>}

            <div className="ornament-line mb-4"></div>

            <h4 className="font-bold mb-3" style={{ color: '#e8e8e8' }}>Seller Information</h4>
            <div className="space-y-2 mb-4">
              <div className="text-sm font-semibold" style={{ color: '#c9a227' }}>{car.sellerName}</div>
              <div className="flex items-center gap-2 text-sm" style={{ color: '#a0a0a0' }}>
                <MapPin size={13} /> {car.location}
              </div>
              {car.sellerContact && (
                <div className="flex items-center gap-2 text-sm" style={{ color: '#a0a0a0' }}>
                  <Phone size={13} /> {car.sellerContact}
                </div>
              )}
              {car.sellerEmail && (
                <div className="flex items-center gap-2 text-sm" style={{ color: '#a0a0a0' }}>
                  <Mail size={13} /> {car.sellerEmail}
                </div>
              )}
            </div>

            <a
              href={`mailto:${car.sellerEmail}`}
              className="block w-full text-center py-3 rounded font-bold mb-3 transition-colors"
              style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
            >
              Contact Seller
            </a>
            <a
              href={`tel:${car.sellerContact}`}
              className="block w-full text-center py-3 rounded font-bold transition-colors"
              style={{ border: '2px solid #c9a227', color: '#c9a227' }}
            >
              Call Seller
            </a>

            <div className="ornament-line my-4"></div>

            <div className="text-xs" style={{ color: '#888' }}>
              <p>Listed: {new Date(car.createdAt).toLocaleDateString()}</p>
              {car.vin && <p className="mt-1">VIN: {car.vin}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
