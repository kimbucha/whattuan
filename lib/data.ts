import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";

import spongebob from "@/public/spongebob.webp";
import doge from "@/public/doge.jpeg";
import harambe from "@/public/harambe.jpeg";


export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
  {
    name: "Contact",
    hash: "#contact",
  },
] as const;

export const experiencesData = [
  {
    title: "B.S. Computer Science",
    location: "San Francisco, CA",
    description:
      "San Francisco State Univesity",
    icon: React.createElement(LuGraduationCap),
    date: "2019 - Current",
  },
  // {
  //   title: "exp 2",
  //   location: "city, state",
  //   description:
  //     "desc",
  //   icon: React.createElement(CgWorkAlt),
  //   date: "2020",
  // },
  // {
  //   title: "exp 3",
  //   location: "city, state",
  //   description:
  //     "desc",
  //   icon: React.createElement(FaReact),
  //   date: "2021 - present",
  // },
] as const;

export const projectsData = [
  {
    title: "project 1",
    description:
      "bro ipsum dolor sit amet gaper backside single track, epic clipless. drop gondy, clipless rip bowl couloir bomb hole. cruiser crank endo, sucker hole piste ripping ACL flow face plant pinner.",
    tags: ["tag.A", "tag.B", "tag.C", "tag.d", "tag.e"],
    imageUrl: doge,
  },
  {
    title: "project 2",
    description:
      "Chase ball of string eat plants, meow, and throw up because  ate plants going to catch the red dot today steal the warm chair right after you get up.",
    tags: ["tag.A", "tag.B", "tag.C", "tag.d", "tag.e"],
    imageUrl: spongebob,
  },
  {
    title: "project 3",
    description:
      "Yolo ipsum dolor sit amet, consectetur adipiscing elit. Ut ac suscipit leo. Carpe diem vulputate est nec commodo rutrum. .",
    tags: ["tag.A", "tag.B", "tag.C", "tag.d", "tag.e"],
    imageUrl: harambe,
  },
] as const;

export const skillsData = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Git",
  "Tailwind",
  "Express",
  "Python",
  "Framer Motion",
] as const;