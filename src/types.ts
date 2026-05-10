
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
}

export interface AppState {
  searchQuery: string;
  locationInsight: LocationInsight | null;
  isLoading: boolean;
  error: string | null;
}
