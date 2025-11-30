import Link from "next/link";
import Container from "@/components/layout/container";
import { H1 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="border-b-4 border-black bg-white">
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
            <Link href="/archive">
              <Button variant="ghost" size="sm">
                Archive
              </Button>
            </Link>
          </nav>

          {/* Mobile menu button - could be expanded later */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
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
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
