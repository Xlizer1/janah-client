"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  InputAdornment,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Search, TrendingUp } from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";
import { searchService } from "@/services/search.service";
import { useUI } from "@/store/ui.store";
import { useDebounce } from "@/hooks/useDebounce";

export function SearchBar() {
  const router = useRouter();
  const { setSearchQuery } = useUI();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  // Get search suggestions
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["searchSuggestions", debouncedQuery],
    queryFn: () =>
      searchService.getSuggestions({ q: debouncedQuery, limit: 8 }),
    enabled: debouncedQuery.length >= 2,
  });

  // Popular searches (mock data - you can replace with actual data)
  const popularSearches = [
    "iPhone 15",
    "MacBook Air",
    "Samsung Galaxy",
    "AirPods Pro",
    "Gaming Laptop",
  ];

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setSearchQuery(searchTerm);
    router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    setIsFocused(false);
    setQuery("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box ref={searchRef} sx={{ position: "relative", width: "100%" }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          placeholder="Search products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
            endAdornment: isLoading && (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "background.paper",
              "&:hover": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "primary.main",
                },
              },
            },
          }}
        />
      </form>

      {/* Search Suggestions Dropdown */}
      {isFocused && (
        <Paper
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1300,
            maxHeight: 400,
            overflow: "auto",
            mt: 1,
          }}
          elevation={3}
        >
          {/* Show suggestions if there's a query */}
          {debouncedQuery.length >= 2 &&
            suggestions?.suggestions &&
            suggestions.suggestions.length > 0 && (
              <>
                <Box sx={{ p: 2, pb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Suggestions
                  </Typography>
                </Box>
                <List dense>
                  {suggestions.suggestions.map((suggestion, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() =>
                        handleSuggestionClick(suggestion.suggestion)
                      }
                      sx={{
                        "&:hover": {
                          bgcolor: "action.hover",
                        },
                      }}
                    >
                      <Search
                        sx={{ mr: 2, color: "action.active", fontSize: 20 }}
                      />
                      <ListItemText
                        primary={suggestion.suggestion}
                        secondary={
                          <Chip
                            label={suggestion.type}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "0.75rem", height: 20 }}
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

          {/* Show popular searches when no query or no results */}
          {(!debouncedQuery ||
            (debouncedQuery.length >= 2 &&
              suggestions?.suggestions &&
              suggestions.suggestions.length === 0)) && (
            <>
              <Box sx={{ p: 2, pb: 1 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <TrendingUp fontSize="small" />
                  {debouncedQuery.length >= 2
                    ? "No suggestions found. Try these popular searches:"
                    : "Popular Searches"}
                </Typography>
              </Box>
              <List dense>
                {popularSearches.map((search, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleSuggestionClick(search)}
                    sx={{
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <TrendingUp
                      sx={{ mr: 2, color: "action.active", fontSize: 20 }}
                    />
                    <ListItemText primary={search} />
                  </ListItem>
                ))}
              </List>
            </>
          )}

          {/* Loading state */}
          {isLoading && debouncedQuery.length >= 2 && (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ mt: 1 }}>
                Searching...
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}