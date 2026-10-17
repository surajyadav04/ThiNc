import Header from "@/components/navigation/Header";
import ImmersiveHero from "@/components/hero/ImmersiveHero";
import AnatomyJourney from "@/components/journey/AnatomyJourney";
import SymptomExplorer from "@/components/sections/SymptomExplorer";
import WristExplorer from "@/components/sections/WristExplorer";
import ConditionsGrid from "@/components/sections/ConditionsGrid";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0E1A] selection:bg-[#03ACED] selection:text-[#0A0D24]">
      {/* Global Header */}
      <Header />

      {/* Main Content Sections corresponding directly to Storyboard Panels 01 to 09 */}
      <main className="flex-grow">
        {/* Panel 01: Home - Hero (Immersive 3D) */}
        <ImmersiveHero />

        {/* Panel 02: Anatomy Journey (Cinematic Continuous Frame Sequence) */}
        <AnatomyJourney />

        {/* Panel 03: Symptom Explorer (Patient Journey) */}
        <SymptomExplorer />

        {/* Panel 04: Explore Wrist (Interactive 3D Detail) */}
        <WristExplorer />

        {/* Panel 07: Patient Education / Conditions Grid */}
        <ConditionsGrid />

        {/* Panel 08: About the Practice */}
        <AboutSection />

        {/* Panel 09: Contact / Appointment */}
        <ContactSection />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
