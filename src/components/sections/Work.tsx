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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.slice(0, 3).map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: i * 0.1 }}
                className="group relative overflow-hidden cursor-pointer"
                style={{ aspectRatio: "4/3" }}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onClick={() => handleProjectClick(project.deploymentLink)}
                data-hover
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ filter: "brightness(0.5) saturate(0.6)" }}
                />

                {/* Color wash on hover */}
                <div
                  className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(135deg, ${project.accent}18 0%, transparent 60%)`,
                  }}
                />

                {/* Base overlay */}
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
                        color:
                          active === i ? project.accent : "rgba(242,237,228,0.5)",
                        backdropFilter: "blur(4px)",
                        transition: "color 0.3s",
                      }}
                    >
                      {project.label}
                    </span>

                    <div
                      className="w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-400 group-hover:rotate-0"
                      style={{
                        background: project.accent,
                        transform: "rotate(-45deg)",
                        transition: "all 0.4s",
                      }}
                    >
                      <ArrowUpRight size={14} color="#0A0A0B" />
                    </div>
                  </div>

                  <div>
                    <div
                      className="w-6 h-px mb-4 transition-all duration-500 group-hover:w-12"
                      style={{ background: project.accent }}
                    />
                    <h3 className="font-['Playfair_Display'] font-bold text-2xl text-foreground mb-3 group-hover:text-white transition-colors duration-300">
                      {project.title}
                    </h3>
                    <p
                      className="font-['DM_Sans'] text-sm leading-relaxed transition-all duration-500"
                      style={{
                        color: "rgba(242,237,228,0.5)",
                        maxHeight: active === i ? 60 : 0,
                        overflow: "hidden",
                        opacity: active === i ? 1 : 0,
                      }}
                    >
                      {project.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No projects available yet.</p>
            <p className="text-muted-foreground text-sm mt-2">Check back soon for our latest work!</p>
          </div>
        )}

        {/* View all projects */}
        {projects.length >= 4 && (
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
