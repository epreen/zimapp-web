"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Search,
  Globe,
  Navigation,
  Store as StoreIcon,
  Wifi,
  Car,
  Coffee,
  Zap,
  Check,
  X,
} from "lucide-react";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import StoreMap from "@/components/ui/maps/store-map";
import { assets } from "@/data/assets";

interface Store {
  _id: string;
  name: string;
  slug: { current: string };
  image?: any;
  address: {
    street: string;
    house?: string;
    city: string;
    state?: string;
    zipCode?: string;
    country: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  contact: {
    phone: string;
    email: string;
  };
  hours?: any;
  description?: string;
  features?: string[];
  sortOrder?: number;
}

interface Country {
  code: string;
  name: string;
  count: number;
}

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  UK: "United Kingdom",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  ES: "Spain",
  IT: "Italy",
  NL: "Netherlands",
  BE: "Belgium",
  CH: "Switzerland",
  AT: "Austria",
  PL: "Poland",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  IE: "Ireland",
  PT: "Portugal",
  GR: "Greece",
  JP: "Japan",
  KR: "South Korea",
  CN: "China",
  IN: "India",
  SG: "Singapore",
  BR: "Brazil",
  MX: "Mexico",
  AE: "United Arab Emirates",
  NZ: "New Zealand",
  ZA: "South Africa",
};

const FEATURE_ICONS: Record<string, any> = {
  parking: Car,
  wifi: Wifi,
  wheelchair: Navigation,
  petFriendly: Coffee,
  driveThrough: Car,
  curbside: Navigation,
  organic: Zap,
  bakery: Coffee,
  deli: Coffee,
  pharmacy: Zap,
};

const FEATURE_LABELS: Record<string, string> = {
  parking: "Parking",
  wifi: "WiFi",
  wheelchair: "Accessible",
  petFriendly: "Pet Friendly",
  driveThrough: "Drive-Through",
  curbside: "Curbside Pickup",
  organic: "Organic",
  bakery: "Bakery",
  deli: "Deli",
  pharmacy: "Pharmacy",
};

const StoreListPage = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch stores
  useEffect(() => {
    const fetchStores = async () => {
      setIsLoading(true);
      try {
        const query = `*[_type == "store" && isActive == true] | order(sortOrder asc, name asc) {
          _id,
          name,
          slug,
          image,
          address,
          coordinates,
          contact,
          hours,
          description,
          features,
          sortOrder
        }`;

        const fetchedStores = await client.fetch(query);
        setStores(fetchedStores);

        // Extract unique countries with counts
        const countryMap: Record<string, number> = {};
        fetchedStores.forEach((store: Store) => {
          const country = store.address.country;
          countryMap[country] = (countryMap[country] || 0) + 1;
        });

        const countryList = Object.entries(countryMap)
          .map(([code, count]) => ({
            code,
            name: COUNTRY_NAMES[code] || code,
            count,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(countryList);
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...stores];

    // Filter by country
    if (selectedCountry !== "all") {
      result = result.filter(
        (store) => store.address.country === selectedCountry
      );
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (store) =>
          store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          store.address.city
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          store.address.street.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredStores(result);
  }, [stores, selectedCountry, searchQuery]);

  const getCurrentDayHours = (hours: any) => {
    if (!hours) return null;
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const today = days[new Date().getDay()];
    return hours[today];
  };

  return (
    <div className="bg-linear-to-b from-background via-primary/15 to-secondary/10 min-h-screen">
      <div className="py-8 lg:py-12 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-linear-to-r from-primary/40 to-primary rounded-full"></div>
            <StoreIcon className="w-8 h-8 text-primary" />
            <h1 className="text-xl lg:text-5xl font-bold text-foreground">
              Local Store Locations
            </h1>
            <MapPin className="w-8 h-8 text-primary" />
            <div className="h-1 w-12 bg-linear-to-l from-primary/40 to-primary rounded-full"></div>
          </div>
          <p className="text-foreground/60 text-sm max-w-2xl mx-auto">
            Find a local store near you and visit them today
          </p>
          <div className="mt-4">
            <Badge className="bg-primary/10 text-primary/60 border-primary/20 text-sm px-4 py-2">
              {filteredStores.length}{" "}
              {filteredStores.length === 1 ? "Store" : "Stores"} Found
            </Badge>
          </div>
        </motion.div>

        {/* Filters */}
        <Card className="mb-8 border-none bg-linear-to-br from-background/10 via-secondary/5 to-primary/5 bg-background/80 rounded-none">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Main Filter Row */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 space-y-2">
                  <Label
                    htmlFor="search"
                    className="text-sm font-medium text-foreground"
                  >
                    Search Stores
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/60" />
                    <Input
                      id="search"
                      type="text"
                      placeholder="Search by store name, city, or address..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-12 pr-10 h-12 py-6 text-base border-primary/20 focus:border-primary/40 focus:ring-primary rounded-xl"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Country Filter */}
                <div className="lg:w-64 space-y-2">
                  <Label
                    htmlFor="country"
                    className="text-sm font-medium text-foreground"
                  >
                    Filter by Country
                  </Label>
                  <Select
                    value={selectedCountry}
                    onValueChange={setSelectedCountry}
                  >
                    <SelectTrigger
                      id="country"
                      className="h-12 py-6 border-primary/20 focus:border-primary/40 focus:ring-primary rounded-xl"
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        <SelectValue placeholder="Select a country" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        <div className="flex items-center justify-between w-full gap-4">
                          <span>All Countries</span>
                          <Badge variant="secondary" className="ml-2">
                            {stores.length}
                          </Badge>
                        </div>
                      </SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <div className="flex items-center justify-between w-full gap-4">
                            <span>{country.name}</span>
                            <Badge variant="secondary" className="ml-2">
                              {country.count}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Toggle Filters Button */}
                {/* <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="h-12 border-primary/30 hover:bg-primary/10 rounded-xl px-6"
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    {showFilters ? "Hide" : "More"} Filters
                  </Button>
                </div> */}
              </div>

              {/* Active Filters Display */}
              {(selectedCountry !== "all" || searchQuery) && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-primary/10">
                  <span className="text-sm text-foreground/60 font-medium">
                    Active filters:
                  </span>
                  {selectedCountry !== "all" && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/5 text-primary border-primary/10 gap-1"
                    >
                      <Globe className="w-3 h-3" />
                      {countries.find((c) => c.code === selectedCountry)?.name}
                      <button
                        onClick={() => setSelectedCountry("all")}
                        className="ml-1 hover:bg-primary/10 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge
                      variant="secondary"
                      className="bg-primary/5 text-primary border-primary/20 gap-1"
                    >
                      <Search className="w-3 h-3" />"{searchQuery}"
                      <button
                        onClick={() => setSearchQuery("")}
                        className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCountry("all");
                      setSearchQuery("");
                    }}
                    className="text-primary bg-primary/20 border border-primary/20 hover:text-primary/80 h-7 text-xs"
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Store Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-background border-none rounded-none">
                <div className="h-48 bg-foreground/10"></div>
                <CardContent className="p-6 space-y-3">
                  <div className="h-6 bg-foreground/10 rounded w-3/4"></div>
                  <div className="h-4 bg-foreground/10 rounded w-full"></div>
                  <div className="h-4 bg-foreground/10 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredStores.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Card className="max-w-md bg-background mx-auto border-none rounded-none">
              <CardContent className="p-12">
                <div className="w-24 h-24 bg-linear-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-12 h-12 text-foreground/60" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  No Stores Found
                </h3>
                <p className="text-foreground/60 mb-6">
                  Try adjusting your filters or search query
                </p>
                <Button
                  onClick={() => {
                    setSelectedCountry("all");
                    setSearchQuery("");
                  }}
                  className="bg-primary hover:bg-primary/90 rounded-xl px-8 py-6"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Store Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredStores.map((store, index) => {
                  const todayHours = getCurrentDayHours(store.hours);
                  const isOpen = todayHours && !todayHours.closed;

                  return (
                    <motion.div
                      key={store._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="border-none hover:shadow-xl transition-shadow overflow-hidden h-full flex flex-col rounded-none bg-background/80">
                        {/* Store Image */}
                        {store.image ? (
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={urlFor(store.image).width(2400).height(1600).url()}
                              alt={store.name}
                              width={600}
                              height={400}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                            />
                            <div className="absolute top-4 right-4">
                              <Badge
                                className={`${
                                  isOpen
                                    ? "bg-primary text-background"
                                    : "bg-foreground/60 text-background"
                                } font-semibold`}
                              >
                                {isOpen ? "Open" : "Closed"}
                              </Badge>
                            </div>
                          </div>
                        ) : (
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={assets.local_store}
                              alt={store.name}
                              width={600}
                              height={400}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 blur-xs saturate-0 brightness-50"
                            />
                            <div className="absolute top-4 right-4">
                              <Badge
                                className={`${
                                  isOpen
                                    ? "bg-primary text-background"
                                    : "bg-foreground/60 text-background"
                                } font-semibold`}
                              >
                                {isOpen ? "Open" : "Closed"}
                              </Badge>
                            </div>
                          </div>
                        )}

                        <CardContent className="p-6 flex-1 flex flex-col">
                          {/* Store Name */}
                          <h3 className="text-xl font-bold text-foreground mb-3">
                            {store.name}
                          </h3>

                          {/* Address */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-start gap-2 text-foreground/60">
                              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                              <div className="text-sm">
                                {store.address.house &&
                                  `${store.address.house} `}
                                {store.address.street}
                                <br />
                                {store.address.city}
                                {store.address.state &&
                                  `, ${store.address.state}`}
                                {store.address.zipCode &&
                                  ` ${store.address.zipCode}`}
                                <br />
                                <span className="font-semibold text-foreground">
                                  {COUNTRY_NAMES[store.address.country] ||
                                    store.address.country}
                                </span>
                              </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center gap-2 text-foreground/60">
                              <Phone className="w-5 h-5 text-primary shrink-0" />
                              <a
                                href={`tel:${store.contact.phone}`}
                                className="text-sm hover:text-primary transition-colors"
                              >
                                {store.contact.phone}
                              </a>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-2 text-foreground/60">
                              <Mail className="w-5 h-5 text-primary shrink-0" />
                              <a
                                href={`mailto:${store.contact.email}`}
                                className="text-sm hover:text-primary transition-colors truncate"
                              >
                                {store.contact.email}
                              </a>
                            </div>

                            {/* Hours */}
                            {todayHours && (
                              <div className="flex items-center gap-2 text-foreground/60">
                                <Clock className="w-5 h-5 text-primary shrink-0" />
                                <span className="text-sm">
                                  {todayHours.closed
                                    ? "Closed Today"
                                    : `${todayHours.open} - ${todayHours.close}`}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Description */}
                          {store.description && (
                            <p className="text-sm text-foreground/60 mb-4 line-clamp-2">
                              {store.description}
                            </p>
                          )}

                          {/* Features */}
                          {store.features && store.features.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {store.features.slice(0, 4).map((feature) => {
                                const Icon = FEATURE_ICONS[feature] || Check;
                                return (
                                  <Badge
                                    key={feature}
                                    variant="outline"
                                    className="border-primary/30 text-primary text-xs"
                                  >
                                    <Icon className="w-3 h-3 mr-1" />
                                    {FEATURE_LABELS[feature] || feature}
                                  </Badge>
                                );
                              })}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="mt-auto pt-4 flex gap-2">
                            <Button
                              asChild
                              className="flex-1 bg-primary hover:bg-primary/90 rounded-xl"
                            >
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${store.coordinates.lat},${store.coordinates.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Navigation className="w-4 h-4 mr-2" />
                                Get Directions
                              </a>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Map Section */}
            <Card className="border-none overflow-hidden bg-background p-4">
              <CardContent className="p-0">
                <div className="p-6 h-full">
                  <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <Globe className="w-6 h-6 text-primary" />
                    Store Locations Map
                  </h2>
                  <p className="text-foreground/60 mb-6 text-sm">
                    View all our store locations on the map below
                  </p>
                </div>

                {/* Map div */}
                <div className="relative w-full h-[600px] bg-foreground/10 rounded-lg overflow-hidden">
                  <StoreMap stores={filteredStores} />

                  {/* Map Overlay Info */}
                  {filteredStores.length > 0 && (
                    <div className="absolute bottom-4 left-2 right-2 bg-white/95 backdrop-blur-sm border border-primary/20 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-black">
                            Showing {filteredStores.length}{" "}
                            {filteredStores.length === 1 ? "store" : "stores"}
                          </p>
                          <p className="text-sm text-black/60">
                            Click on store names in the list to view on Google
                            Maps
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {/* {countries.slice(0, 3).map((country) => (
                            <Badge
                              key={country.code}
                              className="bg-primary/10 text-primary border-primary/20"
                            >
                              {country.name}: {country.count}
                            </Badge>
                          ))} */}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreListPage;
