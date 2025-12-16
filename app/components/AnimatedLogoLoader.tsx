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
        {/* DNA Strand 1 (Blue) */}
        <path
          d="M80 20 C20 60, 20 120, 80 160"
          stroke="#1B3A5B"
          strokeWidth="10"
          strokeLinecap="round"
          className="strand strand-left"
        />
        
        {/* DNA Strand 2 (Teal) */}
        <path
          d="M120 20 C180 60, 180 120, 120 160"
          stroke="#27B19B"
          strokeWidth="10"
          strokeLinecap="round"
          className="strand strand-right"
        />

        {/* DNA Rungs (Looping Pulse) */}
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={i}
            x1="82"
            y1={35 + i * 18}
            x2="118"
            y2={35 + i * 18}
            stroke="#1B3A5B"
            strokeWidth="5"
            strokeLinecap="round"
            className="rung"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}

        {/* Text Group */}
        <g className="text-group">
          <text
            x="200"
            y="75"
            fontSize="38"
            fontWeight="700"
            fill="#1B3A5B"
            fontFamily="sans-serif"
          >
            Global Academy
          </text>

          <text
            x="200"
            y="120"
            fontSize="30"
            fontWeight="600"
            fill="#27B19B"
            fontFamily="sans-serif"
          >
            of Embryology
          </text>
        </g>
      </svg>

      {/* Loading Status Text */}
      <p className="loading-label">Initializing...</p>

      <style jsx>{`
        .loader-wrap {
          position: fixed;
          inset: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(5px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        /* 1. Draw DNA Strands */
        .strand {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: drawStrand 2s ease-out forwards;
        }
        
        .strand-right {
          animation-delay: 0.2s;
        }

        @keyframes drawStrand {
          to { stroke-dashoffset: 0; }
        }

        /* 2. Pulse Rungs Continuously */
        .rung {
          opacity: 0.1;
          animation: pulseRung 1.5s ease-in-out infinite;
        }

        @keyframes pulseRung {
          0% { opacity: 0.1; stroke: #1B3A5B; }
          50% { opacity: 1; stroke: #27B19B; } /* Changes color briefly */
          100% { opacity: 0.1; stroke: #1B3A5B; }
        }

        /* 3. Fade in Text */
        .text-group {
          opacity: 0;
          transform: translateX(10px);
          animation: fadeInText 1s ease forwards 0.5s;
        }

        @keyframes fadeInText {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* 4. Bottom Label Blink */
        .loading-label {
          margin-top: 20px;
          font-family: sans-serif;
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #64748b;
          animation: blink 1.5s infinite ease-in-out;
        }

        @keyframes blink {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}