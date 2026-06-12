"use client";

interface Props {
  variant: "inline" | "block";
}

const SHARE_TEXT =
  "賃金・物価・税収・為替の推移を政権帯とともに確認できます。\n\n#KeizaiMap #日本経済";

function openShare() {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const text = `${SHARE_TEXT}\n${url}`;
  window.open(
    `https://x.com/intent/post?text=${encodeURIComponent(text)}`,
    "_blank",
    "noopener,noreferrer",
  );
}

function XIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.842L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function ShareButton({ variant }: Props) {
  if (variant === "inline") {
    return (
      <button
        onClick={openShare}
        aria-label="X でこのページをシェア"
        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        style={{ backgroundColor: "#000", color: "#fff" }}
      >
        <XIcon size={13} />
        Xでシェア
      </button>
    );
  }

  return (
    <button
      onClick={openShare}
      aria-label="X でこのページをシェア"
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      style={{ backgroundColor: "#000", color: "#fff" }}
    >
      <XIcon size={15} />
      Xでシェア
    </button>
  );
}
