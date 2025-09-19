import React from "react";

export default function Story() {
  return (
    <section className="py-8 px-6 max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-[#00FF84] mb-6">Our Story</h2>
      <p className="text-gray-300 leading-relaxed mb-6">
        MockMiya started with a vision to make career readiness accessible for everyone.
        Our team noticed how many talented people struggled with resumes and interviews.
        By harnessing AI, we built a tool to give everyone a fair chance at success.
      </p>

      {/* See More button */}
      <button className="mt-4 px-6 py-2 cursor-pointer bg-[#00FF84] text-black font-semibold rounded-lg shadow hover:bg-[#00cc66] transition-colors">
        See More
      </button>
    </section>
  );
}
