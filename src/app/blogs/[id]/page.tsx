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
      "In today's fiercely competitive job market, your resume must first pass through an ATS before reaching a recruiter. Our comprehensive guide covers everything from proper formatting and keyword optimization to avoiding common pitfalls that get resumes rejected. Learn how to structure your resume for both machines and humans, increasing your chances of landing that crucial interview.",
    date: "Oct 1, 2025",
    imageUrl: "https://i.ibb.co/FdMrdfK/mock-blog1.jpg",
    imageAlt: "A person on a laptop, writing a resume.",
  },
  {
    id: 2,
    category: "Interview Prep",
    title: "Master Your Next Interview with AI Simulation",
    summary:
      "Interview anxiety often derails skilled candidates. MockMiya's AI-driven interview simulator provides real-time feedback on your responses, body language, and communication style. Practice with industry-specific questions and receive detailed analytics on your performance. Build confidence through repeated practice sessions tailored to your target role and company.",
    date: "Sep 25, 2025",
    imageUrl: "https://i.ibb.co/hJC4XpgQ/mock-blog2.jpg",
    imageAlt: "A person preparing for a video interview.",
  },
  {
    id: 3,
    category: "Technical Skills",
    title: "How to Ace Your Coding Challenge with AI Feedback",
    summary:
      "Technical interviews test more than just correct code. MockMiya's AI feedback helps optimize your problem-solving approach, code structure, and explanation clarity. Our platform analyzes your solutions for efficiency, readability, and best practices. Get personalized suggestions for improvement and learn to communicate your thought process effectively during live coding sessions.",
    date: "Sep 18, 2025",
    imageUrl: "https://i.ibb.co/WvFDHcR9/mock-blog3.jpg",
    imageAlt: "Close-up of a person coding on a laptop screen.",
  },
  {
    id: 4,
    category: "Career Growth",
    title: "From Graduate to Professional: A Roadmap to Success",
    summary:
      "Transitioning from graduation to professional life requires adaptability and strategic planning. This roadmap provides a clear path for developing essential workplace skills, building professional networks, and setting achievable career milestones. Learn how to navigate corporate culture, manage expectations, and continue growing throughout your career journey.",
    date: "Sep 10, 2025",
    imageUrl: "https://i.ibb.co/bjchCCj6/mock-blog4.png",
    imageAlt: "A person walking on a path, representing a career roadmap.",
  },
  {
    id: 5,
    category: "Writing Tips",
    title: "The Secret to a Standout Cover Letter",
    summary:
      "While resumes highlight achievements, cover letters connect your personal story to company needs. Learn how to craft compelling narratives that demonstrate your unique value proposition. Our AI-powered tool helps personalize each letter, ensuring you address specific company pain points and show genuine interest in the organization's mission and values.",
    date: "Sep 5, 2025",
    imageUrl: "https://i.ibb.co/TDPh3NpQ/mock-blog5.jpg",
    imageAlt: "A person typing a document on a laptop.",
  },
  {
    id: 6,
    category: "Industry Insights",
    title: "Top Tech Jobs to Watch in 2026",
    summary:
      "As 2026 approaches, emerging technologies continue to reshape the job market. AI/ML engineers, cybersecurity analysts, and cloud architects will be among the hottest careers. This comprehensive analysis covers required skill sets, salary expectations, and growth projections for each role. Stay ahead of industry trends and position yourself for success in the evolving tech landscape.",
    date: "Aug 30, 2025",
    imageUrl: "https://i.ibb.co/rRM0CCCr/mock-blog6.jpg",
    imageAlt: "Professionals collaborating in a modern office.",
  },
];

// ---------------- Blog Details Page ----------------
export default function BlogDetails({
  params,
}: {
  params: { id: string };
}) {
  const post = blogPosts.find((p) => p.id === Number(params.id));

  if (!post) return notFound();

  const recommended = blogPosts.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="my-8 min-h-screen font-[Poppins]">
      <main className="w-11/12 mx-auto px-4 py-16">
        {/* Blog Details */}
        <article className="p-6 md:p-10 lg:p-12 rounded-3xl shadow-lg border">
          <span className="text-xs font-semibold uppercase  tracking-widest">
            {post.category}
          </span>

          <Image
            src={post.imageUrl}
            alt={post.imageAlt}
            width={800}
            height={400}
            className="w-full h-[400px] object-cover rounded-2xl my-6"
          />

          <p className=" text-sm">{post.date}</p>

          <h1 className="text-3xl md:text-4xl font-extrabold mt-4">
            {post.title}
          </h1>

          <p className=" text-base mt-6 whitespace-pre-wrap leading-relaxed">
            {post.summary}
          </p>
        </article>

        {/* Recommended Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Recommended for you</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommended.map((rec) => (
              <div
                key={rec.id}
                className=" border rounded-2xl shadow-lg overflow-hidden hover:border-orange-400/30 transition-colors duration-300"
              >
                <Image
                  src={rec.imageUrl}
                  alt={rec.imageAlt}
                  width={400}
                  height={200}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <span className="text-xs font-semibold uppercase ">
                    {rec.category}
                  </span>
                  <h3 className="text-lg font-bold mt-2">{rec.title}</h3>
                  <p className=" text-sm mt-2 line-clamp-3">
                    {rec.summary}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      href={`/blogs/${rec.id}`}
                      className=" font-semibold hover:underline text-sm"
                    >
                      Read More →
                    </Link>
                    <span className=" text-xs">{rec.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link
            href="/blogs"
            className="bg-primary inline-block px-6 py-3   font-semibold rounded-xl transition"
          >
            ← Back to Blog
          </Link>
        </div>
      </main>
    </div>
  );
}
