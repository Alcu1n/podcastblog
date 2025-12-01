import Container from "@/components/layout/container";
import { H1, H2, BodyText } from "@/components/ui/typography";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Container>
        <div className="py-16 md:py-24">
          {/* Header Section */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-block mb-8">
              <div className="bg-yellow-400 border-4 border-black p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
                <H1 className="text-5xl md:text-7xl">ABOUT</H1>
              </div>
            </div>
            <BodyText className="text-xl md:text-2xl text-gray-600 mb-8">
              Welcome to PodCast Story - Your Gateway to Amazing Stories
            </BodyText>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 mb-16">
            {/* Developer Info Card */}
            <div className="bg-blue-100 border-4 border-black p-8 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
              <div className="mb-6">
                <div className="w-20 h-20 bg-red-500 border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                  <span className="text-white font-mono font-bold text-2xl">L</span>
                </div>
              </div>
              <H2 className="text-3xl mb-4">Developer</H2>
              <BodyText className="text-lg mb-4">
                <strong>Name:</strong> lemon
              </BodyText>
              <BodyText className="text-lg mb-4">
                <strong>Email:</strong> alcuin.ch@gmail.com
              </BodyText>
              <BodyText className="text-lg mb-6">
                A passionate developer who loves creating beautiful and functional web experiences.
              </BodyText>
              <Link
                href="mailto:alcuin.ch@gmail.com"
                className="inline-flex items-center justify-center whitespace-nowrap font-mono font-bold transition-all duration-100 bg-red-500 text-white border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 h-10 px-4 text-sm"
              >
                Contact Me
              </Link>
            </div>

            {/* Website Info Card */}
            <div className="bg-green-100 border-4 border-black p-8 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
              <div className="mb-6">
                <div className="w-20 h-20 bg-black border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] flex items-center justify-center">
                  <span className="text-white font-mono font-bold text-xl">PS</span>
                </div>
              </div>
              <H2 className="text-3xl mb-4">Website</H2>
              <BodyText className="text-lg mb-4">
                <strong>Purpose:</strong> PodCast Story Hub
              </BodyText>
              <BodyText className="text-lg leading-relaxed">
                This is a podcast story website dedicated to collecting and sharing wonderful long-form text stories.
                We believe in the power of storytelling and aim to create a space where amazing narratives can be discovered and enjoyed.
              </BodyText>
            </div>
          </div>

          {/* Features Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-red-50 border-4 border-black p-8 shadow-[6px_6px_0px_rgba(0,0,0,1)]">
              <H2 className="text-4xl mb-8 text-center">What We Offer</H2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-yellow-300 border-4 border-black p-6 mb-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    <H2 className="text-2xl">📚</H2>
                  </div>
                  <BodyText className="font-bold">Rich Stories</BodyText>
                  <BodyText className="text-sm">Carefully curated long-form content</BodyText>
                </div>
                <div className="text-center">
                  <div className="bg-blue-300 border-4 border-black p-6 mb-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    <H2 className="text-2xl">🎧</H2>
                  </div>
                  <BodyText className="font-bold">Podcast Focus</BodyText>
                  <BodyText className="text-sm">Stories perfect for audio adaptation</BodyText>
                </div>
                <div className="text-center">
                  <div className="bg-green-300 border-4 border-black p-6 mb-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                    <H2 className="text-2xl">✨</H2>
                  </div>
                  <BodyText className="font-bold">Quality Content</BodyText>
                  <BodyText className="text-sm">Every story is handpicked for excellence</BodyText>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-black border-4 border-black p-8 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
              <H2 className="text-4xl mb-6 text-white">Get In Touch</H2>
              <BodyText className="text-lg text-white mb-8">
                Have a story to share or want to collaborate? We'd love to hear from you!
              </BodyText>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="mailto:alcuin.ch@gmail.com"
                  className="inline-flex items-center justify-center whitespace-nowrap font-mono font-bold transition-all duration-100 bg-white text-black border-4 border-white shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 h-14 px-8 text-lg"
                >
                  Send Email
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center whitespace-nowrap font-mono font-bold transition-all duration-100 bg-transparent text-white border-4 border-white hover:bg-white hover:text-black h-14 px-8 text-lg"
                >
                  Back to Stories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}