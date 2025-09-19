import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// ---------------- Type definition ----------------
interface BlogPost {
  id: number;
  category: string;
  title: string;
  summary: string;
  date: string;
  imageUrl: string;
  imageAlt: string;
}

// ---------------- Static blog posts ----------------
const blogPosts: BlogPost[] = [
  {
    id: 1,
    category: "Career Tips",
    title: "The Ultimate Guide to ATS-Friendly Resumes",
    summary:
      "In today’s fiercely competitive job market, your resume must first pass through an ATS before reaching a recruiter...",
    date: "Oct 1, 2025",
    imageUrl: "https://i.ibb.co.com/rR1yKSxh/Ai-resume.jpg",
    imageAlt: "A person on a laptop, writing a resume.",
  },
  {
    id: 2,
    category: "Interview Prep",
    title: "Master Your Next Interview with AI Simulation",
    summary:
      "Interview anxiety often derails skilled candidates. MockMiya’s AI-driven interview simulator provides real-time feedback...",
    date: "Sep 25, 2025",
    imageUrl: "https://i.ibb.co.com/mCgXG34T/Interview-preparation.jpg",
    imageAlt: "A person preparing for a video interview.",
  },
  {
    id: 3,
    category: "Technical Skills",
    title: "How to Ace Your Coding Challenge with AI Feedback",
    summary:
      "Technical interviews test more than just correct code. MockMiya’s AI feedback helps optimize your problem-solving approach...",
    date: "Sep 18, 2025",
    imageUrl: "https://i.ibb.co.com/LDMGq08v/Coding-challenge.jpg",
    imageAlt: "Close-up of a person coding on a laptop screen.",
  },
  {
    id: 4,
    category: "Career Growth",
    title: "From Graduate to Professional: A Roadmap to Success",
    summary:
      "Transitioning from graduation to professional life requires adaptability and strategy. This roadmap provides a clear path...",
    date: "Sep 10, 2025",
    imageUrl: "https://i.ibb.co.com/zVnb1ntC/Career-path.jpg",
    imageAlt: "A person walking on a path, representing a career roadmap.",
  },
  {
    id: 5,
    category: "Writing Tips",
    title: "The Secret to a Standout Cover Letter",
    summary:
      "While resumes highlight achievements, cover letters connect your story to company needs. Here’s how to write a standout one...",
    date: "Sep 5, 2025",
    imageUrl: "https://i.ibb.co.com/x8rbvKNW/Coverlatter.jpg",
    imageAlt: "A person typing a document on a laptop.",
  },
  {
    id: 6,
    category: "Industry Insights",
    title: "Top Tech Jobs to Watch in 2026",
    summary:
      "As 2026 approaches, AI/ML engineers, cybersecurity analysts, and cloud architects will be among the hottest careers...",
    date: "Aug 30, 2025",
    imageUrl: "https://i.ibb.co.com/Xxmndfqm/Tech-job.jpg",
    imageAlt: "Professionals collaborating in a modern office.",
  },
];

// ---------------- Blog Details Page ----------------
export default async function BlogDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ must await in Next.js 15
  const post = blogPosts.find((p) => p.id === Number(id));

  if (!post) return notFound();

  const recommended = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="bg-[#0b0c0f] text-gray-200 min-h-screen font-[Poppins]">
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Blog Details */}
        <article className="bg-[#121417] p-6 md:p-10 lg:p-12 rounded-3xl shadow-lg border border-[#1f2129]">
          <span className="text-xs font-semibold uppercase text-green-400 tracking-widest">
            {post.category}
          </span>

          <Image
            src={post.imageUrl}
            alt={post.imageAlt}
            width={800}
            height={400}
            className="w-full h-[400px] object-cover rounded-2xl my-6"
          />

          <p className="text-gray-400 text-sm">{post.date}</p>

          <h1 className="text-3xl md:text-4xl font-extrabold mt-4">
            {post.title}
          </h1>

          <p className="text-gray-300 text-base mt-6 whitespace-pre-wrap">
            {post.summary}
          </p>
        </article>

        {/* Recommended */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Recommended for you</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommended.map((rec) => (
              <div
                key={rec.id}
                className="bg-[#121417] border border-[#1f2129] rounded-2xl shadow-lg overflow-hidden"
              >
                <Image
                  src={rec.imageUrl}
                  alt={rec.imageAlt}
                  width={400}
                  height={200}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    {rec.category}
                  </span>
                  <h3 className="text-lg font-bold mt-2">{rec.title}</h3>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-3">
                    {rec.summary}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      href={`/blog/${rec.id}`}
                      className="text-green-400 font-semibold hover:underline text-sm"
                    >
                      Read More →
                    </Link>
                    <span className="text-gray-500 text-xs">{rec.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-green-500 text-black font-semibold rounded-xl hover:bg-green-400 transition"
          >
            ← Back to Blog
          </Link>
        </div>
      </main>
    </div>
  );
}
