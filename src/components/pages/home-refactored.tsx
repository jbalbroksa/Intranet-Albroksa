import { useAuth } from "../../../supabase/auth";
import Header from "../landing/Header";
import HeroSection from "../landing/HeroSection";
import FeaturesSection from "../landing/FeaturesSection";
import CTASection from "../landing/CTASection";
import Footer from "../landing/Footer";

export default function LandingPage() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <Header />

      <main className="container mx-auto px-4">
        <HeroSection isLoggedIn={isLoggedIn} />
        <FeaturesSection />
        <CTASection isLoggedIn={isLoggedIn} />
      </main>

      <Footer />
    </div>
  );
}
