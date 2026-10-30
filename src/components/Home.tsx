import React from "react";
import { 
  ArrowRight, Award, ChevronRight, Landmark, Users, 
  MapPin, CheckCircle, ExternalLink, CalendarCheck, ShieldCheck 
} from "lucide-react";
import { Product, Project } from "../types";

interface HomeProps {
  products: Product[];
  projects: Project[];
  onNavigate: (tab: "home" | "products" | "projects" | "about" | "contact" | "admin") => void;
  onSelectProduct: (p: Product) => void;
  onSelectProject: (p: Project) => void;
}

export default function Home({ 
  products, 
  projects, 
  onNavigate, 
  onSelectProduct, 
  onSelectProject 
}: HomeProps) {
  
  // Premium raw woods selection for interactive highlight
  const premiumWoods = [
    {
      name: "Premium Indian Teak",
      origin: "Gir Forest Region, Gujarat",
      features: "High natural oil content, exceptional weather resistance, golden-brown grain.",
      strength: "9.8 / 10 Structural Index",
      color: "border-[#A67C52] bg-[#FAF8F5]",
      desc: "Seasoned over 12 months to prevent contraction against hot and arid climates."
    },
    {
      name: "Majestic Mahogany",
      origin: "Southern Imports",
      features: "Stunning deep-red hues, high density, optimal for state assemblies and courts.",
      strength: "9.5 / 10 Structural Index",
      color: "border-stone-300 bg-white",
      desc: "Selected from certified plantations ensuring tight wood fibers for pristine carving."
    },
    {
      name: "Golden Rosewood",
      origin: "Western Ghats Certified",
      features: "Distinct dark streaks, luxury heavy finish, ideal for executive tabletops.",
      strength: "9.9 / 10 Structural Index",
      color: "border-stone-300 bg-white",
      desc: "Exhibits rich natural fragrance and supreme split-resistant structural qualities."
    }
  ];

  // High quality client endorsements representing regional trust
  const endorsements = [
    {
      quote: "Rasik D Chitroda delivered 3,500 double benches for our regional upgrades on a strict government schedule. Dimensions were flawlessly compliant and finish exceeds tender criteria.",
      author: "Superintending Engineer",
      entity: "Gujarat Education & Roads Board (State Tender)",
      location: "Gandhinagar Office"
    },
    {
      quote: "The Rosewood and Teak conference installations they executed for our luxury suites have become a centerpiece. Standard of joint cohesion is remarkable.",
      author: "Executive Director",
      entity: "Emerald Hospitality Shore Resorts",
      location: "Vadodara Property"
    },
    {
      quote: "For our public administration halls, we required heavy-duty security cabinets and ergonomic office seating. Every piece is incredibly robust and beautifully finished in custom dark lacquer.",
      author: "Joint Municipal Commissioner",
      entity: "Ahmedabad Municipal Administrative HQ",
      location: "Ahmedabad Trade District"
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <div className="relative h-[640px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1800"
            alt="High End Luxury Office Interior Backdrop"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover grayscale-[15%] brightness-[85%]"
          />
          <div className="absolute inset-0 bg-[#1A1A1A]/85 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/55 to-transparent"></div>
        </div>

        {/* Hero Content Body */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-white text-[10px] uppercase tracking-widest font-bold">
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span>No 1 Furniture Manufacturer & State Procurement Contractor</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-serif font-black text-white tracking-tight leading-none uppercase">
            Best Furniture & <br />
            <span className="text-[#A67C52] italic font-serif font-light normal-case">Interior Design</span>
          </h1>
          
          <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto font-sans font-light leading-relaxed">
            Gujarat's premier manufacturer and government tender specialist of robust <strong>School Benches</strong>, premium <strong>Office Furniture</strong>, modern <strong>Hospital Furniture</strong>, and precision-engineered <strong>School Furniture</strong> since 2016.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate("projects")}
              className="w-full sm:w-auto bg-[#A67C52] hover:bg-[#A67C52]/90 text-white text-xs font-bold uppercase tracking-widest py-4 px-8 rounded-sm shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            >
              Explore Our Portfolio
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="w-full sm:w-auto border border-white/40 hover:border-white text-white hover:bg-white/5 text-xs font-bold uppercase tracking-widest py-4 px-8 rounded-sm transition-all duration-200 cursor-pointer"
            >
              Request Custom Quote
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS BREADCRUMB / PERFORMANCE MATRIX */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E5E1D9] rounded p-8 sm:p-14 text-center space-y-6 max-w-3xl mx-auto shadow-sm">
          <span className="text-[#A67C52] text-xs font-extrabold tracking-widest uppercase block">No 1 Furniture in Gujarat since 2016</span>
          <h2 className="text-3.5xl sm:text-4xl font-serif text-[#1A1A1A] tracking-tight font-bold">
            10 Years of Excellence & Best Furniture Solutions
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed max-w-2.5xl mx-auto font-sans font-light">
            Rasik D Chitroda stands as a beacon of premium architectural reliability in Gujarat's state manufacturing grid. We specialize in robust, double-capacity <strong>School Benches</strong>, ergonomic <strong>Office Furniture</strong>, modern healthcare-grade <strong>Hospital Furniture</strong>, and state-of-the-art academic <strong>School Furniture</strong>. Our certified factory guarantees compliant layouts and luxury woodwork for spaces across Ahmedabad, Gandhinagar, and active state sectors.
          </p>
          
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-[#E5E1D9]/70 max-w-lg mx-auto font-serif">
            <div className="border-r border-[#E5E1D9]/70 last:border-0 pr-2">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#A67C52]">10+</span>
              <span className="text-[9px] uppercase font-bold text-stone-500 tracking-wider block mt-1 font-sans">Years Experience</span>
            </div>
            <div className="border-r border-[#E5E1D9]/70 last:border-0 px-2">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#A67C52]">50+</span>
              <span className="text-[9px] uppercase font-bold text-stone-500 tracking-wider block mt-1 font-sans">Skilled Artisans</span>
            </div>
            <div className="last:border-0 pl-2">
              <span className="block text-3xl sm:text-4xl font-extrabold text-[#A67C52]">100+</span>
              <span className="text-[9px] uppercase font-bold text-stone-500 tracking-wider block mt-1 font-sans">Contracts Executed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. CORE MATERIAL ADVANTAGES (WOOD TYPES) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-[#A67C52] text-xs font-bold uppercase tracking-widest">Architectural Foundations</span>
          <h3 className="text-3xl font-serif font-bold text-[#1A1A1A] tracking-tight">Premium Raw Lumber Selection</h3>
          <p className="text-stone-500 text-xs font-light">
            Each specimen of wood is moisture-analyzed and seasoned to endure intense regional summers and atmospheric humidity without bending.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {premiumWoods.map((wood) => (
            <div
              key={wood.name}
              className={`p-6 border rounded-sm transition-all duration-300 hover:shadow-md hover:border-[#A67C52] space-y-4 ${wood.color}`}
            >
              <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                <h4 className="font-serif font-bold text-lg text-[#1A1A1A]">{wood.name}</h4>
                <ShieldCheck size={18} className="text-[#A67C52]" />
              </div>
              <div className="space-y-2.5">
                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  {wood.desc}
                </p>
                <div className="text-[10px] space-y-1 bg-stone-100/50 p-3 rounded">
                  <div className="flex justify-between">
                    <span className="text-stone-400 uppercase font-semibold">Origin Location:</span>
                    <span className="text-[#1A1A1A] font-bold">{wood.origin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400 uppercase font-semibold">Moisture Guard:</span>
                    <span className="text-[#1A1A1A] font-bold">{wood.strength}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. THREE COLUMN PORTFOLIO CASE STUDIES SPOTLIGHT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end border-b pb-4 border-[#E5E1D9]">
          <div>
            <span className="text-[#A67C52] text-xs font-bold uppercase tracking-widest block mb-1">Our Showcase</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] tracking-tight">Stately Projects</h3>
          </div>
          <button 
            onClick={() => onNavigate("projects")}
            className="text-[#A67C52] hover:text-[#1A1A1A] text-xs font-bold tracking-widest uppercase flex items-center transition cursor-pointer"
          >
            View Full Portfolio <ChevronRight size={14} className="ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.length > 0 ? (
            projects.slice(0, 3).map((pj) => (
              <div 
                key={pj.id} 
                onClick={() => onSelectProject(pj)}
                className="group cursor-pointer bg-white border border-[#E5E1D9] rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative h-60 w-full overflow-hidden bg-stone-100">
                  <img
                    src={pj.image_url}
                    alt={pj.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#F9F7F2] border border-[#E5E1D9] text-[#1A1A1A] text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm shadow-sm">
                      {pj.completed_year}
                    </span>
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <div className="text-[10px] text-[#A67C52] tracking-widest uppercase font-semibold">
                    {pj.contract_type} • {pj.category}
                  </div>
                  <h4 className="text-lg font-serif font-bold text-[#1A1A1A] group-hover:text-[#A67C52] transition duration-150 leading-tight">
                    {pj.title}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                    {pj.description}
                  </p>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-700 pt-2 flex items-center group-hover:translate-x-1.5 transition-transform duration-200">
                    Explore Case Details <ArrowRight size={11} className="ml-1 text-[#A67C52]" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-stone-400 text-xs">
              Fetching project history from database...
            </div>
          )}
        </div>
      </div>

      {/* 5. METICULOUS BLUEPRINT VALUE ACCENT BANNER */}
      <div className="bg-[#1A1A1A] text-white py-14 border-y border-stone-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <span className="text-[#A67C52] uppercase font-mono text-xs tracking-widest font-bold">State Certified Tender Partner</span>
            <h3 className="text-2.5xl sm:text-3xl font-serif font-medium tracking-tight leading-snug">
              Securing architectural specifications for major civic complexes and premium woodwork Interior projects in Gujarat.
            </h3>
            <p className="text-stone-400 text-xs font-sans font-light">
              From secretariats at Gandhinagar to premium hospitality projects in Ahmedabad, we bring full-spectrum <strong>Best Furniture</strong> designs, heavy-duty <strong>School Benches</strong>, ergonomic <strong>Office Furniture</strong>, certified <strong>Hospital Furniture</strong>, and 100% compliant contract execution.
            </p>
          </div>
          <div className="md:col-span-4 flex justify-start md:justify-end">
            <button
              onClick={() => onNavigate("contact")}
              className="w-full sm:w-auto bg-[#A67C52] hover:bg-[#A67C52]/90 text-white py-4 px-8 text-xs font-bold uppercase tracking-widest hover:translate-y-[-1px] transition shadow cursor-pointer"
            >
              Request Consultation
            </button>
          </div>
        </div>
      </div>

      {/* 6. FEATURED WOODWORK PRODUCTS CATALOG */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end border-b pb-4 border-[#E5E1D9]">
          <div>
            <span className="text-[#A67C52] text-xs font-bold uppercase tracking-widest block mb-1">Statewide Distribution</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">No 1 Furniture Showcase</h3>
          </div>
          <button 
            onClick={() => onNavigate("products")}
            className="text-[#A67C52] hover:text-[#1A1A1A] text-xs font-bold tracking-widest uppercase flex items-center transition cursor-pointer"
          >
            Explore Catalog <ChevronRight size={14} className="ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.slice(0, 4).map((p) => (
              <div 
                key={p.id} 
                onClick={() => onSelectProduct(p)}
                className="group cursor-pointer bg-white border border-[#E5E1D9] rounded overflow-hidden shadow-sm hover:shadow transition-all duration-200"
              >
                <div className="relative aspect-square w-full bg-stone-50 overflow-hidden border-b">
                  <img
                    src={p.image_url}
                    alt={p.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#1A1A1A] text-[#E5E1D9] text-[8px] font-bold px-2.5 py-0.5 rounded-sm uppercase tracking-wider">
                    {p.category}
                  </div>
                </div>
                <div className="p-4 space-y-1.5">
                  <h4 className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#A67C52] transition truncate">
                    {p.title}
                  </h4>
                  <div className="text-xs text-[#A67C52] font-semibold font-mono">
                    ₹{p.price_min?.toLocaleString()} - ₹{p.price_max?.toLocaleString()}
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                  <div className="text-[10px] font-bold uppercase text-stone-400 mt-2 flex items-center group-hover:text-[#A67C52] transition duration-150">
                    View Specifications <ChevronRight size={10} className="ml-0.5" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-stone-400 text-xs">
              Loading catalog from certified repository...
            </div>
          )}
        </div>
      </div>

      {/* 7. REGIONAL ENDORSEMENTS & TESTIMONIALS */}
      <div className="bg-[#FAF8F5] border-y border-[#E5E1D9] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[#A67C52] text-xs font-bold uppercase tracking-widest block">Client Testimonials</span>
            <h3 className="text-3xl font-serif font-bold text-[#1A1A1A]">Trusted Across Civic & Commercial Spaces</h3>
            <p className="text-stone-500 text-xs font-light">
              We stand solid behind every government contract and luxurious installation executed in the region.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {endorsements.map((e, index) => (
              <div 
                key={index}
                className="bg-white border border-[#E5E1D9] rounded p-6 sm:p-8 space-y-5 flex flex-col justify-between shadow-sm hover:shadow transition duration-200"
              >
                <div className="space-y-4">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-[#A67C52] text-base">★</span>
                    ))}
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans font-light italic">
                    "{e.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E5E1D9]/70 space-y-1">
                  <h5 className="font-bold text-xs text-[#1A1A1A]">{e.author}</h5>
                  <p className="text-[10px] text-[#A67C52] font-semibold">{e.entity}</p>
                  <p className="text-[9px] text-stone-400">{e.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 8. WORKSTATION INQUIRY FORM TEASER */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="border border-[#E5E1D9] rounded overflow-hidden shadow-md grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-5 bg-[#1A1A1A] text-white p-8 sm:p-12 space-y-4 flex flex-col justify-center">
            <span className="text-[#A67C52] text-xs font-bold tracking-widest uppercase">Direct Channel</span>
            <h4 className="text-2xl font-serif font-medium leading-tight">Discuss Your Custom Blueprint</h4>
            <p className="text-xs text-stone-300 leading-relaxed font-light">
              Planning state procurement tenders, private colleges, assembly rooms or luxury custom projects? Reach out directly. Our Managing Director responds in writing with tender validations within 24 business hours.
            </p>
          </div>
          
          <div className="md:col-span-7 bg-white p-8 sm:p-12 space-y-4 flex flex-col justify-center items-start">
            <h4 className="text-xl font-serif font-bold text-[#1A1A1A]">Ready to build massive compliance items?</h4>
            <p className="text-xs text-stone-500 leading-relaxed">
              Our factory can process up to 100 cubic metric tons of raw premium teak and commercial assembly joints monthly. Discuss specifications, shipping routes, local freight, and structural warranty contracts instantly.
            </p>
            <button
              onClick={() => onNavigate("contact")}
              className="mt-2 bg-[#A67C52] hover:bg-[#A67C52]/90 text-white text-xs font-bold uppercase tracking-widest py-3.5 px-6 rounded-sm shadow transition duration-150 cursor-pointer"
            >
              Contact Our Director Console
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
