import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useListings } from '@/context/ListingsContext';
import { useAuth } from '@/hooks/useAuth';
import { generateId } from '@/lib/utils';
import type { CarListing, AuctionListing } from '@/types';
import { CAR_MAKES, BODY_STYLES, TRANSMISSIONS, FUEL_TYPES, DRIVE_TYPES, CONDITIONS } from '@/lib/constants';

export default function SellCarPage() {
  const navigate = useNavigate();
  const { addListing, addAuction } = useListings();
  const { user } = useAuth();
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
    price: '',
    negotiable: false,
    description: '',
    location: '',
    sellerName: user?.username || '',
    sellerContact: '',
    sellerEmail: user?.email || '',
    features: '',
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
    const base = {
      id: generateId(listingType === 'auction' ? 'auction' : 'car'),
      listingType: listingType as 'sale',
      make: form.make,
      model: form.model,
      year: parseInt(form.year) || 1960,
      trim: form.trim,
      vin: form.vin,
      mileage: parseInt(form.mileage) || 0,
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
      features: form.features.split(',').map((f) => f.trim()).filter(Boolean),
      price: parseInt(form.price) || 0,
      negotiable: form.negotiable,
      description: form.description,
      location: form.location,
      sellerName: form.sellerName,
      sellerContact: form.sellerContact,
      sellerEmail: form.sellerEmail,
      images: [],
      createdAt: Date.now(),
      sellerId: user?.id || 'anonymous',
    };

    if (listingType === 'auction') {
      const auction: AuctionListing = {
        ...base,
        listingType: 'auction',
        reservePrice: parseInt(form.reservePrice) || 0,
        startingBid: parseInt(form.startingBid) || 0,
        currentBid: parseInt(form.startingBid) || 0,
        currentBidder: '',
        currentBidderName: 'No bids yet',
        auctionDurationHours: parseInt(form.auctionDurationHours) || 24,
        auctionEndTime: Date.now() + (parseInt(form.auctionDurationHours) || 24) * 3600000,
        auctionActive: true,
        bids: [],
      };
      addAuction(auction);
      setSubmitted(true);
      setTimeout(() => navigate('/auction'), 1500);
    } else {
      const listing: CarListing = { ...base, listingType: 'sale' };
      addListing(listing);
      setSubmitted(true);
      setTimeout(() => navigate('/browse'), 1500);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#c9a227' }}>Listing Submitted!</h2>
        <p style={{ color: '#a0a0a0' }}>Redirecting you now...</p>
      </div>
    );
  }

  const inputClass = 'w-full px-3 py-2 rounded text-sm outline-none';
  const inputStyle = { backgroundColor: '#111125', border: '1px solid rgba(201,162,39,0.3)', color: '#e8e8e8' };
  const labelStyle = { color: '#a0a0a0', fontSize: '0.75rem', display: 'block', marginBottom: '4px' };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>List Your Car</h1>
      <p className="mb-6 text-sm" style={{ color: '#a0a0a0' }}>Fill out the form below to list your vehicle on VCCP.</p>

      {/* Listing Type Toggle */}
      <div className="flex gap-3 mb-6">
        <button
          type="button"
          onClick={() => setListingType('sale')}
          className="px-6 py-2 rounded font-semibold text-sm transition-colors"
          style={listingType === 'sale' ? { backgroundColor: '#c9a227', color: '#1a1a2e' } : { border: '1px solid rgba(201,162,39,0.4)', color: '#c9a227' }}
        >
          For Sale
        </button>
        <button
          type="button"
          onClick={() => setListingType('auction')}
          className="px-6 py-2 rounded font-semibold text-sm transition-colors"
          style={listingType === 'auction' ? { backgroundColor: '#c9a227', color: '#1a1a2e' } : { border: '1px solid rgba(201,162,39,0.4)', color: '#c9a227' }}
        >
          Auction
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-lg p-5" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#c9a227' }}>Vehicle Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Make *</label>
              <select value={form.make} onChange={(e) => update('make', e.target.value)} className={inputClass} style={inputStyle} required>
                <option value="">Select Make</option>
                {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Model *</label>
              <input type="text" value={form.model} onChange={(e) => update('model', e.target.value)} className={inputClass} style={inputStyle} required placeholder="e.g. Mustang" />
            </div>
            <div>
              <label style={labelStyle}>Year *</label>
              <input type="number" value={form.year} onChange={(e) => update('year', e.target.value)} className={inputClass} style={inputStyle} required placeholder="e.g. 1967" min="1900" max="2000" />
            </div>
            <div>
              <label style={labelStyle}>Trim</label>
              <input type="text" value={form.trim} onChange={(e) => update('trim', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. Fastback" />
            </div>
            <div>
              <label style={labelStyle}>VIN</label>
              <input type="text" value={form.vin} onChange={(e) => update('vin', e.target.value)} className={inputClass} style={inputStyle} placeholder="Vehicle ID Number" />
            </div>
            <div>
              <label style={labelStyle}>Mileage *</label>
              <input type="number" value={form.mileage} onChange={(e) => update('mileage', e.target.value)} className={inputClass} style={inputStyle} required placeholder="e.g. 45000" />
            </div>
          </div>
        </div>

        <div className="rounded-lg p-5" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#c9a227' }}>Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Condition</label>
              <select value={form.condition} onChange={(e) => update('condition', e.target.value)} className={inputClass} style={inputStyle}>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Body Style</label>
              <select value={form.bodyStyle} onChange={(e) => update('bodyStyle', e.target.value)} className={inputClass} style={inputStyle}>
                {BODY_STYLES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Transmission</label>
              <select value={form.transmission} onChange={(e) => update('transmission', e.target.value)} className={inputClass} style={inputStyle}>
                {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Fuel Type</label>
              <select value={form.fuelType} onChange={(e) => update('fuelType', e.target.value)} className={inputClass} style={inputStyle}>
                {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Drive Type</label>
              <select value={form.driveType} onChange={(e) => update('driveType', e.target.value)} className={inputClass} style={inputStyle}>
                {DRIVE_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Engine Size</label>
              <input type="text" value={form.engineSize} onChange={(e) => update('engineSize', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. 4.7L" />
            </div>
            <div>
              <label style={labelStyle}>Cylinders</label>
              <input type="text" value={form.cylinders} onChange={(e) => update('cylinders', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. V8" />
            </div>
            <div>
              <label style={labelStyle}>Horsepower</label>
              <input type="text" value={form.horsepower} onChange={(e) => update('horsepower', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. 320" />
            </div>
            <div>
              <label style={labelStyle}>Exterior Color</label>
              <input type="text" value={form.color} onChange={(e) => update('color', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. Highland Green" />
            </div>
            <div>
              <label style={labelStyle}>Interior Color</label>
              <input type="text" value={form.interiorColor} onChange={(e) => update('interiorColor', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. Black" />
            </div>
          </div>
        </div>

        <div className="rounded-lg p-5" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#c9a227' }}>Pricing & Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {listingType === 'sale' ? (
              <>
                <div>
                  <label style={labelStyle}>Asking Price ($) *</label>
                  <input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} className={inputClass} style={inputStyle} required placeholder="e.g. 89000" />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input type="checkbox" id="negotiable" checked={form.negotiable} onChange={(e) => update('negotiable', e.target.checked)} />
                  <label htmlFor="negotiable" style={{ color: '#e8e8e8', fontSize: '0.875rem' }}>Price Negotiable</label>
                </div>
              </>
            ) : (
              <>
                <div>
                  <label style={labelStyle}>Starting Bid ($) *</label>
                  <input type="number" value={form.startingBid} onChange={(e) => update('startingBid', e.target.value)} className={inputClass} style={inputStyle} required placeholder="e.g. 50000" />
                </div>
                <div>
                  <label style={labelStyle}>Reserve Price ($)</label>
                  <input type="number" value={form.reservePrice} onChange={(e) => update('reservePrice', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. 80000" />
                </div>
                <div>
                  <label style={labelStyle}>Auction Duration (hours)</label>
                  <select value={form.auctionDurationHours} onChange={(e) => update('auctionDurationHours', e.target.value)} className={inputClass} style={inputStyle}>
                    <option value="24">24 hours</option>
                    <option value="48">48 hours</option>
                    <option value="72">72 hours</option>
                    <option value="168">7 days</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Buy It Now Price ($)</label>
                  <input type="number" value={form.price} onChange={(e) => update('price', e.target.value)} className={inputClass} style={inputStyle} placeholder="Optional" />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="rounded-lg p-5" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#c9a227' }}>Additional Information</h3>
          <div className="space-y-4">
            <div>
              <label style={labelStyle}>Location *</label>
              <input type="text" value={form.location} onChange={(e) => update('location', e.target.value)} className={inputClass} style={inputStyle} required placeholder="e.g. Los Angeles, CA" />
            </div>
            <div>
              <label style={labelStyle}>Features (comma-separated)</label>
              <input type="text" value={form.features} onChange={(e) => update('features', e.target.value)} className={inputClass} style={inputStyle} placeholder="e.g. Power Steering, AC, Bucket Seats" />
            </div>
            <div>
              <label style={labelStyle}>Description *</label>
              <textarea
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className={inputClass}
                style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                required
                placeholder="Describe your vehicle in detail..."
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg p-5" style={{ backgroundColor: '#1e1e32', border: '1px solid rgba(201,162,39,0.2)' }}>
          <h3 className="font-semibold mb-4" style={{ color: '#c9a227' }}>Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Your Name *</label>
              <input type="text" value={form.sellerName} onChange={(e) => update('sellerName', e.target.value)} className={inputClass} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input type="tel" value={form.sellerContact} onChange={(e) => update('sellerContact', e.target.value)} className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input type="email" value={form.sellerEmail} onChange={(e) => update('sellerEmail', e.target.value)} className={inputClass} style={inputStyle} required />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded font-bold text-base tracking-wide"
          style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
        >
          {listingType === 'auction' ? 'Start Auction' : 'List My Car'}
        </button>
      </form>
    </div>
  );
}
