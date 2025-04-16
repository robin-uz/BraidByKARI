import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Volumizing Spray",
    price: 24.99,
    image: "/images/product-volumizing.png",
    isNew: true
  },
  {
    id: 2,
    name: "Hair Comb",
    price: 12.99,
    image: "/images/product-comb.png",
    isNew: false
  },
  {
    id: 3,
    name: "Natural Hair Serum",
    price: 29.99,
    image: "/images/product-serum.png",
    isNew: false
  },
  {
    id: 4,
    name: "Styling Wax",
    price: 18.99,
    image: "/images/product-wax.png", 
    isNew: true
  }
];

export default function ProductsSection() {
  return (
    <section className="py-16 bg-minerva-beige">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-minerva-brown">Our products</h2>
            <p className="mt-2 text-minerva-brown/80 max-w-lg">
              Discover our range of premium hair care products specifically designed for all hair types and textures.
            </p>
          </div>
          <Button className="mt-4 md:mt-0 bg-minerva-red hover:bg-minerva-red/90 text-white rounded-none">
            VIEW ALL
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-minerva-cream rounded-lg p-4 relative group">
              {product.isNew && (
                <span className="absolute top-2 left-2 bg-minerva-red text-white text-xs font-medium px-2 py-1 rounded">
                  NEW
                </span>
              )}
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="bg-white/80 text-minerva-red hover:bg-white rounded-full">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="h-48 flex items-center justify-center mb-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="h-full object-contain" 
                />
              </div>
              
              <div className="text-center">
                <h3 className="font-medium text-minerva-brown">{product.name}</h3>
                <p className="text-minerva-red font-semibold mt-1">${product.price}</p>
                
                <Button variant="outline" size="sm" className="mt-3 w-full border-minerva-brown/20 hover:bg-minerva-red hover:text-white hover:border-minerva-red">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  ADD TO CART
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}