import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";

export default function RefundPolicy() {
  const updatedDate = "April 15, 2025";
  const salonName = "Divine Braids";
  const depositAmount = "$20";

  return (
    <>
      <Helmet>
        <title>Refund & Deposit Policy | {salonName}</title>
        <meta name="description" content="Our refund and deposit policy for salon services." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-center mb-8">Refund & Deposit Policy</h1>
          <p className="text-muted-foreground text-center mb-12">Last Updated: {updatedDate}</p>
          
          <Card className="mb-8 shadow-md">
            <CardContent className="pt-6">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="text-lg">
                  We value your business and want to ensure clarity regarding our policies on deposits and refunds.
                </p>
                
                <h2 className="text-2xl font-medium mt-8 mb-4">1. Deposits</h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>A non-refundable deposit (e.g., {depositAmount}) is required to book an appointment.</li>
                  <li>The deposit will go toward your final service balance.</li>
                </ul>
                
                <h2 className="text-2xl font-medium mt-8 mb-4">2. Cancellations</h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>You may cancel up to 24 hours in advance without penalty (deposit will be held but not refunded).</li>
                  <li>Cancellations less than 24 hours before your appointment will result in loss of deposit.</li>
                </ul>
                
                <h2 className="text-2xl font-medium mt-8 mb-4">3. No-Shows</h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>No-shows will lose their deposit and may be restricted from booking future appointments.</li>
                </ul>
                
                <h2 className="text-2xl font-medium mt-8 mb-4">4. Rescheduling</h2>
                <ul className="list-disc pl-6 mb-4">
                  <li>You may reschedule once for free if done at least 24 hours in advance.</li>
                  <li>Rescheduling more than once may require a new deposit.</li>
                </ul>
                
                <h2 className="text-2xl font-medium mt-8 mb-4">5. Refunds for Completed Services</h2>
                <p>
                  We strive to provide the highest quality of service. If you are not satisfied with your service, 
                  please notify us within 48 hours. We may offer to fix the issue or provide a partial refund at 
                  our discretion, depending on the nature of the concern.
                </p>
                
                <h2 className="text-2xl font-medium mt-8 mb-4">6. Payment Methods</h2>
                <p>
                  We accept payment via credit card, debit card, and mobile payment services. All transactions are 
                  processed securely through our payment processor.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}