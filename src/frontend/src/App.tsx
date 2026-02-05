import { Header, Footer } from './components/Header';
import { ImageUploader } from './components/gallery/ImageUploader';
import { GalleryGrid } from './components/gallery/GalleryGrid';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary/5 to-transparent">
          <div className="container mx-auto px-4 py-12">
            <div className="relative rounded-2xl overflow-hidden mb-8 shadow-xl">
              <img
                src="/assets/generated/hero-banner.dim_1400x400.png"
                alt="Gallery Hero"
                className="w-full h-48 md:h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                <div className="container mx-auto px-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    Share Your Moments
                  </h2>
                  <p className="text-white/90 text-lg">
                    Upload, view, and manage your images in one place
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="container mx-auto px-4 py-8">
          <ImageUploader />
        </section>

        {/* Gallery Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Gallery</h2>
            <p className="text-muted-foreground">
              Browse all uploaded images
            </p>
          </div>
          <GalleryGrid />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
