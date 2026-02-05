import { Heart } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/site-logo.dim_256x256.png" 
              alt="Gallery Logo" 
              className="h-10 w-10 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">Image Gallery</h1>
              <p className="text-xs text-muted-foreground">Share your moments</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center text-sm text-muted-foreground">
          © 2026. Built with <Heart className="inline h-4 w-4 text-accent fill-accent" /> using{' '}
          <a 
            href="https://caffeine.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-accent transition-colors font-medium"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
