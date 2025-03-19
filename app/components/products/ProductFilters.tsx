"use client";

import { useState } from "react";
import { useLocalization } from "../../context/LocalizationContext";

interface ProductFiltersProps {
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setSortBy: (sort: string) => void;
  categories: string[];
}

export default function ProductFilters({
  setSearchQuery,
  setCategoryFilter,
  setSortBy,
  categories,
}: ProductFiltersProps) {
  const { labels } = useLocalization();
  const [searchInput, setSearchInput] = useState(""); // Controlled search state

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchInput(query); // Update local state
    setSearchQuery(query); // Update global search state in ProductContext
  };

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Search Bar */}
      <input
        type="text"
        value={searchInput} // Controlled state
        onChange={handleSearchChange} // Update state on input change
        placeholder={labels.searchPlaceholder}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white"
      />

      {/* Category Dropdown */}
      <select
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white"
      >
        <option value="">{labels.allCategories}</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Sorting Dropdown */}
      <select
        onChange={(e) => setSortBy(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-white"
      >
        <option value="name">{labels.sortByName}</option>
        <option value="price">{labels.sortByPrice}</option>
        <option value="newest">{labels.sortByNewest}</option>
      </select>
    </div>
  );
}
