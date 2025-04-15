import { db } from "../db";
import { gallery } from "@shared/schema";

async function seedGallery() {
  // Check if gallery already has items
  const existingItems = await db.select().from(gallery);
  
  if (existingItems.length > 0) {
    console.log("Gallery already has items, skipping seed");
    return;
  }
  
  // Default gallery images to seed
  const galleryItems = [
    {
      title: "Elegant Box Braids",
      description: "Medium size box braids with perfect symmetry",
      imageUrl: "/images/box-braids.jpg",
      order: 0
    },
    {
      title: "Knotless Braids",
      description: "Beautiful knotless braids with elegant styling",
      imageUrl: "/images/braids-style2.jpg",
      order: 1
    },
    {
      title: "Natural Afro Style",
      description: "Gorgeous natural hair with defined curls",
      imageUrl: "/images/afro-style.jpg",
      order: 2
    },
    {
      title: "Natural Textured Look",
      description: "Embracing natural texture with minimal styling",
      imageUrl: "/images/natural-hair1.jpg",
      order: 3
    }
  ];
  
  // Insert gallery items
  for (const item of galleryItems) {
    await db.insert(gallery).values(item);
  }
  
  console.log("Gallery seeded successfully");
}

// Export the function to be called from the main server
export { seedGallery };