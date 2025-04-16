// Test authentication functions
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

async function testPasswordHash() {
  // Test with a known password
  const password = "customer123";
  const hashedPassword = await hashPassword(password);
  console.log("Hashed password:", hashedPassword);
  
  // Test comparison with correct password
  const correctComparison = await comparePasswords(password, hashedPassword);
  console.log("Correct password comparison result:", correctComparison);
  
  // Test comparison with incorrect password
  const incorrectComparison = await comparePasswords("wrong-password", hashedPassword);
  console.log("Incorrect password comparison result:", incorrectComparison);
  
  // Test with the stored hash from the customer user
  // This is the hash we saw in the database query
  const storedHash = "f0413bfb5ef2d34ac9dc9c28f760e56a06e494daa88c42611343aa63cbfc92c14fb37937fe8f5d427fcd805f49eebc02aab57701858f4c3dab45b66fc84c66b7.3efb1691c92214996d1ed90251a91660";
  
  // Test if "customer123" works with the stored hash
  const customerCorrect = await comparePasswords("customer123", storedHash);
  console.log("customer123 comparison with stored hash:", customerCorrect);
  
  // Test if "password123" works with the stored hash
  const passwordAttempt = await comparePasswords("password123", storedHash);
  console.log("password123 comparison with stored hash:", passwordAttempt);
}

// Run the test
testPasswordHash().catch(console.error);