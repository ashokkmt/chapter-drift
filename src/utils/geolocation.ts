import { Region } from "@/components/RegionSelector";

interface Coordinates {
  latitude: number;
  longitude: number;
}

// Map coordinates to regions based on approximate geographical boundaries
export function coordinatesToRegion(coords: Coordinates): Region {
  const { latitude, longitude } = coords;

  // North America: roughly -170 to -50 longitude, 15 to 85 latitude
  if (longitude >= -170 && longitude <= -50 && latitude >= 15 && latitude <= 85) {
    return "North America";
  }

  // Europe: roughly -10 to 40 longitude, 35 to 70 latitude
  if (longitude >= -10 && longitude <= 40 && latitude >= 35 && latitude <= 70) {
    return "Europe";
  }

  // Middle East & Africa: roughly -20 to 60 longitude, -35 to 40 latitude
  if (longitude >= -20 && longitude <= 60 && latitude >= -35 && latitude <= 40) {
    return "Middle East & Africa";
  }

  // Asia Pacific: roughly 60 to 180 longitude, -50 to 60 latitude
  if (longitude >= 60 && longitude <= 180 && latitude >= -50 && latitude <= 60) {
    return "Asia Pacific";
  }

  // Latin America: roughly -120 to -30 longitude, -60 to 15 latitude
  if (longitude >= -120 && longitude <= -30 && latitude >= -60 && latitude <= 15) {
    return "Latin America";
  }

  // Default to All Regions if can't determine
  return "All Regions";
}

export async function detectUserRegion(): Promise<Region | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        const region = coordinatesToRegion(coords);
        console.log(`Detected region: ${region} from coords:`, coords);
        resolve(region);
      },
      (error) => {
        console.log("Geolocation error:", error.message);
        resolve(null);
      },
      {
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}
