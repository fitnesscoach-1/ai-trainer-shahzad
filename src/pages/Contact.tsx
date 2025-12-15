import { FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import "./Contact.css";

export default function Contact() {
  return (
    <div className="contact-page">
      <h1>Contact AI Trainer Shahzad</h1>
      <p className="subtitle">
        Let’s connect and build your healthier future together
      </p>

      <div className="contact-layout">
        {/* Contact Info */}
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
            <a href="#" className="instagram" aria-label="Instagram">
              <FaInstagram /> Instagram
            </a>
            <a href="#" className="facebook" aria-label="Facebook">
              <FaFacebookF /> Facebook
            </a>
            <a href="#" className="linkedin" aria-label="LinkedIn">
              <FaLinkedinIn /> LinkedIn
            </a>
            <a href="#" className="youtube" aria-label="YouTube">
              <FaYoutube /> YouTube
            </a>
          </div>
        </div>

        {/* Map */}
        <div className="map-card">
          <div className="map-header">
            <h3>Our Location</h3>
            <p>
              Find us at Fitness Trainer Shahzad in Islamabad, Pakistan. Come visit or get in touch for your personalized training program.
            </p>
          </div>
          <iframe
            title="Google Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3325.2132984269797!2d73.12136807558667!3d33.547834044196335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8d528b9e42828b13%3A0x272ec79f02e66236!2sFitness%20Trainer%20Shahzad!5e0!3m2!1sen!2s!4v1765756103850!5m2!1sen!2s"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
