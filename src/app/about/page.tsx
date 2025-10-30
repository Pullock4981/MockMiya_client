"use client";
import { Briefcase, FileText, MessageCircle, Users, Star } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="py-28 min-h-screen">
      {/* Header */}
      <section className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold  mb-4">About MockMiya</h1>
        <p className="w-11/12 mx-auto ">
          Your all-in-one platform for career success. We are on a mission to
          make professional development accessible, effective, and empowering
          for everyone.
        </p>
      </section>

      {/* Mission Section */}
      <section className="bg-card border shadow-sm mx-auto max-w-4xl text-center rounded-2xl p-8 mb-16">
        <h2 className="text-2xl font-semibold  mb-4">Our Mission</h2>
        <p className="">
          At <strong>MockMiya</strong>, we believe that everyone deserves the
          tools and confidence to land their dream job. We combine cutting-edge
          technology with thoughtful design to provide comprehensive career
          development solutions—empowering you to showcase your skills with
          clarity and confidence.
        </p>
      </section>

      {/* What We Offer */}
      <section className="text-center mb-20 px-6">
        <h2 className="text-2xl font-semibold  mb-10">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Resume Builder */}
          <div className="bg-card border p-6 rounded-xl shadow hover:shadow-md transition">
            <FileText className="mx-auto  mb-4" size={40} />
            <h3 className="text-lg font-semibold mb-2">Resume Builder</h3>
            <p className=" text-sm">
              Create professional, ATS-friendly resumes with ease.
            </p>
          </div>

          {/* Cover Letter Generator */}
          <div className="bg-card border p-6 rounded-xl shadow hover:shadow-md transition">
            <MessageCircle className="mx-auto  mb-4" size={40} />
            <h3 className="text-lg font-semibold mb-2">
              Cover Letter Generator
            </h3>
            <p className=" text-sm">
              Craft personalized cover letters tailored to your dream job.
            </p>
          </div>

          {/* Interview Practice */}
          <div className="bg-card border p-6 rounded-xl shadow hover:shadow-md transition">
            <Briefcase className="mx-auto  mb-4" size={40} />
            <h3 className="text-lg font-semibold mb-2">Interview Practice</h3>
            <p className=" text-sm">
              Prepare for interviews with realistic mock sessions and feedback.
            </p>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className=" py-16 text-center">
        <h2 className="text-2xl font-semibold  mb-10">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto px-4 ">
          <div className="bg-card border px-8 py-4 rounded-2xl">
            <Users className="mx-auto  mb-3" size={40} />
            <h3 className="font-semibold mb-2">Empowerment</h3>
            <p className=" text-sm">
              We empower individuals to achieve their full career potential.
            </p>
          </div>
          <div className="bg-card border px-8 py-4 rounded-2xl">
            <Star className="mx-auto  mb-3" size={40} />
            <h3 className="font-semibold mb-2">User-Centric</h3>
            <p className=" text-sm">
              Every feature is built with your goals, time, and success in mind.
            </p>
          </div>
          <div className="bg-card border px-8 py-4 rounded-2xl">
            <Briefcase className="mx-auto  mb-3" size={40} />
            <h3 className="font-semibold mb-2">Innovation</h3>
            <p className=" text-sm">
              We continuously evolve to bring smarter, modern career tools.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-20 px-6 ">
        <div className=" max-w-3xl bg-card border mx-auto  shadow-lg rounded-2xl py-10 px-6">
          <h2 className="text-xl font-semibold  mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className=" mb-6">
            Join thousands of professionals who’ve already boosted their careers
            with <strong>MockMiya</strong>.
          </p>
          <button className="  px-6 py-3 rounded-lg font-semibold transition">
            Get Started Today
          </button>
        </div>
      </section>
    </main>
  );
}
