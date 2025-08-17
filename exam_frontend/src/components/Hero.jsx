import Spline from "@splinetool/react-spline";

const Hero = () => {
  return (
    <main className="pt-[6.5rem] min-h-[calc(100vh-6.5rem)] px-4 relative overflow-hidden bg-black text-white">
      <div
        data-aos="fade-right"
        data-aos-offset="300"
        data-aos-easing="ease-in-sine"
        className="relative max-w-screen-xl mx-auto"
      >
        {/* Left Content */}
        <div className="max-w-xl z-10 w-full mt-10 lg:mt-[6.5rem] lg:ml-[-3.5rem] relative">
          {/* Tag Box */}
          <div className="relative w-[95%] sm:w-48 h-10 bg-gradient-to-t from-[#656565] to-[#e99b63] shadow-[0_0_15px_rgba(255,255,255,0.4)] rounded-full">
            <div className="absolute inset-[3px] bg-black rounded-full flex items-center justify-center gap-1 text-white text-sm font-medium">
              <i className="bx bx-pyramid"></i>
              INTRODUCING
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-wider my-8 text-white">
            Ready. Set. Test....
            <br />
            Folks
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg tracking-wider text-gray-400 max-w-[25rem] lg:max-w-[30rem]">
            Welcome to the ultimate testing experience. We're here to push your
            limits and help you discover your potential to take your exams with
            confidence!
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-12">
            <a
              className="border border-[#2a2a2a] py-2 sm:py-3 px-4 sm:px-5 rounded-full sm:text-lg text-sm font-semibold tracking-wider transition-all duration-300 hover:bg-[#1a1a1a]"
              href="#"
            >
              Documentation <i className="bx bx-link-alt"></i>
            </a>

            <a
              className="border border-[#2a2a2a] py-2 sm:py-3 px-8 sm:px-10 rounded-full sm:text-lg text-sm font-semibold tracking-wider transition-all duration-300 hover:bg-[#1a1a1a] bg-gray-300 text-black hover:text-white"
              href="#"
            >
              Get Started <i className="bx bx-institution"></i>
            </a>
          </div>
        </div>

        {/* Spline Animation Positioned Right */}
        <div
          data-aos="zoom-in-left"
          className="absolute top-[6rem] right-0 w-[300px] md:w-[400px] lg:w-[500px] z-0"
        >
          <Spline scene="https://prod.spline.design/MCw5o0Fwxv6dzioJ/scene.splinecode" />
        </div>
      </div>

      {/* NEW SECTION BELOW HERO – starts approx 1 inch down */}
      <div className="mt-[96px] max-w-screen-xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Card 1: Check Exam */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-2xl p-6 shadow-md border border-gray-700 hover:shadow-lg transition-transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <i className="bx bx-search-alt"></i> Check Exam
            </h3>
            <p className="text-gray-400 mb-4">
              View upcoming exams and prepare accordingly.
            </p>
            <a href="/check-exam" className="text-[#e99b63] font-medium hover:underline">
  Go to Exams →
</a>
          </div>

          {/* Card 2: Check Result */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-2xl p-6 shadow-md border border-gray-700 hover:shadow-lg transition-transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <i className="bx bx-bar-chart-alt"></i> Check Result
            </h3>
            <p className="text-gray-400 mb-4">
              Review your exam scores and performance.
            </p>
       <a href="/user/result-marksheet" className="text-[#e99b63] font-medium hover:underline">
  View Result →
</a>

          </div>

          {/* Card 3: All Given Exams */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-2xl p-6 shadow-md border border-gray-700 hover:shadow-lg transition-transform hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <i className="bx bx-task"></i> All Given Exams
            </h3>
            <p className="text-gray-400 mb-4">
              Browse your exam history and attempt records.
            </p>
            <a href="/user/all-exams" className="text-[#e99b63] font-medium hover:underline">
              See History →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;
