import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Luxury.ae — call, WhatsApp or email us, or send a message and we'll reply within a business day.",
};

export default function ContactPage() {
  return (
    <main id="main" className="section container content-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link> <span>/</span> <span>Contact</span>
      </nav>

      <div className="page-head">
        <span className="eyebrow">Say hello</span>
        <h1>Contact us</h1>
        <p>Questions about a product, an order, or wholesale? We&rsquo;d love to hear from you.</p>
      </div>

      <div className="contact-layout">
        <div className="contact-details">
          <div className="contact-block">
            <h4>Phone</h4>
            <a href="tel:+97148804005">04 880 4005</a>
          </div>
          <div className="contact-block">
            <h4>WhatsApp / Mobile</h4>
            <a href="https://wa.me/971522885649">+971 52 288 5649</a>
          </div>
          <div className="contact-block">
            <h4>Email</h4>
            <a href="mailto:mk@mjqinvestment.com">mk@mjqinvestment.com</a>
          </div>
          <div className="contact-block">
            <h4>Head office</h4>
            <p>MJQ Investment LLC<br />Dubai, United Arab Emirates</p>
          </div>
          <div className="contact-block">
            <h4>Wholesale &amp; retail</h4>
            <p>Interested in stocking our brands? Reach out and our team will be in touch.</p>
          </div>
        </div>

        <div className="contact-form-wrap">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
