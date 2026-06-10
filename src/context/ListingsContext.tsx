import { createContext, useContext, useState, useEffect } from 'react';
import type { CarListing, AuctionListing } from '@/types';

interface ListingsContextType {
  listings: CarListing[];
  auctions: AuctionListing[];
  addListing: (listing: CarListing) => void;
  addAuction: (auction: AuctionListing) => void;
  updateAuction: (auction: AuctionListing) => void;
  removeListing: (id: string) => void;
}

const ListingsContext = createContext<ListingsContextType>({
  listings: [],
  auctions: [],
  addListing: () => {},
  addAuction: () => {},
  updateAuction: () => {},
  removeListing: () => {},
});

export function useListings() {
  return useContext(ListingsContext);
}

const SAMPLE_LISTINGS: CarListing[] = [
  {
    id: 'car_1',
    listingType: 'sale',
    make: 'Ford',
    model: 'Mustang',
    year: 1967,
    trim: 'Fastback',
    vin: '7T01S125612',
    mileage: 45200,
    condition: 'Excellent',
    transmission: 'Manual',
    fuelType: 'Gasoline',
    bodyStyle: 'Coupe',
    driveType: 'RWD',
    engineSize: '4.7L',
    cylinders: 'V8',
    horsepower: '320',
    color: 'Highland Green',
    interiorColor: 'Black',
    doors: '2',
    features: ['Power Steering', 'Dual Exhaust', 'Bucket Seats', 'Floor Console', 'Rally Pac'],
    price: 89000,
    negotiable: true,
    description: 'Stunning 1967 Ford Mustang Fastback in Highland Green. Matching numbers 289 V8 engine. Full frame-off restoration completed in 2019. Show quality paint and bodywork.',
    location: 'Los Angeles, CA',
    sellerName: 'John Mitchell',
    sellerContact: '(310) 555-0198',
    sellerEmail: 'john@example.com',
    images: [],
    createdAt: Date.now() - 86400000,
    sellerId: 'user_sample1',
  },
  {
    id: 'car_2',
    listingType: 'sale',
    make: 'Chevrolet',
    model: 'Camaro',
    year: 1969,
    trim: 'Z/28',
    vin: '124379N550001',
    mileage: 38500,
    condition: 'Good',
    transmission: 'Manual',
    fuelType: 'Gasoline',
    bodyStyle: 'Coupe',
    driveType: 'RWD',
    engineSize: '5.0L',
    cylinders: 'V8',
    horsepower: '290',
    color: 'Fathom Green',
    interiorColor: 'Black',
    doors: '2',
    features: ['4-Speed Transmission', 'Posi-Traction', 'Sport Suspension', 'Rally Wheels'],
    price: 72000,
    negotiable: false,
    description: 'Original Z/28 numbers matching. DZ 302 engine. Correct Fathom Green paint over black interior. Solid California car with no rust.',
    location: 'Phoenix, AZ',
    sellerName: 'Robert Garcia',
    sellerContact: '(602) 555-0142',
    sellerEmail: 'rob@example.com',
    images: [],
    createdAt: Date.now() - 172800000,
    sellerId: 'user_sample2',
  },
  {
    id: 'car_3',
    listingType: 'sale',
    make: 'Porsche',
    model: '911',
    year: 1973,
    trim: 'Carrera RS',
    vin: '9113600891',
    mileage: 62000,
    condition: 'Excellent',
    transmission: 'Manual',
    fuelType: 'Gasoline',
    bodyStyle: 'Coupe',
    driveType: 'RWD',
    engineSize: '2.7L',
    cylinders: 'Flat-6',
    horsepower: '210',
    color: 'White',
    interiorColor: 'Black',
    doors: '2',
    features: ['Ducktail Spoiler', 'Lightweight Body', 'Sport Seats', 'Magnesium Wheels'],
    price: 450000,
    negotiable: false,
    description: 'Iconic 1973 Porsche 911 Carrera RS 2.7 Touring. Numbers matching. Original Porsche Certificate of Authenticity. Matching numbers engine and gearbox.',
    location: 'Miami, FL',
    sellerName: 'Klaus Weber',
    sellerContact: '(305) 555-0167',
    sellerEmail: 'klaus@example.com',
    images: [],
    createdAt: Date.now() - 259200000,
    sellerId: 'user_sample3',
  },
  {
    id: 'car_4',
    listingType: 'sale',
    make: 'Mercedes-Benz',
    model: '300SL',
    year: 1955,
    trim: 'Gullwing',
    vin: '1980041500038',
    mileage: 28000,
    condition: 'Excellent',
    transmission: 'Manual',
    fuelType: 'Gasoline',
    bodyStyle: 'Coupe',
    driveType: 'RWD',
    engineSize: '3.0L',
    cylinders: 'Inline-6',
    horsepower: '215',
    color: 'Silver',
    interiorColor: 'Red',
    doors: '2',
    features: ['Gullwing Doors', 'Fuel Injection', 'Tubular Space Frame', 'Original Tools'],
    price: 1200000,
    negotiable: false,
    description: 'One of only 1,400 Gullwing coupes ever produced. Matching numbers. Comprehensive restoration by a marque specialist. Featured in multiple concours events.',
    location: 'New York, NY',
    sellerName: 'Heritage Motors',
    sellerContact: '(212) 555-0189',
    sellerEmail: 'heritage@example.com',
    images: [],
    createdAt: Date.now() - 345600000,
    sellerId: 'user_sample4',
  },
  {
    id: 'car_5',
    listingType: 'sale',
    make: 'Jaguar',
    model: 'E-Type',
    year: 1961,
    trim: 'Series 1',
    vin: '875006',
    mileage: 55000,
    condition: 'Good',
    transmission: 'Manual',
    fuelType: 'Gasoline',
    bodyStyle: 'Convertible',
    driveType: 'RWD',
    engineSize: '3.8L',
    cylinders: 'Inline-6',
    horsepower: '265',
    color: 'British Racing Green',
    interiorColor: 'Tan',
    doors: '2',
    features: ['Triple Carburetors', 'Independent Suspension', 'Disc Brakes', 'Wire Wheels'],
    price: 175000,
    negotiable: true,
    description: 'Highly original Series 1 E-Type roadster. RHD car imported from UK. Flat floor, outside bonnet latches, and full leather interior. Correct XK engine.',
    location: 'Chicago, IL',
    sellerName: 'British Car Specialists',
    sellerContact: '(312) 555-0134',
    sellerEmail: 'british@example.com',
    images: [],
    createdAt: Date.now() - 432000000,
    sellerId: 'user_sample5',
  },
];

const SAMPLE_AUCTIONS: AuctionListing[] = [
  {
    id: 'auction_1',
    listingType: 'auction',
    make: 'Ferrari',
    model: '250 GTE',
    year: 1962,
    trim: '2+2',
    vin: '3271GT',
    mileage: 42000,
    condition: 'Good',
    transmission: 'Manual',
    fuelType: 'Gasoline',
    bodyStyle: 'Sedan',
    driveType: 'RWD',
    engineSize: '3.0L',
    cylinders: 'V12',
    horsepower: '240',
    color: 'Rosso Corsa',
    interiorColor: 'Tan',
    doors: '4',
    features: ['V12 Engine', 'Borrani Wire Wheels', 'Matching Numbers', 'Ferrari Classiche Certified'],
    price: 180000,
    negotiable: false,
    description: 'Rare Ferrari 250 GTE 2+2 in stunning Rosso Corsa. One of the most practical early Ferraris. Matching numbers V12 engine. Full Ferrari Classiche certification.',
    location: 'Scottsdale, AZ',
    sellerName: 'Prancing Horse Collection',
    sellerContact: '(480) 555-0123',
    sellerEmail: 'ferrari@example.com',
    images: [],
    createdAt: Date.now() - 3600000,
    sellerId: 'user_auction1',
    reservePrice: 160000,
    startingBid: 100000,
    currentBid: 142000,
    currentBidder: 'user_bidder1',
    currentBidderName: 'VintageFan42',
    auctionDurationHours: 24,
    auctionEndTime: Date.now() + 72000000,
    auctionActive: true,
    bids: [
      { id: 'bid_1', bidderId: 'user_bidder1', bidderName: 'VintageFan42', amount: 100000, timestamp: Date.now() - 3000000 },
      { id: 'bid_2', bidderId: 'user_bidder2', bidderName: 'ClassicWheels', amount: 120000, timestamp: Date.now() - 2000000 },
      { id: 'bid_3', bidderId: 'user_bidder1', bidderName: 'VintageFan42', amount: 142000, timestamp: Date.now() - 1000000 },
    ],
  },
  {
    id: 'auction_2',
    listingType: 'auction',
    make: 'Aston Martin',
    model: 'DB5',
    year: 1964,
    trim: 'Vantage',
    vin: 'DB5/1486/R',
    mileage: 78000,
    condition: 'Excellent',
    transmission: 'Manual',
    fuelType: 'Gasoline',
    bodyStyle: 'Coupe',
    driveType: 'RWD',
    engineSize: '4.0L',
    cylinders: 'Inline-6',
    horsepower: '325',
    color: 'Silver Birch',
    interiorColor: 'Black',
    doors: '2',
    features: ['Triple Weber Carbs', 'ZF 5-Speed', 'Original Toolkit', 'Heritage Certificate'],
    price: 900000,
    negotiable: false,
    description: 'The most iconic Aston Martin ever made. This DB5 Vantage is in exceptional condition with only 78,000 original miles. Silver Birch paint over black Connolly leather.',
    location: 'London, UK (Shipped from)',
    sellerName: 'DB Classics Ltd',
    sellerContact: '+44 20 5555 0167',
    sellerEmail: 'db@example.com',
    images: [],
    createdAt: Date.now() - 7200000,
    sellerId: 'user_auction2',
    reservePrice: 800000,
    startingBid: 500000,
    currentBid: 685000,
    currentBidder: 'user_bidder3',
    currentBidderName: 'BondFanatic',
    auctionDurationHours: 48,
    auctionEndTime: Date.now() + 144000000,
    auctionActive: true,
    bids: [
      { id: 'bid_a', bidderId: 'user_bidder2', bidderName: 'ClassicWheels', amount: 500000, timestamp: Date.now() - 6000000 },
      { id: 'bid_b', bidderId: 'user_bidder3', bidderName: 'BondFanatic', amount: 600000, timestamp: Date.now() - 4000000 },
      { id: 'bid_c', bidderId: 'user_bidder2', bidderName: 'ClassicWheels', amount: 650000, timestamp: Date.now() - 2500000 },
      { id: 'bid_d', bidderId: 'user_bidder3', bidderName: 'BondFanatic', amount: 685000, timestamp: Date.now() - 1200000 },
    ],
  },
];

export function ListingsProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<CarListing[]>(() => {
    try {
      const stored = localStorage.getItem('vccp_listings');
      return stored ? JSON.parse(stored) : SAMPLE_LISTINGS;
    } catch (e: any) {
      return SAMPLE_LISTINGS;
    }
  });

  const [auctions, setAuctions] = useState<AuctionListing[]>(() => {
    try {
      const stored = localStorage.getItem('vccp_auctions');
      return stored ? JSON.parse(stored) : SAMPLE_AUCTIONS;
    } catch (e: any) {
      return SAMPLE_AUCTIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem('vccp_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('vccp_auctions', JSON.stringify(auctions));
  }, [auctions]);

  const addListing = (listing: CarListing) => {
    setListings((prev) => [listing, ...prev]);
  };

  const addAuction = (auction: AuctionListing) => {
    setAuctions((prev) => [auction, ...prev]);
  };

  const updateAuction = (auction: AuctionListing) => {
    setAuctions((prev) => prev.map((a) => (a.id === auction.id ? auction : a)));
  };

  const removeListing = (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
    setAuctions((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <ListingsContext.Provider value={{ listings, auctions, addListing, addAuction, updateAuction, removeListing }}>
      {children}
    </ListingsContext.Provider>
  );
}
