'use client'

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MapPin, ArrowUpRight, Loader2 } from "lucide-react";
import { MagneticBtn } from "../MagneticBtn";
import { contactSettingsAPI, contactFormAPI } from "../../services/api";
import toast, { Toaster } from "react-hot-toast";

export function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    project: "",
  });
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: "",
    address: "",
    instagram: "",
    twitter: "",
    linkedin: ""
  });
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Load contact settings from API
  useEffect(() => {
    const loadContactSettings = async () => {
      try {
        const response = await contactSettingsAPI.getContactSettings();
        if (response.success && response.settings) {
          setContactInfo({
            email: response.settings.email || "",
            address: response.settings.address || "",
            instagram: response.settings.instagram || "",
            twitter: response.settings.twitter || "",
            linkedin: response.settings.linkedin || ""
          });
        }
      } catch (error) {
        console.error('Failed to load contact settings:', error);
      }
    };

    loadContactSettings();
  }, []);

  const CONTACT_INFO = [
    { icon: Mail, text: contactInfo.email },
    { icon: MapPin, text: contactInfo.address },
  ].filter(item => item.text); // Only show items that have values

  const set = (k: string) => (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.project) {
      setIsSubmitting(true);
      
      try {
        const response = await contactFormAPI.submitForm({
          name: form.name,
          email: form.email,
          project: form.project
        });
        
        // Only show success if the API response indicates success
        if (response.success) {
          setSent(true);
          toast.success('Message sent successfully! We\'ll get back to you soon.');
        } else {
          toast.error('Sorry, we couldn\'t send your message right now. Please try again later.');
        }
      } catch (error: any) {
        console.error('Failed to submit form:', error);
        toast.error('Sorry, we couldn\'t send your message right now. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const fieldStyle = {
    background: "transparent",
    borderBottom: "1px solid rgba(242,237,228,0.12)",
    color: "var(--foreground)",
  };

  return (
    <section id="contact" ref={ref} className="py-36">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
          success: {
            iconTheme: {
              primary: 'var(--accent)',
              secondary: 'var(--card)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'var(--card)',
            },
          },
        }}
      />
      <div className="max-w-[1440px] mx-auto px-8 md:px-16">
        <div className="grid md:grid-cols-2 gap-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span
              className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase mb-4 block"
              style={{ color: "var(--accent)" }}
            >
              Get In Touch
            </span>
            <h2
              className="font-['Playfair_Display'] font-black leading-tight mb-8"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
            >
              Be our
              <br />
              first client.
            </h2>
            <p
              className="font-['DM_Sans'] text-base leading-relaxed mb-14 max-w-sm"
              style={{ color: "rgba(242,237,228,0.5)" }}
            >
              We are hungry for our first real projects. If you have something
              worth building, we want to hear about it. No project is too small
              to start.
            </p>

            <div className="space-y-6">
              {CONTACT_INFO.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4">
                  <div
                    className="w-8 h-8 flex items-center justify-center border shrink-0"
                    style={{ borderColor: "rgba(200,151,61,0.25)" }}
                  >
                    <Icon size={14} style={{ color: "var(--accent)" }} />
                  </div>
                  <span
                    className="font-['DM_Sans'] text-sm"
                    style={{ color: "rgba(242,237,228,0.5)" }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {sent ? (
              <div className="flex flex-col justify-center h-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-12 border text-center"
                  style={{
                    borderColor: "rgba(200,151,61,0.25)",
                    background: "rgba(200,151,61,0.04)",
                  }}
                >
                  <div
                    className="w-10 h-px mx-auto mb-8"
                    style={{ background: "var(--accent)" }}
                  />
                  <h3 className="font-['Playfair_Display'] font-black text-3xl mb-4">
                    We got it.
                  </h3>
                  <p
                    className="font-['DM_Sans'] text-sm"
                    style={{ color: "rgba(242,237,228,0.5)" }}
                  >
                    We will review your message and come back to you within 24
                    hours. Excited already.
                  </p>
                </motion.div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                {[
                  { key: "name", placeholder: "Your name *", type: "text" },
                  {
                    key: "email",
                    placeholder: "Email address *",
                    type: "email",
                  },
                ].map(({ key, placeholder, type }) => (
                  <input
                    key={key}
                    type={type}
                    placeholder={placeholder}
                    required={placeholder.includes("*")}
                    value={(form as any)[key]}
                    onChange={set(key)}
                    className="w-full py-4 font-['DM_Sans'] text-base outline-none placeholder-muted-foreground focus:placeholder-transparent transition-all duration-300"
                    style={{ ...fieldStyle }}
                    onFocus={(e) =>
                      (e.target.style.borderBottomColor = "var(--accent)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderBottomColor =
                        "rgba(242,237,228,0.12)")
                    }
                  />
                ))}

                <textarea
                  placeholder="Tell us about your project *"
                  required
                  rows={4}
                  value={form.project}
                  onChange={set("project")}
                  className="w-full py-4 font-['DM_Sans'] text-base outline-none placeholder-muted-foreground resize-none focus:placeholder-transparent transition-all duration-300"
                  style={{ ...fieldStyle }}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor = "var(--accent)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderBottomColor =
                      "rgba(242,237,228,0.12)")
                  }
                />

                <MagneticBtn
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-3 px-10 py-4 font-['DM_Mono'] text-xs tracking-[0.2em] uppercase hover:opacity-90 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "var(--accent)", color: "#0A0A0B" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <ArrowUpRight size={14} />
                    </>
                  )}
                </MagneticBtn>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
