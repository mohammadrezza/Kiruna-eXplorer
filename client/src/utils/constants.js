import {kirunaMunicipal} from './kirunaMunicipal'
const swapCoordinates = (data) => {
  return data.map((item) => {
    if (Array.isArray(item[0])) {
      // Recursively process nested arrays
      return swapCoordinates(item);
    } else {
      // Swap the order of coordinates
      const [lng, lat] = item;
      return [lat, lng];
    }
  });
};
export const kirunaBounds = swapCoordinates(kirunaMunicipal);;
export const initialMapCenter = { lat: 67.85572, lng: 20.22513 };