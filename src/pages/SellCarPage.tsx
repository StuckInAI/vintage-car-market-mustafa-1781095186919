import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, X, Gavel, Car } from 'lucide-react';
import { useListings } from '@/context/ListingsContext';
import { useAuth } from '@/hooks/useAuth';
import type { CarListing, AuctionListing } from '@/types';
import {
  CAR_MAKES, BODY_STYLES, TRANSMISSIONS, FUEL_TYPES,
  DRIVE_TYPES, CONDITIONS, CYLINDER_OPTIONS, DOOR_OPTIONS,
  EXTERIOR_COLORS, INTERIOR_COLORS, CAR_FEATURES, AUCTION_DURATIONS
} from '@/lib/constants';
import { generateId } from '@/lib/utils';

type ListingMode = 'sale' | 'auction';

export default function SellCarPage() {
  const navigate = useNavigate();
  const { addListing, addAuction } = useListings();
  const { user } = useAuth();
  const [mode, setMode] = useState<ListingMode>('sale');
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear().toString(),
    trim: '',
    vin: '',
    mileage: '',
    condition: 'Good',
    transmission: 'Manual',
    fuelType: 'Gasoline',
    bodyStyle: 'Coupe',
    driveType: 'RWD',
    engineSize: '',
    cylinders: 'V8',
    horsepower: '',
    color: '',
    interiorColor: '',
    doors: '2',
    features: [] as string[],
    price: '',
    negotiable: false,
    description: '',
    location: '',
    sellerName: user?.username || '',
    sellerContact: '',
    sellerEmail: user?.email || '',
    images: [] as string[],
    // Auction fields
    reservePrice: '',
    startingBid: '',
    auctionDurationHours: 24,
  });

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFeature = (feature: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleSubmit = () => {
    const baseData: CarListing = {
      id: generateId('car'),
      listingType: mode,
      make: form.make,
      model: form.model,
      year: parseInt(form.year),
      trim: form.trim || undefined,
      vin: form.vin || undefined,
      mileage: parseInt(form.mileage) || 0,
      condition: form.condition,
      transmission: form.transmission,
      fuelType: form.fuelType,
      bodyStyle: form.bodyStyle,
      driveType: form.driveType,
      engineSize: form.engineSize,
      cylinders: form.cylinders,
      horsepower: form.horsepower || undefined,
      color: form.color,
      interiorColor: form.interiorColor,
      doors: form.doors,
      features: form.features,
      price: parseInt(form.price) || 0,
      negotiable: form.negotiable,
      description: form.description,
      location: form.location,
      sellerName: form.sellerName,
      sellerContact: form.sellerContact,
      sellerEmail: form.sellerEmail,
      images: form.images,
      createdAt: Date.now(),
      sellerId: user?.id || 'anonymous',
    };

    if (mode === 'sale') {
      addListing(baseData);
    } else {
      const startingBid = parseInt(form.startingBid) || parseInt(form.price) || 0;
      const auctionData: AuctionListing = {
        ...baseData,
        reservePrice: parseInt(form.reservePrice) || startingBid,
        startingBid,
        currentBid: startingBid,
        currentBidder: '',
        currentBidderName: 'No bids yet',
        auctionDurationHours: form.auctionDurationHours,
        auctionEndTime: Date.now() + form.auctionDurationHours * 3600000,
        auctionActive: true,
        bids: [],
      };
      addAuction(auctionData);
    }

    setSubmitted(true);
  };

  const inputClass = 'w-full px-3 py-2 rounded text-sm outline-none focus:ring-1';
  const inputStyle = { backgroundColor: '#111125', border: '1px solid rgba(201,162,39,0.3)', color: '#e8e8e8' };
  const labelStyle = { color: '#a0a0a0' };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-bold mb-4" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>
          {mode === 'sale' ? 'Listing Submitted!' : 'Auction Created!'}
        </h2>
        <p className="mb-8" style={{ color: '#a0a0a0' }}>
          Your {form.year} {form.make} {form.model} has been {mode === 'sale' ? 'listed for sale' : 'listed for auction'}.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate(mode === 'sale' ? '/browse' : '/auction')}
            className="px-6 py-3 rounded font-bold"
            style={{ backgroundColor: '#c9a227', color: '#1a1a2e' }}
          >
            View Listings
          </button>
          <button
            onClick={() => { setSubmitted(false); setStep(1); setForm((prev) => ({ ...prev, make: '', model: '', year: new Date().getFullYear().toString() })); }}
            className="px-6 py-3 rounded font-bold"
            style={{ border: '2px solid #c9a227', color: '#c9a227' }}
          >
            List Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2" style={{ color: '#c9a227', fontFamily: 'Georgia, serif' }}>List Your Classic Car</h1>
      <p className="text-sm mb-6" style={{ color: '#a0a0a0' }}>Fill in the details below to list your vintage automobile.</p>
      <div className="ornament-line mb-8"></div>

      {/* Mode Toggle */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setMode('sale')}
          className="flex-1 py-3 rounded font-bold flex items-center justify-center gap-2"
          style={{
            backgroundColor: mode === 'sale' ? '#c9a227' : '#1e1e32',
            color: mode === 'sale' ? '#1a1a2e' : '#e8e8e8',
            border: '2px solid ' + (mode === 'sale' ? '#c9a227' : 'rgba(201,162,39,0.3)'),
          }}
        >
          <Car size={18} /> List for Sale
        </button>
        <button
          onClick={() => setMode('auction')}
          className="flex-1 py-3 rounded font-bold flex items-center justify-center gap-2"
          style={{
            backgroundColor: mode === 'auction' ? '#c9a227' : '#1e1e32',
            color: mode === 'auction' ? '#1a1a2e' : '#e8e8e8',
            border: '2px solid ' + (mode === 'auction' ? '#c9a227' : 'rgba(201,162,39,0.3)'),
          }}
        >
          <Gavel size={18} /> Create Auction
        </button>
      </div>

      {/* Steps */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className="flex-1 h-2 rounded-full transition-all"
            style={{ backgroundColor: step >= s ? '#c9a227' : 'rgba(201,162,39,0.2)' }}
          />
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#e8e8e8' }}>Vehicle Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Make *</label>
              <select value={form.make} onChange={(e: any) => update('make', e.target.value)} className={inputClass} style={inputStyle}>
                <option value="">Select Make</option>
                {CAR_MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Model *</label>
              <input type="text" value={form.model} onChange={(e: any) => update('model', e.target.value)} placeholder="e.g. Mustang" className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Year *</label>
              <input type="number" value={form.year} onChange={(e: any) => update('year', e.target.value)} min="1900" max="1990" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Trim / Variant</label>
              <input type="text" value={form.trim} onChange={(e: any) => update('trim', e.target.value)} placeholder="e.g. GT, Z/28" className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>VIN</label>
              <input type="text" value={form.vin} onChange={(e: any) => update('vin', e.target.value)} placeholder="Vehicle ID Number" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Mileage *</label>
              <input type="number" value={form.mileage} onChange={(e: any) => update('mileage', e.target.value)} placeholder="e.g. 45000" className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1" style={labelStyle}>Condition *</label>
            <select value={form.condition} onChange={(e: any) => update('condition', e.target.value)} className={inputClass} style={inputStyle}>
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Location *</label>
              <input type="text" value={form.location} onChange={(e: any) => update('location', e.target.value)} placeholder="City, State" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Body Style</label>
              <select value={form.bodyStyle} onChange={(e: any) => update('bodyStyle', e.target.value)} className={inputClass} style={inputStyle}>
                {BODY_STYLES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Engine & Specs */}
      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#e8e8e8' }}>Engine & Specifications</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Engine Size</label>
              <input type="text" value={form.engineSize} onChange={(e: any) => update('engineSize', e.target.value)} placeholder="e.g. 4.7L" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Cylinders</label>
              <select value={form.cylinders} onChange={(e: any) => update('cylinders', e.target.value)} className={inputClass} style={inputStyle}>
                {CYLINDER_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Transmission</label>
              <select value={form.transmission} onChange={(e: any) => update('transmission', e.target.value)} className={inputClass} style={inputStyle}>
                {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Drive Type</label>
              <select value={form.driveType} onChange={(e: any) => update('driveType', e.target.value)} className={inputClass} style={inputStyle}>
                {DRIVE_TYPES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Fuel Type</label>
              <select value={form.fuelType} onChange={(e: any) => update('fuelType', e.target.value)} className={inputClass} style={inputStyle}>
                {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Horsepower</label>
              <input type="text" value={form.horsepower} onChange={(e: any) => update('horsepower', e.target.value)} placeholder="e.g. 320" className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Doors</label>
              <select value={form.doors} onChange={(e: any) => update('doors', e.target.value)} className={inputClass} style={inputStyle}>
                {DOOR_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Exterior Color</label>
              <select value={form.color} onChange={(e: any) => update('color', e.target.value)} className={inputClass} style={inputStyle}>
                <option value="">Select Color</option>
                {EXTERIOR_COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs mb-1" style={labelStyle}>Interior Color</label>
            <select value={form.interiorColor} onChange={(e: any) => update('interiorColor', e.target.value)} className={inputClass} style={inputStyle}>
              <option value="">Select Interior Color</option>
              {INTERIOR_COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Step 3: Price, Description & Features */}
      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#e8e8e8' }}>Pricing & Description</h2>

          {mode === 'sale' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs mb-1" style={labelStyle}>Asking Price ($) *</label>
                <input type="number" value={form.price} onChange={(e: any) => update('price', e.target.value)} placeholder="e.g. 45000" className={inputClass} style={inputStyle} />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <input type="checkbox" id="negotiable" checked={form.negotiable} onChange={(e: any) => update('negotiable', e.target.checked)} className="w-4 h-4" style={{ accentColor: '#c9a227' }} />
                <label htmlFor="negotiable" className="text-sm" style={{ color: '#e8e8e8' }}>Price is negotiable</label>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs mb-1" style={labelStyle}>Starting Bid ($) *</label>
                  <input type="number" value={form.startingBid} onChange={(e: any) => update('startingBid', e.target.value)} placeholder="e.g. 50000" className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={labelStyle}>Reserve Price ($)</label>
                  <input type="number" value={form.reservePrice} onChange={(e: any) => update('reservePrice', e.target.value)} placeholder="Minimum acceptable" className={inputClass} style={inputStyle} />
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1" style={labelStyle}>Auction Duration</label>
                <select value={form.auctionDurationHours} onChange={(e: any) => update('auctionDurationHours', parseInt(e.target.value))} className={inputClass} style={inputStyle}>
                  {AUCTION_DURATIONS.map((d) => <option key={d.hours} value={d.hours}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs mb-1" style={labelStyle}>Estimated Value ($)</label>
                <input type="number" value={form.price} onChange={(e: any) => update('price', e.target.value)} placeholder="Estimated value" className={inputClass} style={inputStyle} />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs mb-1" style={labelStyle}>Description *</label>
            <textarea
              value={form.description}
              onChange={(e: any) => update('description', e.target.value)}
              rows={5}
              placeholder="Describe the vehicle's history, condition, restoration details, etc."
              className={inputClass}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div>
            <label className="block text-xs mb-2" style={labelStyle}>Features & Options</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 rounded" style={{ backgroundColor: '#111125', border: '1px solid rgba(201,162,39,0.2)' }}>
              {CAR_FEATURES.map((feature) => (
                <label key={feature} className="flex items-center gap-2 text-xs cursor-pointer p-1 rounded hover:bg-opacity-20" style={{ color: '#e8e8e8' }}>
                  <input
                    type="checkbox"
                    checked={form.features.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                    className="w-3 h-3"
                    style={{ accentColor: '#c9a227' }}
                  />
                  {feature}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Seller Info & Images */}
      {step === 4 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#e8e8e8' }}>Seller Information</h2>
          <div>
            <label className="block text-xs mb-1" style={labelStyle}>Your Name *</label>
            <input type="text" value={form.sellerName} onChange={(e: any) => update('sellerName', e.target.value)} placeholder="Full name or business" className={inputClass} style={inputStyle} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Email *</label>
              <input type="email" value={form.sellerEmail} onChange={(e: any) => update('sellerEmail', e.target.value)} placeholder="your@email.com" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs mb-1" style={labelStyle}>Phone</label>
              <input type="tel" value={form.sellerContact} onChange={(e: any) => update('sellerContact', e.target.value)} placeholder="(555) 555-5555" className={inputClass} style={inputStyle} />
            </div>
          </div>

          <div>
            <label className="block text-xs mb-2" style={labelStyle}>Image URLs (one per line)</label>
            <textarea
              rows={4}
              placeholder="https://example.com/car-photo.jpg"
              onChange={(e: any) => {
                const urls = e.target.value.split('\n').map((u: string) => u.trim()).filter((u: string) => u.length > 0);
                update('images', urls);
              }}
              className={inputClass}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
            <p className="text-xs mt-1" style={{ color: '#666' }}>Enter one image URL per line</p>
          </div>

          {/* Summary */}
          <div className="p-4 rounded" style={{ backgroundColor: '#111125', border: '1px solid rgba(201,162,39,0.2)' }}>
            <h4 className="font-bold mb-3" style={{ color: '#c9a227' }}>Listing Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div style={{ color: '#a0a0a0' }}>Vehicle:</div>
              <div style={{ color: '#e8e8e8' }}>{form.year} {form.make} {form.model} {form.trim}</div>
              <div style={{ color: '#a0a0a0' }}>Condition:</div>
              <div style={{ color: '#e8e8e8' }}>{form.condition}</div>
              <div style={{ color: '#a0a0a0' }}>Mileage:</div>
              <div style={{ color: '#e8e8e8' }}>{parseInt(form.mileage || '0').toLocaleString()} mi</div>
              {mode === 'sale' ? (
                <>
                  <div style={{ color: '#a0a0a0' }}>Price:</div>
                  <div style={{ color: '#c9a227' }}>${parseInt(form.price || '0').toLocaleString()}</div>
                </>
              ) : (
                <>
                  <div style={{ color: '#a0a0a0' }}>Starting Bid:</div>
                  <div style={{ color: '#c9a227' }}>${parseInt(form.startingBid || '0').toLocaleString()}</div>
                  <div style={{ color: '#a0a0a0' }}>Duration:</div>
                  <div style={{ color: '#e8e8e8' }}>{AUCTION_DURATIONS.find((d) => d.hours === form.auctionDurationHours)?.label}</div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="px-6 py-2 rounded font-semibold"
            style={{ border: '1px solid rgba(201,162,39,0.4)', color: '#c9a227' }}
          >
            Back
          </button>
        ) : <div />}
        {step < 4 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={step === 1 && (!form.make || !form.model)}
            className="px-6 py-2 rounded font-bold"
            style={{ backgroundColor: '#c9a227', color: '#1a1a2e', opacity: (step === 1 && (!form.make || !form.model)) ? 0.5 : 1 }}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!form.sellerName || !form.sellerEmail}
            className="px-8 py-2 rounded font-bold"
            style={{ backgroundColor: '#c9a227', color: '#1a1a2e', opacity: (!form.sellerName || !form.sellerEmail) ? 0.5 : 1 }}
          >
            {mode === 'sale' ? 'List for Sale' : 'Create Auction'}
          </button>
        )}
      </div>
    </div>
  );
}
