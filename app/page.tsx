import About from "@/components/About";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Intro from "@/components/Intro";
import Lines from "@/components/Lines";
import Projects from "@/components/Projects";
import SectionDivider from "@/components/Section-Divider";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <main className="flex flex-col items-center px-4">
      <Lines />
      <Intro />
      <SectionDivider />
      <About />
      {/* <Projects/>
     <Skills/>
     <Experience/> */}
      <Contact />
    </main>
  );
}
