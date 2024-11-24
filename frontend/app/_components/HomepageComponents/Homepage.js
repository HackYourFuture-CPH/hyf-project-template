import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  FileText,
  Users,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isDemoVisible, setDemoVisible] = useState(false);

  function handleClick() {
    setDemoVisible(!isDemoVisible);
  }

  const team = [
    {
      name: "YueJiao Shi",
      role: "Frontend Lead",
      image: "/images/yue.jpeg",
      github: "https://www.github.com/YueJiaoShi",
      linkedin: "https://www.linkedin.com/in/yuejiao-shi",
    },
    {
      name: "Ali Reza",
      role: "Frontend & Backend",
      image: "/images/ali.jpeg",
      github: "https://www.github.com/AliRezaHassanloo2731",
      linkedin: "https://www.linkedin.com/in/alireza-hassanloo-415356239",
    },
    {
      name: "Alejandro Gispert",
      role: "Backend Lead",
      image: "/images/ale.jpeg",
      github: "https://www.github.com/AlejandroGispert",
      linkedin: "https://www.linkedin.com/in/alejandro-gispert",
    },
  ];

  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Client Communication",
      description:
        "Real-time chat, file sharing, and project updates in one place",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Smart Invoicing",
      description: "Automated invoicing and payment tracking system",
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: "Project Management",
      description:
        "Comprehensive tools for managing multiple projects efficiently",
    },
  ];

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  const floatingAnimation = {
    y: [-10, 10],
    transition: {
      y: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="fixed w-full z-50 bg-black/20 backdrop-blur-lg border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-white"
            >
              WEflance
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors"
              onClick={() => router.push("/login")}
            >
              {"  "}Login{"  "}
            </motion.button>
          </div>
        </div>
      </motion.nav>
      {isDemoVisible && (
        <img
          src="/images/demo.gif"
          alt="Developer working"
          className="rounded-lg shadow-2xl"
          loading="lazy"
        />
      )}
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1
                className="text-5xl md:text-6xl font-bold text-white mb-6"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Manage Your <span className="text-blue-400">Freelance</span>{" "}
                Business
              </motion.h1>
              <motion.p
                className="text-xl text-gray-300 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                All-in-one platform for managing clients, projects, and invoices
                with ease.
              </motion.p>
              <motion.div
                className="flex gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                  onClick={() => router.push("/signup")}
                >
                  Get Started <ChevronRight className="w-4 h-4" />
                </motion.button>
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white/10 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-colors"
                  onClick={handleClick}
                >
                  {isDemoVisible ? "Hide Demo" : "Watch Demo"}
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div animate={floatingAnimation} className="relative">
              <img
                src="/images/developer.jpeg"
                alt="Developer working"
                className="rounded-lg shadow-2xl"
              />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg"
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <motion.section
        className="py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-white/10 p-6 rounded-xl backdrop-blur-lg"
              >
                <motion.div
                  className="text-blue-400 mb-4"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ type: "spring" }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="py-20 bg-black/20 backdrop-blur-lg"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl font-bold text-white text-center mb-12"
            variants={itemVariants}
          >
            Meet Our Team
          </motion.h2>

          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative group"
              >
                <div className="bg-white/10 rounded-xl overflow-hidden backdrop-blur-lg w-48">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-white">
                      {member.name}
                    </h3>
                    <p className="text-blue-400 text-sm">{member.role}</p>
                    <motion.div
                      className="flex gap-2 mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredCard === index ? 1 : 0 }}
                    >
                      <a
                        href={member.github}
                        className="text-gray-400 hover:text-white"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SiGithub className="w-4 h-4" />
                      </a>
                      <a
                        href={member.linkedin}
                        className="text-gray-400 hover:text-white"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <SiLinkedin className="w-4 h-4" />
                      </a>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        className="py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-white mb-6"
          >
            Ready to streamline your freelance business?
          </motion.h2>
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => router.push("/signup")}
          >
            Get Started Now
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
