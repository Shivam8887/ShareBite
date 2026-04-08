import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { Link } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070&auto=format&fit=crop', // Hunger problem
    text: 'Millions Sleep Hungry Every Night',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop', // Platform solution
    text: 'ShareBite Connects Donors with the Needy',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?q=80&w=2070&auto=format&fit=crop', // Process
    text: 'Food is Collected, Verified & Packed Safely',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1617469165786-8007eda3caa7?q=80&w=2070&auto=format&fit=crop', // Delivery
    text: 'Delivered to the Right People, On Time',
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop', // Impact
    text: 'Turning Hunger into Happiness',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop', // Transparency
    text: 'Track Your Donation in Real-Time',
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop', // Call to action
    text: 'Be the Reason Someone Eats Today',
  },
];

const HeroCarousel = () => {
  return (
    <div className="relative w-full h-[60vh] md:h-[80vh] lg:h-screen">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={true}
        className="w-full h-full hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full overflow-hidden">
              {/* Background Image with optional subtle zoom effect */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105"
                style={{ backgroundImage: `url('${slide.image}')` }}
                loading="lazy"
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/60" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10">
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold text-white mb-8 max-w-5xl leading-tight animate-fade-in-up drop-shadow-lg">
                  {slide.text}
                </h1>
                
                <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up animation-delay-300">
                  <Link 
                    to="/donate" 
                    className="px-8 py-3.5 bg-orange-500 text-white font-bold rounded-full hover:bg-orange-600 transition-colors duration-300 transform hover:scale-105 shadow-[0_0_15px_rgba(249,115,22,0.5)] text-lg"
                  >
                    Donate Now
                  </Link>
                  <Link 
                    to="/volunteer" 
                    className="px-8 py-3.5 bg-black/30 backdrop-blur-sm border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 shadow-lg text-lg"
                  >
                    Join as Volunteer
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Global styles for swiper to ensure proper styling of navigation and pagination */}
      <style dangerouslySetInnerHTML={{__html: `
        .hero-swiper .swiper-button-next,
        .hero-swiper .swiper-button-prev {
          color: white;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(4px);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }
        .hero-swiper .swiper-button-next:after,
        .hero-swiper .swiper-button-prev:after {
          font-size: 20px;
          font-weight: 900;
        }
        .hero-swiper .swiper-button-next:hover,
        .hero-swiper .swiper-button-prev:hover {
          background: rgba(249,115,22,0.8);
          transform: scale(1.1);
        }
        .hero-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: white;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        .hero-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #f97316; /* orange-500 */
          width: 30px;
          border-radius: 8px;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
      `}} />
    </div>
  );
};

export default HeroCarousel;
