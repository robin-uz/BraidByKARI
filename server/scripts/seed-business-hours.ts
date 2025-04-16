import { storage } from "../storage";

/**
 * Seeds business hours for a salon
 */
export async function seedBusinessHours() {
  console.log("Checking if business hours exist...");
  
  const existingHours = await storage.getBusinessHours();
  
  if (existingHours.length > 0) {
    console.log("Business hours already exist, skipping seed");
    return;
  }
  
  console.log("Seeding business hours...");
  
  // Monday to Friday: 9 AM - 6 PM with lunch break from 1 PM - 2 PM
  for (let day = 1; day <= 5; day++) {
    await storage.createBusinessHours({
      dayOfWeek: day,
      isOpen: true,
      openTime: "09:00",
      closeTime: "18:00",
      breakStart: "13:00",
      breakEnd: "14:00"
    });
  }
  
  // Saturday: 10 AM - 4 PM, no break
  await storage.createBusinessHours({
    dayOfWeek: 6,
    isOpen: true,
    openTime: "10:00",
    closeTime: "16:00",
    breakStart: null,
    breakEnd: null
  });
  
  // Sunday: Closed
  await storage.createBusinessHours({
    dayOfWeek: 0,
    isOpen: false,
    openTime: "00:00",
    closeTime: "00:00",
    breakStart: null,
    breakEnd: null
  });
  
  console.log("Business hours seeded successfully");
}