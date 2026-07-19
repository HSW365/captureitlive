export function GlobeConnect({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="2.5" />
      <path d="M6 32h52M32 6c8 7 8 45 0 52M32 6c-8 7-8 45 0 52" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      <circle cx="14" cy="20" r="3" fill="currentColor" />
      <circle cx="50" cy="44" r="3" fill="currentColor" />
      <path d="M14 20 Q32 32 50 44" stroke="currentColor" strokeWidth="2" strokeDasharray="2 4" />
    </svg>
  );
}

export function LotusPulse({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M32 44 C24 44 18 36 20 26 C26 30 30 36 32 44 C34 36 38 30 44 26 C46 36 40 44 32 44Z" fill="currentColor" opacity="0.85" />
      <path d="M32 44 C26 40 22 32 26 22 C30 28 32 36 32 44 C32 36 34 28 38 22 C42 32 38 40 32 44Z" fill="currentColor" opacity="0.5" />
      <circle cx="32" cy="50" r="4" fill="currentColor" />
    </svg>
  );
}

export function ClassBloom({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <circle cx="32" cy="32" r="6" fill="currentColor" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse key={deg} cx="32" cy="18" rx="6" ry="12" fill="currentColor" opacity="0.55" transform={`rotate(${deg} 32 32)`} />
      ))}
    </svg>
  );
}

export function HandsSpark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path d="M14 40 C14 28 22 20 32 20 C42 20 50 28 50 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 40 L20 48 M32 40 L32 52 M44 40 L44 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32 6 L32 14 M22 10 L26 16 M42 10 L38 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}
