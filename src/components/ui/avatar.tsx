import { cn } from "@/lib/utils";

export function Avatar({ name, src, className }: { name: string; src?: string | null; className?: string }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();
  if (src) {
    return <img src={src} alt={name} className={cn("rounded-full object-cover bg-muted", className)} />;
  }
  return (
    <div className={cn("rounded-full bg-gradient-to-br from-coral-500 to-violet-500 text-white flex items-center justify-center font-display font-semibold", className)}>
      {initials}
    </div>
  );
}
