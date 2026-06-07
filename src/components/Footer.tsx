'use client'

import { useEffect, useState } from "react";
import Link from "next/link";
import { SITE_CONFIG } from "../constants";
import { contactSettingsAPI } from "../services/api";

const FOOTER_NAV = [
  {
    heading: 'Studio',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Work', href: '/work' },
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'Software Development', href: '/services' },
      { label: 'Hire Freelance Developers', href: '/freelance' },
      { label: 'Web & Next.js', href: '/services#web' },
      { label: 'Mobile Apps', href: '/services#mobile' },
      { label: 'Backend & APIs', href: '/services#backend' },
      { label: 'Cloud & DevOps', href: '/services#cloud' },
    ],
  },
]

const DEFAULT_SOCIALS = [
  { name: 'X', url: 'https://x.com/stintbuild' },
  { name: 'Instagram', url: 'https://www.instagram.com/stint.7' },
  { name: 'GitHub', url: 'https://github.com/BuildWithStint' },
]

export function Footer() {
  const [socialLinks, setSocialLinks] = useState<Array<{ name: string; url: string }>>(DEFAULT_SOCIALS);

  useEffect(() => {
    const loadSocialLinks = async () => {
      try {
        const response = await contactSettingsAPI.getContactSettings();
        if (response.success && response.settings) {
          const links: { name: string; url: string }[] = [];
          if (response.settings.instagram) links.push({ name: "Instagram", url: response.settings.instagram });
          if (response.settings.linkedin) links.push({ name: "LinkedIn", url: response.settings.linkedin });
          if (response.settings.twitter) links.push({ name: "X (Twitter)", url: response.settings.twitter });
          if (links.length > 0) setSocialLinks(links);
        }
      } catch (error) {
        console.error('Failed to load social links:', error);
      }
    };
    loadSocialLinks();
  }, []);

  return (
    <footer
      className="border-t pt-20 pb-12"
      style={{ borderColor: "rgba(242,237,228,0.07)" }}
    >
      <div className="max-w-[1440px] mx-auto px-8 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-5">
            <Link href="/" className="font-['Playfair_Display'] text-4xl font-black inline-block">
              {SITE_CONFIG.name}
              <span style={{ color: 'var(--accent)' }}>.</span>
            </Link>
            <p
              className="font-['DM_Sans'] text-base leading-relaxed mt-6 max-w-md"
              style={{ color: 'rgba(242,237,228,0.55)' }}
            >
              STINT is a remote-first studio of senior freelance developers. We design,
              build, and scale web, mobile, and custom software for startups and
              growing teams worldwide.
            </p>
          </div>

          {FOOTER_NAV.map((group) => (
            <div key={group.heading} className="md:col-span-3">
              <span
                className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase mb-5 block"
                style={{ color: 'var(--accent)' }}
              >
                {group.heading}
              </span>
              <ul className="space-y-3">
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="font-['DM_Sans'] text-sm transition-colors hover:text-foreground"
                      style={{ color: 'rgba(242,237,228,0.6)' }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-1 flex flex-col">
            <span
              className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase mb-5 block"
              style={{ color: 'var(--accent)' }}
            >
              Social
            </span>
            <ul className="space-y-3">
              {socialLinks.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['DM_Sans'] text-sm transition-colors hover:text-foreground"
                    style={{ color: 'rgba(242,237,228,0.6)' }}
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="border-t pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ borderColor: 'rgba(242,237,228,0.07)' }}
        >
          <p
            className="font-['DM_Mono'] text-[10px] tracking-wider"
            style={{ color: 'rgba(242,237,228,0.5)' }}
          >
            © {SITE_CONFIG.year} STINT · Built with intent.
          </p>
          <p
            className="font-['DM_Mono'] text-[10px] tracking-wider"
            style={{ color: 'rgba(242,237,228,0.4)' }}
          >
            contact@stint.digital · Remote · Worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
