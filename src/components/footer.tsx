import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="font-display text-xl font-semibold">CaptureItLive</div>
          <p className="text-sm text-muted-foreground mt-1">Connecting instructors and students, worldwide.</p>
        </div>
        <div className="flex gap-8 text-sm text-muted-foreground">
          <Link href="/community" className="hover:text-foreground">Community</Link>
          <Link href="/instructors" className="hover:text-foreground">Instructors</Link>
          <Link href="/classes" className="hover:text-foreground">Classes</Link>
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
