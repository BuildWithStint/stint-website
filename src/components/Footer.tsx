import { useEffect, useState } from "react";
import { SITE_CONFIG } from "../constants";
import { contactSettingsAPI } from "../services/api";

export function Footer() {
  const [socialLinks, setSocialLinks] = useState<Array<{ name: string; url: string }>>([]);

  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const response = await contactSettingsAPI.getContactSettings();
        if (response.success && response.settings) {
          const links = [];
          
          if (response.settings.instagram) {
            links.push({ name: "Instagram", url: response.settings.instagram });
          }
          if (response.settings.linkedin) {
            links.push({ name: "LinkedIn", url: response.settings.linkedin });
          }
          if (response.settings.twitter) {
            links.push({ name: "X (Twitter)", url: response.settings.twitter });
          }
          
          setSocialLinks(links);
        }
      } catch (error) {
        console.error('Failed to load social links:', error);
      }
    };

    loadSocialLinks();
  }, []);

  return (
    <footer
      className="border-t py-12"
      style={{ borderColor: "rgba(242,237,228,0.07)" }}
    >
      <div className="max-w-[1440px] mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-3 items-center gap-6">
        <span className="font-['Playfair_Display'] text-2xl font-black justify-self-center md:justify-self-start">
          {SITE_CONFIG.name}
          <span style={{ color: "var(--accent)" }}>.</span>
        </span>

        <p
          className="font-['DM_Mono'] text-[10px] tracking-wider text-center justify-self-center"
          style={{ color: "rgba(242,237,228,0.5)" }}
        >
          © {SITE_CONFIG.year} STINT · Built with intent.
        </p>

        {socialLinks.length > 0 ? (
          <div className="flex items-center gap-8 justify-self-center md:justify-self-end">
            {socialLinks.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-['DM_Mono'] text-[10px] tracking-[0.2em] uppercase hover:text-foreground transition-colors duration-300"
                style={{ color: "rgba(242,237,228,0.6)" }}
              >
                {s.name}
              </a>
            ))}
          </div>
        ) : (
          <span className="hidden md:block" />
        )}
      </div>
    </footer>
  );
}
