import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HackathonSection from "@/components/landing/HackathonSection";
import Footer from "@/components/landing/Footer";
import FloatingParticles from "@/components/landing/FloatingParticles";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <FloatingParticles />
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <HackathonSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
