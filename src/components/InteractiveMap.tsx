import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { LocationInsight } from '../types';

interface InteractiveMapProps {
  insight: LocationInsight;
}

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';

export function InteractiveMap({ insight }: InteractiveMapProps) {
  const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

  if (!hasValidKey) {
    return (
      <div className="h-[400px] luxury-card flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-xl font-serif mb-4">Maps Configuration Required</h3>
        <p className="text-sm text-white/60 max-w-sm">
          Please add your Google Maps API key to the secrets panel to enable interactive visualizations.
        </p>
      </div>
    );
  }

  // Calculate center from famous places or default to the first one
  const center = insight.famousPlaces.length > 0 
    ? { lat: insight.famousPlaces[0].latitude, lng: insight.famousPlaces[0].longitude }
    : { lat: 0, lng: 0 };

  return (
    <div className="h-[600px] w-full luxury-card border-none mt-12">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={center}
          defaultZoom={13}
          mapId="NOMADSENSE_MAP"
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          className="w-full h-full"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        >
          {insight.famousPlaces.map((place, idx) => (
            <AdvancedMarker 
              key={idx}
              position={{ lat: place.latitude, lng: place.longitude }}
              title={place.name}
            >
              <Pin 
                background={place.category === 'landmark' ? '#D4AF37' : '#4285F4'}
                glyphColor="#fff"
                borderColor="rgba(255,255,255,0.2)"
              />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
