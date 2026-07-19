import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 py-32 text-center">
      <h1 className="font-display text-4xl font-medium mb-3">Off the mat</h1>
      <p className="text-muted-foreground mb-8">This page doesn't exist. Let's get you back to center.</p>
      <Link href="/"><Button>Back to Yogo</Button></Link>
    </div>
  );
}
