import Image from "next/image";
import React from 'react';
import Link from "next/link";
import { Pencil, Share2, Download, Shapes, Users } from 'lucide-react';

function FeatureCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
      <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-indigo-600" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Collaborative Whiteboarding
              <span className="text-indigo-600"> Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Create, collaborate, and share beautiful diagrams and sketches with our intuitive drawing tool. No sign-up required.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href={"/signin"}>
                <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                  Sign In
                </button>
              </Link>
              <Link href={"/signup"}>
                <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Preview Image */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="relative rounded-xl shadow-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=2700&q=80"
              alt="Excalidraw Interface Preview"
              className="w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/30 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Everything you need to bring ideas to life</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Pencil}
            title="Intuitive Drawing"
            description="Simple yet powerful drawing tools that feel natural and responsive."
          />
          <FeatureCard
            icon={Share2}
            title="Easy Sharing"
            description="Share your drawings with a simple link. No account required."
          />
          <FeatureCard
            icon={Download}
            title="Export Options"
            description="Export your drawings in multiple formats including PNG, SVG, and PDF."
          />
          <FeatureCard
            icon={Shapes}
            title="Rich Components"
            description="Access a library of shapes, arrows, and other elements to enhance your diagrams."
          />
          <FeatureCard
            icon={Users}
            title="Real-time Collaboration"
            description="Work together with your team in real-time, seeing changes as they happen."
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-600">© 2025 Siddhesh Dhonde. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
