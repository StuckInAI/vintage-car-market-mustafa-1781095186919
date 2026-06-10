import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '@/context/ListingsContext';
import { useAuth } from '@/hooks/useAuth';
import type { CarListing, AuctionListing } from '@/types';
import { CAR_MAKES, BODY_STYLES, TRANSMISSIONS, FUEL_TYPES, DRIVE_TYPES, CONDITIONS } from '@/lib/constants';

const inputClass = 'w-full px-3 py-2 rounded text-sm outline-none focus:ring-1';
const inputStyle = { backgroundColor: '#111125', border: '1px solid rgba(201,162,39,0.3)', color: '#e8e8e8' };
const labelStyle = { color: '#a0a0a0' };

export default function SellCarPage() {
  const { addListing, addAuction } = useListings();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [listingType, setListingType] = useState<'sale' | 'auction'>('sale');
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    make: '',
    model: '',
    year: '',
    trim: '',
    vin: '',
    mileage: '',
    condition: 'Good',
    transmission: 'Manual',
    fuelType: 'Gasoline',
    bodyStyle: 'Coupe',
    driveType: 'RWD',
    engineSize: '',
    cylinders: '',
    horsepower: '',
    color: '',
    interiorColor: '',
    doors: '2',
    features: '',
    price: '',
    negotiable: false,
    description: '',
    location: '',
    sellerName: user?.username || '',
    sellerContact: '',
    sellerEmail: user?.email || '',
    // Auction fields
    reservePrice: '',
    startingBid: '',
    auctionDurationHours: '24',
  });

  const update = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const baseId = `${listingType}_${Date.now()}`;
    const features = form.features.split(',').map((f) => f.trim()).filter(Boolean);

    const base = {
      id: baseId,
      make: form.make,
      model: form.model,
      year: Number(form.year),
      trim: form.trim,
      vin: form.vin,
      mileage: Number(form.mileage),
      condition: form.condition,
      transmission: form.transmission,
      fuelType: form.fuelType,
      bodyStyle: form.bodyStyle,
      driveType: form.driveType,
      engineSize: form.engineSize,
      cylinders: form.cylinders,
      horsepower: form.horsepower,
      color: form.color,
      interiorColor: form.interiorColor,
      doors: form.doors,
      features,
      price: Number(form.price),
      negotiable: form.negotiable,
      description: form.description,
      location: form.location,
      sellerName: form.sellerName,
      sellerContact: form.sellerContact,
      sellerEmail: form.sellerEmail,
      images: [] as string[],
      createdAt: Date.now(),
      sellerId: user?.id || 'anonymous',
    };

    if (listingType === 'sale') {
      addListing({ ...base, listingType: 'sale' } as CarListing);
      setSubmitted(true);
      setTimeout(() => navigate('/browse'), 2000);
    } else {
      const auctionEndTime = Date.now() + Number(form.auctionDurationHours) * 3600000;
      addAuction({
        ...base,
        listingType: 'auction',
        reservePrice: Number(form.reservePrice),
        startingBid: Number(form.startingBid),
        currentBid: Number(form.startingBid),
        currentBidder: '',
        currentBidderName: 'No bids yet',
        auctionDurationHours: Number(form.auctionDurationHours),
        auctionEndTime,
        auctionActive: true,
        bids: [],
      } as AuctionListing);
      setSubmitted(true);
      setTimeout(() => navigate('/auction'), 2000);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#e8e8e8' }}>Listing Submitted!</h2>
        <p style={{ color: '#a0a0a0' }}>Redirecting you now...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2" style={{ color: '#e8e8e8', fontFamily: 'Georgia, serif' }}>
        List Your <span style={{ color: '#c9a227' }}>Classic Car</span>
      </h1>
      <p className="text-sm mb-6" style={{ color: '#a0a0a0' }}>Fill in the details below to create your listing.</p>

      {!isAuthenticated && (
        <div className="mb-6 p-4 rounded-lg text-sm" style={{ backgroundColor: '#2a1a0a', border: '1px solid #c9a227', color: '#c9a227' }}>
          You are not signed in. Your listing will be posted as a guest.
        </div>
      )}

      {/* Type Toggle */}
      <div className="flex gap-3 mb-8">
        {(['sale', 'auction'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setListingType(type)}
            className="px-6 py-2 rounded font-semibold text-sm capitalize"
            style={{
              backgroundColor: listingType === type ? '#c9a227' : '#1e1e32',
              color: listingType === type ? '#1a1a2e' : '#a0a0a0',
              border: '1px solid rgba(201,162,39,0.3)',
            }}
          >
            {type === 'sale' ? 'For Sale' : 'Auction'}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Info */}
        <section className="p-4 rounded-lg" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
          <h2 className="font-bold mb-4" style={{ color: '#c9a227' }}>Vehicle Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Make *</label>
              <select required value={form.make} onChange={(e) => update('make', e.target.value)} className={inputClass} style={inputStyle}>
                <option value="">Select Make</option>
                {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Model *</label>
              <input required type="text" value={form.model} onChange={(e) => update('model', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. Mustang" />
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Year *</label>
              <input required type="number" min="1900" max="2000" value={form.year} onChange={(e) => update('year', e.target.value)} className={inputClass} style={inputStyle} placeholder="1967" />
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Trim</label>
              <input type="text" value={form.trim} onChange={(e) => update('trim', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. GT, Z/28" />
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>VIN</label>
              <input type="text" value={form.vin} onChange={(e) => update('vin', e.target.value)} className={inputClass} style={inputStyle} placeholder="Vehicle Identification Number" />
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Mileage *</label>
              <input required type="number" min="0" value={form.mileage} onChange={(e) => update('mileage', e.target.value)} className={inputClass} style={inputStyle} placeholder="45000" />
            </div>
          </div>
        </section>

        {/* Specs */}
        <section className="p-4 rounded-lg" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
          <h2 className="font-bold mb-4" style={{ color: '#c9a227' }}>Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Condition *</label>
              <select required value={form.condition} onChange={(e) => update('condition', e.target.value)} className={inputClass} style={inputStyle}>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Body Style *</label>
              <select required value={form.bodyStyle} onChange={(e) => update('bodyStyle', e.target.value)} className={inputClass} style={inputStyle}>
                {BODY_STYLES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Transmission *</label>
              <select required value={form.transmission} onChange={(e) => update('transmission', e.target.value)} className={inputClass} style={inputStyle}>
                {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Fuel Type *</label>
              <select required value={form.fuelType} onChange={(e) => update('fuelType', e.target.value)} className={inputClass} style={inputStyle}>
                {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Drive Type *</label>
              <select required value={form.driveType} onChange={(e) => update('driveType', e.target.value)} className={inputClass} style={inputStyle}>
                {DRIVE_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Engine Size</label>
              <input type="text" value={form.engineSize} onChange={(e) => update('engineSize', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. 4.7L" />
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Cylinders</label>
              <input type="text" value={form.cylinders} onChange={(e) => update('cylinders', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. V8, Flat-6" />
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Horsepower</label>
              <input type="number" value={form.horsepower} onChange={(e) => update('horsepower', e.target.value)} className={inputClass} style={inputStyle} placeholder="320" />
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Exterior Color</label>
              <input type="text" value={form.color} onChange={(e) => update('color', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. Highland Green" />
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Interior Color</label>
              <input type="text" value={form.interiorColor} onChange={(e) => update('interiorColor', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. Black" />
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Doors</label>
              <input type="number" min="2" max="5" value={form.doors} onChange={(e) => update('doors', e.target.value)} className={inputClass} style={inputStyle} />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="p-4 rounded-lg" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
          <h2 className="font-bold mb-4" style={{ color: '#c9a227' }}>Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>{listingType === 'auction' ? 'Estimated Value ($)' : 'Asking Price ($) *'}</label>
              <input required type="number" min="0" value={form.price} onChange={(e) => update('price', e.target.value)} className={inputClass} style={inputStyle} placeholder="89000" />
            </div>
            {listingType === 'sale' && (
              <div className="flex items-center gap-2">
                <input type="checkbox" id="negotiable" checked={form.negotiable} onChange={(e) => update('negotiable', e.target.checked)} />
                <label htmlFor="negotiable" className="text-sm" style={{ color: '#e8e8e8' }}>Price Negotiable (OBO)</label>
              </div>
            )}
            {listingType === 'auction' && (
              <>
                <div>
                  <label className="block text-xs mb-1" style={labelStyle}>Starting Bid ($) *</label>
                  <input required type="number" min="0" value={form.startingBid} onChange={(e) => update('startingBid', e.target.value)} className={inputClass} style={inputStyle} placeholder="50000" />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={labelStyle}>Reserve Price ($)</label>
                  <input type="number" min="0" value={form.reservePrice} onChange={(e) => update('reservePrice', e.target.value)} className={inputClass} style={inputStyle} placeholder="75000" />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={labelStyle}>Auction Duration (hours)</label>
                  <select value={form.auctionDurationHours} onChange={(e) => update('auctionDurationHours', e.target.value)} className={inputClass} style={inputStyle}>
                    {[6, 12, 24, 48, 72, 168].map((h) => <option key={h} value={h}>{h} hours</option>)}
                  </select>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Details */}
        <section className="p-4 rounded-lg" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
          <h2 className="font-bold mb-4" style={{ color: '#c9a227' }}>Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Description *</label>
              <textarea
                required
                rows={5}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className={inputClass}
                style={inputStyle}
                placeholder="Describe the car's history, condition, modifications, etc."
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Features (comma-separated)</label>
              <input
                type="text"
                value={form.features}
                onChange={(e) => update('features', e.target.value)}
                className={inputClass}
                style={inputStyle}
                placeholder="Power Steering, Dual Exhaust, Bucket Seats"
              />
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Location *</label>
              <input required type="text" value={form.location} onChange={(e) => update('location', e.target.value)} className={inputClass} style={inputStyle} placeholder="City, State" />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="p-4 rounded-lg" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
          <h2 className="font-bold mb-4" style={{ color: '#c9a227' }}>Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Name *</label>
              <input required type="text" value={form.sellerName} onChange={(e) => update('sellerName', e.target.value)} className={inputClass} style={inputStyle} placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Phone</label>
              <input type="tel" value={form.sellerContact} onChange={(e) => update('sellerContact', e.target.value)} className={inputClass} style={inputStyle} placeholder="(555) 555-5555" />
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Email *</label>
              <input required type="email" value={form.sellerEmail} onChange={(e) => update('sellerEmail', e.target.value)} className={inputClass} style={inputStyle} placeholder="you@example.com" />
            </div>
          </div>
        </section>

        <button
          type="submit"
          className="w-full py-3 rounded font-bold text-lg"
          style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
        >
          {listingType === 'sale' ? 'Submit Listing' : 'Start Auction'}
        </button>
      </form>
    </div>
  );
}
