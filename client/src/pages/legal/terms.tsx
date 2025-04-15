import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsAndConditions() {
  const updatedDate = "April 15, 2025";
  const salonName = "Divine Braids";

  return (
    <>
      <Helmet>
        <title>Terms & Conditions | {salonName}</title>
        <meta name="description" content="Our terms and conditions for using our salon services." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-center mb-8">Terms & Conditions</h1>
          <p className="text-muted-foreground text-center mb-12">Last Updated: {updatedDate}</p>
          
          <Card className="mb-8 shadow-md">
            <CardContent className="pt-6">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-lg">
                  By using our website and booking services, you agree to the following terms:
                </p>
                
                <h2 className="text-2xl font-medium mt-8 mb-4">1. Booking Appointments</h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>Appointments must be booked at least 24 hours in advance.</li>
                  <li>Please arrive on time. If you're 15+ minutes late, we may need to reschedule or shorten your service.</li>
                </ul>
                
                <h2 className="text-2xl font-medium mt-8 mb-4">2. Pricing</h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>All prices listed are base rates and may vary based on hair length, style complexity, or add-ons.</li>
                  <li>A non-refundable deposit may be required to secure your slot.</li>
                </ul>
                
                <h2 className="text-2xl font-medium mt-8 mb-4">3. Client Responsibilities</h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>Please come with clean, detangled hair unless you've booked a wash.</li>
                  <li>Inform us of any allergies or scalp conditions in advance.</li>
                </ul>
                
                <h2 className="text-2xl font-medium mt-8 mb-4">4. Cancellations</h2>
                <p>
                  See our <a href="/legal/refund-policy" className="text-primary hover:underline">Refund & Deposit Policy</a> for full details.
                </p>
                
                <h2 className="text-2xl font-medium mt-8 mb-4">5. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website.
                  Continued use of our services following any changes indicates your acceptance of the new terms.
                </p>
                
                <h2 className="text-2xl font-medium mt-8 mb-4">6. Limitation of Liability</h2>
                <p>
                  {salonName} is not liable for any damages or injuries that may result from following service recommendations
                  or using products suggested by our staff. Clients are responsible for informing us of any known allergies or sensitivities.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}