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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((project, i) => (
                  <motion.a
                    key={project._id}
                    href={project.deploymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: (i % 6) * 0.08 }}
                    className="group relative overflow-hidden cursor-pointer block"
                    style={{ aspectRatio: "4/3" }}
                    data-hover
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      style={{ filter: "brightness(0.5) saturate(0.6)" }}
                    />

                    <div
                      className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(135deg, ${project.accent}22 0%, transparent 60%)`,
                      }}
                    />

                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(10,10,11,0.95) 0%, rgba(10,10,11,0.2) 50%, transparent 100%)",
                      }}
                    />

                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span
                          className="font-['DM_Mono'] text-[10px] tracking-[0.25em] uppercase px-3 py-1.5"
                          style={{
                            background: "rgba(10,10,11,0.6)",
                            color: project.accent,
                            backdropFilter: "blur(4px)",
                          }}
                        >
                          {project.label}
                        </span>

                        <div
                          className="w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500"
                          style={{ background: project.accent }}
                        >
                          <ArrowUpRight size={14} color="#0A0A0B" />
                        </div>
                      </div>

                      <div>
                        <div
                          className="w-6 h-px mb-4 transition-all duration-500 group-hover:w-14"
                          style={{ background: project.accent }}
                        />
                        <h3 className="font-['Playfair_Display'] font-bold text-2xl text-foreground mb-3 group-hover:text-white transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p
                          className="font-['DM_Sans'] text-sm leading-relaxed transition-all duration-500 opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-32 overflow-hidden"
                          style={{ color: "rgba(242,237,228,0.65)" }}
                        >
                          {project.description}
                        </p>
                      </div>
                    </div>
                  </motion.a>
                ))}
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
