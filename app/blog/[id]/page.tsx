import React from "react";
import { notFound } from "next/navigation";

// BlogPost type
interface BlogPost {
  id: number;
  category: string;
  title: string;
  summary: string;
  date: string;
  imageUrl: string;
  imageAlt: string;
}

// Blog posts array
const blogPosts: BlogPost[] = [
  {
    id: 1,
    category: 'Career Tips',
    title: 'The Ultimate Guide to ATS-Friendly Resumes',
    summary: `In today’s fiercely competitive job market, an outstanding resume is no longer enough. Before your application reaches a recruiter, it must first pass through an Applicant Tracking System (ATS), a software program designed to filter and rank resumes. Shockingly, a large percentage of qualified candidates are rejected at this stage—not because of a lack of talent, but due to avoidable mistakes like complex formatting, unreadable fonts, or the absence of job-specific keywords. This guide explains how to create a resume that is not only attractive to humans but also fully optimized for ATS scanners. We highlight why clean and simple formatting works best, how to avoid tables or graphics that confuse algorithms, and why choosing standard fonts like Arial or Calibri is safer than decorative ones. One of the most critical strategies is tailoring your resume to each role by incorporating keywords from the job description, ensuring your profile aligns with recruiter expectations. We also explore best practices for structuring your professional experience, skills, and education in a logical, scannable way. For example, using bullet points, quantifying achievements with numbers, and grouping skills under clear categories can greatly improve readability. Beyond manual methods, we showcase how MockMiya’s AI-powered resume builder can simplify the process. By analyzing a job posting, it generates an ATS-optimized version of your resume in minutes, preventing your skills from getting lost in the shuffle. With this approach, you’ll avoid common pitfalls, increase your chances of moving past the first filter, and secure that all-important interview opportunity.`,
    date: 'Oct 1, 2025',
    imageUrl: 'https://i.ibb.co.com/rR1yKSxh/Ai-resume.jpg',
    imageAlt: 'A person on a laptop, writing a resume.',
  },
  {
    id: 2,
    category: 'Interview Prep',
    title: 'Master Your Next Interview with AI Simulation',
    summary: `Interview anxiety can often derail even the most skilled candidates. You may know the answers, yet nerves cause hesitation, filler words, or disorganized responses. This is where AI-driven interview simulations become invaluable. MockMiya’s AI interview simulator creates a safe, judgment-free space where you can rehearse for different scenarios, from technical rounds to behavioral interviews. Unlike traditional mock interviews with friends or mentors, the AI can generate a wide range of role-specific and competency-based questions on demand. Once you answer, the system provides real-time feedback, highlighting aspects such as tone of voice, clarity, word choice, and even pacing. For instance, it can detect frequent use of filler words like “um” or “like,” then suggest techniques to reduce them. Going beyond speech, the AI also evaluates non-verbal communication like posture, eye contact, and hand movements if you’re practicing in video mode. This holistic feedback ensures you refine not only what you say but also how you present yourself. Moreover, the tool encourages structured answering through methods like STAR (Situation, Task, Action, Result) or LABS (Learn, Act, Build, Share). These frameworks help you narrate experiences in a way that recruiters find compelling. Over multiple practice sessions, you build muscle memory and confidence, transforming nervous energy into polished delivery. More than a tool, it becomes a personal coach, identifying your weak areas and turning them into strengths. By using AI simulations, you’re not just preparing for an interview—you’re rehearsing for success, giving yourself a significant competitive advantage.`,
    date: 'Sep 25, 2025',
    imageUrl: 'https://i.ibb.co.com/mCgXG34T/Interview-preparation.jpg',
    imageAlt: 'A person preparing for a video interview.',
  },
  {
    id: 3,
    category: 'Technical Skills',
    title: 'How to Ace Your Coding Challenge with AI Feedback',
    summary: `Technical interviews go beyond solving problems correctly; they assess problem-solving approaches, communication skills, and efficiency under time pressure. Many candidates can write functioning code, but the real challenge lies in explaining thought processes clearly and optimizing solutions for performance. MockMiya’s AI feedback system offers an innovative way to prepare by analyzing both your code and your explanation in real time. Unlike traditional tests that only validate correctness, this AI evaluates deeper dimensions such as time complexity, space complexity, and code readability. For instance, if you write a brute-force solution with $O(n^2)$ complexity, the AI might suggest a more efficient $O(n \log n)$ approach, explaining why it’s better for handling large datasets. It also catches overlooked edge cases, like handling null inputs or large values, which are often the difference between passing and failing a real coding test. Beyond efficiency, the AI highlights best practices such as consistent variable naming, modular functions, and proper commenting—key traits interviewers look for in professional developers. Perhaps most valuable is its immediate, detailed feedback that not only points out issues but explains the “why” behind each suggestion. This transforms coding practice into an interactive learning experience. It also trains you to verbalize reasoning, simulating how you’d explain solutions in front of an interviewer. By repeatedly practicing with this system, you develop not just technical mastery but also the confidence to communicate like a seasoned engineer. With AI feedback guiding you, you’ll enter coding challenges with clarity, efficiency, and the ability to impress at every stage.`,
    date: 'Sep 18, 2025',
    imageUrl: 'https://i.ibb.co.com/LDMGq08v/Coding-challenge.jpg',
    imageAlt: 'Close-up of a person coding on a laptop screen.',
  },
  {
    id: 4,
    category: 'Career Growth',
    title: 'From Graduate to Professional: A Roadmap to Success',
    summary: `The transition from graduation to a professional career can feel overwhelming. While academia equips you with theoretical knowledge, the workplace requires practical skills, adaptability, and a growth-oriented mindset. This roadmap breaks the journey into three clear phases to help you confidently navigate this transformation. Phase 1 emphasizes building foundational skills. Beyond technical expertise, employers value soft skills such as communication, teamwork, and problem-solving. We recommend practicing project management tools, improving writing and presentation abilities, and learning how to collaborate effectively in diverse teams. Phase 2 focuses on networking. Many opportunities arise not from job boards but from relationships. Strategies like connecting with mentors, attending career fairs, and engaging in professional communities—both online and offline—can open doors. LinkedIn, for example, is a powerful tool for showcasing achievements and connecting with recruiters. Phase 3 centers on personal branding. This involves polishing your resume, building a portfolio website, and maintaining a professional online presence. Sharing industry insights, contributing to open-source projects, or publishing case studies can help you stand out. Continuous learning is equally important; industries evolve rapidly, and staying updated with certifications or new technologies makes you resilient in the long run. Together, these phases provide a practical blueprint for success, helping you land your first job and setting the stage for a thriving career. With consistent effort and the right mindset, you can transition from student to professional with confidence and purpose.`,
    date: 'Sep 10, 2025',
    imageUrl: 'https://i.ibb.co.com/zVnb1ntC/Career-path.jpg',
    imageAlt: 'A person walking on a path, representing a career roadmap.',
  },
  {
    id: 5,
    category: 'Writing Tips',
    title: 'The Secret to a Standout Cover Letter',
    summary: `While resumes highlight your achievements, cover letters allow you to tell your story and connect your background to a company’s needs. Unfortunately, many candidates either skip writing one or submit a generic letter that fails to impress. This article reveals the secrets to creating a standout cover letter that elevates your application. A great cover letter begins with a personalized opening—addressing the hiring manager by name whenever possible. This small step immediately sets a respectful and attentive tone. The body should directly link your skills and experiences to the job description. For instance, instead of vaguely stating “I have strong teamwork skills,” describe a project where collaboration led to measurable success. Quantifying achievements, such as “increased user engagement by 30%,” demonstrates real impact. The closing paragraph should be confident and action-oriented, expressing eagerness to contribute and inviting further discussion. Many job seekers struggle with tone—how to balance professionalism with personality. MockMiya’s AI tool simplifies this by analyzing job postings, extracting required competencies, and suggesting a cover letter draft aligned with the employer’s expectations. It can even adjust tone—formal, enthusiastic, or persuasive—depending on the role. This saves time while ensuring customization, helping you avoid the trap of “one-size-fits-all.” By crafting a cover letter that is tailored, authentic, and results-driven, you maximize your chances of standing out. Instead of being an afterthought, your letter becomes a powerful bridge between your resume and the recruiter, positioning you as the right fit for the job.`,
    date: 'Sep 5, 2025',
    imageUrl: 'https://i.ibb.co.com/x8rbvKNW/Coverlatter.jpg',
    imageAlt: 'A person typing a document on a laptop.',
  },
  {
    id: 6,
    category: 'Industry Insights',
    title: 'Top Tech Jobs to Watch in 2026',
    summary: `The tech world evolves rapidly, and staying ahead requires awareness of upcoming trends and in-demand roles. As 2026 approaches, several positions stand out as career-defining opportunities. One of the most prominent is the AI/Machine Learning Engineer. With the explosion of generative AI and advanced analytics, professionals skilled in training models, managing large datasets, and building AI-driven products will be in high demand. Similarly, Cybersecurity Analysts are becoming critical as organizations worldwide face increasingly sophisticated digital threats. Protecting sensitive information and building resilient defense systems will be top priorities for companies across industries. Another fast-growing role is the Cloud Solutions Architect. With businesses migrating to scalable, cloud-native infrastructures, professionals who can design, implement, and optimize cloud strategies will be invaluable. Beyond these, we also see rising demand for Data Engineers, DevOps Specialists, and AR/VR Developers, fueled by advancements in immersive technologies and automation. Each role requires a mix of hard and soft skills—from coding and system design to problem-solving and communication. Certification pathways, such as AWS Solutions Architect, Google Cloud Professional, or cybersecurity credentials like CISSP, can accelerate entry into these roles. This article provides detailed insights into responsibilities, required skills, and preparation strategies for each job, ensuring you can align your career goals with the future of tech. By proactively building expertise in these areas, you position yourself as a competitive candidate in a rapidly shifting market, ready to seize the opportunities that 2026 will bring.`,
    date: 'Aug 30, 2025',
    imageUrl: 'https://i.ibb.co.com/Xxmndfqm/Tech-job.jpg',
    imageAlt: 'Professionals collaborating in a modern office.',
  },
];


export default function BlogDetails({ params }: { params: { id: string } }) {
  const post = blogPosts.find((p) => p.id === Number(params.id));

  if (!post) return notFound(); // 404 if invalid id

  return (
    <div className="bg-[#0b0c0f] text-gray-200 min-h-screen font-[Poppins]">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <article className="bg-[#121417] p-6 rounded-3xl shadow-lg border border-[#1f2129] md:p-10 lg:p-12">
            <span className="text-xs font-semibold uppercase text-gray-500 tracking-widest">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
              {post.title}
            </h1>
            <p className="text-gray-400 text-sm mt-2">{post.date}</p>

            <img
              src={post.imageUrl}
              alt={post.imageAlt}
              className="w-full h-auto rounded-2xl my-8 object-cover"
            />

            <p className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap">
              {post.summary}
            </p>
          </article>

          {/* Back to Blog button */}
          <div className="mt-12 text-center">
            <a
              href="/blog"
              className="inline-block px-6 py-3 bg-green-500 text-black font-semibold rounded-xl shadow hover:bg-green-400 transition"
            >
              ← Back to Blog
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
