import CTASection from "@/components/home/CTASection";
import CompletedProjects from "@/components/home/CompletedProjects";
import Hero from "@/components/home/Hero";
import ProjectsPreview from "@/components/home/ProjectsPreview";
import Stats from "@/components/home/Stats";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <ProjectsPreview />
      <CompletedProjects />
      <Testimonials />
      <CTASection />
    </>
  );
}

