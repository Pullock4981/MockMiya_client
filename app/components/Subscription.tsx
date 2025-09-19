import { FC } from "react";
import { FaBolt, FaCrown, FaRocket, FaCheck } from "react-icons/fa";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "$0",
    duration: "/forever",
    icon: <FaBolt className="text-green-400 text-2xl" />,
    features: [
      "1 Resume template",
      "Basic mock interviews",
      "5 AI feedback sessions",
      "PDF export",
      "Community support",
    ],
    buttonText: "Get Started",
    buttonStyle: "bg-[#1f1f1f] text-gray-200 hover:bg-[#2a2a2a]",
    highlight: false,
  },
  {
    name: "Pro",
    description: "Everything you need to succeed",
    price: "$19",
    duration: "/per month",
    icon: <FaCrown className="text-green-400 text-2xl" />,
    features: [
      "Unlimited resume templates",
      "Advanced mock interviews (text, voice, video)",
      "Unlimited AI feedback",
      "Priority support",
      "Advanced analytics",
      "Custom coding challenges",
      "PDF & DOCX export",
      "Role-based dashboards",
    ],
    buttonText: "Start Pro Trial",
    buttonStyle: "bg-[#00cc69] text-black hover:bg-green-400",
    highlight: true,
  },
  {
    name: "Enterprise",
    description: "For teams and organizations",
    price: "$99",
    duration: "/per month",
    icon: <FaRocket className="text-green-400 text-2xl" />,
    features: [
      "Everything in Pro",
      "Team management",
      "Admin console",
      "Custom integrations",
      "White-label options",
      "Advanced security",
      "Dedicated support",
      "Custom training data",
    ],
    buttonText: "Contact Sales",
    buttonStyle: "bg-[#1f1f1f] text-gray-200 hover:bg-[#2a2a2a]",
    highlight: false,
  },
];

const Subscription: FC = () => {
  return (
    <section className="bg-[#16181d] text-white py-20 px-6 md:px-16">
      {/* Heading */}
      <div className="text-center mb-14">
        <h2 className="text-xl md:text-2xl lg:text-4xl font-bold pb-4">
          Choose Your <span className="text-green-400">Success</span> Plan
        </h2>
        <p className="text-gray-400 mt-2">
          Flexible pricing designed to grow with your career. Start free,
          upgrade when ready.
        </p>
      </div>

      {/* Plans */}
      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`relative bg-[#16181d] p-8 rounded-3xl shadow-md border border-[#00cc69] origin-bottom hover:scale-102 hover:duration-300  ${
              plan.highlight
                ? "border-green-500 shadow-green-500/30"
                : "border-[#00cc69] shadow-[#00cc69]/30 hover:shadow-green-500/20 hover:border-green-400"
            } flex flex-col justify-between`}
          >
            {/* Most Popular badge */}
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00ff84] text-black text-xs font-semibold px-6 py-2 rounded-full">
                Most Popular
              </div>
            )}

            {/* Icon, Title, Description, Price */}
            <div className="mb-6 text-center">
              {/* Icon */}
              <div className="flex justify-center mb-4">{plan.icon}</div>

              {/* Title */}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

              {/* Price */}
              <p className="text-4xl font-bold">
                {plan.price}
                <span className="text-lg text-gray-400 ml-1">
                  {plan.duration}
                </span>
              </p>
            </div>

            {/* Features */}
            <ul className="mt-6 space-y-3 flex-1">
              {plan.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-gray-300 text-sm"
                >
                  <FaCheck className="text-green-400 mt-1" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* Button */}
            <button
              className={`mt-8 w-full py-3 rounded-md font-medium transition ${plan.buttonStyle}`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Bottom Guarantee */}
      <div className="mt-10 text-center text-sm text-gray-400">
        <div className="flex items-center justify-center gap-2 text-green-400">
          <FaCheck />
          <span>30-day money-back guarantee • No questions asked</span>
        </div>
      </div>
    </section>
  );
};

export default Subscription;
