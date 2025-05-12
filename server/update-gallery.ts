import { db } from "./db";
import { gallery, insertGallerySchema } from "@shared/schema";

// This script will update the gallery with KARI STYLEZ images
async function updateGallery() {
  console.log('Updating gallery with KARI STYLEZ images...');

  // Define new gallery items with KARI STYLEZ images
  const galleryItems = [
    {
      title: "Elegant Box Braids",
      description: "Long box braids with elegant styling",
      imageUrl: "/assets/kari-stylez/braids-model-1.png",
      order: 1
    },
    {
      title: "Golden-Brown Twisted Braids",
      description: "Medium length twisted braids with golden-brown tones",
      imageUrl: "/assets/kari-stylez/braids-model-2.png",
      order: 2
    },
    {
      title: "Detailed Braided Design",
      description: "Intricate braiding pattern with artistic detail",
      imageUrl: "/assets/kari-stylez/braids-model-3.png",
      order: 3
    },
    {
      title: "Cascading Braids",
      description: "Long cascading braids with natural styling",
      imageUrl: "/assets/kari-stylez/braids-model-4.jpg",
      order: 4
    },
    {
      title: "Braided Updo",
      description: "Sophisticated braided updo for formal occasions",
      imageUrl: "/assets/kari-stylez/braids-model-5.jpg",
      order: 5
    },
    {
      title: "Casual Box Braids",
      description: "Everyday style box braids for a casual look",
      imageUrl: "/assets/kari-stylez/braids-model-6.jpg",
      order: 6
    },
    {
      title: "Auburn Accent Braids",
      description: "Classic braids with auburn color accents",
      imageUrl: "/assets/kari-stylez/braids-model-7.jpg",
      order: 7
    },
    {
      title: "Goddess Braids",
      description: "Elegant goddess braids with precise parting",
      imageUrl: "/assets/kari-stylez/braids-model-8.jpg",
      order: 8
    },
    {
      title: "Curly Braids Style",
      description: "Braids with curly ends for a softer look",
      imageUrl: "/assets/kari-stylez/braids-curls.png",
      order: 9
    },
    {
      title: "Side-Swept Braids",
      description: "Braids styled to the side for an elegant profile",
      imageUrl: "/assets/kari-stylez/braids-side.png",
      order: 10
    },
    {
      title: "Braided Bun Style",
      description: "Braids styled into an elegant bun for formal events",
      imageUrl: "/assets/kari-stylez/braids-bun.png",
      order: 11
    },
    {
      title: "Bob Braids",
      description: "Shorter braided bob style for a modern look",
      imageUrl: "/assets/kari-stylez/braids-bob.png",
      order: 12
    },
    {
      title: "Auburn Braids",
      description: "Full auburn colored braids for a distinctive style",
      imageUrl: "/assets/kari-stylez/braids-auburn.png",
      order: 13
    }
  ];

  try {
    // First, delete all existing gallery items
    await db.delete(gallery);
    console.log('Cleared existing gallery items');

    // Insert new gallery items
    for (const item of galleryItems) {
      const validatedItem = insertGallerySchema.parse(item);
      await db.insert(gallery).values(validatedItem);
    }

    console.log(`Successfully added ${galleryItems.length} gallery items`);
  } catch (error) {
    console.error('Error updating gallery:', error);
  }
}

// Execute the function
updateGallery()
  .then(() => {
    console.log('Gallery update complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Gallery update failed:', err);
    process.exit(1);
  });