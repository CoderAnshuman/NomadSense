
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

export interface AppState {
  searchQuery: string;
  locationInsight: LocationInsight | null;
  isLoading: boolean;
  error: string | null;
}
