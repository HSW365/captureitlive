export function EnergyTrail({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 1400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="none">
      <defs>
        <linearGradient id="trailGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF6B4A" />
          <stop offset="33%" stopColor="#F5A623" />
          <stop offset="66%" stopColor="#1D9A85" />
          <stop offset="100%" stopColor="#8358D6" />
        </linearGradient>
      </defs>
      <path
        d="M100 0 C40 120, 160 220, 100 340 S20 520, 100 660 S180 840, 100 980 S30 1180, 100 1400"
        stroke="url(#trailGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        strokeDasharray="1400"
        strokeDashoffset="1400"
        className="animate-trail-draw"
      />
    </svg>
  );
}
