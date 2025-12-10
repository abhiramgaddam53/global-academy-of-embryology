
"use client";

export default function AnimatedLogoLoader() {
  return (
    <div className="loader-wrap">
      <svg
        width="260"
        height="90"
        viewBox="0 0 520 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="logo-svg"
      >
        {/* DNA LEFT */}
        <path
          d="M80 20 C20 60, 20 120, 80 160"
          stroke="#1B3A5B"
          strokeWidth="10"
          fill="none"
        />
        <path
          d="M120 20 C180 60, 180 120, 120 160"
          stroke="#27B19B"
          strokeWidth="10"
          fill="none"
        />

        {/* DNA Rungs */}
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={i}
            x1="82"
            y1={35 + i * 18}
            x2="118"
            y2={35 + i * 18}
            stroke="#1B3A5B"
            strokeWidth="4"
            className="rung"
            style={{ animationDelay: `${i * 0.12}s` }}
          />
        ))}

        {/* Academy Text */}
        <text
          x="200"
          y="75"
          fontSize="38"
          fontWeight="700"
          fill="#1B3A5B"
          className="text-main"
        >
          Global Academy
        </text>

        <text
          x="200"
          y="120"
          fontSize="30"
          fontWeight="600"
          fill="#27B19B"
          className="text-sub"
        >
          of Embryology
        </text>
      </svg>

      <p className="loading-text">Loading...</p>

      <style jsx>{`
        .loader-wrap {
          position: fixed;
          inset: 0;
          background: #f5f8fc;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .logo-svg {
          overflow: visible;
        }

        /* DNA animation */
        .logo-svg path {
          stroke-dasharray: 600;
          stroke-dashoffset: 600;
          animation: draw 1.6s ease forwards;
        }

        .logo-svg path:nth-child(2) {
          animation-delay: 0.3s;
        }

        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* Rungs pulse */
        .rung {
          opacity: 0;
          animation: pulse 1.4s ease-in-out infinite;
        }

        @keyframes pulse {
          0% {
            opacity: 0;
            transform: scaleX(0.2);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: scaleX(1);
          }
        }

        /* Text reveal */
        .text-main {
          opacity: 0;
          transform: translateX(-10px);
          animation: slideIn 0.8s ease forwards;
          animation-delay: 0.9s;
        }

        .text-sub {
          opacity: 0;
          transform: translateX(-10px);
          animation: slideIn 0.8s ease forwards;
          animation-delay: 1.2s;
        }

        @keyframes slideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .loading-text {
          margin-top: 18px;
          font-size: 13px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #1b3a5b;
          opacity: 0.75;
          animation: blink 1.4s infinite;
        }

        @keyframes blink {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
