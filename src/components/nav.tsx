import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-context";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/community", label: "Community" },
  { href: "/instructors", label: "Instructors" },
  { href: "/classes", label: "Classes" },
  { href: "/pricing", label: "Pricing" },
];

export function Nav() {
  const [location] = useLocation();
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Yogo
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${
                location === l.href ? "text-coral-600" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user && profile ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-2">
                <Avatar name={profile.full_name} src={profile.avatar_url} className="w-9 h-9 text-xs" />
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>Sign out</Button>
            </>
          ) : (
            <>
              <Link href="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
              <Link href="/signup"><Button size="sm">Join Yogo</Button></Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium">
              {l.label}
            </Link>
          ))}
          {user && profile ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium">Dashboard</Link>
              <Button variant="outline" size="sm" onClick={() => signOut()}>Sign out</Button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="text-sm font-medium">Log in</Link>
              <Link href="/signup" onClick={() => setOpen(false)}><Button size="sm" className="w-full">Join Yogo</Button></Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
