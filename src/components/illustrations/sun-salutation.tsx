export function SunSalutation({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="240" cy="180" r="150" fill="url(#sunGrad)" opacity="0.15" />
      <defs>
        <radialGradient id="sunGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#FF6B4A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="figGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF6B4A" />
          <stop offset="100%" stopColor="#8358D6" />
        </linearGradient>
      </defs>
      {/* rays */}
      <g stroke="#F5A623" strokeWidth="3" strokeLinecap="round" opacity="0.5">
        <line x1="240" y1="20" x2="240" y2="55" />
        <line x1="110" y1="60" x2="132" y2="82" />
        <line x1="370" y1="60" x2="348" y2="82" />
        <line x1="60" y1="180" x2="95" y2="180" />
        <line x1="420" y1="180" x2="385" y2="180" />
      </g>
      {/* figure in urdhva hastasana / raised-arms pose */}
      <g transform="translate(240,205)">
        <circle cx="0" cy="-110" r="22" fill="url(#figGrad)" />
        <path
          d="M0 -88 L0 20 M0 -70 L-58 -140 M0 -70 L58 -140 M0 20 L-34 120 M0 20 L34 120"
          stroke="url(#figGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>
      {/* ground shadow */}
      <ellipse cx="240" cy="332" rx="70" ry="10" fill="#2A1F1A" opacity="0.08" />
    </svg>
  );
}
