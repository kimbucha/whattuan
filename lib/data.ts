import spongebob from "@/public/spongebob.webp";
import doge from "@/public/doge.jpeg";
import harambe from "@/public/harambe.jpeg";
import tjmaxx from "@/public/tjmaxx.svg";
import goku from "@/public/goku.webp";
import buca from "@/public/buca.png";
import amazon from "@/public/amazon.png";
import onepot from "@/public/onepot.png";
import sifted from "@/public/sifted.png";
import tablepot from "@/public/tablepot.webp";

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "Stuff",
    hash: "#projects",
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
    description: "Gave customers a great experience when they visited.",
    duities: [
      "Make customers happy",
      "Talk to and help all customers",
      "Follow good customer service rules",
      "Keep the store clean and tidy",
    ],
    icon: tjmaxx,
    date: "Aug 2015 -  Dec 2015",
  },
  {
    title: "Server | Host | Takeout Lead",
    company: "Buca di Beppo",
    location: "San Jose, CA",
    description:
      "helped people enjoy their meal. supported team growth and development.",
    icon: buca,
    date: "Jan 2016 -  Aug 2016",
  },
  {
    title: "Server | Bartender",
    company: "Goku KBBQ and Hotpot",
    location: "San Jose, CA",
    description: "improved the guest experience and the teamwork fluidity.",
    icon: goku,
    date: "Aug 2018 - Apr 2022",
  },

  {
    title: "Automated Floor Manager | Learning Ambassador | Driver",
    company: "Amazon ",
    location: "Troutdale, OR",
    description:
      "ranked number 2 for highest productivity score accross the country",
    icon: amazon,
    date: "Apr 2022 - Apr 2023",
    reccomendation:
      "Tuan worked with me for the greater part of a year during which time he consistently performed at above the productivity required and one week was even the most productive employee in the building! Furthermore, Tuan always volunteered for new opportunities and never complained about difficult or tedious tasks. Tuan was one of a small group of associates trusted to undergo the training to go out on the robotics floor and has experience with onboarding new associates. Although losing him will hurt my team and my boss was a little alarmed to hear he may be moving on, it has been a blessing to watch Tuan develop throughout his time here at Amazon and I am sure he will be a strong addition to your team.",
  },
  {
    title: "Server",
    company: "Buca di Beppo",
    location: "Campbell, CA",
    description: "returned to a new location to help with with store.",
    icon: buca,
    date: "Apr 2023 -  Dec 2023",
  },
  {
    title: "Server",
    company: "One Pot Shabu Shabu",
    location: "San Jose, CA",
    description: "helped a family owned business grow and expand.",
    icon: onepot,
    date: "Dec 2023 -  Mar 2024",
  },
  {
    title: "Host | Driver",
    company: "Sifted",
    location: "Sunnyvale, CA",
    description: "working to end hunger and giving back to our community.",
    icon: sifted,
    date: "Mar 2024 -  Present",
  },
] as const;

export const projectsData = [
  {
    title: "Table Pots: 70x",
    description: "Developed an interactive web application designed to celebrate a 7-month anniversary with 70 meaningful questions.",
    tags: ["Next.js", "React", "Typescript", "Tailwind CSS", "Git", "Vercel"],
    imageUrl: "/tablepot.webp",
    imageWidth: 900, // Adjusted width
    imageHeight: 700, // Adjusted height
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
  "Python",
  "Framer Motion",
] as const;
