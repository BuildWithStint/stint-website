'use client'

import { useState, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { projectsAPI } from "../../services/api";

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

export function Work() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [active, setActive] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects from API
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await projectsAPI.getProjects();
        if (response.success) {
          setProjects(response.projects);
        }
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  const handleProjectClick = (deploymentLink: string) => {
    window.open(deploymentLink, '_blank', 'noopener,noreferrer');
  };

  const visibleProjects = projects.slice(0, 4);


  if (isLoading) {
    return (
      <section
        id="work"
        ref={ref}
        className="py-36"
        style={{ background: "var(--card)" }}
      >
        <div className="max-w-[1440px] mx-auto px-8 md:px-16">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="work"
      ref={ref}
      className="py-36"
      style={{ background: "var(--card)" }}
    >
      <div className="max-w-[1440px] mx-auto px-8 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <span
              className="font-['DM_Mono'] text-[10px] tracking-[0.3em] uppercase mb-4 block"
              style={{ color: "var(--accent)" }}
            >
              Our Work
            </span>
            <h2
              className="font-['Playfair_Display'] font-black leading-tight"
              style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)" }}
            >
              Our latest projects
              <br />
              and client work.
            </h2>
          </div>
          <p
            className="font-['DM_Sans'] text-sm max-w-xs"
            style={{ color: "rgba(242,237,228,0.4)" }}
          >
            Explore our portfolio of completed projects and see what we can create for you.
          </p>
        </motion.div>

        {projects.length > 0 ? (
          <>
            {/* DESKTOP: image-dominant tiles with content overlaid */}
            <div className="hidden lg:grid grid-cols-2 gap-5">
              {visibleProjects.map((project, i) => {
                const isActive = active === i;
                return (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 36 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative overflow-hidden cursor-pointer aspect-[16/10]"
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    onClick={() => handleProjectClick(project.deploymentLink)}
                    data-hover
                  >
                    {/* Image fills the tile and gently zooms */}
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
                  </motion.div>
                );
              })}
            </div>

            {/* MOBILE / TABLET: stacked editorial image cards */}
            <div className="lg:hidden flex flex-col gap-5">
              {visibleProjects.map((project, i) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: i * 0.08 }}
                  className="group relative overflow-hidden aspect-[3/2] cursor-pointer"
                  onClick={() => handleProjectClick(project.deploymentLink)}
                  data-hover
                >
                  <img
                    src={project.image || "/blog-default.png"}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: "brightness(0.55) saturate(0.85)" }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(10,10,11,0.9) 0%, rgba(10,10,11,0.2) 55%, transparent 100%)",
                    }}
                  />
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <span
                      className="font-['DM_Mono'] text-[9px] tracking-[0.25em] uppercase px-2.5 py-1 backdrop-blur-md"
                      style={{
                        background: "rgba(10,10,11,0.55)",
                        color: project.accent,
                      }}
                    >
                      {project.label}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <div
                      className="h-px w-10 mb-3"
                      style={{ background: project.accent }}
                    />
                    <div className="flex items-end justify-between gap-3">
                      <h3
                        className="font-['Playfair_Display'] font-bold leading-[1.1] text-foreground"
                        style={{ fontSize: "clamp(1.4rem, 6vw, 2rem)" }}
                      >
                        {project.title}
                      </h3>
                      <div
                        className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full"
                        style={{ background: project.accent }}
                      >
                        <ArrowUpRight size={16} color="#0A0A0B" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No projects available yet.</p>
            <p className="text-muted-foreground text-sm mt-2">Check back soon for our latest work!</p>
          </div>
        )}

        {/* View all projects */}
        {projects.length > 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-14 flex justify-center"
          >
            <Link
              href="/work"
              className="group relative inline-flex items-center gap-4 px-10 py-5 font-['DM_Mono'] text-xs tracking-[0.25em] uppercase overflow-hidden transition-colors duration-500"
              style={{
                border: "1px solid rgba(200,151,61,0.4)",
                color: "var(--foreground)",
              }}
              data-hover
            >
              {/* Fill that slides in from the left on hover */}
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
                style={{ background: "var(--accent)" }}
                aria-hidden
              />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-[#0A0A0B]">
                View all projects
              </span>
              <ArrowUpRight
                size={14}
                className="relative z-10 transition-all duration-500 group-hover:text-[#0A0A0B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </motion.div>
        )}

        {/* CTA under grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-14 flex items-center justify-center"
        >
          <div
            className="px-10 py-7 border text-center max-w-lg"
            style={{
              borderColor: "rgba(242,237,228,0.1)",
              background: "rgba(200,151,61,0.04)",
            }}
          >
            <p className="font-['Playfair_Display'] italic text-xl mb-2 text-foreground">
              Your project could be next.
            </p>
            <p
              className="font-['DM_Mono'] text-[10px] tracking-[0.25em] uppercase"
              style={{ color: "rgba(242,237,228,0.35)" }}
            >
              We are actively taking on new clients
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
