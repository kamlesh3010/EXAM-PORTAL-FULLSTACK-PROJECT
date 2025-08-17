import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#000", // black background
        color: "#fff",
        padding: "60px 0 30px",
        fontSize: "14px",
      }}
    >
      <div className="container">
        <div className="row">
          {/* Column 1: Find us */}
          <div className="col-md-3 mb-4">
            <h5 className="text-uppercase mb-3 text-[#e99b63]">Find us</h5>
            <p>
              We’re based in Pune, Maharashtra. Reach out for smart exam and
              learning solutions.
            </p>
            <p>
              <i className="bx bx-map"></i> Pune, Maharashtra, India
            </p>
            <p>
              <i className="bx bx-phone"></i> +91 9284006935
            </p>
            <p>
              <i className="bx bx-envelope"></i> kamlesh928bobade@gmail.com
            </p>
          </div>

          {/* Column 2: Services */}
          <div className="col-md-3 mb-4">
            <h5 className="text-uppercase mb-3 text-[#e99b63]">
              Our Services
            </h5>
            <ul className="list-unstyled space-y-2">
              <li>
                <a href="#" className="hover:text-[#e99b63] transition">
                  Online Exam Platform
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e99b63] transition">
                  Result & Performance Analytics
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e99b63] transition">
                  AI-based Exam Evaluation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e99b63] transition">
                  Mock Tests & Practice Papers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e99b63] transition">
                  Secure Exam Proctoring
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Popular */}
          <div className="col-md-3 mb-4">
            <h5 className="text-uppercase mb-3 text-[#e99b63]">Popular</h5>
            <ul className="list-unstyled space-y-2">
              <li>
                <a href="#" className="hover:text-[#e99b63] transition">
                  Student Dashboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e99b63] transition">
                  Exam Scheduling
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e99b63] transition">
                  Auto-Grading System
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e99b63] transition">
                  Progress Reports
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#e99b63] transition">
                  Certification Generator
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Why Choose Us */}
          <div className="col-md-3 mb-4">
            <h5 className="text-uppercase mb-3 text-[#e99b63]">
              Why Choose Us
            </h5>
            <ul className="list-unstyled space-y-2">
              <li>
                <i className="bx bxs-check-circle" style={{ color: "skyblue" }}></i>{" "}
                24/7 Support
              </li>
              <li>
                <i className="bx bxs-check-circle" style={{ color: "skyblue" }}></i>{" "}
                Secure & Reliable Platform
              </li>
              <li>
                <i className="bx bxs-check-circle" style={{ color: "skyblue" }}></i>{" "}
                Scalable for Institutions
              </li>
              <li>
                <i className="bx bxs-check-circle" style={{ color: "skyblue" }}></i>{" "}
                AI-driven Insights
              </li>
            </ul>
          </div>
        </div>

        <hr style={{ backgroundColor: "#444" }} />

        {/* Footer Bottom */}
        <div className="text-center mt-3">
          <p>
            © 2025 Designed with ❤️ by{" "}
            <a href="#" style={{ color: "skyblue" }}>
              Enhance Technologies
            </a>
          </p>
          <div style={{ marginTop: "10px" }}>
            <a href="#" className="mx-2 text-white hover:text-[#e99b63]">
              Home
            </a>
            <a href="#" className="mx-2 text-white hover:text-[#e99b63]">
              About
            </a>
            <a href="#" className="mx-2 text-white hover:text-[#e99b63]">
              Services
            </a>
            <a href="#" className="mx-2 text-white hover:text-[#e99b63]">
              Privacy
            </a>
            <a href="#" className="mx-2 text-white hover:text-[#e99b63]">
              Blog
            </a>
            <a href="#" className="mx-2 text-white hover:text-[#e99b63]">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
