import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";

import spongebob from "@/public/spongebob.webp";
import doge from "@/public/doge.jpeg";
import harambe from "@/public/harambe.jpeg";
import { compileFunction } from "vm";


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
    title: "Store Associate",
    company: "TJ Maxx",
    location: "San Jose, CA",
    description:
      "Gave customers a great experience when they visited.",
    duities: ["Make customers happy", "Talk to and help all customers", "Follow good customer service rules", "Keep the store clean and tidy"],
    icon: React.createElement(LuGraduationCap),
    date: "Aug 2015 -  Dec 2015",
  },
  {
    title: "Server | Host | Takeout Lead",
    company: "Buca di Beppo",
    location: "San Jose, CA",
    description:
      "helped people enjoy their meal. supported team growth and development.",
    icon: React.createElement(CgWorkAlt),
    date: "Jan 2016 -  Aug 2016",

  },
  {
    title: "Server | Bartender",
    company: "Goku KBBQ and Hotpot",
    location: "San Jose, CA",
    description:
      "improved the guest experience and the teamwork fluidity.",
    icon: React.createElement(FaReact),
    date: "Aug 2018 - present",
  },

  {
    title: "Automated Floor Manager  | Learning Ambassador | Associate | Driver" ,
    company: "Amazon ",
    location: "Troutdale, OR",
    description:
      "ranked number 2 for highest productivity score accross the country",
    icon: React.createElement(FaReact),
    date: "Apr 2022 - Apr 2023",
    reccomendation: "Tuan worked with me for the greater part of a year during which time he consistently performed at above the productivity required and one week was even the most productive employee in the building! Furthermore, Tuan always volunteered for new opportunities and never complained about difficult or tedious tasks. Tuan was one of a small group of associates trusted to undergo the training to go out on the robotics floor and has experience with onboarding new associates. Although losing him will hurt my team and my boss was a little alarmed to hear he may be moving on, it has been a blessing to watch Tuan develop throughout his time here at Amazon and I am sure he will be a strong addition to your team.",

    
  },
  {
    title: "Server",
    company: "Buca di Beppo",
    location: "Campbell, CA",
    description:
      "returned to a new location to help with with store.",
    icon: React.createElement(CgWorkAlt),
    date: "Apr 2023 -  Dec 2023",

  },
  {
    title: "Server",
    company: "One Pot Shabu Shabu",
    location: "San Jose, CA",
    description:
      "helped a family owned business grow and expand.",
    icon: React.createElement(CgWorkAlt),
    date: "Dec 2023 -  Mar 2024",
  },
  {
    title: "Host | Driver",
    company: "Sifted",
    location: "Sunnyvale, CA",
    description:
      "working to end hunger and giving back to our community.",
    icon: React.createElement(CgWorkAlt),
    date: "Mar 2024 -  Present",
  },

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