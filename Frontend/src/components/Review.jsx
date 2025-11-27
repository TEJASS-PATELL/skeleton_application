import React from "react";
import "../style/Review.css";
import { FaUserCircle } from "react-icons/fa";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// change reviews data as needed
const reviews = [
    {
        name: "Tejas Patel",
        text: "This skeleton web app is perfect for kickstarting full-stack projects. All essential sections like login, pricing, FAQ, and reviews are well-structured and efficient!",
        rating: 5,
    },
    {
        name: "Priya Sharma",
        text: "UI is clean and responsive. Setup was easy and code structure is beginner-friendly. Great for startups.",
        rating: 4.5,
    },
    {
        name: "Rahul Verma",
        text: "Loved the performance optimization and reusable components. Useful for production-ready applications.",
        rating: 4,
    },
];

export default function Review() {
    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => {
            if (rating >= i + 1) return <FaStar key={i} />;
            else if (rating >= i + 0.5) return <FaStarHalfAlt key={i} />;
            else return <FaRegStar key={i} />;
        });
    };

    return (
        <section id="review">
            <div className="review-container">
                {reviews.map((rev, index) => (
                    <div className="review-card" key={index}>
                        <p>"{rev.text}"</p>
                        <div className="contain">
                        <div className="review-avatar">
                            <FaUserCircle />
                        </div>
                        <div className="centre-content">
                        <span className="reviewer-name">— {rev.name}</span>
                        <div className="review-stars">{renderStars(rev.rating)}
                        </div>
                        </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
