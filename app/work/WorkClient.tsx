'use client'

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Nav, Footer } from "../../src/components";
import { projectsAPI } from "../../src/services/api";

interface Project {
  _id: string;
  title: string;
  description: string;
  label: string;
  image: string;
  deploymentLink: string;
  accent: string;
  createdAt: string;
}

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await projectsAPI.getProjects();
        if (response.success) setProjects(response.projects);
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.label)))];
  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.label === filter);

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <Nav />

      <main>
        {/* Hero */}
        <section className="relative pt-40 pb-20 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(200,151,61,0.07) 0%, transparent 70%)",
            }}
          />

          <div className="max-w-[1440px] mx-auto px-8 md:px-16 relative">
            <Link
              href="/"
              className="inline-flex items-center gap-3 mb-10 font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase transition-colors duration-300"
              style={{ color: "rgba(242,237,228,0.5)" }}
              data-hover
            >
              <ArrowLeft size={12} />
              Back to home
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span
                className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase mb-5 block"
                style={{ color: "var(--accent)" }}
              >
                Selected Work
              </span>
              <h1
                className="font-['Playfair_Display'] font-black leading-[0.95] mb-8"
                style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)" }}
              >
                Projects, shipped
                <br />
                <span className="italic" style={{ color: "var(--accent)" }}>
                  with intent.
                </span>
              </h1>
              <p
                className="font-['DM_Sans'] text-lg max-w-xl leading-relaxed"
                style={{ color: "rgba(242,237,228,0.55)" }}
              >
                A closer look at the products, platforms, and systems we&rsquo;ve
                built — each engineered to be reliable, scalable, and a pleasure
                to use.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters */}
        {categories.length > 2 && (
          <section className="border-t border-b" style={{ borderColor: "rgba(242,237,228,0.07)" }}>
            <div className="max-w-[1440px] mx-auto px-8 md:px-16 py-6 flex flex-wrap items-center gap-3">
              <span
                className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase mr-4"
                style={{ color: "rgba(242,237,228,0.35)" }}
              >
                Filter
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="font-['DM_Mono'] text-[10px] tracking-[0.25em] uppercase px-4 py-2 border transition-all duration-300"
                  style={{
                    borderColor:
                      filter === cat
                        ? "rgba(200,151,61,0.5)"
                        : "rgba(242,237,228,0.08)",
                    color:
                      filter === cat ? "var(--accent)" : "rgba(242,237,228,0.55)",
                    background:
                      filter === cat ? "rgba(200,151,61,0.05)" : "transparent",
                  }}
                  data-hover
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Grid */}
        <section className="py-24" style={{ background: "var(--card)" }}>
          <div className="max-w-[1440px] mx-auto px-8 md:px-16">
            {isLoading ? (
              <div className="flex items-center justify-center py-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-32">
                <p
                  className="font-['Playfair_Display'] italic text-2xl mb-3"
                  style={{ color: "rgba(242,237,228,0.6)" }}
                >
                  Nothing here yet.
                </p>
                <p
                  className="font-['DM_Mono'] text-[10px] tracking-[0.25em] uppercase"
                  style={{ color: "rgba(242,237,228,0.35)" }}
                >
                  Check back soon
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filtered.map((project, i) => {
                  const isActive = active === project._id;
                  return (
                    <motion.a
                      key={project._id}
                      href={project.deploymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 36 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: (i % 6) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className="group relative overflow-hidden cursor-pointer block aspect-[16/10]"
                      onMouseEnter={() => setActive(project._id)}
                      onMouseLeave={() => setActive(null)}
                      data-hover
                    >
                      <motion.img
                        src={project.image || "/blog-default.png"}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        animate={{ scale: isActive ? 1.05 : 1 }}
                        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        style={{
                          filter: isActive
                            ? "brightness(0.62) saturate(1)"
                            : "brightness(0.48) saturate(0.82)",
                          transition: "filter 0.7s ease",
                        }}
                      />

                      {/* Accent wash */}
                      <div
                        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                        style={{
                          background: `linear-gradient(135deg, ${project.accent}26 0%, transparent 55%)`,
                          opacity: isActive ? 1 : 0,
                        }}
                      />
                      {/* Legibility gradient */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(10,10,11,0.92) 0%, rgba(10,10,11,0.25) 50%, rgba(10,10,11,0.1) 100%)",
                        }}
                      />

                      {/* Top row: number + label */}
                      <div className="absolute top-7 left-7 right-7 flex items-start justify-between">
                        <span
                          className="font-['DM_Mono'] text-[11px] tracking-[0.3em] tabular-nums transition-colors duration-500"
                          style={{
                            color: isActive
                              ? project.accent
                              : "rgba(242,237,228,0.55)",
                          }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase px-3 py-1.5 backdrop-blur-md"
                          style={{
                            background: "rgba(10,10,11,0.4)",
                            color: isActive
                              ? project.accent
                              : "rgba(242,237,228,0.6)",
                            transition: "color 0.5s",
                          }}
                        >
                          {project.label}
                        </span>
                      </div>

                      {/* Content overlaid at bottom */}
                      <div className="absolute inset-x-0 bottom-0 p-8">
                        <div
                          className="h-px mb-5 transition-all duration-700 ease-[cubic-bezier(0.65,0,0.35,1)]"
                          style={{
                            background: project.accent,
                            width: isActive ? "72px" : "28px",
                          }}
                        />
                        <div className="flex items-end justify-between gap-6">
                          <div className="min-w-0">
                            <h3
                              className="font-['Playfair_Display'] font-bold leading-[1.05] text-foreground transition-transform duration-500"
                              style={{
                                fontSize: "clamp(1.7rem, 2.4vw, 2.4rem)",
                                transform: isActive
                                  ? "translateY(-4px)"
                                  : "translateY(0)",
                              }}
                            >
                              {project.title}
                            </h3>
                            <p
                              className="font-['DM_Sans'] text-sm leading-relaxed mt-3 max-w-md transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)]"
                              style={{
                                color: "rgba(242,237,228,0.72)",
                                maxHeight: isActive ? 100 : 0,
                                opacity: isActive ? 1 : 0,
                                overflow: "hidden",
                              }}
                            >
                              {project.description}
                            </p>
                          </div>

                          <div
                            className="w-12 h-12 shrink-0 flex items-center justify-center rounded-full transition-all duration-500"
                            style={{
                              background: isActive
                                ? project.accent
                                : "rgba(10,10,11,0.45)",
                              backdropFilter: "blur(8px)",
                              border: `1px solid ${
                                isActive ? project.accent : "rgba(242,237,228,0.2)"
                              }`,
                              transform: isActive
                                ? "rotate(0deg)"
                                : "rotate(-45deg)",
                            }}
                          >
                            <ArrowUpRight
                              size={18}
                              color={
                                isActive ? "#0A0A0B" : "rgba(242,237,228,0.85)"
                              }
                            />
                          </div>
                        </div>
                      </div>

                      {/* Hover frame */}
                      <div
                        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                        style={{
                          boxShadow: `inset 0 0 0 1px ${project.accent}`,
                          opacity: isActive ? 0.55 : 0,
                        }}
                      />
                    </motion.a>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-32">
          <div className="max-w-[1440px] mx-auto px-8 md:px-16 text-center">
            <span
              className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase mb-5 block"
              style={{ color: "var(--accent)" }}
            >
              Start a project
            </span>
            <h2
              className="font-['Playfair_Display'] font-black leading-tight mb-8"
              style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
            >
              Have something in mind?
            </h2>
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-4 px-10 py-5 font-['DM_Mono'] text-xs tracking-[0.25em] uppercase transition-all duration-300 hover:opacity-90"
              style={{ background: "var(--accent)", color: "#0A0A0B" }}
              data-hover
            >
              Get in touch
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
