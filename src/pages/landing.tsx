import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MEMBERSHIP_PRICE } from "@/lib/config";

const img = (name: string) => `${import.meta.env.BASE_URL}img/${name}.jpg`;

const included = [
  "The community feed: post, comment and follow",
  "Every instructor on CaptureItLive, one tap to follow",
  "Unlimited class RSVPs, including paid sessions",
  "Direct messages with instructors and students",
  "List and fill your own classes if you teach",
  "The Learn library: breathing, stretching, meditation",
];

export default function Landing() {
  const [, setLocation] = useLocation();
  // Ad QR / sign-up links (?signup or #signup): show the app a moment, then open sign-up + membership in one step.
  useEffect(() => {
    if (!/[?&]signup/.test(location.search) && !/^#(signup|join)$/.test(location.hash)) return;
    const t = setTimeout(() => setLocation("/signup"), 900);
    return () => clearTimeout(t);
  }, [setLocation]);
  return (
    <div>
      {/* Hero: one real class, full frame */}
      <section className="px-3 md:px-4 pt-3">
        <div className="relative overflow-hidden rounded-[28px] md:rounded-[36px] min-h-[640px] md:min-h-[min(820px,calc(100vh-110px))] flex items-end">
          <img
            src={img("class")}
            alt="A yoga class holding warrior pose together in a studio"
            className="absolute inset-0 w-full h-full object-cover object-[50%_35%]"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1611] via-[#0E1611]/55 to-[#0E1611]/0" />
          <div className="relative w-full max-w-6xl mx-auto px-6 md:px-10 pb-10 md:pb-16">
            <h1 className="text-white font-extrabold text-[15vw] sm:text-7xl md:text-[124px] leading-[0.88] tracking-[-0.045em] max-w-4xl">
              Yoga is better with people in it.
            </h1>
            <div className="mt-8 md:mt-10 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
              <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-md">
                CaptureItLive is where instructors and students find each other, fill classes and keep practicing together between sessions.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/signup"><Button size="lg">Join for ${MEMBERSHIP_PRICE} a month</Button></Link>
                <Link href="/classes">
                  <Button size="lg" variant="outline" className="border-white/35 text-white hover:bg-white/10">See this week's classes</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two ways in */}
      <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-32">
        <h2 className="text-4xl md:text-6xl font-bold leading-[0.95] max-w-3xl">
          Whether you teach the class or take it, you get the whole room.
        </h2>

        <div className="mt-14 md:mt-20 grid md:grid-cols-2 gap-6">
          <article className="group">
            <div className="overflow-hidden rounded-[24px] aspect-[4/5] bg-muted">
              <img src={img("practice")} alt="A student in downward dog on a studio floor" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
            </div>
            <h3 className="mt-6 text-2xl md:text-3xl font-bold">For students</h3>
            <p className="mt-3 text-muted-foreground text-lg leading-relaxed max-w-md">
              Find instructors by style and level, RSVP to live and virtual classes, and keep the conversation going with the people you practice beside.
            </p>
            <Link href="/instructors" className="mt-5 inline-block font-semibold text-foreground underline decoration-coral-600 decoration-2 underline-offset-[6px] hover:text-coral-700">
              Browse instructors
            </Link>
          </article>

          <article className="group md:mt-24">
            <div className="overflow-hidden rounded-[24px] aspect-[4/5] bg-muted">
              <img src={img("teacher")} alt="An instructor playing a singing bowl during class" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
            </div>
            <h3 className="mt-6 text-2xl md:text-3xl font-bold">For instructors</h3>
            <p className="mt-3 text-muted-foreground text-lg leading-relaxed max-w-md">
              List your classes, take RSVPs and message your students directly. Payments for your classes go straight to you. CaptureItLive takes no cut.
            </p>
            <Link href="/signup" className="mt-5 inline-block font-semibold text-foreground underline decoration-coral-600 decoration-2 underline-offset-[6px] hover:text-coral-700">
              Start teaching on CaptureItLive
            </Link>
          </article>
        </div>
      </section>

      {/* Membership */}
      <section className="px-3 md:px-4 pt-24 md:pt-32">
        <div className="rounded-[28px] md:rounded-[36px] bg-moss-900 text-white overflow-hidden grid lg:grid-cols-[1.1fr_1fr]">
          <div className="p-8 md:p-14 lg:p-16">
            <h2 className="text-4xl md:text-6xl font-bold leading-[0.95]">One membership. Students and teachers pay the same.</h2>
            <div className="mt-10 flex items-baseline gap-3">
              <span className="text-[96px] md:text-[132px] font-extrabold leading-none tracking-[-0.05em]">${MEMBERSHIP_PRICE}</span>
              <span className="text-white/60 text-xl">a month</span>
            </div>
            <ul className="mt-8 grid gap-3 text-white/85 text-lg">
              {included.map((x) => (
                <li key={x} className="flex gap-3">
                  <span aria-hidden className="mt-[11px] h-[7px] w-[7px] shrink-0 rounded-full bg-coral-500" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link href="/signup"><Button size="lg">Create your account</Button></Link>
              <span className="text-white/55 text-sm">Pay by Cash App or Zelle. No card needed.</span>
            </div>
          </div>
          <div className="relative min-h-[360px] lg:min-h-0">
            <img src={img("studio")} alt="An instructor stretching in a sunlit studio" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-8">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-10 md:gap-16 items-center">
          <div className="overflow-hidden rounded-[24px] aspect-square">
            <img src={img("arches")} alt="A practitioner balancing in a white arched hall" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <h2 className="text-4xl md:text-6xl font-bold leading-[0.95]">Your first class is two minutes away.</h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-md">
              Make your account, follow a few instructors and pick a session.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup"><Button size="lg">Join CaptureItLive</Button></Link>
              <Link href="/login"><Button size="lg" variant="outline">I already have an account</Button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
