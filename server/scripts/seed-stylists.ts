import { storage } from "../storage";

/**
 * Seeds stylists for the salon
 */
export async function seedStylists() {
  console.log("Checking if stylists exist...");
  
  const existingStylists = await storage.getStylists();
  
  if (existingStylists.length > 0) {
    console.log("Stylists already exist, skipping seed");
    return;
  }
  
  console.log("Seeding stylists...");
  
  // Add some sample stylists
  const stylists = [
    {
      name: "Jasmine Carter",
      bio: "Specializes in box braids and twists with over 10 years of experience.",
      specialties: ["Box Braids", "Twists", "Locs"],
      imageUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3",
      isActive: true,
      availability: JSON.stringify({
        days: [1, 2, 3, 4, 5],
        times: ["09:00-18:00"]
      })
    },
    {
      name: "Maya Johnson",
      bio: "Known for creative protective styles and hair color treatments.",
      specialties: ["Protective Styles", "Hair Color", "Cornrows"],
      imageUrl: "https://images.unsplash.com/photo-1508184964240-ee96bb9677a7?ixlib=rb-4.0.3",
      isActive: true,
      availability: JSON.stringify({
        days: [1, 3, 5, 6],
        times: ["10:00-18:00"]
      })
    },
    {
      name: "Zoe Williams",
      bio: "Specializes in intricate braiding patterns and custom hair designs.",
      specialties: ["Ghana Braids", "Knotless Braids", "Feed-in Braids"],
      imageUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?ixlib=rb-4.0.3",
      isActive: true,
      availability: JSON.stringify({
        days: [2, 4, 6],
        times: ["09:00-17:00"]
      })
    },
    {
      name: "Aisha Thomas",
      bio: "Expert in natural hair care and styling for all hair types.",
      specialties: ["Natural Hair", "Wash and Style", "Hair Health"],
      imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3",
      isActive: true,
      availability: JSON.stringify({
        days: [1, 2, 5, 6],
        times: ["09:00-16:00"]
      })
    }
  ];
  
  for (const stylist of stylists) {
    await storage.createStylist(stylist);
  }
  
  console.log("Stylists seeded successfully");
}