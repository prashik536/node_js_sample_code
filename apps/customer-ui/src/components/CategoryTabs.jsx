import React from 'react';
import { CATEGORIES } from '../data/mockData';

export default function CategoryTabs({ selectedCategory, onSelectCategory }) {
  return (
    <div className="category-scroll-container">
      <div className="category-list">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              className={`category-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
