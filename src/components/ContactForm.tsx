import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { sendContactEmail } from "@/lib/send-email";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormData = z.infer<typeof formSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setStatus("sending");
    try {
      const result = await sendContactEmail({ data });
      if (result.success) {
        setStatus("sent");
        toast.success("Message sent!", {
          description: "Thanks for reaching out. I'll get back to you soon.",
        });
        reset();
        window.setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("idle");
        toast.error("Failed to send", {
          description: result.error,
        });
      }
    } catch (err) {
      console.error("[ContactForm] Server function error:", err);
      setStatus("idle");
      toast.error("Something went wrong", {
        description: "Please try again or email me directly.",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full text-left"
      id="contact-form"
    >
      <div className="glass rounded-2xl p-6 sm:p-8 space-y-5">
        {/* Name */}
        <div className="space-y-2">
          <label
            htmlFor="contact-name"
            className="text-xs uppercase tracking-widest text-muted-foreground"
          >
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="Your name"
            autoComplete="name"
            {...register("name")}
            className="w-full rounded-xl border border-glass-border bg-foreground/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-foreground/30 focus:ring-1 focus:ring-foreground/20 focus:bg-foreground/[0.05]"
          />
          {errors.name && (
            <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="contact-email"
            className="text-xs uppercase tracking-widest text-muted-foreground"
          >
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
            className="w-full rounded-xl border border-glass-border bg-foreground/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-foreground/30 focus:ring-1 focus:ring-foreground/20 focus:bg-foreground/[0.05]"
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <label
            htmlFor="contact-subject"
            className="text-xs uppercase tracking-widest text-muted-foreground"
          >
            Subject
          </label>
          <input
            id="contact-subject"
            type="text"
            placeholder="What's this about?"
            {...register("subject")}
            className="w-full rounded-xl border border-glass-border bg-foreground/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-foreground/30 focus:ring-1 focus:ring-foreground/20 focus:bg-foreground/[0.05]"
          />
          {errors.subject && (
            <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label
            htmlFor="contact-message"
            className="text-xs uppercase tracking-widest text-muted-foreground"
          >
            Message
          </label>
          <textarea
            id="contact-message"
            rows={4}
            placeholder="Tell me about your project or just say hello..."
            {...register("message")}
            className="w-full rounded-xl border border-glass-border bg-foreground/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200 focus:border-foreground/30 focus:ring-1 focus:ring-foreground/20 focus:bg-foreground/[0.05] resize-none"
          />
          {errors.message && (
            <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status !== "idle"}
          className="group w-full inline-flex items-center justify-center gap-2.5 bg-foreground text-background px-6 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 hover:opacity-90 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : status === "sent" ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Sent!
            </>
          ) : (
            <>
              Send Message
              <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
