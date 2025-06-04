import { api } from "@/lib/api-client";
import type {
  GlobalSearchResult,
  SearchSuggestion,
  FilterOptions,
} from "@/types";

export const searchService = {
  globalSearch: async (params: {
    q: string;
    limit?: number;
  }): Promise<GlobalSearchResult> => {
    return api.get("/search/global", params);
  },

  getSuggestions: async (params: {
    q: string;
    limit?: number;
  }): Promise<{ suggestions: SearchSuggestion[] }> => {
    return api.get("/search/suggestions", params);
  },

  getFilterOptions: async (params?: {
    category_id?: number;
  }): Promise<FilterOptions> => {
    return api.get("/search/filters", params);
  },
};

export default searchService;
