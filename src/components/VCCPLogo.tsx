type VCCPLogoProps = { size?: number };

export default function VCCPLogo({ size = 48 }: VCCPLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <rect width="64" height="64" rx="10" fill="#1a1a2e" stroke="#c9a227" strokeWidth="2" />
      {/* Car silhouette */}
      <g transform="translate(6, 28)">
        <path
          d="M4 18 L4 10 L10 4 L22 4 L28 8 L44 8 L50 14 L52 18 Z"
          fill="none"
          stroke="#c9a227"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="13" cy="18" r="3" fill="#c9a227" />
        <circle cx="43" cy="18" r="3" fill="#c9a227" />
        <line x1="4" y1="18" x2="7" y2="18" stroke="#c9a227" strokeWidth="1.5" />
        <line x1="19" y1="18" x2="37" y2="18" stroke="#c9a227" strokeWidth="1.5" />
        <line x1="49" y1="18" x2="52" y2="18" stroke="#c9a227" strokeWidth="1.5" />
      </g>
      {/* VCCP text */}
      <text
        x="32"
        y="22"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="14"
        fontWeight="bold"
        fill="#c9a227"
        letterSpacing="1"
      >
        VCCP
      </text>
    </svg>
  );
}
