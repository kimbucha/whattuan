"use client";

import { projectsData } from "@/lib/data";
import { useState } from "react";
import ProjectImage from "./ProjectImage";

type ProjectProps = (typeof projectsData)[number];

function Project({ title, description, tags, imageUrl, imageWidth, imageHeight }: ProjectProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHoverStart = () => {
    setIsHovered(true);
  };

  const handleHoverEnd = () => {
    setIsHovered(false);
  };

  return (
    <div className="group mb-3 sm:mb-7 last:mb-28 cursor-pointer flex items-center relative">
      <section
        className="bg-gray-100 border border-black/5 overflow-hidden relative sm:h-auto transition rounded-lg dark:bg-white/10 dark:text-white p-5"
        style={{ maxWidth: '20rem', paddingBottom: '1rem' }} // Background box styles
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
      >
        <div className="flex flex-col justify-between h-full">
          <div>
            <h3 className="text-2xl font-semibold text-center">{title}</h3>
            <p className="mt-2 leading-relaxed text-gray-700 dark:text-white/70 lowercase text-center">
              {description}
            </p>
          </div>
          <div className="flex flex-wrap mt-4 gap-2 justify-center">
            {tags.map((tag, index) => (
              <li
                className="bg-black/[.7] px-3 py-1 text-[.7rem] text-white tracking-wider rounded-full uppercase dark:text-white/70"
                key={index}
              >
                {tag}
              </li>
            ))}
          </div>
        </div>
      </section>
      <ProjectImage
        imageUrl={imageUrl}
        imageWidth={imageWidth}
        imageHeight={imageHeight}
        isHovered={isHovered}
      />
    </div>
  );
}

export default Project;
