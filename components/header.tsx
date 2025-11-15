export function Header() {
  return (
    <header className="w-full bg-accent">
      <div className="w-full px-4">
        <div className="flex justify-between items-center py-4">
          <a href="https://www.shaf.fun/">
            <img
              src="/shafdotfun.png"
              alt="Shaf.fun"
              className="h-8 hover:scale-105 transition-transform"
            />
          </a>
          <div className="flex items-center gap-x-4">
            <a href="/" className=" text-foreground hover:text-primary">
              Tokenizer
            </a>
            <a href="/about" className=" text-foreground hover:text-primary">
              About
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

