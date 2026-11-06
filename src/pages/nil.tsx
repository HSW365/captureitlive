import { Link } from "wouter";
import { Trophy, Building2, ShieldCheck } from "lucide-react";
export default function Nil() {
  return (
    <div className="arena"><div className="glow" /><div className="lines" />
      <section className="relative max-w-5xl mx-auto px-5 md:px-6 pt-16 pb-24">
        <div className="text-[13px] font-extrabold tracking-[0.2em] uppercase volt">NIL365 by CaptureItLive</div>
        <h1 className="ath text-[15vw] md:text-[130px] mt-4">Get seen.<br />Get <span style={{ WebkitTextStroke: "2px #F4F4F6", color: "transparent" }}>paid.</span></h1>
        <p className="muted text-lg md:text-xl mt-8 max-w-xl">Upload your best clips from training and games. Verified colleges and brands browse athletes and send recruiting interest and brand deal offers straight to your inbox.</p>
        <div className="grid md:grid-cols-2 gap-4 mt-12">
          <Link href="/nil/athlete" className="panel p-7 block hover:-translate-y-1 transition-transform"><Trophy className="volt" size={28} /><div className="ath text-4xl mt-5">I'm an athlete</div><p className="muted mt-3">Build your profile, upload clips, receive offers.</p></Link>
          <Link href="/nil/scout" className="panel p-7 block hover:-translate-y-1 transition-transform"><Building2 className="volt" size={28} /><div className="ath text-4xl mt-5">College or brand</div><p className="muted mt-3">Apply for access, find athletes, make offers.</p></Link>
        </div>
        <div className="panel p-6 mt-4 flex gap-4 items-start"><ShieldCheck className="volt shrink-0" size={24} />
          <p className="muted text-sm">Athletes under 18 are only listed after a parent or guardian consents. Only organizations we approve can see athlete profiles and clips, and all offers stay inside NIL365. Always follow your state, school and NCAA rules on name, image and likeness.</p></div>
      </section>
    </div>
  );
}
