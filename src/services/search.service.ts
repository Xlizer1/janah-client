import { api } from "@/lib/api-client";
import type {
  GlobalSearchResult,
  SearchSuggestion,
  FilterOptions,
} from "@/types";

export const searchService = {
  // Global search across products and categories
  globalSearch: async (params: {
    q: string;
    limit?: number;
  }): Promise<GlobalSearchResult> => {
    return api.get("/search/global", params);
  },

  // Get search suggestions/autocomplete
  getSuggestions: async (params: {
    q: string;
    limit?: number;
  }): Promise<{ suggestions: SearchSuggestion[] }> => {
    return api.get("/search/suggestions", params);
  },

  // Get filter options for advanced search
  getFilterOptions: async (params?: {
    category_id?: number;
  }): Promise<FilterOptions> => {
    return api.get("/search/filters", params);
  },
};

export default searchService;
