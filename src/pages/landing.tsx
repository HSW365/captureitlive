import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { SunSalutation } from "@/components/illustrations/sun-salutation";
import { EnergyTrail } from "@/components/illustrations/energy-trail";
import { GlobeConnect, LotusPulse, ClassBloom, HandsSpark } from "@/components/illustrations/feature-icons";

const features = [
  { icon: GlobeConnect, title: "Find your people, anywhere", body: "Instructors and students discover each other by style, timezone, and energy — not just proximity." },
  { icon: LotusPulse, title: "Practice out loud", body: "Share reflections, breakthroughs, and questions in a feed built for presence, not performance." },
  { icon: ClassBloom, title: "Classes that fit your life", body: "Browse live and virtual sessions, RSVP in a tap, and build a practice around real instructors." },
  { icon: HandsSpark, title: "Grow through connection", body: "Follow instructors, build community, and carry positive energy from the mat into everyday life." },
];

export default function Landing() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 md:pt-24 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-rise">
          <span className="inline-block text-xs font-mono tracking-widest uppercase text-coral-600 bg-coral-50 px-3 py-1 rounded-full mb-6">
            A community platform for yoga
          </span>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] font-medium text-foreground">
            Connect. Practice.
            <br />
            <span className="italic text-coral-600">Belong.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-md">
            Yogo brings yoga instructors and students together, worldwide — to build real community
            through shared practice and positive energy.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/pricing"><Button size="lg">Join Yogo — $8/mo</Button></Link>
            <Link href="/community"><Button size="lg" variant="outline">Explore the community</Button></Link>
          </div>
        </div>
        <div className="relative flex justify-center">
          <SunSalutation className="w-full max-w-sm" />
        </div>
      </section>

      <section className="relative bg-muted/60 py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-[1fr_auto] gap-16 items-start">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-medium mb-4">
              Every connection carries energy forward.
            </h2>
            <p className="text-muted-foreground max-w-lg mb-16">
              The ribbon beside these features traces one continuous line, the same way one class,
              one post, one conversation on Yogo tends to lead into the next.
            </p>
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-14">
              {features.map(({ icon: Icon, title, body }) => (
                <div key={title}>
                  <Icon className="w-10 h-10 text-coral-500 mb-4" />
                  <h3 className="font-display text-xl font-medium mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
          <EnergyTrail className="hidden md:block w-24 h-[560px] justify-self-center" />
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display text-3xl md:text-4xl font-medium mb-4">
          Your practice is better with people in it.
        </h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Whether you teach or you're finding your way onto the mat, Yogo is where that happens next.
        </p>
        <Link href="/pricing"><Button size="lg">Get started — $8/mo</Button></Link>
      </section>
    </div>
  );
}
