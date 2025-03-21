import { getLocalization } from "../../utils/getLocalization";
import Image from "next/image";

// Server-side function to fetch testimonials
export default function Testimonials() {
  const { homepage } = getLocalization();

  if (!homepage?.testimonials || homepage.testimonials.length === 0) {
    return null; // Prevent rendering if no testimonials
  }

  const getStarElements = (rating: number) => {
    const stars = [];
    const maxStars = 5;
    
    for (let i = 0; i < maxStars; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<span key={i} className="text-yellow-500 text-lg">★</span>); // Full star
      } else if (i < Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(<span key={i} className="text-yellow-500 text-lg">⯪</span>); // Half star symbol
      } else {
        stars.push(<span key={i} className="text-gray-400 text-lg">☆</span>); // Empty star
      }
    }
  
    return stars;
  };  

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        {/* Section Title */}
        <h2 className="text-4xl font-extrabold text-gray-800 mb-12">
          {homepage.testimonialsTitle || "What Our Customers Say"}
        </h2>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 mt-4 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {homepage.testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-100 p-8 rounded-lg shadow-md flex flex-col items-center text-center transition-transform transform hover:scale-105"
            >
              {/* User Avatar */}
              <Image
                src={testimonial.avatar}
                alt={testimonial.name}
                width={80}
                height={80}
                className="rounded-full mb-4 border-4 border-gray-300"
                priority={false}
              />

              {/* Name */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{testimonial.name}</h3>

              {/* Star Rating (Improved with Full, Half, & Empty Stars) */}
              <div className="flex mb-3">{getStarElements(Number(testimonial.rating) || 0)}</div>

              {/* Review Text */}
              <p className="text-gray-700 text-base italic">{testimonial.review}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
