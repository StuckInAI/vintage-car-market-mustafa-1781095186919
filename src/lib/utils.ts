export function formatPrice(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  }
  if (amount >= 1000) {
    return `$${amount.toLocaleString()}`;
  }
  return `$${amount}`;
}

export function formatCountdown(endTime: number): string {
  const diff = endTime - Date.now();
  if (diff <= 0) return '00:00:00';
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getDefaultFilters() {
  return {
    make: '',
    model: '',
    yearMin: '',
    yearMax: '',
    priceMin: '',
    priceMax: '',
    mileageMax: '',
    condition: '',
    bodyStyle: '',
    transmission: '',
    fuelType: '',
    driveType: '',
    color: '',
    location: '',
    searchText: '',
  };
}
