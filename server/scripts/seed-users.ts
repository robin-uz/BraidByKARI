import { db } from "../db";
import { users } from "../../shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

export async function seedUsers() {
  // Check if users already exist
  const existingUsers = await db.select().from(users);
  
  if (existingUsers.length > 0) {
    console.log("Users already exist, skipping seed");
    return;
  }
  
  // Create default admin user
  await db.insert(users).values({
    username: "admin",
    password: await hashPassword("admin123"),
    email: "admin@divinebraids.com",
    fullName: "Admin User",
    role: "admin"
  });
  
  // Create default customer user
  await db.insert(users).values({
    username: "customer",
    password: await hashPassword("customer123"),
    email: "customer@example.com",
    fullName: "Customer User",
    role: "customer"
  });
  
  console.log("Default users created successfully");
}

// This is an ESM module, so we don't use require.main check
// The function will be called from index.ts