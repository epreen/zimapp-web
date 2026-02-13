"use client";

import { useEffect, useRef } from "react";

interface Store {
  _id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  address: {
    street?: string;
    city?: string;
    country?: string;
  };
}

interface StoreMapProps {
  stores: Store[];
}

declare global {
  interface Window {
    google?: any;
  }
}

const loadGoogleMapsScript = (apiKey: string) =>
  new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return reject("no window");
    if (window.google && window.google.maps) return resolve();

    const existing = document.querySelector(`script[data-google-maps]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject("failed to load"));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.setAttribute("data-google-maps", "true");
    script.onload = () => resolve();
    script.onerror = () => reject("failed to load google maps script");
    document.head.appendChild(script);
  });

const StoreMap = ({ stores }: StoreMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any | null>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn(
        "Google Maps API key missing. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY."
      );
      return;
    }
    if (!mapRef.current) return;

    let mounted = true;

    (async () => {
      try {
        await loadGoogleMapsScript(apiKey);
        if (!mounted) return;

        const google = window.google;
        if (!google || !google.maps) {
          console.error("Google Maps failed to load.");
          return;
        }

        // Initialize map if not already initialized
        if (!mapInstanceRef.current) {
          const center = stores.length
            ? {
                lat:
                  stores.reduce((s, st) => s + (st.coordinates.lat || 0), 0) /
                  Math.max(1, stores.length),
                lng:
                  stores.reduce((s, st) => s + (st.coordinates.lng || 0), 0) /
                  Math.max(1, stores.length),
              }
            : { lat: 0, lng: 0 };

          mapInstanceRef.current = new google.maps.Map(mapRef.current, {
            center,
            zoom: stores.length > 1 ? 4 : 12,
            gestureHandling: "greedy",
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });

          infoWindowRef.current = new google.maps.InfoWindow();
        }

        // Clear existing markers
        markersRef.current.forEach((m) => m.setMap(null));
        markersRef.current = [];

        // Add markers
        const bounds = new google.maps.LatLngBounds();
        stores.forEach((store, idx) => {
          const position = {
            lat: Number(store.coordinates.lat),
            lng: Number(store.coordinates.lng),
          };

          const marker = new google.maps.Marker({
            position,
            map: mapInstanceRef.current,
            label: {
              text: String(idx + 1),
              color: "#fff",
              fontWeight: "600",
            },
            title: store.name,
          });

          // Info window content
          const addressParts = [
            store.address?.street,
            store.address?.city,
            store.address?.country,
          ]
            .filter(Boolean)
            .join(", ");

          const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${position.lat},${position.lng}`
          )}`;

          const content = `
            <div style="min-width:200px;">
              <div style="font-weight:400;margin-bottom:6px;color:#1a73e8">${escapeHtml(
                store.name
              )}</div>
              <div style="font-size:12px;color:#555;margin-bottom:8px;">${escapeHtml(
                addressParts || ""
              )}</div>
              <a href="${mapsLink}" target="_blank" rel="noopener" style="font-size:12px;color:#1a73e8;text-decoration:none;">
                Open in Google Maps
              </a>
            </div>
          `;

          marker.addListener("click", () => {
            infoWindowRef.current?.setContent(content);
            infoWindowRef.current?.open({
              anchor: marker,
              map: mapInstanceRef.current,
              shouldFocus: false,
            });
          });

          markersRef.current.push(marker);
          bounds.extend(position);
        });

        // Fit bounds if we have at least one store
        if (stores.length === 1) {
          mapInstanceRef.current.setCenter(bounds.getCenter());
          mapInstanceRef.current.setZoom(12);
        } else if (stores.length > 1) {
          mapInstanceRef.current.fitBounds(bounds, 80);
        } else {
          // No stores: center world or fallback
          mapInstanceRef.current.setCenter({ lat: 0, lng: 0 });
          mapInstanceRef.current.setZoom(2);
        }
      } catch (err) {
        console.error("Error initializing Google Map:", err);
      }
    })();

    return () => {
      mounted = false;
      // cleanup markers
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      // optionally, remove map instance (leave DOM node alone)
      mapInstanceRef.current = null;
    };
  }, [stores]);

  // Small helper to escape HTML for InfoWindow
  const escapeHtml = (unsafe: string) =>
    unsafe
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  if (!stores || stores.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/10">
        <div className="text-center">
          <p className="text-black/50 text-lg">No stores to display on map</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} className="rounded-lg overflow-hidden" />

      {/* Store markers overlay / list (keeps your existing UI) */}
      <div className="absolute top-2.5 left-2.5 text-black bg-white/95 backdrop-blur-sm p-3 max-h-[200px]">
        <p className="font-semibold text-sm mb-2">Store Locations:</p>
        <div className="space-y-1 max-h-40 min-w-70 overflow-hidden overflow-y-auto">
          {stores.map((store, index) => (
            <a
              key={store._id}
              href={`https://www.google.com/maps/search/?api=1&query=${store.coordinates.lat},${store.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-xs hover:bg-black/5 p-2 rounded transition-colors group"
            >
              <span className="bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center shrink-0 text-[10px] font-bold group-hover:bg-red-700">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-black">{store.name}</p>
                <p className="text-black/60">
                  {store.address.city}, {store.address.country}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoreMap;