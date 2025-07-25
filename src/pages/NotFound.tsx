import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

const NotFound = () => {
  const location = useLocation();
  const amogusRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Trigger Animation Reset
    const img = amogusRef.current;
    if (img) {
      img.classList.remove("animate-amogus-fly");
      // Trigger reflow to restart animation
      void img.offsetWidth;
      img.classList.add("animate-amogus-fly");
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative overflow-hidden">
      {/* Amogus Flying */}
      <img
        ref={amogusRef}
        src="/assets/images/amogus.jpeg"
        alt="amogus"
        className="pointer-events-none select-none absolute left-[-7rem] bottom-20 w-28 h-28 opacity-90 animate-amogus-fly"
        style={{ zIndex: 50 }}
      />
      <div className="text-center relative z-10">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
      {/* Custom Amogus Animation */}
      <style>
        {`
        @keyframes amogus-fly {
          0% {
            left: -7rem;
            opacity: 0.8;
            transform: rotate(-60deg) scale(1);
          }
          40% {
            opacity: 1;
            transform: rotate(0deg) scale(1.05);
          }
          70% {
            left: 50%;
            opacity: 1;
            transform: rotate(10deg) scale(1.1);
          }
          90% {
            left: 100vw;
            opacity: 0.6;
            transform: rotate(40deg) scale(1);
          }
          100% {
            left: 120vw;
            opacity: 0;
            transform: rotate(60deg) scale(0.9);
          }
        }
        .animate-amogus-fly {
          animation: amogus-fly 2.1s cubic-bezier(.8,.2,.7,1.1) both;
        }
        `}
      </style>
    </div>
  );
};

export default NotFound;
