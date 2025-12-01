"use client";

import Link from "next/link";
import Container from "@/components/layout/container";
import { H1 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback, useRef } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

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
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="group">
            <H1 className="text-2xl md:text-3xl group-hover:text-red-500 transition-colors">
              PodCast Story
            </H1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <Button variant="ghost" size="sm">
                Home
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="sm">
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
