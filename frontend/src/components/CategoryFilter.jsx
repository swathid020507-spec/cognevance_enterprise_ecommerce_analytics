import React from 'react';
import './CategoryFilter.css';

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  sortOption,
  onSortChange,
  searchQuery,
  onClearSearch,
  totalResults
}) {
  return (
    <div className="filter-wrapper">
      <div className="filter-top-bar">
        <div className="category-chips">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`chip-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="filter-controls">
          <div className="sort-box">
            <label htmlFor="sort-select">Sort By:</label>
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
            </select>
          </div>
        </div>
      </div>

      {(searchQuery || selectedCategory !== 'All Categories') && (
        <div className="active-filter-bar">
          <span>
            Showing <strong>{totalResults}</strong> result{totalResults !== 1 ? 's' : ''}
            {searchQuery && <> for "<strong>{searchQuery}</strong>"</>}
            {selectedCategory !== 'All Categories' && <> in <em>{selectedCategory}</em></>}
          </span>

          <button
            className="clear-filters-btn"
            onClick={() => {
              onClearSearch();
              onSelectCategory('All Categories');
            }}
          >
            Clear Filters ×
          </button>
        </div>
      )}
    </div>
  );
}
