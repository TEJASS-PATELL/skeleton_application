import React from 'react';
import { FaUserAlt, FaMobileAlt, FaDollarSign, FaQuestionCircle, FaStar, FaCogs, FaLock, FaServer, FaCamera, FaRobot, FaDatabase } from "react-icons/fa";
import "../style/Features.css";

const features = [
  { title: "Login & Signup", desc: "Secure authentication with OTP, email login, Google/GitHub social login, and forgot password.", icon: <FaUserAlt /> },
  { title: "Responsive Design", desc: "Fully responsive layout for mobile, tablet, and desktop.", icon: <FaMobileAlt /> },
  { title: "Pricing Plans", desc: "Free and Pro plans with premium features and Stripe payment integration.", icon: <FaDollarSign /> },
  { title: "FAQ Section", desc: "Accordion-style FAQ to answer common questions.", icon: <FaQuestionCircle /> },
  { title: "Review Section", desc: "Showcase multiple testimonials with star ratings for your project rating.", icon: <FaStar /> },
  { title: "Modular Components", desc: "Reusable and flexible components for quick project setup.", icon: <FaCogs /> },
  { title: "High Backend Security", desc: "Secure backend with proper authentication, encryption, and token validation.", icon: <FaLock /> },
  { title: "Server Optimization", desc: "Optimized server performance with fast API response time for better UX.", icon: <FaServer /> },
  { title: "Profile Upload", desc: "Users can upload and update profile images with real-time preview.", icon: <FaCamera /> },
  { title: "Inbuilt Chatbot", desc: "Integrated chatbot with customizable prompt to assist users inside the app.", icon: <FaRobot /> },
  { title: "Database Management", desc: "Using Prisma ORM with MySQL for efficient data handling,and optimized query performance.", icon: <FaDatabase /> },

];

export default function Features() {
  return (
    <section id='features'>
      {/* <h1>Features Section</h1> */}
      <div className='features-container'>
        {features.map((feature, index) => (
          <div key={index} className='feature-card'>
            <div className="feature-title">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
            </div>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
