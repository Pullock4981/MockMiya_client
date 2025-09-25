import React from "react";

// The Home component acts as a landing page with a link to the blog.
export default function Home() {
  return (
    // Main container with a dark background and professional styling
    <div className="bg-[#0b0c0f] text-gray-200 min-h-screen font-[Poppins] flex items-center justify-center">
      <main className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-xl mx-auto p-6 rounded-3xl shadow-lg border border-[#1f2129] bg-[#121417]">
          {/* Welcome message and instructions */}
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Welcome to the Blog
          </h1>
          <p className="mt-4 text-gray-400 leading-relaxed">
            Discover articles on career tips, interview preparation, and more.
          </p>

          {/* Link to the blog page styled as a professional button */}
          <div className="mt-8">
            <a
              href="/blog"
              className="inline-block px-6 py-3 bg-green-500 text-black font-semibold rounded-xl shadow hover:bg-green-400 transition"
            >
              Go to Blog
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
