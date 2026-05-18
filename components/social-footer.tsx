const socialLinks = [
  { label: "GH", href: "https://github.com", title: "GitHub" },
  { label: "LI", href: "https://linkedin.com", title: "LinkedIn" },
  { label: "TG", href: "https://telegram.org", title: "Telegram" },
];

export function SocialFooter() {
  return (
    <footer className="border-t border-[#b026ff]/20 bg-[#000000] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-[#888888] text-sm">CONNECT:</span>
            <div className="flex items-center gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.title}
                  className="
                    border border-[#b026ff]/40 px-3 py-1
                    text-[#e0e0e0] text-sm
                    hover:border-[#b026ff] hover:text-[#b026ff]
                    hover:neon-glow hover:neon-border-glow
                    transition-all duration-200
                  ">
                  [{link.label}]
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#888888]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#00ff00] animate-pulse" />
              SYSTEM ACTIVE
            </span>
            <span>|</span>
            <span>© 2026 DEV.SYS</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#b026ff]/10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#b026ff]">guest@portfolio</span>
            <span className="text-[#888888]">:</span>
            <span className="text-[#b026ff]">~</span>
            <span className="text-[#888888]">$</span>
            <span className="text-[#e0e0e0]">echo "Thanks for visiting"</span>
            <span className="cursor-blink text-[#b026ff]">█</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
