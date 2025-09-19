import React, { useState } from 'react';

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

// Define the full content for the detailed blog posts.
// This is used for the full blog article when a user clicks on a post.
const detailedBlogContent: { [key: number]: string } = {
  1: `In today's competitive job market, getting your resume noticed is a challenge. The first hurdle isn't a human recruiter—it's an Applicant Tracking System, or ATS. These systems scan and filter resumes for keywords, formatting, and relevance. If your resume isn't ATS-friendly, it could be rejected before a human ever sees it. That's why building a resume that speaks the language of both robots and recruiters is essential.

ATS-friendly resumes are simple and clean. They avoid complex designs, graphics, and tables that can confuse the system. Instead, they focus on clear headings, standard sections (like "Experience," "Skills," and "Education"), and strategic keyword usage. By tailoring your resume to each specific job description, you can ensure it contains the keywords that the ATS is looking for. MockMiya's AI helps you identify these keywords and automatically optimizes your resume's content, giving you the edge you need to get past the initial screen.`,
  2: `Interview anxiety is a common feeling, but with the right preparation, you can turn that nervousness into confidence. The key to a successful interview isn't just knowing the answers; it's about being able to deliver them clearly, confidently, and concisely. This is where MockMiya's AI Interview Simulator comes in. Our simulator provides a safe, no-stakes environment to practice for the real thing.

The AI asks dynamic, role-specific questions and provides real-time feedback on your performance. It analyzes your clarity, confidence, and even detects filler words like "um" and "like." You get a performance score and structured tips based on frameworks like STAR (Situation, Task, Action, Result) and LABS (Listen, Acknowledge, Bridge, Solution), helping you refine your answers and present yourself in the best possible light. By practicing regularly, you can build muscle memory for strong answers and reduce the anxiety that comes with an unknown interview format.`,
  3: `For a technical interview, solving the coding problem is only half the battle. Your ability to explain your thought process, justify your choices, and write clean, efficient code is equally important. MockMiya's integrated coding challenge platform offers a unique way to prepare for this. Our in-browser editor provides a realistic environment to practice coding tasks.

But what sets us apart is the AI feedback. After you submit your solution, the AI doesn't just tell you if it's correct. It provides a detailed commentary on your code's efficiency, readability, and logic. This includes suggestions for refactoring, alternative algorithms, and explanations of why your solution performs the way it does. This comprehensive feedback helps you not only solve the problem but also master the art of a technical interview.`,
  4: `The transition from student to professional can be a challenging one. Without a clear plan, it's easy to feel lost in the job search. This is why having a career roadmap is so crucial. A roadmap helps you identify your long-term goals and plot the steps you need to take to achieve them. It's about more than just finding a job; it's about building a fulfilling and successful career.

MockMiya helps you at every step of this journey. From creating your first professional resume to preparing for your first major interview, our tools are designed to guide you. We highlight essential skills needed for your desired role, help you network effectively, and ensure you're always one step ahead. By leveraging our AI-powered platform, you can confidently navigate the path from graduation to a thriving professional life.`,
  5: `A great cover letter isn't just a summary of your resume—it's your chance to tell a compelling story. It's an opportunity to show a recruiter why you are the perfect candidate for the role and to demonstrate your enthusiasm for the company. However, writing a tailored cover letter for every application is time-consuming. Our AI Cover Letter Assistant solves this problem by generating a personalized and compelling letter for you in seconds.

Simply provide the job description and some key highlights from your resume, and our AI will create a draft that perfectly matches the tone and requirements of the job. You can even adjust the tone—from formal and professional to confident and creative—to best suit the company culture. This feature saves you time and ensures that every application you send out has a powerful, personalized cover letter that will stand out from the crowd.`,
  6: `The tech industry is in a constant state of flux, with new technologies and roles emerging all the time. Staying on top of these changes is key to a successful career. Whether you're a seasoned professional or just starting, knowing which tech jobs are in demand can help you focus your efforts and acquire the right skills. From AI and machine learning specialists to cybersecurity analysts and cloud engineers, the opportunities are vast.

MockMiya provides the insights you need to navigate this landscape. Our platform tracks industry trends and highlights the skills that companies are currently seeking. We help you identify skill gaps on your resume and recommend learning resources to help you fill them. By preparing for the jobs of tomorrow today, you can position yourself as a competitive candidate in the ever-evolving world of technology.`
};

// Component for displaying the list of blog posts.
// It takes a function as a prop to handle post clicks.
const BlogList = ({ onPostClick }: { onPostClick: (post: BlogPost) => void }) => (
  <>
    {/* Blog Header */}
    <header className="text-center mb-12">
      {/* Main title of the blog page */}
      <h1 className="text-5xl font-extrabold tracking-tight">
        MockMiya <span className="gradient-text">Blog</span>
      </h1>
      {/* Subtitle providing a brief description */}
      <p className="text-lg text-gray-400 mt-4">
        Stay updated with the latest in career tips, tech trends, and AI advancements.
      </p>
    </header>
    {/* Blog Posts Grid */}
    <section className="grid grid-cols-1 gap-8">
      {/* Map over the blogPosts array to render a card for each post. */}
      {blogPosts.map((post) => (
        <div
          key={post.id}
          className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-[#121417] border border-[#1f2129] cursor-pointer"
          onClick={() => onPostClick(post)}
        >
          {/* Blog post image section */}
          <div className="md:w-2/5 w-full">
            <img
              className="rounded-2xl w-full h-auto object-cover"
              src={post.imageUrl}
              alt={post.imageAlt}
            />
          </div>
          {/* Blog post information section */}
          <div className="md:w-3/5 w-full">
            {/* Category tag */}
            <span className="text-xs font-semibold uppercase text-gray-500 tracking-widest">{post.category}</span>
            {/* Post title */}
            <h2 className="text-2xl font-bold mt-2 leading-tight">{post.title}</h2>
            {/* Post summary */}
            <p className="text-gray-400 mt-4 text-sm leading-relaxed">{post.summary}</p>
            {/* Read more button and date */}
            <div className="mt-6 flex items-center justify-between">
              <button className="text-green-400 font-semibold hover:underline">Read More &rarr;</button>
              <span className="text-gray-500 text-xs">{post.date}</span>
            </div>
          </div>
        </div>
      ))}
    </section>
  </>
);

// Component for displaying a single detailed blog post.
// It takes the selected post data and a function to go back.
const BlogDetails = ({ post, onBackClick }: { post: BlogPost; onBackClick: () => void }) => (
  <div className="max-w-4xl mx-auto">
    <button
      onClick={onBackClick}
      className="text-green-400 font-semibold mb-8 flex items-center hover:underline"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to Blog
    </button>
    <article className="bg-[#121417] p-6 rounded-3xl shadow-lg border border-[#1f2129] md:p-10 lg:p-12">
      <span className="text-xs font-semibold uppercase text-gray-500 tracking-widest">{post.category}</span>
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">{post.title}</h1>
      <p className="text-gray-400 text-sm mt-2">{post.date}</p>
      <img
        src={post.imageUrl}
        alt={post.imageAlt}
        className="w-full h-auto rounded-2xl my-8 object-cover"
      />
      <p className="text-gray-300 text-base leading-relaxed whitespace-pre-wrap">{detailedBlogContent[post.id]}</p>
    </article>
  </div>
);

// Main Blog component that renders the page content.
const Blog = () => {
  // State to track the currently selected blog post.
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Function to handle a blog post click and show its details.
  const handlePostClick = (post: BlogPost) => {
    setSelectedPost(post);
  };

  // Function to go back to the main blog list.
  const handleBackClick = () => {
    setSelectedPost(null);
  };

  // Conditionally render either the blog post list or the details page.
  return (
    <div className="bg-[#0b0c0f] text-gray-200 min-h-screen font-[Poppins]">
      <main className="container mx-auto px-4 py-16">
        {selectedPost ? (
          <BlogDetails post={selectedPost} onBackClick={handleBackClick} />
        ) : (
          <BlogList onPostClick={handlePostClick} />
        )}
      </main>
    </div>
  );
};

export default Blog;
