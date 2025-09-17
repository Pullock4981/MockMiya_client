import { FC } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { FaStar } from "react-icons/fa";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  feedback: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Senior Frontend Developer",
    company: "Google",
    feedback:
      "MockMiya transformed my interview prep. The AI feedback was incredibly detailed and helped me identify areas I never knew I needed to improve. Landed my dream job in just 3 weeks!",
    initials: "SC",
  },
  {
    id: 2,
    name: "Marcus Rodriguez",
    role: "Full Stack Engineer",
    company: "Microsoft",
    feedback:
      "The mock interviews felt so realistic. The voice interview feature especially helped me gain confidence. The resume builder is also top-notch – created a perfect tech resume in minutes.",
    initials: "MR",
  },
  {
    id: 3,
    name: "Emily Zhang",
    role: "DevOps Engineer",
    company: "Amazon",
    feedback:
      "As someone who struggled with technical interviews, MockMiya was a game-changer. The coding challenges and real-time feedback helped me practice efficiently. Highly recommend!",
    initials: "EZ",
  },
  {
    id: 4,
    name: "Alex Johnson",
    role: "Backend Developer",
    company: "Stripe",
    feedback:
      "The platform is incredibly intuitive and the AI is surprisingly accurate. It helped me prepare for system design questions and coding challenges. Worth every penny!",
    initials: "AJ",
  },
];

const stats = [
  { label: "Average rating", value: "4.9/5" },
  { label: "Happy developers", value: "50K+" },
  { label: "Success rate", value: "95%" },
];

const Testimonials: FC = () => {
  return (
    <section className="bg-[#0a0a0a] text-white py-20 px-6 md:px-16">
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="text-3xl md:text-4xl font-bold">
          Loved by <span className="text-green-400">Developers</span>
        </h2>
        <p className="text-gray-400 mt-2">
          Join thousands of developers who've accelerated their careers with
          MockMiya
        </p>
      </div>

      {/* Testimonial Cards */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 ">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="bg-[#111c1b] p-6 rounded-lg shadow-md border-[0.5px] border-gray-50/20  flex flex-col justify-between"
          >
            {/* Quote icon */}
            <FaQuoteLeft className="text-green-400 text-xl mb-4" />

            {/* 5 Stars */}
            <div className="flex gap-1 text-green-400 mb-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <FaStar key={i} />
                ))}
            </div>

            {/* Feedback */}
            <p className="text-gray-200 text-sm leading-relaxed mb-6">
              "{t.feedback}"
            </p>

            {/* Profile */}
            <div className="flex items-center gap-3 mt-auto">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-600 text-white font-bold text-sm">
                {t.initials}
              </div>
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-xs text-gray-400">
                  {t.role} <span></span>
                </p>
                <p className="text-green-400 font-medium"> {t.company}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 text-center gap-10">
        {stats.map((s, i) => (
          <div key={i}>
            <p className="text-green-400 text-3xl font-bold">{s.value}</p>
            <p className="text-gray-400 text-sm mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
