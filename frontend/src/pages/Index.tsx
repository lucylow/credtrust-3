import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import CreditFlowDemo from "@/components/landing/CreditFlowDemo";
import IExecExplainer from "@/components/landing/IExecExplainer";
import FeaturesSection from "@/components/landing/FeaturesSection";
import AnalyticsPreview from "@/components/landing/AnalyticsPreview";
import TechStackSection from "@/components/landing/TechStackSection";
import HackathonSection from "@/components/landing/HackathonSection";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import FloatingParticles from "@/components/landing/FloatingParticles";


const Index = () => {
  return (
    <div className="bg-background">
      <main>
        <HeroSection />
        
        <ProblemSection />
        <SolutionSection />
        <CreditFlowDemo />
        <IExecExplainer />
        <FeaturesSection />
        <AnalyticsPreview />
        <TechStackSection />
        <HackathonSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
