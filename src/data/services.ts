import type { Service } from "../types/clinic";

const defaultServices: Service[] = [
  {
    slug: "rhinoplasty",
    name: "Rhinoplasty",
    shortDescription: "Refine nasal shape and improve facial balance.",
    heroImage:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80",
    details:
      "Rhinoplasty can reshape the nose for cosmetic improvement or breathing support. Consultations typically cover facial harmony, expected results, and post-procedure care.",
    benefits: [
      "Improves profile balance",
      "Can address bumps or asymmetry",
      "May support better nasal airflow"
    ]
  },
  {
    slug: "liposuction",
    name: "Liposuction",
    shortDescription: "Target stubborn fat pockets with contour-focused treatment.",
    heroImage:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
    details:
      "Liposuction is used to remove localized fat deposits from selected body areas. Treatment planning usually includes body assessment, downtime expectations, and realistic contour goals.",
    benefits: [
      "Targets stubborn body areas",
      "Supports body contour refinement",
      "Works well with healthy lifestyle habits"
    ]
  },
  {
    slug: "hair-transplant",
    name: "Hair Transplant",
    shortDescription: "Restore hair density with personalized transplant planning.",
    heroImage:
      "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=1200&q=80",
    details:
      "Hair transplant procedures move healthy follicles into thinning areas to improve coverage. A good plan covers donor availability, graft goals, and recovery milestones.",
    benefits: [
      "Creates natural-looking density",
      "Customized to hairline goals",
      "Long-term improvement in coverage"
    ]
  }
];

export function getServices(): Service[] {
  if (typeof window === "undefined") {
    return defaultServices;
  }

  try {
    const saved = window.localStorage.getItem("truecare-extra-services");

    if (!saved) {
      return defaultServices;
    }

    const extraServices = JSON.parse(saved) as Service[];
    return [...defaultServices, ...extraServices];
  } catch {
    return defaultServices;
  }
}

export function getServiceBySlug(slug?: string): Service | undefined {
  return getServices().find((service) => service.slug === slug);
}
