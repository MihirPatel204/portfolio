import { useEffect, useState } from "react";
import { Home, User, Briefcase, Code2, Mail, Sun, Moon, Sparkles } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const links = [
  { id: "home", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "stack", label: "Stack", icon: Code2 },
  { id: "contact", label: "Contact", icon: Mail },
];

export function IslandNav() {
  const [active, setActive] = useState("home");
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      for (const { id } of links) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          setActive(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-5 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-strong rounded-full p-1.5 flex items-center gap-1">
        {/* Brand chip */}
        <a
          href="#home"
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-foreground/5 transition"
          aria-label="Alex Carter — Home"
        >
          <span className="h-7 w-7 rounded-full bg-foreground text-background flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <span className="hidden sm:inline text-sm font-medium tracking-tight">Alex Carter</span>
        </a>

        <span className="hidden sm:block h-5 w-px bg-foreground/10 mx-1" />

        {links.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              aria-label={label}
              title={label}
              className={`relative flex items-center justify-center h-9 w-9 rounded-full transition-all duration-300 ${
                isActive
                  ? "bg-foreground text-background"
                  : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
              }`}
            >
              <Icon className="h-4 w-4" />
            </a>
          );
        })}

        <span className="h-5 w-px bg-foreground/10 mx-1" />

        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="h-9 w-9 rounded-full flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </nav>
  );
}
