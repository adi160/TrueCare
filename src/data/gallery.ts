export interface GalleryItem {
  title: string;
  treatment: string;
  description: string;
  beforeImage: string;
  afterImage: string;
}

const defaultGalleryItems: GalleryItem[] = [
  {
    title: "Nasal Refinement",
    treatment: "Rhinoplasty",
    description:
      "Before and after treatment images can be placed here to show improved balance and profile harmony.",
    beforeImage:
      "https://www.cadoganclinic.com/assets/image-cache/images/Before-and-After/crops/desktop.6eb796f2.septorhino_sp_before_pt.2_front.43ad610a.png",
    afterImage:
      "https://www.cadoganclinic.com/assets/image-cache/images/Before-and-After/crops/desktop.d5a22607.septorhino_sp_after_pt.2_front.43ad610a.png"
  },
  {
    title: "Face Lift",
    treatment: "Mini Facelift",
    description:
      "Use this space to display facial lifting results and visible contour improvement after treatment.",
    beforeImage:
      "https://www.cadoganclinic.com/assets/image-cache/images/Before-and-After/crops/desktop.9a12db8a.5_4.43ad610a.png",
    afterImage:
      "https://www.cadoganclinic.com/assets/image-cache/images/Before-and-After/crops/desktop.4b0d7640.6_8.43ad610a.png"
  },
  {
    title: "Hairline Restoration",
    treatment: "Hair Transplant",
    description:
      "Add before and after visuals here to highlight density, hairline design, and natural-looking growth.",
    beforeImage:
      "https://wimpoleclinic.com/wp-content/uploads/Before-5000-graft-FUT.jpg",
    afterImage:
      "https://wimpoleclinic.com/wp-content/uploads/FUT-5000-grafts-27-months-1.jpg"
  }
];

export function getGalleryItems(): GalleryItem[] {
  if (typeof window === "undefined") {
    return defaultGalleryItems;
  }

  try {
    const saved = window.localStorage.getItem("truecare-extra-gallery-items");

    if (!saved) {
      return defaultGalleryItems;
    }

    const extraItems = JSON.parse(saved) as GalleryItem[];
    return [...defaultGalleryItems, ...extraItems];
  } catch {
    return defaultGalleryItems;
  }
}
