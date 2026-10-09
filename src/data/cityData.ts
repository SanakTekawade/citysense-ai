export interface PlaceReview {
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface PlaceAccessibility {
  stepFree: boolean;
  elevator: boolean;
  tactileSignage: boolean;
  sensoryQuiet: boolean;
  notes: string;
}

export interface PlaceTransit {
  type: 'metro' | 'bus' | 'bike';
  name: string;
  distance: string;
}

export interface PlaceItem {
  id: string;
  name: string;
  category: 'Food' | 'Hotels' | 'History' | 'Attractions' | 'Parks';
  categoryId: 'food' | 'hotels' | 'history' | 'attractions' | 'parks';
  lat: number;
  lng: number;
  rating?: number; // Only shown when available
  reviewsCount?: number;
  description: string;
  historicalBackground?: string;
  address: string;
  distance: string;
  distanceKm: number;
  hours: string;
  price?: string;
  priceLevel?: 'Free' | '$' | '$$' | '$$$' | '$$$$';
  accessible: boolean;
  accessibilityDetails?: PlaceAccessibility;
  transitOptions?: PlaceTransit[];
  reviews?: PlaceReview[];
  districtSafetyNotice?: string;
  tags: string[];
  themeColor: string;
  clayIcon: string;
  safetyScore?: number;
  statusLabel?: string;
}

export interface CityInsightWeather {
  temperature: number;
  unit: string;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  airQualityIndex: number;
  airQualityStatus: string;
  lastUpdated: string;
}

export interface CityInsightTraffic {
  status: 'Normal Flow' | 'Moderate Delay' | 'Heavy Congestion';
  summary: string;
  metroStatus: string;
  averageSpeed: string;
  corridorNote: string;
  lastUpdated: string;
}

export interface CommunityReport {
  id: string;
  title: string;
  location: string;
  timeAgo: string;
  type: 'Event' | 'Traffic' | 'Notice' | 'Safety';
  description: string;
  verified: boolean;
  upvotes: number;
}

export const CATEGORIES_DATA = [
  {
    id: 'food',
    name: 'Food',
    count: '240+ spots',
    icon: 'Utensils',
    accentColor: '#60a5fa',
    description: 'Artisan bakeries, local bistros & rooftop dining',
  },
  {
    id: 'hotels',
    name: 'Hotels',
    count: '95+ stays',
    icon: 'Building2',
    accentColor: '#93c5fd',
    description: 'Boutique hotels, lofts & eco-lodges',
  },
  {
    id: 'history',
    name: 'History',
    count: '64+ sites',
    icon: 'Landmark',
    accentColor: '#bfdbfe',
    description: 'Historic clock towers, museums & heritage plazas',
  },
  {
    id: 'attractions',
    name: 'Attractions',
    count: '110+ sights',
    icon: 'Compass',
    accentColor: '#38bdf8',
    description: 'Botanical domes, scenic vistas & cultural centers',
  },
  {
    id: 'parks',
    name: 'Parks',
    count: '48+ spaces',
    icon: 'Trees',
    accentColor: '#34d399',
    description: 'Lush botanical trails, civic arboretums & waterfront lawns',
  },
];

export const POPULAR_PLACES_DATA: PlaceItem[] = [
  {
    id: 'pop-1',
    name: 'Verdant Biome Botanical Conservatory',
    category: 'Attractions',
    categoryId: 'attractions',
    lat: 37.7712,
    lng: -122.4285,
    rating: 4.9,
    reviewsCount: 1248,
    description: 'An architectural glass biome housing 3,000+ exotic floral species, canopy walkways, and tranquil mist waterfalls.',
    historicalBackground: 'Commissioned in 1924 as a civic botanical greenhouse, the structure survived the mid-century waterfront expansion and underwent a structural glass retrofitting in 2018.',
    address: '420 Conservatory Way, Park District',
    distance: '1.2 km away',
    distanceKm: 1.2,
    hours: 'Open · Closes 8:00 PM',
    price: '$15 Admission',
    priceLevel: '$$',
    accessible: true,
    accessibilityDetails: {
      stepFree: true,
      elevator: true,
      tactileSignage: true,
      sensoryQuiet: true,
      notes: 'Wide ramp walkways throughout all biome levels. Sensory quiet hours every Tuesday 9 AM - 11 AM.',
    },
    transitOptions: [
      { type: 'metro', name: 'Park District Light Rail Line M', distance: '120m away' },
      { type: 'bus', name: 'Rapid Line 24 (Conservatory Stop)', distance: '40m away' },
      { type: 'bike', name: 'Civic Bikeshare Dock 12', distance: '80m away' },
    ],
    reviews: [
      { author: 'Elena Rostova', rating: 5, date: 'Yesterday', comment: 'Breathtaking light in the cloud forest dome. The mist waterfall walkway is completely accessible.' },
      { author: 'Marcus Chen', rating: 4.8, date: '3 days ago', comment: 'Peaceful escape in the heart of the city. Highly recommend morning tickets when the sunlight hits the dome.' },
    ],
    districtSafetyNotice: 'Safe civic green zone. Monitored by park rangers and illuminated along main paths until 9 PM.',
    tags: ['Scenic', 'Photography', 'Green Space'],
    themeColor: 'from-emerald-950/40 to-blue-950/20',
    clayIcon: 'tree',
  },
  {
    id: 'pop-2',
    name: 'Aetheria Rooftop Bistro & Lounge',
    category: 'Food',
    categoryId: 'food',
    lat: 37.7858,
    lng: -122.4065,
    rating: 4.8,
    reviewsCount: 892,
    description: 'Elevated culinary experience serving locally sourced seasonal tasting menus with panoramic city sunset views.',
    historicalBackground: 'Perched atop the former 1930s Pacific Telegraph building, this venue incorporates the original copper art-deco transceiver tower into its lounge bar.',
    address: '88 Skyline Promenade, Floor 24',
    distance: '0.8 km away',
    distanceKm: 0.8,
    hours: 'Open · Closes 11:30 PM',
    price: '$$$',
    priceLevel: '$$$',
    accessible: true,
    accessibilityDetails: {
      stepFree: true,
      elevator: true,
      tactileSignage: true,
      sensoryQuiet: false,
      notes: 'Dedicated high-speed elevator from street lobby. Restrooms are step-free and ADA compliant.',
    },
    transitOptions: [
      { type: 'metro', name: 'Downtown Central Transit Plaza', distance: '180m away' },
      { type: 'bus', name: 'Night Express 10', distance: '90m away' },
    ],
    reviews: [
      { author: 'Sophia Vane', rating: 5, date: '2 days ago', comment: 'Unrivaled sunset views over the bay. Cocktails and seasonal crudo are world-class.' },
      { author: 'Devon Patel', rating: 4.6, date: '1 week ago', comment: 'Vibrant atmosphere and great acoustics. Be sure to reserve a patio table.' },
    ],
    districtSafetyNotice: 'High-visibility pedestrian corridor. Continuous street lighting and active merchant foot patrol.',
    tags: ['Cocktails', 'City Views', 'Reservations'],
    themeColor: 'from-blue-950/50 to-indigo-950/30',
    clayIcon: 'coffee',
  },
  {
    id: 'pop-3',
    name: 'Old Port Historic Clocktower & Arcade',
    category: 'History',
    categoryId: 'history',
    lat: 37.7955,
    lng: -122.3937,
    rating: 4.7,
    reviewsCount: 654,
    description: 'Constructed in 1884, the Gothic revival masonry clocktower features audio walking tours and artisan craft stalls.',
    historicalBackground: 'Built in 1884 to synchronize maritime harbor cargo vessels, the clockwork mechanism was manually wound until electrical conversion in 1952. The masonry features hand-carved limestone maritime crests.',
    address: '12 Clocktower Plaza, Old Quarter',
    distance: '2.1 km away',
    distanceKm: 2.1,
    hours: 'Open · Closes 7:00 PM',
    price: 'Free entry',
    priceLevel: 'Free',
    accessible: true,
    accessibilityDetails: {
      stepFree: true,
      elevator: false,
      tactileSignage: true,
      sensoryQuiet: true,
      notes: 'Plaza and arcade ground level are completely step-free. The upper belfry is reached via 86 stone spiral stairs only.',
    },
    transitOptions: [
      { type: 'bus', name: 'Waterfront Trolley Line F', distance: '50m away' },
      { type: 'metro', name: 'Embarcadero Station', distance: '350m away' },
    ],
    reviews: [
      { author: 'Julian Bell', rating: 4.7, date: '1 week ago', comment: 'Incredible Victorian masonry. The audio guide gave fascinating historical context on the port trade.' },
    ],
    districtSafetyNotice: 'Historic district pedestrian zone. Cobblestone pavements; well-lit until midnight.',
    tags: ['Architecture', 'History', 'Walking Tour'],
    themeColor: 'from-amber-950/30 to-blue-950/30',
    clayIcon: 'clock',
  },
  {
    id: 'pop-4',
    name: 'The Glasshouse Artisan Boutique Hotel',
    category: 'Hotels',
    categoryId: 'hotels',
    lat: 37.7819,
    lng: -122.3912,
    // Rating omitted intentionally to test "ratings only when available"
    reviewsCount: 0,
    description: 'Newly revitalized minimalist glass and timber sanctuary offering acoustic soundproof suites and organic breakfast.',
    historicalBackground: 'Adaptive reuse of an early 20th century marine timber drying warehouse, preserved using cross-laminated timber beams and acoustic smart glass.',
    address: '104 Waterfront Quay',
    distance: '1.5 km away',
    distanceKm: 1.5,
    hours: '24/7 Front Desk',
    price: '$$$$',
    priceLevel: '$$$$',
    accessible: true,
    accessibilityDetails: {
      stepFree: true,
      elevator: true,
      tactileSignage: true,
      sensoryQuiet: true,
      notes: 'All guest suites and common lounges are ADA compliant with zero-threshold doors.',
    },
    transitOptions: [
      { type: 'metro', name: 'Quay Street Line', distance: '210m away' },
      { type: 'bike', name: 'Harbor Bikeshare', distance: '100m away' },
    ],
    reviews: [], // Intentionally empty to test missing reviews handling
    districtSafetyNotice: 'Quiet waterfront sector. 24/7 lobby concierge and private security presence.',
    tags: ['New Opening', 'Eco-Luxury', 'Waterfront'],
    themeColor: 'from-cyan-950/30 to-slate-900/40',
    clayIcon: 'bed',
    statusLabel: 'New Opening · Rating Pending',
  },
];

export const RECOMMENDED_PLACES_DATA: PlaceItem[] = [
  {
    id: 'rec-1',
    name: 'Solis Modern Art Pavilion',
    category: 'Attractions',
    categoryId: 'attractions',
    lat: 37.7654,
    lng: -122.4148,
    rating: 4.9,
    reviewsCount: 940,
    description: 'Dynamic experiential light installations, digital sculpture galleries, and tranquil reflective pool.',
    address: '300 Cultural Blvd',
    distance: '1.9 km away',
    distanceKm: 1.9,
    hours: 'Open · Closes 9:00 PM',
    price: '$18 Admission',
    priceLevel: '$$',
    accessible: true,
    tags: ['Art', 'Interactive', 'Exhibits'],
    themeColor: 'from-indigo-950/40 to-blue-900/20',
    clayIcon: 'palette',
  },
  {
    id: 'rec-2',
    name: 'Foundry Roasters & Bakery',
    category: 'Food',
    categoryId: 'food',
    lat: 37.7782,
    lng: -122.4102,
    rating: 4.8,
    reviewsCount: 420,
    description: 'Single-origin espresso, warm cardamom buns, and sunlit loft seating inside a repurposed iron foundry.',
    address: '56 Mill Street, Warehouse Row',
    distance: '0.6 km away',
    distanceKm: 0.6,
    hours: 'Open · Closes 6:00 PM',
    price: '$',
    priceLevel: '$',
    accessible: true,
    tags: ['Café', 'Pastries', 'Quiet'],
    themeColor: 'from-amber-950/40 to-stone-900/30',
    clayIcon: 'coffee',
  },
  {
    id: 'rec-3',
    name: 'North Pier Heritage Maritime Dock',
    category: 'History',
    categoryId: 'history',
    lat: 37.8080,
    lng: -122.4177,
    rating: 4.6,
    reviewsCount: 310,
    description: 'Historic wooden pier with restored tall ships, maritime artifact archives, and sunset harbor breeze.',
    address: 'Pier 14, Embarcadero',
    distance: '2.8 km away',
    distanceKm: 2.8,
    hours: 'Open · Closes 8:00 PM',
    price: 'Free',
    priceLevel: 'Free',
    accessible: false, // Step access on historic boat ramps
    tags: ['Ocean', 'History', 'Walks'],
    themeColor: 'from-blue-950/40 to-cyan-950/30',
    clayIcon: 'anchor',
  },
  {
    id: 'rec-4',
    name: 'Aurora Sound & Wellness Sanctuary',
    category: 'Hotels',
    categoryId: 'hotels',
    lat: 37.7602,
    lng: -122.4355,
    rating: 4.9,
    reviewsCount: 180,
    description: 'Urban spa retreats, floating salt baths, and circadian-aligned sleep suites designed for ultimate rest.',
    address: '77 Serenity Lane',
    distance: '3.4 km away',
    distanceKm: 3.4,
    hours: 'Open · Closes 10:00 PM',
    price: '$$$',
    priceLevel: '$$$',
    accessible: true,
    tags: ['Wellness', 'Spa', 'Quiet'],
    themeColor: 'from-purple-950/30 to-blue-950/30',
    clayIcon: 'sparkle',
  },
  {
    id: 'rec-5',
    name: 'Highland Ridge Scenic Overlook',
    category: 'Parks',
    categoryId: 'parks',
    lat: 37.7544,
    lng: -122.4477,
    rating: 4.7,
    reviewsCount: 512,
    description: 'Panoramic mountain ridge viewing platform with telescopes overlooking the entire city skyline.',
    address: 'Summit Drive, Mile 4',
    distance: '4.8 km away',
    distanceKm: 4.8,
    hours: 'Dawn to Dusk',
    price: 'Free',
    priceLevel: 'Free',
    accessible: true,
    tags: ['Views', 'Nature', 'Sunset'],
    themeColor: 'from-teal-950/30 to-slate-900/40',
    clayIcon: 'mountain',
  },
  {
    id: 'rec-6',
    name: 'Cypress Grove Civic Arboretum',
    category: 'Parks',
    categoryId: 'parks',
    lat: 37.7688,
    lng: -122.4532,
    rating: 4.8,
    reviewsCount: 780,
    description: 'Quiet wooded pathways, native flora collections, reflecting lily pond, and peaceful reading benches.',
    address: '150 Arboretum Way, West Park',
    distance: '3.1 km away',
    distanceKm: 3.1,
    hours: 'Open · Closes 7:30 PM',
    price: 'Free',
    priceLevel: 'Free',
    accessible: true,
    tags: ['Arboretum', 'Gardens', 'Peaceful'],
    themeColor: 'from-emerald-950/40 to-slate-900/40',
    clayIcon: 'tree',
  },
];

export const CITY_INSIGHTS_DATA = {
  weather: {
    temperature: 72,
    unit: '°F',
    condition: 'Partly Sunny & Mild',
    high: 76,
    low: 58,
    humidity: 52,
    airQualityIndex: 28,
    airQualityStatus: 'Excellent (AQI 28)',
    lastUpdated: 'Updated 4 mins ago · Local Sensor Hub',
  } as CityInsightWeather,

  traffic: {
    status: 'Normal Flow' as const,
    summary: 'Clear corridors across primary avenues',
    metroStatus: '98.4% On-time across all transit lines',
    averageSpeed: '28 mph downtown core',
    corridorNote: 'Minor repaving on 4th St (expect +3 min)',
    lastUpdated: 'Live Urban Transit Feed',
  } as CityInsightTraffic,

  communityReports: [
    {
      id: 'rep-1',
      title: "Weekend Farmers Market in Central Plaza",
      location: 'Central Plaza & 5th Ave',
      timeAgo: '22m ago',
      type: 'Event' as const,
      description: '45+ local produce vendors, fresh pastries, and acoustic music until 4 PM today.',
      verified: true,
      upvotes: 38,
    },
    {
      id: 'rep-2',
      title: 'Pedestrian Walkway Lighting Upgrade',
      location: 'Riverbank Greenbelt',
      timeAgo: '1h ago',
      type: 'Notice' as const,
      description: 'New low-glare warm LED safety lights active along the north riverwalk.',
      verified: true,
      upvotes: 24,
    },
    {
      id: 'rep-3',
      title: 'Bike Lane Clear & Swept',
      location: 'Broadway East Corridor',
      timeAgo: '2h ago',
      type: 'Traffic' as const,
      description: 'Spring street sweeping completed; dedicated bike path is fully unobstructed.',
      verified: true,
      upvotes: 19,
    },
  ] as CommunityReport[],
};

export interface SafetyIncidentItem {
  id: string;
  title: string;
  category: 'Accident Reports' | 'Road Hazards' | 'Street Lighting' | 'Community Alerts';
  categoryId: 'accident' | 'hazard' | 'lighting' | 'alert';
  location: string;
  lat: number;
  lng: number;
  date: string;
  timeAgo: string;
  source: string;
  isVerified: boolean;
  severity: 'high' | 'medium' | 'low' | 'advisory';
  description: string;
  status: 'Active Alert' | 'In Progress' | 'Verified Advisory' | 'Resolved / Cleared';
  upvotes: number;
}

export interface RouteOption {
  id: string;
  name: string;
  tag: string;
  distance: string;
  walkTime: string;
  bikeTime: string;
  lightingQuality: 'Well-Lit Corridor' | 'Standard Lighting' | 'Dim / Scenic';
  safetyRating: 'Highest Caution Rating' | 'Recommended Route' | 'Alternative Route';
  hazardsEnRoute: number;
  description: string;
  coordinates: [number, number][];
}

export const SAFETY_INCIDENTS_DATA: SafetyIncidentItem[] = [
  {
    id: 'inc-1',
    title: 'Multi-Vehicle Collision Advisory',
    category: 'Accident Reports',
    categoryId: 'accident',
    location: '4th St & Mission Intersection',
    lat: 37.7842,
    lng: -122.4042,
    date: 'Oct 8, 2026 · 9:45 PM',
    timeAgo: '30m ago',
    source: 'Municipal Transit Dispatch & Traffic Hub',
    isVerified: true,
    severity: 'high',
    description: 'Emergency response units on site clearing two vehicles. Southbound right turn lane blocked; sidewalk passable with caution.',
    status: 'Active Alert',
    upvotes: 42,
  },
  {
    id: 'inc-2',
    title: 'Water Main Pavement Repair & Open Trench',
    category: 'Road Hazards',
    categoryId: 'hazard',
    location: '88 Geary Blvd near Union Square',
    lat: 37.7876,
    lng: -122.4068,
    date: 'Oct 8, 2026 · 8:15 PM',
    timeAgo: '2h ago',
    source: 'Department of Public Works Log #409',
    isVerified: true,
    severity: 'medium',
    description: 'Marked excavation trench with flashing orange barricades. Pedestrian detour clearly signposted on north pavement.',
    status: 'In Progress',
    upvotes: 28,
  },
  {
    id: 'inc-3',
    title: 'Pedestrian Walkway LED Lighting Upgrade',
    category: 'Street Lighting',
    categoryId: 'lighting',
    location: 'Riverbank Greenbelt North Section',
    lat: 37.7712,
    lng: -122.4285,
    date: 'Oct 8, 2026 · 6:30 PM',
    timeAgo: '4h ago',
    source: 'Civic Infrastructure Bureau',
    isVerified: true,
    severity: 'advisory',
    description: 'Continuous warm 3000K low-glare smart LED lamp posts newly active. Path is fully illuminated from 6 PM to 6 AM.',
    status: 'Verified Advisory',
    upvotes: 65,
  },
  {
    id: 'inc-4',
    title: 'Temporary Street Lamp Outage Reported',
    category: 'Street Lighting',
    categoryId: 'lighting',
    location: 'Lombard St between 10th & 11th',
    lat: 37.7995,
    lng: -122.4182,
    date: 'Oct 8, 2026 · 7:10 PM',
    timeAgo: '3h ago',
    source: 'Resident Community Watch Member #18',
    isVerified: false, // Unverified community report
    severity: 'medium',
    description: 'Two consecutive overhead street lamps are currently dark. Utility team notified; dispatching maintenance van.',
    status: 'In Progress',
    upvotes: 14,
  },
  {
    id: 'inc-5',
    title: 'Late Evening Community Foot Patrol Active',
    category: 'Community Alerts',
    categoryId: 'alert',
    location: 'Central Plaza Cultural Quarter',
    lat: 37.7788,
    lng: -122.4145,
    date: 'Oct 8, 2026 · 9:00 PM',
    timeAgo: '1h ago',
    source: 'Neighborhood Merchant Alliance',
    isVerified: true,
    severity: 'advisory',
    description: 'Volunteer safety ambassadors wearing high-visibility blue vests assisting transit commuters and visitors until 1 AM.',
    status: 'Active Alert',
    upvotes: 52,
  },
  {
    id: 'inc-6',
    title: 'Uncollected Debris on Protected Bike Lane',
    category: 'Road Hazards',
    categoryId: 'hazard',
    location: 'Howard St & 6th Ave Corridor',
    lat: 37.7798,
    lng: -122.4088,
    date: 'Oct 8, 2026 · 8:50 PM',
    timeAgo: '1h ago',
    source: 'Commuter App Report #77',
    isVerified: false, // Unverified community report
    severity: 'low',
    description: 'Broken timber pallet and gravel scattered across the westbound bike track. Cyclists advised to merge carefully.',
    status: 'Active Alert',
    upvotes: 9,
  },
];

export const PRESET_ROUTES: RouteOption[] = [
  {
    id: 'route-well-lit',
    name: 'Primary Illuminated Corridor',
    tag: 'Recommended Route',
    distance: '1.8 km',
    walkTime: '22 mins',
    bikeTime: '7 mins',
    lightingQuality: 'Well-Lit Corridor',
    safetyRating: 'Recommended Route',
    hazardsEnRoute: 0,
    description: 'Follows major illuminated civic avenues with continuous LED lighting, active transit stops, and zero reported obstructions.',
    coordinates: [
      [37.7858, -122.4065],
      [37.7832, -122.4112],
      [37.7785, -122.4178],
      [37.7712, -122.4285],
    ],
  },
  {
    id: 'route-scenic',
    name: 'Riverbank Greenbelt Trail',
    tag: 'Scenic & Quiet',
    distance: '2.3 km',
    walkTime: '28 mins',
    bikeTime: '9 mins',
    lightingQuality: 'Well-Lit Corridor',
    safetyRating: 'Alternative Route',
    hazardsEnRoute: 0,
    description: 'Upgraded pedestrian walkway along the water with dedicated bike track and new sensor-activated illumination.',
    coordinates: [
      [37.7858, -122.4065],
      [37.7915, -122.4012],
      [37.7875, -122.4215],
      [37.7712, -122.4285],
    ],
  },
  {
    id: 'route-direct',
    name: 'Direct Broadway Crossway',
    tag: 'Fastest Path',
    distance: '1.4 km',
    walkTime: '17 mins',
    bikeTime: '5 mins',
    lightingQuality: 'Standard Lighting',
    safetyRating: 'Highest Caution Rating',
    hazardsEnRoute: 1,
    description: 'Shortest direct distance, but passes adjacent to an active utility trench repair on 4th St.',
    coordinates: [
      [37.7858, -122.4065],
      [37.7842, -122.4042],
      [37.7765, -122.4195],
      [37.7712, -122.4285],
    ],
  },
];

