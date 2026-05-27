export const SITE_CONFIG = {
  name: "STINT",
  tagline: "New. Hungry. Relentless.",
  description: "A new creative collective here to prove ourselves.",
  email: "hello@stintcollective.co",
  location: "Remote-first · Available worldwide",
  year: "2024",
  status: "Open for Projects",
} as const;

export const NAV_LINKS = ["Services", "Work", "Team", "Contact"] as const;

export const SOCIAL_LINKS = [
  { name: "Instagram", url: "#" },
  { name: "LinkedIn", url: "#" },
  { name: "Behance", url: "#" },
] as const;

export const TICKER_ITEMS = [
  "Brand Identity",
  "Web Design",
  "Motion",
  "Strategy",
  "Art Direction",
  "UI/UX",
  "Content",
  "Storytelling",
] as const;

export const MANIFESTO_POINTS = [
  { n: "01", line: "We are new. That is exactly the point." },
  { n: "02", line: "Fresh eyes see what seasoned ones have stopped noticing." },
  { n: "03", line: "We have no legacy work to protect — only future work to prove." },
  { n: "04", line: "Every project we take is one we treat like our last." },
] as const;

export const WHY_US_POINTS = [
  {
    title: "We treat every project like a portfolio piece.",
    body: "Because for us, it literally is. We have everything to prove and zero reason to phone it in.",
  },
  {
    title: "You get our best thinking, not a junior hand-off.",
    body: "Small team means the people you talk to are the people building your work. No layers.",
  },
  {
    title: "We are invested in your outcome.",
    body: "We need your project to work as much as you do. That alignment is a feature, not a consolation.",
  },
] as const;

export const BUDGET_OPTIONS = [
  "Under $1k",
  "$1k – $5k",
  "$5k – $15k",
  "$15k+",
] as const;
