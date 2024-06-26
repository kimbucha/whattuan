"use client";

import React from 'react';
import SectionHeading from './Section-Heading';
import { projectsData } from '@/lib/data';
import Project from './Project';
import { useSectionInView } from '@/lib/hooks';


const Projects: React.FC = () => {
  const {ref} = useSectionInView('Projects', .5);
  return (
    <section ref={ref} id="projects" className="scroll-mt-28">
      <SectionHeading>Projects</SectionHeading>
      <div>
        {
          projectsData.map((project, index) => (
            <React.Fragment key={index}>
              <Project {...project}/>
            </React.Fragment>

          ))
        }
      </div>
    </section>
  );
};


export default Projects;