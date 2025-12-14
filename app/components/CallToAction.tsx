import Link from "next/link";
import React from "react";

interface CallToActionProps {
  title?: string;
  description?: string;
  buttonText?: string;
  href?: string;
}

export default function CallToAction({
  title = "Ready to upgrade your skills?",
  description = "Join our world-class training programs and advance your career in clinical embryology.",
  buttonText = "Register Now",
  href = "/register",
}: CallToActionProps) {
  return (
    <section className="py-16 bg-[#1B3A5B] text-white text-center rounded-2xl mx-4 md:mx-0 my-12 shadow-xl">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        <p className="text-lg text-blue-100 mb-8">{description}</p>
        <Link
          href={href}
          className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
