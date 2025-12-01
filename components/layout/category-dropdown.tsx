"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ARTICLE_CATEGORIES, type ArticleCategory } from "@/lib/types";

export default function CategoryDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when pressing Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleCategoryClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 transition-colors border-2 border-transparent ${
          isOpen
            ? "bg-black text-white border-black"
            : "hover:bg-black hover:text-white hover:border-black"
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Category Icon */}
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        Category
        {/* Dropdown Arrow */}
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border-4 border-black shadow-hard z-50">
          {/* Dropdown Header */}
          <div className="px-4 py-3 bg-gray-100 border-b-4 border-black">
            <h3 className="font-mono font-bold text-sm text-black">
              Browse Categories
            </h3>
            <p className="text-xs text-gray-600 font-mono mt-1">
              Explore stories by topic
            </p>
          </div>

          {/* Category List */}
          <div className="max-h-96 overflow-y-auto">
            {ARTICLE_CATEGORIES.map((category) => {
              const categorySlug = encodeURIComponent(category);
              return (
                <Link
                  key={category}
                  href={`/category/${categorySlug}`}
                  onClick={handleCategoryClick}
                  className="block px-4 py-3 border-b-2 border-gray-200 hover:bg-yellow-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Category Icon */}
                      <div className="w-8 h-8 bg-purple-100 border-2 border-black flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <svg
                          className="w-4 h-4 text-purple-700"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>

                      <div>
                        <div className="font-mono font-bold text-sm text-black group-hover:text-red-500 transition-colors">
                          {category}
                        </div>
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Dropdown Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t-4 border-black">
            <p className="text-xs text-gray-500 font-mono">
              Each category features curated stories from world-class podcasts
            </p>
          </div>
        </div>
      )}
    </div>
  );
}