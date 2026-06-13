import type { IconType } from "react-icons";
import {
  TfiEye,
  TfiLayers,
  TfiLightBulb,
  TfiDesktop,
  TfiSettings,
  TfiUser,
} from "react-icons/tfi";

export type LabCapability = {
  id: string;
  title: string;
  description: string;
  icon: IconType;
};

export const labCapabilitiesSection = {
  title: "Our Lab capabilities",
  subtitle: "Research-driven vision intelligence at NIT Jamshedpur",
} as const;

export const labCapabilities: LabCapability[] = [
  {
    id: "machine-vision",
    title: "Machine Vision",
    description:
      "Image acquisition, preprocessing, and vision pipelines for inspection, measurement, and scene understanding in real environments.",
    icon: TfiEye,
  },
  {
    id: "deep-learning",
    title: "Deep Learning",
    description:
      "Convolutional and modern neural architectures for detection, classification, segmentation, and vision-language applications.",
    icon: TfiLayers,
  },
  {
    id: "intelligent-systems",
    title: "Intelligent Systems",
    description:
      "End-to-end intelligent systems that combine sensing, inference, and control for automation and decision support.",
    icon: TfiDesktop,
  },
  {
    id: "research-innovation",
    title: "Research & Innovation",
    description:
      "Applied research in computer vision and AI with publications, prototypes, and interdisciplinary collaboration across departments.",
    icon: TfiLightBulb,
  },
  {
    id: "industrial-applications",
    title: "Industrial Applications",
    description:
      "Quality inspection, defect detection, and process monitoring solutions tailored for manufacturing and industrial workflows.",
    icon: TfiSettings,
  },
  {
    id: "student-training",
    title: "Student Training",
    description:
      "Hands-on projects, internships, and mentorship for students exploring machine vision, AI, and intelligent system design.",
    icon: TfiUser,
  },
];
