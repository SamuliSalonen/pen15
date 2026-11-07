// The favicon pencil, lying flat with the tip pointing right.
export function PencilIcon({ size = 32, rotate = 0, className, style }) {
  return (
    <svg className={className} style={style} width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <g transform={`translate(16 16) rotate(${rotate}) scale(1.13)`}>
        <rect x="-13.6" y="-4.5" width="6" height="9" rx="2.6" fill="#EF7C86" />
        <rect x="-9.2" y="-4.5" width="3.4" height="9" fill="#AEB4BD" />
        <rect x="-5.8" y="-4.5" width="11.8" height="9" fill="#F2B131" />
        <path d="M6 -4.5 L13 0 L6 4.5 Z" fill="#E9C79B" />
        <path d="M10.1 -1.87 L13 0 L10.1 1.87 Z" fill="#33312E" />
        <path d="M-9.2 1.6 H10.5 L6 4.5 H-9.2 Z" fill="#000" opacity="0.14" />
      </g>
    </svg>
  )
}
