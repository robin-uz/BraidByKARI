import { Helmet } from "react-helmet";
import ContactInfo from "@/components/contact/contact-info";
import GoogleMap from "@/components/ui/google-map";

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact Us | Divine Braids</title>
        <meta name="description" content="Get in touch with Divine Braids. Find our location, contact information, and business hours." />
      </Helmet>
      
      <section className="py-20 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">Get In Touch</h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Have questions? We're here to help. Contact us through any of the methods below.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <ContactInfo />
            
            {/* Google Map */}
            <GoogleMap 
              address="123 Braiding Avenue, Los Angeles, CA 90001" 
            />
          </div>
          
          <div className="mt-16">
            <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg shadow-lg p-6 md:p-8 max-w-3xl mx-auto">
              <h2 className="font-heading text-2xl font-semibold mb-6 text-center text-purple-700 dark:text-purple-300">Send Us a Message</h2>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium">Your Name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-2 border border-purple-200 dark:border-purple-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-neutral-900"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium">Your Email <span className="text-red-500">*</span></label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-2 border border-purple-200 dark:border-purple-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-neutral-900"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block mb-2 font-medium">Subject <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full px-4 py-2 border border-purple-200 dark:border-purple-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-neutral-900"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block mb-2 font-medium">Your Message <span className="text-red-500">*</span></label>
                  <textarea 
                    id="message" 
                    rows={5}
                    className="w-full px-4 py-2 border border-purple-200 dark:border-purple-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-neutral-900 resize-none"
                    required
                  ></textarea>
                </div>
                
                <div className="flex justify-center">
                  <button 
                    type="submit" 
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
