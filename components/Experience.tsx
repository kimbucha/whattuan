"use client";

import React from "react";
import SectionHeading from "./Section-Heading";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { experiencesData } from "@/lib/data";
import { useSectionInView } from "@/lib/hooks";
import { useTheme } from "@/context/Theme-Context";
import Image from "next/image";

export default function Experience() {
  const { ref } = useSectionInView("Exp", 0.5,);
  const { theme } = useTheme();

  return (
    <section id="experience" ref={ref} className="scroll-mt-28 mb-28 sm:mb-40 ">
      <SectionHeading>exp</SectionHeading>
      <VerticalTimeline>
        {experiencesData.map((item, index) => (
          <React.Fragment key={index}>
            <VerticalTimelineElement
            
              visible={true}
              className=" lowercase vertical-timeline-element--work "
              date={experiencesData[index].date}
              contentStyle={{
                background:
                  theme == "light" ? "#f3f4f6" : "rgba(255,255,255,.05",
                boxShadow: "none",
                border: "1px solid rgba(0,0,0,.05)",
                textAlign: "left",
                padding: "1.3rem, 2rem",
              }}
              contentArrowStyle={{
                borderRight:
                  theme == "light"
                    ? ".4rem solid #9ca3af"
                    : ".4rem solid rgba(255,255,255,.5)",
              }}
              icon={<Image src={item.icon} alt={""} className="m-auto mt-3" />}
              iconStyle={{
                background:
                  theme == "light" ? "#f3f4f6" : "rgba(255,255,255,.05",
                backgroundColor:
                  theme == "light" ? "#f3f4f6" : "rgba(255,255,255,.05",
              }}
            >
              <h3 className="vertical-timeline-element-title font-bold">
                {item.title}
              </h3>
              <h4 className="vertical-timeline-element-subtitle italic">
                {item.company} | {item.location}
              </h4>
              <p>{item.description}</p>
            </VerticalTimelineElement>
          </React.Fragment>
        ))}
      </VerticalTimeline>
    </section>
  );
}
