import { useState } from "react";
import axios from "axios";
import aiTrainer from "../assets/ai-trainer.png";

import {
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import "./Contact.css";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/contact", {
        name,
        email,
        message,
      });

      alert("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <h1>Contact AI Trainer Shahzad</h1>
      <p className="subtitle">
        Let’s connect and build your healthier future together
      </p>

      <div className="contact-layout">
        {/* CONTACT INFO */}
        <div className="contact-card">
          <h3>Contact Information</h3>

          <p>
            <strong>Email:</strong> support@aitrainershahzad.com
          </p>
          <p>
            <strong>Phone:</strong> +92 314 1853488
          </p>
          <p>
            <strong>Location:</strong> Islamabad, Pakistan
          </p>

          <div className="social-links">
            <a href="#" className="instagram">
              <FaInstagram /> Instagram
            </a>
            <a href="#" className="facebook">
              <FaFacebookF /> Facebook
            </a>
            <a href="#" className="linkedin">
              <FaLinkedinIn /> LinkedIn
            </a>
            <a href="#" className="youtube">
              <FaYoutube /> YouTube
            </a>
          </div>
        </div>

        {/* CONTACT FORM */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Send a Message</h3>

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <textarea
            placeholder="Your Message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* MAP */}
        <div className="map-card">
  
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3325.2132984269797!2d73.12136807558667!3d33.547834044196335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8d528b9e42828b13%3A0x272ec79f02e66236!2sFitness%20Trainer%20Shahzad!5e0!3m2!1sen!2s!4v1765756103850!5m2!1sen!2s"
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
