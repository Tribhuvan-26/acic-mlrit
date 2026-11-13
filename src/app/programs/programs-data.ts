export type VerticalRole = {
  title: string;
  desc: string;
};

export type VerticalProject = {
  name: string;
  desc: string;
  status: "Active" | "Completed" | "Upcoming";
};

export type VerticalEvent = {
  name: string;
  desc: string;
  type: string;
};

export type VerticalMedia = {
  type: "image" | "video";
  src: string;
  caption?: string;
};

export type ProposalBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export type VerticalProposal = {
  title: string;
  subtitle: string[];
  blocks: ProposalBlock[];
};

export type Vertical = {
  id: string;
  abbr: string;
  name: string;
  tagline: string;
  color: string;
  textColor: string;
  gradient: string;
  lightBg: string;
  border: string;
  shortDesc: string;
  overview: string[];
  quote: string;
  stats: { value: string; label: string }[];
  roles: VerticalRole[];
  projects: VerticalProject[];
  events: VerticalEvent[];
  achievements: string[];
  applyInfo?: string;
  timeline?: { step: string; title: string; desc: string }[];
  timelineLabel?: string;
  timelineHeading?: string;
  features?: { title: string; desc: string }[];
  featuresLabel?: string;
  featuresHeading?: string;
  media?: VerticalMedia[];
  proposal?: VerticalProposal;
};

export const VERTICALS: Vertical[] = [
  {
    id: "pre-incubation",
    abbr: "PRE",
    name: "Pre-Incubation",
    tagline: "From Idea to MVP",
    color: "#E8521A",
    textColor: "#7c2d12",
    gradient: "linear-gradient(145deg, #7c2d12 0%, #c2410c 55%, #E8521A 100%)",
    lightBg: "rgba(232,82,26,0.07)",
    border: "rgba(232,82,26,0.22)",
    shortDesc:
      "A three-month program for aspiring entrepreneurs with an innovative idea who want to turn it into a Minimum Viable Product and a startup.",
    overview: [
      "The three-month Pre-Incubation program of ACIC-MLRIT is designed for aspiring entrepreneurs and innovators who have an innovative idea and want to convert it into a viable product and startup.",
      "The program provides a structured course that guides you through customer mapping, idea validation and building a minimum viable product, laying the foundation for your startup journey.",
      "Any individual with an innovative idea or a working prototype can apply. Ideas focusing on SDG 3, SDG 9 and SDG 11 are eligible.",
    ],
    quote: "Every startup begins as an idea worth testing.",
    stats: [
      { value: "3", label: "Months" },
      { value: "4", label: "Modules" },
      { value: "₹3,000", label: "Program Fee" },
    ],
    roles: [],
    projects: [],
    events: [],
    achievements: [
      "Curated workshops from experts, from identifying customers to building an MVP",
      "Idea-building tools: validation, SWOT mind maps, customer and stakeholder mapping",
      "Build an MVP to present to investors and banks for funding",
      "Access to testing equipment, 3D printing, IoT, drone and mechanical labs",
      "Learn alongside a community of like-minded founders",
      "e-Certificate on successful completion",
    ],
    timelineLabel: "Program Structure",
    timelineHeading: "Four Modules",
    timeline: [
      { step: "01", title: "Understand Your Customers", desc: "Identify and map your target customers and stakeholders." },
      { step: "02", title: "Validate the Problem", desc: "Explore and validate the customer problem before you build." },
      { step: "03", title: "Design & Test a Prototype", desc: "Design, build and test your prototype or MVP in our labs." },
      { step: "04", title: "Business Model", desc: "Shape a business model that can sustain and scale your idea." },
    ],
    featuresLabel: "FAQs",
    featuresHeading: "Common Questions",
    features: [
      { title: "I have two ideas. Can I submit both?", desc: "No, one idea at a time." },
      { title: "I have a team. Can we apply?", desc: "Yes, teams are welcome to apply." },
      { title: "Who is considered for this program?", desc: "Students pursuing graduation, anyone who wants to pursue entrepreneurship as a career, and early-stage ideas." },
    ],
    applyInfo:
      "Module-wise assignments are given throughout the program and must be submitted on time. Write to us to know when the next batch starts.",
  },
  {
    id: "incubation",
    abbr: "INC",
    name: "Incubation",
    tagline: "Scale Your Venture",
    color: "#2563EB",
    textColor: "#1e3a8a",
    gradient: "linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 55%, #2563EB 100%)",
    lightBg: "rgba(37,99,235,0.07)",
    border: "rgba(37,99,235,0.22)",
    shortDesc:
      "A six to twelve month program for startups with a prototype or MVP, ready to refine strategy, validate the market and scale.",
    overview: [
      "ACIC-MLRIT's Incubation Program empowers innovators and startups with the tools, guidance and resources needed to accelerate growth and bring their ideas to market.",
      "It is tailored for startups already equipped with a prototype or Minimum Viable Product, aiming to refine their strategy and take their venture to the next level.",
      "The program includes personalised mentorship, workshops, networking opportunities and access to ACIC-MLRIT resources. Virtual incubation and co-working facilities are also available.",
    ],
    quote: "Build traction, prove your market, and grow into an impactful venture.",
    stats: [
      { value: "6-12", label: "Months" },
      { value: "₹6,000", label: "Registration" },
      { value: "₹2,500", label: "Per Month" },
    ],
    roles: [],
    projects: [],
    events: [],
    achievements: [
      "Design your go-to-market strategy with expert guidance",
      "Support in conducting pilots to validate your product or service",
      "Demo Day with investors and stakeholders",
      "Guidance on Intellectual Property Rights and protection",
      "Direct access to technical and business mentors",
    ],
    applyInfo:
      "Entrepreneurs and innovators with a working prototype or MVP who want to scale their venture are welcome to apply.",
  },
  {
    id: "grip",
    abbr: "GRIP",
    name: "Grassroots Innovation Program",
    tagline: "Rural Youth, Real Innovation",
    color: "#16A34A",
    textColor: "#14532d",
    gradient: "linear-gradient(145deg, #14532d 0%, #15803d 55%, #16A34A 100%)",
    lightBg: "rgba(22,163,74,0.07)",
    border: "rgba(22,163,74,0.22)",
    shortDesc:
      "A four-month program nurturing innovation and entrepreneurship among rural youth by building 21st century skills.",
    overview: [
      "GRIP is a focused four-month initiative that nurtures innovation and entrepreneurship among rural youth by honing their 21st century skill set.",
      "Each cohort of 20 youths develops analytical skills, problem-solving abilities and design thinking, with the goal of leading innovative projects and starting ventures in their own communities.",
      "Enthusiastic individuals aged 18 to 22 who want to upgrade their skills and explore entrepreneurship are encouraged to apply.",
    ],
    quote: "Innovation grows best where it is needed most.",
    stats: [
      { value: "4", label: "Months" },
      { value: "20", label: "Per Cohort" },
      { value: "18-22", label: "Age Group" },
    ],
    roles: [],
    projects: [],
    events: [],
    achievements: [
      "Develop 21st century skills",
      "Build a product or business of your own",
      "Course certification from ACIC-MLRIT",
      "Network with like-minded individuals",
      "Access to innovation ecosystem resources",
      "Makerspace access to turn ideas into products",
    ],
  },
  {
    id: "innovation-yatra",
    abbr: "YATRA",
    name: "Innovation Yatra",
    tagline: "Discover the Innovator Within",
    color: "#9333EA",
    textColor: "#581c87",
    gradient: "linear-gradient(145deg, #581c87 0%, #7e22ce 55%, #9333EA 100%)",
    lightBg: "rgba(147,51,234,0.07)",
    border: "rgba(147,51,234,0.22)",
    shortDesc:
      "A five-day bus journey through Telangana's innovation ecosystem, meeting the unsung grassroots innovators of rural Telangana.",
    overview: [
      "Innovation Yatra is a five-day bus journey designed to inspire and empower individuals to become innovators in their own right.",
      "Yatris are introduced to Telangana's innovation ecosystem, with a focus on the unsung grassroots innovators of rural Telangana, and learn the challenges these innovators and their communities face.",
      "Along the way, participants learn design thinking and apply it to real community problems.",
    ],
    quote: "Learn from the communities you want to serve.",
    stats: [
      { value: "5", label: "Days" },
      { value: "18-35", label: "Age Group" },
      { value: "1", label: "Bus Journey" },
    ],
    roles: [],
    projects: [],
    events: [],
    achievements: [
      "Learn design thinking and apply it to real-world community problems",
      "Develop solutions that can improve rural livelihoods",
      "Understand Telangana's innovation ecosystem and the challenges rural innovators face",
      "Leave with an empowered mindset to drive innovation and entrepreneurship",
    ],
    featuresLabel: "FAQs",
    featuresHeading: "Common Questions",
    features: [
      { title: "Who can apply?", desc: "Anyone aged 18 to 35 who wants to explore communities. Educational qualifications are not considered." },
      { title: "Do I need to be an entrepreneur?", desc: "No. The Yatra is often the first step for budding entrepreneurs." },
      { title: "Where will I stay?", desc: "Basic accommodation and food are arranged at each locality, with facilitators on hand." },
      { title: "How safe is it for women?", desc: "Female facilitators are available around the clock and more than half the team are women." },
    ],
  },
  {
    id: "community-innovator-fellowship",
    abbr: "CIF",
    name: "Community Innovator Fellowship",
    tagline: "A Year of Community Innovation",
    color: "#0891B2",
    textColor: "#0c4a6e",
    gradient: "linear-gradient(145deg, #0c4a6e 0%, #0369a1 55%, #0891B2 100%)",
    lightBg: "rgba(8,145,178,0.07)",
    border: "rgba(8,145,178,0.22)",
    shortDesc:
      "A year-long intensive fellowship for aspiring community innovators, in partnership with Atal Innovation Mission and UNDP India.",
    overview: [
      "In partnership with Atal Innovation Mission, NITI Aayog and UNDP India, ACIC-MLRIT hosts a year-long intensive fellowship for aspiring community innovators.",
      "Fellows receive structured support, mentorship and a collaborative community to turn ideas for community change into working solutions.",
    ],
    quote: "Give an idea direction, and it can change a community.",
    stats: [
      { value: "1", label: "Year" },
      { value: "AIM", label: "Supported" },
      { value: "UNDP", label: "Partner" },
    ],
    roles: [],
    projects: [],
    events: [],
    achievements: [
      "Year-long structured fellowship",
      "Mentorship and guidance to give your idea direction",
      "Connections with like-minded, passionate changemakers",
    ],
  },
  {
    id: "liftoff-accelerator",
    abbr: "LIFT",
    name: "Liftoff Accelerator",
    tagline: "Get Investor Ready",
    color: "#CA8A04",
    textColor: "#713f12",
    gradient: "linear-gradient(145deg, #713f12 0%, #a16207 55%, #CA8A04 100%)",
    lightBg: "rgba(202,138,4,0.07)",
    border: "rgba(202,138,4,0.22)",
    shortDesc:
      "A milestone-driven program, with the Wadhwani Foundation, that helps early-stage startups become investor ready at no cost.",
    overview: [
      "In collaboration with the Wadhwani Foundation, ACIC-MLRIT offers the Liftoff Accelerator, a milestone-driven program that helps early-stage startups achieve investor readiness.",
      "The program is offered at absolutely no cost to selected startups.",
    ],
    quote: "Milestones first. Funding follows.",
    stats: [
      { value: "Free", label: "Program" },
      { value: "Early", label: "Stage" },
      { value: "Wadhwani", label: "Partner" },
    ],
    roles: [],
    projects: [],
    events: [],
    achievements: [
      "Milestone-driven path to investor readiness",
      "Delivered with the Wadhwani Foundation",
      "No cost to participating startups",
    ],
  },
];

export function getVertical(id: string): Vertical | undefined {
  return VERTICALS.find((v) => v.id === id);
}

export function getAllVerticalIds(): string[] {
  return VERTICALS.map((v) => v.id);
}
