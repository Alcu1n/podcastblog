import Container from "@/components/layout/container";
import { CaptionText, BodyText } from "@/components/ui/typography";

export default function Footer() {
  return (
    <footer className="border-t-4 border-black bg-gray-100 mt-16">
      <Container>
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About section */}
            <div>
              <h3 className="font-mono font-bold text-lg mb-4">BRUTAL.BLOG</h3>
              <BodyText className="text-sm">
                Clean code, good taste, brutal design. Thoughts on programming,
                architecture, and the art of software engineering.
              </BodyText>
            </div>

            {/* Links section */}
            <div>
              <h4 className="font-mono font-bold text-lg mb-4">Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="font-sans text-black hover:text-red-500 transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-sans text-black hover:text-red-500 transition-colors"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="font-sans text-black hover:text-red-500 transition-colors"
                  >
                    RSS Feed
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter or other section */}
            <div>
              <h4 className="font-mono font-bold text-lg mb-4">More</h4>
              <BodyText className="text-sm">
                Built with Next.js 16, React 19, and good taste.
              </BodyText>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t-2 border-black mt-8 pt-6 text-center">
            <CaptionText>
              © {new Date().getFullYear()} PodCast Blog. Built with alcu1n.
            </CaptionText>
          </div>
        </div>
      </Container>
    </footer>
  );
}
