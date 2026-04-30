import { useEffect, useState } from "react";
import site from "@/content/site.json";

const roles = site.profile.roles;

export function RotatingRoles() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % roles.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block align-baseline overflow-hidden h-[1em] min-w-[10ch]">
      {roles.map((r, idx) => (
        <span
          key={r}
          className={`absolute left-0 right-0 transition-all duration-500 ease-out ${
            idx === i
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          {r}
        </span>
      ))}
      <span className="invisible">{roles[i]}</span>
    </span>
  );
}
