import { Award, Users, Clock, Scissors } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-minerva-red text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Professional services</h3>
            <p className="text-white/80 text-sm">
              Our highly trained stylists provide exceptional service tailored to your unique needs.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Dedicated stylists</h3>
            <p className="text-white/80 text-sm">
              Our team is passionate about creating beautiful styles that enhance your natural beauty.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <Clock className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Flexible scheduling</h3>
            <p className="text-white/80 text-sm">
              We offer convenient scheduling options to accommodate your busy lifestyle.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
              <Scissors className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Latest techniques</h3>
            <p className="text-white/80 text-sm">
              We stay updated with the latest trends and techniques to give you the perfect look.
            </p>
          </div>
        </div>
        
        <div className="mt-16 flex justify-center flex-wrap gap-12 text-center">
          <div>
            <p className="text-4xl font-bold">30k+</p>
            <p className="text-white/80 text-sm mt-1">Happy customers</p>
          </div>
          <div>
            <p className="text-4xl font-bold">15</p>
            <p className="text-white/80 text-sm mt-1">Years of experience</p>
          </div>
        </div>
      </div>
    </section>
  );
}