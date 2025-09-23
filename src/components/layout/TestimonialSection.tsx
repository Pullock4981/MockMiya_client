import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Senior Frontend Developer",
    company: "Google",
    content: "MockMiya transformed my interview prep. The AI feedback was incredibly detailed and helped me identify areas I never knew I needed to improve. Landed my dream job in just 3 weeks!",
    rating: 5,
    avatar: "SC"
  },
  {
    name: "Marcus Rodriguez",
    role: "Full Stack Engineer", 
    company: "Microsoft",
    content: "The mock interviews felt so realistic. The voice interview feature especially helped me gain confidence. The resume builder is also top-notch - created a perfect tech resume in minutes.",
    rating: 5,
    avatar: "MR"
  },
  {
    name: "Emily Zhang",
    role: "DevOps Engineer",
    company: "Amazon",
    content: "As someone who struggled with technical interviews, MockMiya was a game-changer. The coding challenges and real-time feedback helped me practice efficiently. Highly recommend!",
    rating: 5,
    avatar: "EZ"
  },
  {
    name: "Alex Johnson",
    role: "Backend Developer",
    company: "Stripe",
    content: "The platform is incredibly intuitive and the AI is surprisingly accurate. It helped me prepare for system design questions and coding challenges. Worth every penny!",
    rating: 5,
    avatar: "AJ"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Loved by 
            <span className="text-gradient">Developers</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Join thousands of developers who've accelerated their careers with MockMiya
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="p-6 rounded-2xl bg-card-gradient border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group"
            >
              {/* Quote icon */}
              <div className="mb-4">
                <Quote className="h-8 w-8 text-primary/60" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-primary fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground-secondary mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <span className="text-sm font-semibold text-primary">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-foreground-muted">
                    {testimonial.role}
                  </div>
                  <div className="text-sm text-primary">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="mt-16 text-center">
          <div className="grid md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">4.9/5</div>
              <div className="text-foreground-secondary">Average rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-foreground-secondary">Happy developers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-foreground-secondary">Success rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;