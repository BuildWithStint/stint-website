export interface Feedback {
  id: number;
  name: string;
  email: string;
  rating: number;
  review: string;
  company?: string;
  position?: string;
}

export const feedbackData: Feedback[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    email: "sarah.mitchell@techcorp.com",
    rating: 5,
    review: "Absolutely phenomenal work! The team delivered beyond our expectations. Their attention to detail and creative approach transformed our brand identity completely.",
    company: "TechCorp",
    position: "CEO"
  },
  {
    id: 2,
    name: "James Rodriguez",
    email: "j.rodriguez@innovate.io",
    rating: 5,
    review: "Working with this team was a game-changer for our startup. They understood our vision and brought it to life with stunning design and flawless execution.",
    company: "Innovate.io",
    position: "Founder"
  },
  {
    id: 3,
    name: "Emily Chen",
    email: "emily.chen@designstudio.com",
    rating: 4,
    review: "Professional, creative, and incredibly responsive. The motion design work they did for our campaign was outstanding. Highly recommend!",
    company: "Design Studio",
    position: "Creative Director"
  },
  {
    id: 4,
    name: "Michael Thompson",
    email: "m.thompson@brandco.com",
    rating: 5,
    review: "The strategic approach they took to our rebranding was impressive. Every decision was backed by research and creative insight. Couldn't be happier!",
    company: "BrandCo",
    position: "Marketing Director"
  },
  {
    id: 5,
    name: "Aisha Patel",
    email: "aisha.patel@ventures.com",
    rating: 5,
    review: "From concept to execution, everything was seamless. The web design is not only beautiful but also incredibly functional. Our conversion rates have doubled!",
    company: "Ventures Inc",
    position: "Product Manager"
  },
  {
    id: 6,
    name: "David Kim",
    email: "david.kim@startup.io",
    rating: 4,
    review: "Great collaboration throughout the project. They listened to our needs and delivered a brand identity that perfectly captures our essence.",
    company: "Startup.io",
    position: "Co-Founder"
  },
  {
    id: 7,
    name: "Lisa Anderson",
    email: "lisa.a@creative.agency",
    rating: 5,
    review: "The storytelling aspect of their work is what sets them apart. They don't just design; they create experiences that resonate with audiences.",
    company: "Creative Agency",
    position: "Strategy Lead"
  },
  {
    id: 8,
    name: "Robert Martinez",
    email: "r.martinez@ecommerce.com",
    rating: 5,
    review: "Our new website is a masterpiece! The motion design elements add such a premium feel. Customer feedback has been overwhelmingly positive.",
    company: "E-Commerce Co",
    position: "Head of Digital"
  },
  {
    id: 9,
    name: "Nina Kowalski",
    email: "nina.k@fashionbrand.com",
    rating: 4,
    review: "Exceptional creativity and professionalism. They took our vague ideas and turned them into a cohesive, stunning brand identity.",
    company: "Fashion Brand",
    position: "Brand Manager"
  },
  {
    id: 10,
    name: "Thomas Wright",
    email: "thomas.wright@consulting.com",
    rating: 5,
    review: "Best investment we've made in our business. The team's expertise in strategy and design helped us stand out in a crowded market.",
    company: "Wright Consulting",
    position: "Managing Partner"
  }
];
