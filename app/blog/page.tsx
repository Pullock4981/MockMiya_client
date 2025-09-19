import Link from "next/link";
import React from "react";

// Define the structure for a single blog post object.
// This ensures type safety and consistency across the data.
interface BlogPost {
  id: number;
  category: string;
  title: string;
  summary: string;
  date: string;
  imageUrl: string;
  imageAlt: string;
}

// Array of blog post data. Each object represents a single post.
// This makes it easy to add, remove, or edit blog content.
const blogPosts: BlogPost[] = [
  {
    id: 1,
    category: 'Career Tips',
    title: 'The Ultimate Guide to ATS-Friendly Resumes',
    summary: 'In a competitive job market, your resume needs to pass the Applicant Tracking System (ATS) before it reaches a human. Our detailed guide breaks down the essential elements, from formatting to keyword optimization, that will get your application noticed and land you an interview.',
    date: 'Oct 1, 2025',
    imageUrl: 'https://i.ibb.co.com/rR1yKSxh/Ai-resume.jpg',
    imageAlt: 'A person on a laptop, writing a resume.',
  },
  {
    id: 2,
    category: 'Interview Prep',
    title: 'Master Your Next Interview with AI Simulation',
    summary: 'Interview anxiety can be a major hurdle. Discover how MockMiya\'s AI simulator offers a realistic, safe space to practice your interview skills. Our platform provides actionable, data-driven feedback on your tone, clarity, and confidence to help you perform your best when it matters most.',
    date: 'Sep 25, 2025',
    imageUrl: 'https://i.ibb.co.com/mCgXG34T/Interview-preparation.jpg',
    imageAlt: 'A person preparing for a video interview.',
  },
  {
    id: 3,
    category: 'Technical Skills',
    title: 'How to Ace Your Coding Challenge with AI Feedback',
    summary: 'Technical interviews are about more than just solving a problem; they\'re about clear communication and efficient code. This article explains how MockMiya\'s AI analyzes your solution, offering a detailed commentary on your approach, code efficiency, and potential improvements to help you stand out.',
    date: 'Sep 18, 2025',
    imageUrl: 'https://i.ibb.co.com/LDMGq08v/Coding-challenge.jpg',
    imageAlt: 'Close-up of a person coding on a laptop screen.',
  },
  {
    id: 4,
    category: 'Career Growth',
    title: 'From Graduate to Professional: A Roadmap to Success',
    summary: 'Navigating the start of your career can be overwhelming. This guide provides a clear and actionable roadmap, outlining the essential skills, networking strategies, and professional development tips you need to confidently transition from student life to a successful career.',
    date: 'Sep 10, 2025',
    imageUrl: 'https://i.ibb.co.com/zVnb1ntC/Career-path.jpg',
    imageAlt: 'A person walking on a path, representing a career roadmap.',
  },
  {
    id: 5,
    category: 'Writing Tips',
    title: 'The Secret to a Standout Cover Letter',
    summary: 'Your cover letter is a unique opportunity to tell your story and make a strong first impression. Learn how our AI-powered tool can help you craft a personalized and compelling letter in minutes, ensuring your application catches a recruiter\'s eye and highlights exactly why you\'re the best candidate.',
    date: 'Sep 5, 2025',
    imageUrl: 'https://i.ibb.co.com/x8rbvKNW/Coverlatter.jpg',
    imageAlt: 'A person typing a document on a laptop.',
  },
  {
    id: 6,
    category: 'Industry Insights',
    title: 'Top Tech Jobs to Watch in 2026',
    summary: 'The tech landscape is always evolving. We\'ve compiled a list of the most in-demand tech roles for the coming year, complete with a skill breakdown and insight into future trends. Stay ahead of the curve by understanding where the industry is heading and what skills are most valuable.',
    date: 'Aug 30, 2025',
    imageUrl: 'https://i.ibb.co.com/Xxmndfqm/Tech-job.jpg',
    imageAlt: 'Professionals collaborating in a modern office.',
  },
];

// Main Blog component that renders the page content.
const Blog = () => {
  return (
    // Main container with dark background and typography styling.
    <div className="bg-[#0b0c0f] text-gray-200 min-h-screen font-[Poppins]">
      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-16">
        {/* Blog Header */}
        <header className="text-center mb-12">
          {/* Main title of the blog page */}
          <h1 className="text-5xl font-extrabold tracking-tight">
            MockMiya <span className="gradient-text">Blog</span>
          </h1>
          {/* Subtitle providing a brief description */}
          <p className="text-lg text-gray-400 mt-4">
            Stay updated with the latest in career tips, tech trends, and AI
            advancements.
          </p>
        </header>

        {/* Blog Posts Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Map over the blogPosts array to render a card for each post. */}
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="card p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-[#121417] border border-[#1f2129]"
            >
              {/* Blog post image */}
              <img
                className="rounded-2xl w-full h-48 object-cover mb-6"
                src={post.imageUrl}
                alt={post.imageAlt}
              />
              {/* Category tag */}
              <span className="text-xs font-semibold uppercase text-gray-500 tracking-widest">
                {post.category}
              </span>
              {/* Post title */}
              <h2 className="text-xl font-bold mt-2">{post.title}</h2>
              {/* Post summary */}
              <p className="text-gray-400 mt-4 text-sm leading-relaxed">
                {post.summary}
              </p>
              {/* Read more link and date */}
              <div className="mt-6 flex items-center justify-between">
                <Link
                  href={`/blog/${post.id}`}
                  className="text-green-400 font-semibold hover:underline"
                >
                  Read More &rarr;
                </Link>
                <span className="text-gray-500 text-xs">{post.date}</span>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Blog;
