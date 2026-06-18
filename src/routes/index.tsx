
import { createFileRoute } from "@tanstack/react-router";
import { IslandNav } from "@/components/IslandNav";
import { RotatingRoles } from "@/components/RotatingRoles";
import { ArrowUpRight, Github, Linkedin, MapPin, Sparkles, ArrowDown, GraduationCap, ExternalLink } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Toaster } from "@/components/ui/sonner";
import project1 from "@/assets/project-1.png";
import project2 from "@/assets/project-2.png";
import project3 from "@/assets/project-3.png";
import project4 from "@/assets/project-4.jpg";
import site from "@/content/site.json";

const imageMap: Record<string, string> = {
  "project-1": project1,
  "project-2": project2,
  "project-3": project3,
  "project-4": project4,
};

const { profile, about, projects: projectsData, stack, contact, seo, footer } = site;
const projects = projectsData.map((p) => ({ ...p, image: imageMap[p.image] ?? project1 }));
const focus = about.focus;

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: seo.title },
      { name: "description", content: seo.description },
      { property: "og:title", content: seo.ogTitle },
      { property: "og:description", content: seo.ogDescription },
    ],
  }),
});


function Index() {

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden noise-overlay">
      {/* Ambient backdrop */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-strong" />
        <div className="absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,black_30%,transparent_80%)]" />
        <div className="absolute inset-0 bg-background/20 [mask-image:linear-gradient(to_bottom,transparent,black_40%,black_60%,transparent)]" />
        <div className="absolute -top-40 left-1/3 h-[600px] w-[600px] rounded-full bg-foreground/[0.05] blur-3xl" />
        <div className="absolute top-1/2 -right-40 h-[500px] w-[500px] rounded-full bg-foreground/[0.04] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-foreground/[0.05] blur-3xl" />
      </div>

      <IslandNav />

      <main className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* HERO */}
        <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center pt-32 pb-12">

          <h1 className="text-bold-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
            <span className="block text-muted-foreground/70 font-display italic font-normal text-2xl sm:text-3xl md:text-4xl mb-2">
              {profile.greeting}
            </span>
            {profile.name}
          </h1>

          <div className="mt-5 text-bold-display text-xl sm:text-3xl md:text-4xl text-muted-foreground">
            <RotatingRoles />
          </div>

          <p className="mt-10 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            {profile.heroDescription}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#work"
              className="group inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition"
            >
              View my projects
              <ArrowUpRight className="h-4 w-4 group-hover:rotate-45 transition-transform" />
            </a>
            <a
              href="#contact"
              className="glass inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium hover:bg-foreground/5 transition"
            >
              Get in touch
            </a>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5" />
              {profile.location}
            </div>
            <div className="hidden sm:block h-3 w-px bg-border" />
            <div className="flex items-center gap-2">
              <GraduationCap className="h-3.5 w-3.5" />
              {profile.status}
            </div>
            <div className="hidden sm:block h-3 w-px bg-border" />
            <div>{profile.tagline}</div>
          </div>

          <a href="#about" aria-label="Scroll to about" className="mt-12 glass h-10 w-10 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition float">
            <ArrowDown className="h-4 w-4" />
          </a>
        </section>

        {/* (marquee removed) */}

        {/* ABOUT */}
        <section id="about" className="py-20 sm:py-24 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">01 — About</div>
            <h2 className="text-display text-3xl sm:text-4xl mt-4">{about.heading}</h2>
          </div>
          <div className="md:col-span-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
            {about.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
            <div className="grid sm:grid-cols-3 gap-4 pt-6">
              {focus.map((f) => (
                <div key={f.title} className="glass p-5 rounded-2xl">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Focus</div>
                  <div className="mt-2 font-medium text-foreground">{f.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="py-20 sm:py-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">02 — Selected Work</div>
              <h2 className="text-bold-display text-3xl sm:text-5xl mt-4">Recent projects.</h2>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" /> 2025 — 2026
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {projects.map((p, i) => {
              const primaryLink = p.live || p.github;
              return (
                <div
                  key={p.title}
                  className="group glass rounded-3xl overflow-hidden flex flex-col hover:bg-foreground/[0.015] hover:shadow-soft transition-all duration-300"
                >
                  <a
                    href={primaryLink}
                    target="_blank"
                    rel="noreferrer"
                    className="aspect-[16/10] overflow-hidden border-b border-glass-border block cursor-pointer"
                  >
                    <img
                      src={p.image}
                      alt={`${p.title} preview`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </a>
                  <div className="p-6 flex flex-col justify-between flex-1 gap-6">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between text-xs tabular-nums text-muted-foreground">
                        <span>0{i + 1}</span>
                        <span>{p.year}</span>
                      </div>
                      <div className="flex items-start justify-between gap-3">
                        <a
                          href={primaryLink}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:underline decoration-1 underline-offset-4"
                        >
                          <h3 className="text-bold-display text-2xl sm:text-3xl leading-[1] text-foreground">
                            {p.title}
                          </h3>
                        </a>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                      <div className="text-xs text-muted-foreground/80 mt-1">{p.tag}</div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-glass-border">
                      {p.live && (
                        <a
                          href={p.live}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 bg-foreground text-background px-4 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition shadow-sm"
                        >
                          Live Demo
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      )}
                      {p.github && (
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 glass text-foreground px-4 py-2 rounded-full text-xs font-semibold hover:bg-foreground/10 hover:text-foreground transition"
                        >
                          {p.github.includes("github.com") ? (
                            <>
                              <Github className="h-3.5 w-3.5" />
                              GitHub
                            </>
                          ) : (
                            <>
                              <ExternalLink className="h-3.5 w-3.5" />
                              Kaggle
                            </>
                          )}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* STACK */}
        <section id="stack" className="py-20 sm:py-24">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">03 — Stack</div>
          <h2 className="text-display text-3xl sm:text-4xl mt-4 mb-12">Tools of the trade.</h2>

          <div className="flex flex-wrap gap-3">
            {stack.map((s) => (
              <div
                key={s}
                className="glass px-5 py-2.5 rounded-full text-sm hover:bg-foreground hover:text-background transition cursor-default"
              >
                {s}
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-20 sm:py-24">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Left column — text & links */}
            <div className="text-left">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">04 — Contact</div>
              <h2 className="text-bold-display text-4xl sm:text-5xl md:text-6xl mt-6">
                {contact.heading}
              </h2>
              <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
                {contact.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={contact.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="glass inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium hover:bg-foreground/5 transition"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
                <a
                  href={contact.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="glass inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium hover:bg-foreground/5 transition"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </div>
            </div>

            {/* Right column — form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </section>

        <footer className="py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground border-t border-border">
          <div>{footer.copyright}</div>
          <div>{footer.note}</div>
        </footer>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}
