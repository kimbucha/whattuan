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

export default function Experience() {
  const { ref } = useSectionInView("Experience");
  const { theme } = useTheme();

  return (
    <section id="experience" ref={ref} className="scroll-mt-28 mb-28 sm:mb-40">
      <SectionHeading>exp</SectionHeading>
      <VerticalTimeline >
        <VerticalTimelineElement
          visible={true}
          className="vertical-timeline-element--work lowercase"
          date={experiencesData[0].date}
          // iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          // icon={<WorkIcon />}
        >
          <h3 className="vertical-timeline-element-title">
            {experiencesData[0].title}
          </h3>
          <h4 className="vertical-timeline-element-subtitle">
            {/* <a
              href="https://tjmaxx.tjx.com"
              target="_blank"
              rel="noopener noreferrer"
            > */}
            {experiencesData[0].company} | {experiencesData[0].location}
            {/* </a> */}
          </h4>
          <p>{experiencesData[0].description}</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          visible={true}
          className="vertical-timeline-element--work lowercase"
          date={experiencesData[1].date}
          // iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          // icon={<WorkIcon />}
        >
          <h3 className="vertical-timeline-element-title">
            {experiencesData[1].title}
          </h3>
          <h4 className="vertical-timeline-element-subtitle">
            {experiencesData[1].company} | {experiencesData[1].location}
          </h4>
          <p>{experiencesData[1].description}</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          visible={true}
          className="vertical-timeline-element--work lowercase"
          date={experiencesData[2].date}
          // iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          // icon={<WorkIcon />}
        >
          <h3 className="vertical-timeline-element-title">
            {experiencesData[2].title}
          </h3>
          <h4 className="vertical-timeline-element-subtitle">
            {experiencesData[2].company} | {experiencesData[2].location}
          </h4>
          <p>{experiencesData[2].description}</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          visible={true}
          className="vertical-timeline-element--work lowercase"
          date={experiencesData[3].date}
          // iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          // icon={<WorkIcon />}
        >
          <h3 className="vertical-timeline-element-title">
            {experiencesData[3].title}
          </h3>
          <h4 className="vertical-timeline-element-subtitle">
            {experiencesData[3].company} | {experiencesData[3].location}
          </h4>
          <p>{experiencesData[3].description}</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          visible={true}
          className="vertical-timeline-element--work lowercase"
          date={experiencesData[4].date}
          // iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          // icon={<WorkIcon />}
        >
          <h3 className="vertical-timeline-element-title">
            {experiencesData[4].title}
          </h3>
          <h4 className="vertical-timeline-element-subtitle">
            {experiencesData[4].company} | {experiencesData[4].location}
          </h4>
          <p>{experiencesData[4].description}</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          visible={true}
          className="vertical-timeline-element--work lowercase"
          date={experiencesData[5].date}
          // iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          // icon={<WorkIcon />}
        >
          <h3 className="vertical-timeline-element-title">
            {experiencesData[5].title}
          </h3>
          <h4 className="vertical-timeline-element-subtitle">
            {experiencesData[5].company} | {experiencesData[5].location}
          </h4>
          <p>{experiencesData[5].description}</p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          visible={true}
          className="vertical-timeline-element--work lowercase"
          date={experiencesData[6].date}
          // iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
          // icon={<WorkIcon />}
        >
          <h3 className="vertical-timeline-element-title">
            {experiencesData[6].title}
          </h3>
          <h4 className="vertical-timeline-element-subtitle">
            {experiencesData[6].company} | {experiencesData[6].location}
          </h4>
          <p>{experiencesData[6].description}</p>
        </VerticalTimelineElement>

        
        <VerticalTimelineElement
        // iconStyle={{ background: 'rgb(16, 204, 82)', color: '#fff' }}
        // icon={<StarIcon />}
        />
      </VerticalTimeline>
    </section>
  );
}
