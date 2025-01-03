import React from "react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Header from "../../Header.js";
import animationGif from "../../images/AnimationAbout.gif";
import CollobarationImg from "../../images/CollobarationImg.jpg";
import VisualTaskImg from "../../images/VisualTaskImg.jpg";
import Footer from "../../footer";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Vision
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  We envision a world where project management is intuitive,
                  visual, and accessible to everyone. Flowboard is designed to
                  eliminate the complexity of traditional project management
                  tools while delivering powerful features that teams actually
                  need.
                </p>
                <p className="text-lg text-gray-600">
                  Our platform enables teams to create clear visual workflows,
                  manage tasks efficiently, and collaborate seamlessly - all in
                  one integrated workspace.
                </p>
              </div>
              <div className="lg:w-1/2">
                <div className="relative w-600 h-[400px] rounded-lg shadow-xl overflow-hidden">
                  <Image
                    src={animationGif}
                    alt="Project Management Animation"
                    fill
                    priority
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
              Why Choose Flowboard
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="relative group hover:transform hover:scale-105 transition-all duration-300 ">
                <Image
                  src={VisualTaskImg}
                  alt="Visual Workflows"
                  className="rounded-lg shadow-lg mb-6 w-3/4 max-w-sm"
                />

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Visual Task Management
                </h3>
                <p className="text-gray-600">
                  Transform complex projects into clear, visual workflows that
                  your entire team can understand and execute efficiently.
                </p>
                <ArrowRight className="absolute bottom-0 right-0 h-6 w-6 text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="relative group hover:transform hover:scale-105 transition-all duration-300">
                <Image
                  src={CollobarationImg}
                  alt="Team Collaboration"
                  className="rounded-lg shadow-lg mb-6 w-3/4 max-w-sm"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Seamless Collaboration
                </h3>
                <p className="text-gray-600">
                  Built-in collaboration tools keep your team aligned and
                  productive, with real-time updates and clear communication
                  channels.
                </p>
                <ArrowRight className="absolute bottom-0 right-0 h-6 w-6 text-blue-900 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-gradient-to-r from-blue-950 to-blue-700 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of teams who have already revolutionized their
              project management with Flowboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-900 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center justify-center gap-2">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white/10 transition-colors font-medium">
                Schedule Demo
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
