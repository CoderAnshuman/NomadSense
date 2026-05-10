
export interface LocationInsight {
  name: string;
  description: string;
  culture: {
    summary: string;
    facts: string[];
    traditions: string[];
  };
  famousPlaces: {
    name: string;
    description: string;
    category: "landmark" | "museum" | "nature" | "hidden-gem";
    latitude: number;
    longitude: number;
  }[];
  festivals: {
    name: string;
    timing: string;
    significance: string;
    isComingSoon: boolean;
  }[];
  activities: {
    title: string;
    description: string;
    vibe: string;
  }[];
  itinerary: {
    day: number;
    theme: string;
    items: {
      time: string;
      activity: string;
      location: string;
      estimatedCost: number;
    }[];
  }[];
  cuisine: {
    name: string;
    description: string;
    type: "dish" | "drink" | "dessert";
    mustTry: boolean;
  }[];
  etiquette: {
    rule: string;
    description: string;
    isEssential: boolean;
  }[];
  travelTips: {
    category: "language" | "transport" | "weather" | "budget";
    content: string;
  }[];
}

export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  additionalInfo?: string;
  photoUrl?: string;
  username?: string;
}

export interface UserTrip {
  id: string;
  userId: string;
  destination: string;
  startDate: string; // ISO string
  endDate: string; // ISO string
  days: number;
  budget: number;
  peopleCount?: number;
  transportMode?: string;
  checklist?: { id: string; task: string; completed: boolean }[];
  notes?: string;
  insight?: LocationInsight;
  createdAt: any;
}

export interface AppState {
  searchQuery: string;
  locationInsight: LocationInsight | null;
  activeTrip: UserTrip | null;
  isLoading: boolean;
  error: string | null;
  user: UserProfile | null;
  authLoading: boolean;
}
