"use client";

import { useState } from "react";

export function ShareButton({
  title,
  url,
  label,
  copiedLabel,
}: {
  title: string;
  url: string;
  label: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // User cancelled the native share sheet — not an error worth surfacing.
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-full border border-line px-3 py-1.5 text-sm text-ink/70 hover:bg-white"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
