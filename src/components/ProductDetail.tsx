import React, { useState } from "react";
import { ArrowLeft, Check, Phone, FileText, Send, X } from "lucide-react";
import { Product } from "../types";
import SEO from "./SEO";

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export default function ProductDetail({ product, onBack }: ProductDetailProps) {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Parse Key Features cleanly
  let featuresArray: string[] = [];
  try {
    if (typeof product.key_features === "string") {
      featuresArray = JSON.parse(product.key_features);
    } else if (Array.isArray(product.key_features)) {
      featuresArray = product.key_features;
    }
  } catch (e) {
    if (typeof product.key_features === "string") {
      featuresArray = product.key_features.split(",").map(f => f.trim());
    }
  }

  // Parse Specs cleanly
  let specsObj: Record<string, string> = {};
  try {
    if (typeof product.specs === "string") {
      specsObj = JSON.parse(product.specs);
    } else if (product.specs && typeof product.specs === "object") {
      specsObj = product.specs as Record<string, string>;
    }
  } catch (e) {
    // Leave as empty
  }

  const handleRequestQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert("Please fill out your Name and Phone Number parameters.");
      return;
    }
    setFormSubmitted(true);
    setTimeout(() => {
      setShowQuoteForm(false);
      setFormSubmitted(false);
      setClientName("");
      setClientPhone("");
      setClientNotes("");
      alert(`Quote requested successfully for "${product.title}"! Representative will call you shortly.`);
    }, 1500);
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.title,
    "image": product.image_url,
    "description": product.description,
    "category": product.category,
    "brand": {
      "@type": "Brand",
      "name": "Rasik D Chitroda"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "INR",
      "lowPrice": product.price_min || 1000,
      "highPrice": product.price_max || 50000,
      "price": product.price_min || 1000,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Rasik D Chitroda Furniture"
      }
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://officefurnitureonline.in/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Products",
        "item": "https://officefurnitureonline.in/products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.title,
        "item": `https://officefurnitureonline.in/products/${product.id}`
      }
    ]
  };

  return (
    <div className="py-8 max-w-6xl mx-auto px-4 sm:px-6">
      <SEO
        title={`${product.title} - Gujarat School & Office Furniture`}
        description={product.description?.slice(0, 160) || `Buy ${product.title} manufactured by Rasik D Chitroda. Commercial grade furniture for schools, hospitals, and offices in Gujarat.`}
        canonical={`/products/${product.id}`}
        ogImage={product.image_url}
        ogType="product"
        keywords={`${product.title}, ${product.category}, School Benches Gujarat, Office Furniture Ahmedabad, Tender Furniture`}
        schema={[productSchema, breadcrumbSchema]}
      />
      
      {/* Breadcrumb Navigation matching the editorial design */}
      <nav className="text-xs text-stone-500 mb-8 flex items-center space-x-2 tracking-widest uppercase font-semibold">
        <button onClick={onBack} className="hover:text-[#A67C52] transition">Home</button>
        <span className="text-[#1A1A1A]/20">/</span>
        <button onClick={onBack} className="hover:text-[#A67C52] transition">Products</button>
        <span className="text-[#1A1A1A]/20">/</span>
        <span className="text-[#1A1A1A] font-bold">{product.title}</span>
      </nav>

      {/* Main Product grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start bg-white border border-[#E5E1D9] rounded p-6 sm:p-12 shadow-sm relative overflow-hidden">
        
        {/* Back Link Floating overlay */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 lg:hidden flex items-center text-xs text-stone-500 hover:text-[#1A1A1A] border border-[#E5E1D9] px-2.5 py-1.5 rounded bg-[#F9F7F2]"
        >
          <ArrowLeft size={12} className="mr-1" /> Back
        </button>

        {/* Product Image Stage (Left Column) */}
        <div className="lg:col-span-6 w-full flex flex-col">
          <div className="relative aspect-square w-full bg-[#F9F7F2] border border-[#E5E1D9] rounded overflow-hidden flex items-center justify-center">
            <img
              src={product.image_url}
              alt={product.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          
          <button
            onClick={onBack}
            className="hidden lg:flex items-center text-xs font-bold tracking-widest uppercase text-[#A67C52] hover:text-[#1A1A1A] transition duration-150 mt-6"
          >
            <ArrowLeft size={14} className="mr-2" /> Back to Products Catalog
          </button>
        </div>

        {/* Product Details Columns (Right Column) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Category Pill Tag */}
          <span className="inline-block px-3 py-1 bg-[#A67C52] text-white text-[10px] font-bold tracking-widest uppercase rounded-sm">
            {product.category}
          </span>

          <h1 className="text-4xl font-serif font-bold text-[#1A1A1A] tracking-tight leading-tight mt-2">
            {product.title}
          </h1>

          {/* Pricing indicators matching screenshot */}
          <div className="text-2xl font-serif text-[#A67C52] font-semibold tracking-wide">
            ₹{product.price_min?.toLocaleString()} – ₹{product.price_max?.toLocaleString()}
          </div>

          <p className="text-sm text-[#4A4A4A] leading-relaxed font-sans font-light">
            {product.description}
          </p>

          {/* Key Features block */}
          {featuresArray.length > 0 && (
            <div className="pt-6 border-t border-[#E5E1D9]">
              <h3 className="text-xs uppercase font-bold tracking-widest text-[#A67C52] mb-3">Key Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featuresArray.map((feature, i) => (
                  <li key={i} className="flex items-start text-xs text-[#1A1A1A]">
                    <span className="bg-[#FAF7F2] border border-[#E5E1D9] p-0.5 rounded text-[#A67C52] mr-2.5 mt-0.5 shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="leading-tight font-light">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technical Specifications chart matching standard design layout */}
          {Object.keys(specsObj).length > 0 && (
            <div className="pt-6 border-t border-[#E5E1D9]">
              <h3 className="text-xs uppercase font-bold tracking-widest text-[#A67C52] mb-3">Technical Specifications</h3>
              <div className="border border-[#E5E1D9] rounded overflow-hidden">
                <table className="w-full text-left font-sans text-xs border-collapse">
                  <tbody>
                    {Object.entries(specsObj).map(([key, val], i) => (
                      <tr 
                        key={key} 
                        className={`border-b border-[#E5E1D9]/50 ${i % 2 === 0 ? "bg-[#F9F7F2]/50" : "bg-white"}`}
                      >
                        <td className="py-2.5 px-3 font-semibold text-stone-600 border-r border-[#E5E1D9]/50 w-1/3">{key}</td>
                        <td className="py-2.5 px-3 text-[#1A1A1A] font-light">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Box matching Screenshot 6 */}
          <div className="mt-8 bg-[#F9F7F2] border border-[#E5E1D9] rounded p-6 space-y-4">
            <h4 className="text-sm font-serif font-bold text-[#1A1A1A] tracking-tight">Interested in this product?</h4>
            <p className="text-xs text-[#4A4A4A] leading-relaxed font-light">
              We specialize in fulfilling bulk commercial contracts and government tenders across Gujarat. Get customized sizing, bulk discounts, and rapid local logistics fulfillment options.
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <button
                onClick={() => setShowQuoteForm(true)}
                className="flex-1 py-3 bg-[#1A1A1A] hover:bg-[#3E2D25] text-white text-xs font-bold tracking-widest uppercase transition duration-150 shadow-sm text-center"
              >
                Request a Quote
              </button>
              <a
                href="tel:+919638616995"
                className="flex items-center justify-center py-3 px-5 border border-[#1A1A1A] hover:bg-[#FAF7F2] text-[#1A1A1A] text-xs font-bold tracking-widest uppercase transition duration-150"
              >
                <Phone size={14} className="mr-2 text-[#A67C52]" /> Call Now
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Slide-over custom quote request dialog container */}
      {showQuoteForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded max-w-md w-full border border-[#E5E1D9] shadow-2xl overflow-hidden relative">
            <button
              onClick={() => setShowQuoteForm(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition"
            >
              <X size={18} />
            </button>
            
            <div className="bg-[#1A1A1A] p-6 text-white text-center">
              <span className="text-[10px] tracking-widest uppercase text-[#A67C52] font-bold">Rasik D Chitroda</span>
              <h3 className="text-xl font-serif mt-1 font-medium">Bespoke Quotation Request</h3>
              <p className="text-xs text-stone-300 mt-2">Get regional pricing and customization specs for: <span className="text-white font-semibold block mt-1">{product.title}</span></p>
            </div>

            <form onSubmit={handleRequestQuote} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-[#A67C52] uppercase tracking-wide mb-1">Your Name / Organization</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="e.g. Brijesh Patel (Rajkot Capital Corp)"
                  className="w-full px-3 py-2 border border-[#E5E1D9] rounded-sm text-xs text-[#1A1A1A] outline-none focus:ring-1 focus:ring-[#A67C52] bg-[#F9F7F2]/30"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#A67C52] uppercase tracking-wide mb-1">Contact Phone Number</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={e => setClientPhone(e.target.value)}
                  placeholder="e.g. +91 96386 16995"
                  className="w-full px-3 py-2 border border-[#E5E1D9] rounded-sm text-xs text-[#1A1A1A] outline-none focus:ring-1 focus:ring-[#A67C52] bg-[#F9F7F2]/30"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#A67C52] uppercase tracking-wide mb-1">Custom Requirements / Quantity Notes (Optional)</label>
                <textarea
                  rows={3}
                  value={clientNotes}
                  onChange={e => setClientNotes(e.target.value)}
                  placeholder="Mention custom size, color, wood grade or batch delivery needs..."
                  className="w-full px-3 py-2 border border-[#E5E1D9] rounded-sm text-xs text-[#1A1A1A] outline-none focus:ring-1 focus:ring-[#A67C52] bg-[#F9F7F2]/30"
                />
              </div>

              <button
                type="submit"
                disabled={formSubmitted}
                className="w-full py-2.5 bg-[#1A1A1A] hover:bg-[#3E2D25] text-white rounded-sm text-xs font-bold uppercase tracking-wider transition-colors disabled:bg-stone-400 flex items-center justify-center space-x-2 shadow"
              >
                {formSubmitted ? (
                  <span>Sending secure request...</span>
                ) : (
                  <>
                    <Send size={12} />
                    <span>Submit Query</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
