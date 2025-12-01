"use client";

import Link from "next/link";
import Container from "@/components/layout/container";
import { H1 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useRef } from "react";
import CategoryDropdown from "@/components/layout/category-dropdown";
import { ARTICLE_CATEGORIES } from "@/lib/types";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Throttle function to limit scroll events
  const throttle = useCallback((func: Function, limit: number) => {
    let inThrottle: boolean;
    return function (this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }, []);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Show header with glass effect when scrolled down more than 100px
    if (currentScrollY > 100) {
      setIsScrolled(true);

      // Hide/show header based on scroll direction with delay
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        // Scrolling down - hide header after delay
        scrollTimeoutRef.current = setTimeout(() => {
          setIsHeaderVisible(false);
        }, 150); // 150ms delay before hiding
      } else {
        // Scrolling up - show header immediately
        setIsHeaderVisible(true);
      }
    } else {
      setIsScrolled(false);
      setIsHeaderVisible(true);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    // Add scroll event listener with throttling
    const throttledHandleScroll = throttle(handleScroll, 100);
    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [handleScroll, throttle]);

  const headerClasses = `
    w-full z-50 transition-all duration-1000 ease-in-out
    ${isScrolled ? "fixed top-0 left-0" : "relative"}
    ${!isHeaderVisible && isScrolled ? "-translate-y-full" : "translate-y-0"}
    ${
      isScrolled
        ? "bg-white/10 backdrop-blur-sm border-b-2 border-gray-500 shadow-lg"
        : "bg-white border-b-4 border-black"
    }
  `;

  return (
    <header className={headerClasses}>
      <Container>
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link href="/" className="group">
            <H1 className="text-2xl md:text-3xl group-hover:text-red-500 transition-all duration-200 inline-block px-4 py-2 bg-white border-4 border-black rounded-2xl shadow-[4px_4px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]">
              PodCast Story
            </H1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="border-2 border-black hover:bg-black hover:text-white transition-colors">
                Home
              </Button>
            </Link>
            <CategoryDropdown />
            <Link href="/about">
              <Button variant="ghost" size="sm" className="border-2 border-black hover:bg-black hover:text-white transition-colors">
                About
              </Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                // Close icon
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger icon
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t-4 border-black bg-white shadow-lg">
            <div className="px-4 py-6 space-y-4">
              <Link
                href="/"
                className="block"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full justify-start text-left"
                >
                  Home
                </Button>
              </Link>

              {/* Mobile Category Menu */}
              <div className="space-y-2">
                <div className="px-4 py-2 font-mono font-bold text-sm text-black flex items-center gap-2">
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
                  Categories
                </div>
                <div className="ml-4 space-y-1">
                  {ARTICLE_CATEGORIES.map((category) => {
                    const categorySlug = encodeURIComponent(category);
                    return (
                      <Link
                        key={category}
                        href={`/category/${categorySlug}`}
                        className="block"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          size="lg"
                          className="w-full justify-start text-left pl-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-purple-100 border border-black flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-purple-700"
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
                            <span className="font-mono text-sm">{category}</span>
                          </div>
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <Link
                href="/about"
                className="block"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full justify-start text-left"
                >
                  About
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
