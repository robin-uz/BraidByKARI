import { db } from "./db";
import { services } from "@shared/schema";
import { eq } from "drizzle-orm";

// This script will update the services with non-repetitive images from KARI STYLEZ folder
async function updateServices() {
  console.log('Updating services with diverse KARI STYLEZ images...');

  // Define image associations for different service types
  const serviceImages = {
    "Knotless Braids": "/assets/kari-stylez/braids-model-1.png",
    "Box Braids": "/assets/kari-stylez/braids-model-4.jpg",
    "Goddess Braids": "/assets/kari-stylez/braids-model-8.jpg",
    "Lemonade Braids": "/assets/kari-stylez/braids-side.png",
    "Passion Twists": "/assets/kari-stylez/braids-model-2.png",
    "Faux Locs": "/assets/kari-stylez/braids-model-3.png",
    "Kids Braids": "/assets/kari-stylez/braids-bob.png",
    "Braided Updo": "/assets/kari-stylez/braids-bun.png",
    "Cornrows": "/assets/kari-stylez/braids-model-5.jpg",
    "Micro Braids": "/assets/kari-stylez/braids-model-6.jpg",
    "Feed-in Braids": "/assets/kari-stylez/braids-model-7.jpg",
    "Fulani Braids": "/assets/kari-stylez/braids-curls.png",
    "Bohemian Braids": "/assets/kari-stylez/braids-auburn.png"
  };

  try {
    // Get all existing services
    const existingServices = await db.select().from(services);

    // Update each service with a unique image if available in our mapping
    for (const service of existingServices) {
      // If we have a specific image for this service name
      if (serviceImages[service.name]) {
        await db.update(services)
          .set({ icon: serviceImages[service.name] })
          .where(eq(services.id, service.id));
        
        console.log(`Updated service "${service.name}" with image: ${serviceImages[service.name]}`);
      }
    }

    console.log('Service images updated successfully');
  } catch (error) {
    console.error('Error updating services:', error);
  }
}

// Execute the function
updateServices()
  .then(() => {
    console.log('Services update complete!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Services update failed:', err);
    process.exit(1);
  });