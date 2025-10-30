
"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Message sent successfully ✅");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send message ❌");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-11/12 mx-auto min-h-screen py-28">
      <div className="text-center mb-10">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Get in Touch</h1>
        <p className="px-2 text-base mt-2">
          Have questions? We’d love to hear from you. Send us a message and we’ll respond as soon as possible.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        {/* --- Contact Form --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-card border shadow-md rounded-2xl p-6 space-y-4"
        >
          <h2 className="text-lg font-semibold ">Send us a Message</h2>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            autoComplete="off"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="youremail@gmail.com"
            autoComplete="off"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            required
          />

          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="What's this about?"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your message..."
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-primary-foreground py-2 rounded-lg font-semibold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary"
            }`}
          >
            {loading ? "Sending Message..." : "Send Message"}
          </button>
        </form>

        {/* --- Contact Information --- */}
        <div className="space-y-6">
          <div className="bg-card border shadow-md rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 ">Contact Information</h2>

            <div className="flex items-center gap-3 mb-3 ">
              <Mail className="" /> support@mockmiya.com
            </div>

            <div className="flex items-center gap-3 mb-3 ">
              <Phone className="" /> +88 123-467-4567
            </div>

            <div className="flex items-center gap-3 mb-3 ">
              <MapPin className="" />Dhaka, Bangladesh
            </div>
          </div>

          <div className="bg-card border shadow-md rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 ">Office Hours</h2>
            <div className="flex items-center gap-3 ">
              <Clock className="" /> Monday - Friday: 9AM - 6PM PST
            </div>
            <p className=" mt-2">Weekend: 10AM - 4PM PST</p>
            <p className=" mt-2">Office will be Closed on all public holidays</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <h3 className="font-semibold ">Before You Reach Out</h3>
        <p className=" mt-2">
          Looking for quick answers? Check out our FAQ section or documentation.
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
            Visit FAQ
          </button>
          <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition">
            Read Documentation
          </button>
        </div>
      </div>

      <footer className="text-center mt-10  text-sm">
        © 2025 MockMiya. All rights reserved.
      </footer>
    </div>
  );
}


