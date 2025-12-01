import Container from "@/components/layout/container";
import { CaptionText } from "@/components/ui/typography";
import { Twitter, Github } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t-2 border-gray-200 bg-white mt-auto">
      <Container>
        <div className="py-12">
          {/* Centered content */}
          <div className="flex flex-col items-center justify-center space-y-8">
            {/* Brand */}
            <div className="text-center">
              <h3 className="font-nunito font-extrabold text-2xl text-black mb-2">
                PodCast Story
              </h3>
              <CaptionText className="text-gray-600">
                Discover amazing podcast stories
              </CaptionText>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <a
                href="https://x.com/Nonametoregist"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-100"
              >
                <Twitter className="w-5 h-5 text-black" />
              </a>
              <a
                href="https://github.com/Alcu1n"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-white border-2 border-black rounded-lg shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all duration-100"
              >
                <Github className="w-5 h-5 text-black" />
              </a>
            </div>

            {/* Copyright */}
            <div className="text-center">
              <CaptionText className="text-gray-500">
                © {new Date().getFullYear()} PodCast Story. Built by{" "}
                <a
                  href="mailto:alcuin.ch@gmail.com"
                  className="inline-flex items-center hover:text-red-500 transition-colors"
                  title="Contact lemon"
                >
                  <Image
                    src="/TdesignLemon.svg"
                    alt="Lemon"
                    width={16}
                    height={16}
                    className="ml-1"
                  />
                </a>
              </CaptionText>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
