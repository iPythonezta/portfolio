import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import { About, Skills, ProjectsSection, Experience, Education, Contact } from "@/components/Sections";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <ProjectsSection />
        <Experience />
        <Education />
        <Contact />
      </main>
    </>
  );
}
