export function dmsToDecimal(dmsString) {
  const dmsPattern =
    /(\d{1,3})[°]\s*(\d{1,2})[']\s*(\d{1,2}(?:\.\d+)?)[\"]?\s*([NSEW])\s*(\d{1,3})[°]\s*(\d{1,2})[']\s*(\d{1,2}(?:\.\d+)?)[\"]?\s*([NSEW])/;

  const match = dmsString.match(dmsPattern);

  if (!match) {
    throw new Error(
      'Invalid DMS format. Please use the correct DMS format like "67°51\'09.0"N 20°13\'20.8"E".'
    );
  }

  // Extract values for latitude
  const latDegrees = parseFloat(match[1]);
  const latMinutes = parseFloat(match[2]);
  const latSeconds = parseFloat(match[3]);
  const latDirection = match[4];

  // Extract values for longitude
  const lngDegrees = parseFloat(match[5]);
  const lngMinutes = parseFloat(match[6]);
  const lngSeconds = parseFloat(match[7]);
  const lngDirection = match[8];

  // Calculate decimal degrees for latitude and longitude
  const latDecimal = latDegrees + latMinutes / 60 + latSeconds / 3600;
  const lngDecimal = lngDegrees + lngMinutes / 60 + lngSeconds / 3600;

  // Return coordinates with correct signs based on direction
  return {
    lat: latDirection === 'N' ? latDecimal : -latDecimal,
    lng: lngDirection === 'E' ? lngDecimal : -lngDecimal,
  };
}
