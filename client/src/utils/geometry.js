export const calculateCentroid = (coords) => {
  let latSum = 0;
  let lngSum = 0;
  coords.forEach(([lat, lng]) => {
    latSum += lat;
    lngSum += lng;
  });
  return {lat: latSum / coords.length, lng: lngSum / coords.length};
};
