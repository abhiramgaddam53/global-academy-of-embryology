import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  alignment?: "left" | "center" | "right";
}

export default function SectionTitle({
  title,
  subtitle,
  alignment = "center",
}: SectionTitleProps) {
  const alignClass =
    alignment === "left"
      ? "text-left"
      : alignment === "right"
      ? "text-right"
      : "text-center";

  return (
    <div className={`mb-10 ${alignClass}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A5B] mb-3">
        {title}
      </h2>
      {subtitle && (
        <div className="w-24 h-1 bg-teal-500 mx-auto rounded-full mb-4" />
      )}
      {subtitle && (
        <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
      )}
    </div>
  );
}
