"use client";

import React from "react";
import { projectsData } from "@/lib/data";
import Project from "./Project";
import SectionHeading from "./Section-Heading";

const Projects: React.FC = () => {
  return (
    <section id="projects" className="flex flex-col items-center justify-center min-h-screen mb-20 sm:mb-28 w-full text-center">
      <SectionHeading>Projects</SectionHeading>
      <div className="flex flex-col items-center gap-6 mt-10">
        {projectsData.map((project, index) => (
          <Project key={index} {...project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
