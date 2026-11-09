export function Footer() {
  return (
    <footer className="border-t border-ink/25 bg-paper py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs font-mono text-ink">
          Amplikaa · Edición Digital · Tecnología &amp; Marketing · Vol. 2026
        </p>
        <div className="flex gap-6 text-xs font-mono text-ink">
          <a href="#" className="hover:text-ink transition-colors cursor-pointer">Legal</a>
          <a href="#" className="hover:text-ink transition-colors cursor-pointer">Privacidad</a>
          <a href="#" className="hover:text-ink transition-colors cursor-pointer">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
