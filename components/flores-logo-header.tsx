// Flores logo SVG React component
export default function FloresLogo({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      width="181"
      height="45"
      viewBox="0 0 181 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <g>
        <circle cx="22.5" cy="22.5" r="22.5" fill="#1976A5" />
        <path
          d="M13.5 32.5C13.5 32.5 17.5 27.5 27.5 27.5C37.5 27.5 41.5 32.5 41.5 32.5"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M13.5 12.5C13.5 12.5 17.5 17.5 27.5 17.5C37.5 17.5 41.5 12.5 41.5 12.5"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      <text
        x="50"
        y="33"
        fill="#1976A5"
        fontFamily="Open Sans, Arial, sans-serif"
        fontWeight="bold"
        fontSize="38"
      >
        Flores
      </text>
    </svg>
  );
}
