export async function getCoordinatesForPlace(placeName: string): Promise<{ lat: number; lon: number } | null> {
    // Nominatim usage policy: add a `User-Agent` or `headers` specifying who you are
    // For more advanced usage, see https://nominatim.org/release-docs/latest/api/Search/
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}`;
  
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
  
    if (!response.ok) {
      throw new Error(`Nominatim request failed with status ${response.status}`);
    }
  
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) {
      return null; // no results
    }
  
    // Typically the first result is the best guess
    const first = data[0];
    return {
      lat: parseFloat(first.lat),
      lon: parseFloat(first.lon),
    };
  }
  