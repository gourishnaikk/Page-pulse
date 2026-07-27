function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav
        className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-8"
        aria-label="Primary navigation"
      >
        <a
          href="/"
          className="text-xl font-semibold tracking-normal text-slate-950 outline-none transition-colors hover:text-indigo-700 focus-visible:rounded focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-4"
        >
          Page Pulse
        </a>
      </nav>
    </header>
  );
}

export default Navbar;
