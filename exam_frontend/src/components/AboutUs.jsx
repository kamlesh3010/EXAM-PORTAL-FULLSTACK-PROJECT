// src/components/AboutUs.jsx
import React, { useEffect } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutUs = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-black text-gray-300 leading-relaxed">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-purple-900 via-black to-indigo-900">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl font-extrabold text-white"
        >
          Empowering Students with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Tech & Innovation
          </span>
        </motion.h1>
        <p className="mt-4 max-w-2xl text-gray-400">
          We build innovative projects in AI, ML, Cloud & Web Dev to upskill
          students through real-world experiences.
        </p>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-10">
          Vision & Mission
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "Vision",
              desc: "To make tech education accessible worldwide through innovative projects.",
            },
            {
              title: "Mission",
              desc: "Empowering students with hands-on learning, mentorship, and global opportunities.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-8 rounded-xl border border-indigo-500/40 bg-gray-900/40 backdrop-blur-md shadow-lg text-center hover:shadow-indigo-500/40 hover:border-indigo-400 transition"
            >
              <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center text-purple-400 mb-10">
          Our Team
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              name: "Kamlesh Bobade",
              role: "Full Stack Developer",
              img: "E:\exam_frontend\src\components\images\mypic.jpg",
              linkedin: "https://www.linkedin.com/in/webdeveloperkamlesh/",
            },
            {
              name: "Kamlesh Bobade",
              role: "Spring Boot Developer",
              img: "https://via.placeholder.com/150",
              linkedin: "https://www.linkedin.com/in/webdeveloperkamlesh/",
            },
            {
              name: "Kamlesh Bobade",
              role: "Data Scientist",
              img: "https://via.placeholder.com/150",
              linkedin: "https://www.linkedin.com/in/webdeveloperkamlesh/",
            },
          ].map((m, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-xl border border-purple-500/40 bg-gray-900/40 backdrop-blur-md shadow-lg text-center hover:shadow-purple-500/40 hover:border-purple-400 transition"
            >
              <img
                src={m.img}
                alt={m.name}
                className="w-24 h-24 mx-auto rounded-full mb-3 border-2 border-purple-500"
              />
              <h3 className="font-bold text-white">{m.name}</h3>
              <p className="text-gray-400">{m.role}</p>
              <a
                href={m.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 underline hover:text-indigo-300"
              >
                LinkedIn
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 px-6" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-10">
          Achievements
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "🏆",
              title: "Google Android Developer Internship",
              desc: "Apr - Jun 2024",
            },
            {
              icon: "☁️",
              title: "AWS Internship",
              desc: "Hands-on Cloud Integration",
            },
            {
              icon: "💻",
              title: "IBM SkillBuild",
              desc: "Full Stack Web Development",
            },
          ].map((a, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="p-6 rounded-xl border border-indigo-500/40 bg-gray-900/40 backdrop-blur-md shadow-lg text-center hover:shadow-indigo-500/40 hover:border-indigo-400 transition"
            >
              <div className="text-4xl mb-3">{a.icon}</div>
              <h3 className="font-bold text-white">{a.title}</h3>
              <p className="text-gray-400">{a.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-6" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center text-purple-400 mb-10">
          Project Milestones
        </h2>
        <div className="relative border-l-4 border-indigo-500 ml-6 space-y-6">
          {[
            { year: "2023", event: "Started EBookStore project (MERN stack)" },
            {
              year: "2024",
              event: "Completed AWS internship with cloud integration",
            },
            { year: "2025", event: "Launched Online Exam Conductor project" },
          ].map((m, i) => (
            <div
              key={i}
              className="ml-4 p-6 rounded-lg border border-indigo-500/40 bg-gray-900/40 backdrop-blur-md shadow-md hover:shadow-indigo-500/40 transition"
            >
              <span className="inline-block px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-semibold mb-2">
                {m.year}
              </span>
              <p className="text-gray-300">{m.event}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-center text-indigo-400 mb-10">
          FAQs
        </h2>
        <div className="max-w-2xl mx-auto">
          {[
            {
              q: "Who can join us?",
              a: "Any student or professional passionate about technology.",
            },
            {
              q: "What projects do we work on?",
              a: "We focus on AI, ML, Web Dev, and Cloud-based solutions.",
            },
            {
              q: "Do we provide internships?",
              a: "Yes, we collaborate with companies and offer internships.",
            },
          ].map((faq, i) => (
            <Accordion key={i}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {faq.q}
              </AccordionSummary>
              <AccordionDetails>{faq.a}</AccordionDetails>
            </Accordion>
          ))}
        </div>
      </section>

      {/* Contact Form */}
     <section className="py-16 px-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
  <h2 className="text-3xl font-bold text-center text-purple-400 mb-10">
    Contact Us
  </h2>
  <form className="max-w-xl mx-auto space-y-4 bg-gray-800 p-6 rounded-2xl shadow-xl">
    <TextField
      fullWidth
      label="Name"
      variant="outlined"
      InputLabelProps={{ style: { color: "#cbd5e1" } }} // slate-300
      InputProps={{ style: { color: "white" } }}
    />
    <TextField
      fullWidth
      label="Email"
      variant="outlined"
      InputLabelProps={{ style: { color: "#cbd5e1" } }}
      InputProps={{ style: { color: "white" } }}
    />
    <TextField
      fullWidth
      label="Message"
      multiline
      rows={4}
      variant="outlined"
      InputLabelProps={{ style: { color: "#cbd5e1" } }}
      InputProps={{ style: { color: "white" } }}
    />
    <Button
      variant="contained"
      fullWidth
      className="!bg-indigo-600 hover:!bg-indigo-700 !text-white shadow-lg hover:shadow-indigo-500/50"
    >
      Send Message
    </Button>
  </form>
</section>


      {/* CTA Footer */}
      <section className="py-12 text-center bg-black border-t border-gray-800">
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-2xl font-bold text-white mb-4"
        >
          Ready to Join Us?
        </motion.h3>
        <Button
          variant="contained"
          className="bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/50"
        >
          Join Our Community
        </Button>
      </section>
    </div>
  );
};

export default AboutUs;
