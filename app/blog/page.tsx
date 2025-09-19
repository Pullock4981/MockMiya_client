import Head from "next/head";
import Link from "next/link";
import React from "react";
import { Helmet } from "react-helmet";

interface BlogPost {
  id: number;
  category: string;
  title: string;
  summary: string;
  date: string;
  imageUrl: string;
  imageAlt: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    category: "Career Tips",
    title: "The Ultimate Guide to ATS-Friendly Resumes",
    summary:
      "In a competitive job market, your resume needs to pass the Applicant Tracking System (ATS) before it reaches a human. Our detailed guide breaks down the essential elements, from formatting to keyword optimization, that will get your application noticed and land you an interview.",
    date: "Oct 1, 2025",
    imageUrl: "https://i.ibb.co.com/rR1yKSxh/Ai-resume.jpg",
    imageAlt: "A person on a laptop, writing a resume.",
  },
  {
    id: 2,
    category: "Interview Prep",
    title: "Master Your Next Interview with AI Simulation",
    summary:
      "Interview anxiety can be a major hurdle. Discover how MockMiya's AI simulator offers a realistic, safe space to practice your interview skills. Our platform provides actionable, data-driven feedback on your tone, clarity, and confidence to help you perform your best when it matters most.",
    date: "Sep 25, 2025",
    imageUrl: "https://i.ibb.co.com/mCgXG34T/Interview-preparation.jpg",
    imageAlt: "A person preparing for a video interview.",
  },
  {
    id: 3,
    category: "Technical Skills",
    title: "How to Ace Your Coding Challenge with AI Feedback",
    summary:
      "Technical interviews are about more than just solving a problem; they're about clear communication and efficient code. This article explains how MockMiya's AI analyzes your solution, offering a detailed commentary on your approach, code efficiency, and potential improvements to help you stand out.",
    date: "Sep 18, 2025",
    imageUrl: "https://i.ibb.co.com/LDMGq08v/Coding-challenge.jpg",
    imageAlt: "Close-up of a person coding on a laptop screen.",
  },
  {
    id: 4,
    category: "Career Growth",
    title: "From Graduate to Professional: A Roadmap to Success",
    summary:
      "Navigating the start of your career can be overwhelming. This guide provides a clear and actionable roadmap, outlining the essential skills, networking strategies, and professional development tips you need to confidently transition from student life to a successful career.",
    date: "Sep 10, 2025",
    imageUrl: "https://i.ibb.co.com/zVnb1ntC/Career-path.jpg",
    imageAlt: "A person walking on a path, representing a career roadmap.",
  },
  {
    id: 5,
    category: "Writing Tips",
    title: "The Secret to a Standout Cover Letter",
    summary:
      "Your cover letter is a unique opportunity to tell your story and make a strong first impression. Learn how our AI-powered tool can help you craft a personalized and compelling letter in minutes, ensuring your application catches a recruiter's eye and highlights exactly why you're the best candidate.",
    date: "Sep 5, 2025",
    imageUrl: "https://i.ibb.co.com/x8rbvKNW/Coverlatter.jpg",
    imageAlt: "A person typing a document on a laptop.",
  },
  {
    id: 6,
    category: "Industry Insights",
    title: "Top Tech Jobs to Watch in 2026",
    summary:
      "The tech landscape is always evolving. We've compiled a list of the most in-demand tech roles for the coming year, complete with a skill breakdown and insight into future trends. Stay ahead of the curve by understanding where the industry is heading and what skills are most valuable.",
    date: "Aug 30, 2025",
    imageUrl: "https://i.ibb.co.com/Xxmndfqm/Tech-job.jpg",
    imageAlt: "Professionals collaborating in a modern office.",
  },
];


export const metadata = {
  title: "MockMiya Blog - Career Tips, Tech & AI",
  description:
    "Stay updated with the latest in career tips, interview preparation, technical skills, and AI advancements with MockMiya Blog.",
  openGraph: {
    title: "MockMiya Blog",
    description:
      "Stay updated with the latest in career tips, interview preparation, technical skills, and AI advancements with MockMiya Blog.",
    type: "website",
  },
};
const Blog = () => {
  return (
    <>
  <Head>
        <title>MockMiya Blog - Career Tips, Tech & AI</title>
        <meta
          name="description"
          content="Stay updated with the latest in career tips, interview preparation, technical skills, and AI advancements with MockMiya Blog."
        />
        <meta property="og:title" content="MockMiya Blog" />
        <meta
          property="og:description"
          content="Stay updated with the latest in career tips, interview preparation, technical skills, and AI advancements with MockMiya Blog."
        />
        <meta property="og:type" content="website" />
      </Head>
    <div className="bg-[#0b0c0f] text-gray-200 min-h-screen font-[Poppins]">
      
      <main className="container mx-auto px-4 py-16">
        {/* Blog Header */}
      <header className="text-center mb-20">
  <div className="relative w-full md:w-auto">
    {/* Banner Background */}
    <div className="bg-gradient-to-r from-green-500 to-blue-500 px-6 md:px-16 py-6 md:py-10 rounded-none md:rounded-2xl shadow-2xl relative z-10">
      <h1 className="text-3xl md:text-6xl font-extrabold tracking-widest text-white uppercase drop-shadow-lg">
        MockMiya <span className="text-yellow-300">Blog</span>
      </h1>
      <p className="text-sm md:text-2xl text-gray-100 mt-3 md:mt-4 font-medium md:font-semibold tracking-wide">
        Stay updated with the latest in career tips, tech trends, and AI advancements.
      </p>
    </div>

    {/* Left Ribbon (hidden on small screens) */}
    <div className="hidden md:block absolute top-1/2 left-[-50px] -translate-y-1/2 w-0 h-0 
                    border-t-[70px] border-t-transparent 
                    border-b-[70px] border-b-transparent 
                    border-r-[50px] border-r-green-700">
    </div>

    {/* Right Ribbon (hidden on small screens) */}
    <div className="hidden md:block absolute top-1/2 right-[-50px] -translate-y-1/2 w-0 h-0 
                    border-t-[70px] border-t-transparent 
                    border-b-[70px] border-b-transparent 
                    border-l-[50px] border-l-blue-700">
    </div>
  </div>
</header>


        {/* Blog Posts as Hero Sections */}
        <section className="space-y-16">
          {blogPosts.map((post, index) => (
            <div
              key={post.id}
              className={`flex flex-col md:flex-row lg:max-h-80 ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              } items-center gap-8 bg-[#121417] rounded-3xl border border-[#1f2129] shadow-lg overflow-hidden`}
            >
              {/* Hero Image */}
              <div className="w-full md:w-1/2">
                <img
                  src={post.imageUrl}
                  alt={post.imageAlt}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>

              {/* Hero Content */}
              <div className="w-full md:w-1/2 p-6 md:p-10">
                <span className="text-xs font-semibold uppercase text-gray-500 tracking-widest">
                  {post.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mt-3 mb-4 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent hover:from-green-300 hover:to-blue-300 transition-colors duration-300">
                  {post.title}
                </h2>
                <p className="text-gray-400 mt-2 text-sm md:text-base leading-relaxed">
                  {post.summary}
                </p>
                <div className="mt-6 flex items-center justify-between">
                  <Link
                    href={`/blog/${post.id}`}
                    className="text-green-400 font-semibold hover:underline"
                  >
                    Read More &rarr;
                  </Link>
                  <span className="text-gray-500 text-xs md:text-sm">
                    {post.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
    </>
  );
};

export default Blog;
