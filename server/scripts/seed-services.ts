import { db } from "../db";
import { services } from "@shared/schema";

async function seedServices() {
  // Check if we already have services
  const existingServices = await db.select().from(services);
  
  if (existingServices.length > 0) {
    console.log("Services already exist, skipping seed");
    return;
  }
  
  // Create services that match our braid styles
  const serviceData = [
    {
      name: "Classic Box Braids",
      description: "Traditional square-shaped parts with clean lines and uniform size.",
      price: 20000, // $200.00
      duration: 240, // 4 hours
      imageUrl: "",
      category: "box"
    },
    {
      name: "Jumbo Box Braids",
      description: "Larger box braids that take less time to install but are heavier.",
      price: 18000, // $180.00
      duration: 180, // 3 hours
      imageUrl: "",
      category: "box"
    },
    {
      name: "Goddess Braids",
      description: "Raised braids close to the scalp, often in intricate patterns.",
      price: 22000, // $220.00
      duration: 240, // 4 hours
      imageUrl: "",
      category: "goddess"
    },
    {
      name: "Knotless Box Braids",
      description: "Box braids with a more natural look and less tension at the roots.",
      price: 22000, // $220.00
      duration: 300, // 5 hours
      imageUrl: "",
      category: "knotless"
    },
    {
      name: "Knotless Braids with Beads",
      description: "Knotless braids adorned with decorative beads for a distinctive look.",
      price: 25000, // $250.00
      duration: 360, // 6 hours
      imageUrl: "",
      category: "knotless"
    },
    {
      name: "Tribal Braids",
      description: "Bold, thick braids often with decorative elements inspired by African styles.",
      price: 24000, // $240.00
      duration: 360, // 6 hours
      imageUrl: "",
      category: "tribal"
    },
    {
      name: "Fulani Braids",
      description: "Geometric pattern with a center part and braids flowing back.",
      price: 23000, // $230.00
      duration: 300, // 5 hours
      imageUrl: "",
      category: "tribal"
    },
    {
      name: "Feed-in Braids",
      description: "Braids that start small and gradually get thicker by feeding in hair.",
      price: 19000, // $190.00
      duration: 240, // 4 hours
      imageUrl: "",
      category: "other"
    },
    {
      name: "Passion Twists",
      description: "Rope-like twists that have a natural, bohemian appearance.",
      price: 18000, // $180.00
      duration: 240, // 4 hours
      imageUrl: "",
      category: "other"
    }
  ];
  
  // Insert services
  await db.insert(services).values(serviceData);
  
  console.log(`Added ${serviceData.length} services`);
}

export { seedServices };