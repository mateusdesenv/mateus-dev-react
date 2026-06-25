const icons = {
  code: (
    <>
      <path d="m9 18-6-6 6-6" />
      <path d="m15 6 6 6-6 6" />
      <path d="m14 4-4 16" />
    </>
  ),
  briefcase: (
    <>
      <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
      <path d="M4 7h16v12H4z" />
      <path d="M4 12h16" />
      <path d="M10 12v2h4v-2" />
    </>
  ),
  monitor: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </>
  ),
  cloud: (
    <>
      <path d="M17.5 18H7a4 4 0 1 1 .7-7.9A5.5 5.5 0 0 1 18 12h.5a3 3 0 0 1 0 6Z" />
    </>
  ),
  user: (
    <>
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </>
  ),
  star: (
    <>
      <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
    </>
  ),
  check: (
    <>
      <path d="m7 12 3 3 7-7" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="7" ry="3" />
      <path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
      <path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="4" width="16" height="6" rx="1.5" />
      <rect x="4" y="14" width="16" height="6" rx="1.5" />
      <path d="M8 7h.01" />
      <path d="M8 17h.01" />
    </>
  ),
  tools: (
    <>
      <path d="m14.7 6.3 3 3" />
      <path d="M4 20 16.5 7.5a2.1 2.1 0 0 0 .3-2.6L20 2l2 2-2.9 3.2a2.1 2.1 0 0 0-2.6.3L4 20Z" />
      <path d="m5 7 4 4" />
    </>
  ),
  graduation: (
    <>
      <path d="m22 10-10-5-10 5 10 5 10-5Z" />
      <path d="M6 12v5c3 2 9 2 12 0v-5" />
    </>
  ),
  send: (
    <>
      <path d="M22 2 11 13" />
      <path d="m22 2-7 20-4-9-9-4 20-7Z" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 21h14" />
    </>
  ),
  github: (
    <>
      <path d="M15 22v-3.9a3.4 3.4 0 0 0-1-2.6c3.2-.4 6.6-1.6 6.6-7.1a5.4 5.4 0 0 0-1.5-3.8 5 5 0 0 0-.1-3.7s-1.2-.4-4 1.5a13.8 13.8 0 0 0-7.2 0C5 0 3.8.9 3.8.9a5 5 0 0 0-.1 3.7 5.4 5.4 0 0 0-1.5 3.8c0 5.5 3.4 6.7 6.6 7.1a3 3 0 0 0-.9 2.1V22" />
      <path d="M9 18c-3 .9-3-1.5-4.2-1.8" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.4-4.8a8.5 8.5 0 1 1 16.1-4Z" />
      <path d="M8.7 8.8c.2 4 2.8 5.7 6.1 6.5l1-1.4c.2-.3.1-.7-.2-.9l-1.7-.8c-.3-.1-.6 0-.8.2l-.5.6c-1.3-.5-2.3-1.4-2.9-2.7l.6-.6c.2-.2.3-.5.2-.8l-.8-1.6c-.2-.4-.7-.5-1-.2l-1 1.1Z" />
    </>
  ),
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
};

function Icon({ name, size = 24, className = '' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name] || icons.code}
    </svg>
  );
}

export default Icon;
