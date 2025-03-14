"use client";

interface ProductFiltersProps {
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (category: string) => void;
  setSortBy: (sort: string) => void;
  categories: string[];
  labels: { [key: string]: string }; // Labels received from API
}

export default function ProductFilters({ setSearchQuery, setCategoryFilter, setSortBy, categories, labels }: ProductFiltersProps) {
  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder={labels.searchPlaceholder}
        className="border rounded px-3 py-2"
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Category Dropdown */}
      <select onChange={(e) => setCategoryFilter(e.target.value)} className="border rounded px-3 py-2">
        <option value="">{labels.allCategories}</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {/* Sorting Dropdown */}
      <select onChange={(e) => setSortBy(e.target.value)} className="border rounded px-3 py-2">
        <option value="name">{labels.sortByName}</option>
        <option value="price">{labels.sortByPrice}</option>
        <option value="newest">{labels.sortByNewest}</option>
      </select>
    </div>
  );
}
