import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

// Sample pricing data exactly like in the screenshot
const pricingData = [
  {
    id: 1,
    style: "Box Braids (Small)",
    description: "Thin box braids with detailed parting",
    duration: "5-7 hours",
    price: 200
  },
  {
    id: 2,
    style: "Box Braids (Medium)",
    description: "Standard size box braids",
    duration: "4-6 hours",
    price: 180
  },
  {
    id: 3,
    style: "Box Braids (Large)",
    description: "Chunky box braids with less installation time",
    duration: "3-5 hours",
    price: 150
  },
  {
    id: 4,
    style: "Knotless Braids",
    description: "Tension-free braids with a natural look",
    duration: "5-8 hours",
    price: 220
  },
  {
    id: 5,
    style: "Feed-in Braids",
    description: "Sleek braids with a natural transition",
    duration: "4-6 hours",
    price: 180
  },
  {
    id: 6,
    style: "Bob Boho Braids",
    description: "Stylish bob-length braids with elegant curls",
    duration: "4-6 hours",
    price: 250
  },
  {
    id: 7,
    style: "Curly Top Braids",
    description: "Natural curly top with beautifully styled braids",
    duration: "3-5 hours",
    price: 200
  }
];

export default function PricingPage() {
  return (
    <>
      <Helmet>
        <title>Complete Pricing | Divine Braids</title>
        <meta name="description" content="See our complete pricing list for all braiding services at Divine Braids salon." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-center text-3xl font-bold mb-10">Complete Pricing</h1>
        
        {/* Simple pricing table matching the screenshot */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-full border-collapse">
            <thead>
              <tr className="border-b-2 dark:border-neutral-700">
                <th className="text-left py-4 px-4 font-semibold">Style</th>
                <th className="text-left py-4 px-4 font-semibold">Description</th>
                <th className="text-left py-4 px-4 font-semibold">Duration</th>
                <th className="text-left py-4 px-4 font-semibold">Price</th>
              </tr>
            </thead>
            <tbody>
              {pricingData.map((item) => (
                <tr key={item.id} className="border-b dark:border-neutral-700">
                  <td className="py-4 px-4 font-medium">{item.style}</td>
                  <td className="py-4 px-4 text-neutral-600 dark:text-neutral-300">{item.description}</td>
                  <td className="py-4 px-4 text-neutral-600 dark:text-neutral-300">{item.duration}</td>
                  <td className="py-4 px-4 font-semibold text-amber-600 dark:text-amber-400">${item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-neutral-600 dark:text-neutral-300 mb-6">
            Ready to transform your look with our expert braiding services?
          </p>
          <Link href="/booking">
            <Button size="lg" className="rounded-full px-8">
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}