import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  const updatedDate = "April 15, 2025";
  const salonName = "Divine Braids";
  const contactEmail = "contact@divinebraids.com";

  return (
    <>
      <Helmet>
        <title>Privacy Policy | {salonName}</title>
        <meta name="description" content="Our privacy policy explains how we collect, use, and protect your information." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-center mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground text-center mb-12">Last Updated: {updatedDate}</p>
          
          <Card className="mb-8 shadow-md">
            <CardContent className="pt-6">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-lg">
                  At {salonName}, your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when you visit our website or book an appointment.
                </p>
                
                <h2 className="text-2xl font-medium mt-8 mb-4">1. Information We Collect</h2>
                <p>We may collect:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Full Name</li>
                  <li>Phone Number</li>
                  <li>Email Address</li>
                  <li>Appointment Date & Time</li>
                  <li>Style/Service Selected</li>
                </ul>
                <p>We also collect basic browsing data through cookies.</p>
                
                <h2 className="text-2xl font-medium mt-8 mb-4">2. How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Schedule & confirm appointments</li>
                  <li>Send you booking reminders</li>
                  <li>Improve your experience with our service</li>
                </ul>
                <p>We never sell or share your information with third parties.</p>
                
                <h2 className="text-2xl font-medium mt-8 mb-4">3. Booking & Payment</h2>
                <p>
                  We use secure third-party services (Stripe, PayPal, etc.) to process payments. 
                  We do not store credit/debit card information.
                </p>
                
                <h2 className="text-2xl font-medium mt-8 mb-4">4. Cookies</h2>
                <p>
                  Our website may use cookies to personalize your visit. You can disable them in your browser if preferred.
                </p>
                
                <h2 className="text-2xl font-medium mt-8 mb-4">5. Your Rights</h2>
                <p>You may request to:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>View the data we have on you</li>
                  <li>Update or delete your information</li>
                </ul>
                <p>
                  Contact us at <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a> for data requests.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}