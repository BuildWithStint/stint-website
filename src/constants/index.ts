export const SITE_CONFIG = {
  name: "STINT",
  tagline: "Design. Build. Scale.",
  description: "A digital product and software studio building dependable software for modern teams.",
  email: "buildwithstint@gmail.com",
  location: "Remote-first · Available worldwide",
  year: "2024",
  status: "Accepting new engagements",
} as const;

export const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const SOCIAL_LINKS = [
  { name: "Instagram", url: "#" },
  { name: "LinkedIn", url: "#" },
  { name: "Behance", url: "#" },
] as const;

export const TICKER_ITEMS = [
  "Web Development",
  "Mobile Apps",
  "Custom Software",
  "Backend & APIs",
  "Cloud & DevOps",
  "ERP Systems",
  "UI/UX",
  "Automation",
] as const;

export const MANIFESTO_POINTS = [
  { n: "01", line: "We build software that solves real problems, not just demos." },
  { n: "02", line: "Clarity first. Complexity is a cost we manage on your behalf." },
  { n: "03", line: "We measure our work by the outcomes it creates for your team." },
  { n: "04", line: "Every engagement gets our full attention and our best thinking." },
] as const;

export const WHY_US_POINTS = [
  {
    title: "We hold every project to a single standard.",
    body: "Considered, well-built work — delivered with the same care whether the engagement is large or small.",
  },
  {
    title: "You work directly with the people building it.",
    body: "No hand-offs to junior teams. The people you talk to are the ones writing the code and shipping the work.",
  },
  {
    title: "We are accountable to your outcome.",
    body: "Your goals define the work. We align on what success looks like and build toward it deliberately.",
  },
] as const;

export const BUDGET_OPTIONS = [
  "Under $1k",
  "$1k – $5k",
  "$5k – $15k",
  "$15k+",
] as const;
