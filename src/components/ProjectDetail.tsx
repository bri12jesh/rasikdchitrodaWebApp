import React, { useState } from "react";
import { ArrowLeft, User, MapPin, Calendar, Briefcase, Award, X, ZoomIn } from "lucide-react";
import { Project } from "../types";

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export default function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const galleryImages = Array.isArray(project.gallery_urls) ? project.gallery_urls : [];

  return (
    <div className="w-full">
      
      {/* Top Atmos Backing Banner Section with floating back button */}
      <div className="relative h-[480px] w-full overflow-hidden">
        <img
          src={project.image_url}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filtering-blur"
        />
        
        {/* Dark Ambient Overlay layer */}
        <div className="absolute inset-0 bg-stone-900/35 backdrop-blur-[1px]"></div>
        
        {/* Floating Back to Projects Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 sm:left-12 flex items-center text-xs font-semibold text-white tracking-wider uppercase bg-[#1A1A1A]/85 hover:bg-[#1A1A1A] border border-[#E5E1D9]/20 px-4 py-2.5 rounded-sm transition-all shadow-lg cursor-pointer"
        >
          <ArrowLeft size={13} className="mr-2 text-[#A67C52]" /> Back to Projects
        </button>

        {/* Floating visual indicator */}
        <div className="absolute bottom-6 right-6 text-[10px] text-white/50 tracking-widest font-mono uppercase bg-black/40 px-3 py-1.5 rounded">
          ARCHITECTURAL DETAIL SHOT
        </div>
      </div>

      {/* Raised Floating Detail Card Layout - Matching Screenshot 2 precisely */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative -mt-48 pb-16 z-10">
        <div className="bg-white border border-[#E5E1D9] rounded p-6 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Editorial Project Description Column (Left 8 Units) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Tagline classification row */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-[#F9F7F2] border border-[#E5E1D9] text-[#1A1A1A] text-[10px] font-bold tracking-widest uppercase px-3 py-1 mr-2 rounded-sm">
                {project.category?.toUpperCase()}
              </span>
              <span className="text-[#A67C52] text-[10px] font-bold tracking-widest uppercase">
                {project.contract_type}
              </span>
            </div>

            {/* Project Majestic Title */}
            <h1 className="text-4xl sm:text-5xl font-serif font-semibold text-[#1A1A1A] tracking-tight leading-tight">
              {project.title}
            </h1>

            {/* Editorial Lead Paragraph Copy */}
            <p className="text-[#4A4A4A] text-sm sm:text-base leading-relaxed font-sans font-light pt-3">
              {project.description}
            </p>

            <div className="pt-6 border-t border-dashed border-[#E5E1D9] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#F9F7F2] p-4 rounded border border-[#E5E1D9]/50 flex items-start space-x-3">
                <div className="p-2 bg-amber-100/60 text-[#A67C52] rounded">
                  <Award size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-[#A67C52] tracking-wider">Quality Standard</h4>
                  <p className="text-xs text-[#1A1A1A] mt-0.5 leading-snug">Handcrafted solid joinery wood engineered to survive generational public and private usage.</p>
                </div>
              </div>

              <div className="bg-[#F9F7F2] p-4 rounded border border-[#E5E1D9]/50 flex items-start space-x-3">
                <div className="p-2 bg-amber-100/60 text-[#A67C52] rounded">
                  <Briefcase size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-[#A67C52] tracking-wider">Contract Scope</h4>
                  <p className="text-xs text-[#1A1A1A] mt-0.5 leading-snug">Full furniture outfitting, space blueprinting, local delivery, and custom finish polishing.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Project Details Sidebar Box (Right 4 Units) - Matching Screenshot 2 precisely */}
          <div className="lg:col-span-4 bg-[#F9F7F2] border border-[#E5E1D9] rounded p-6 sm:p-8 space-y-6 font-sans">
            
            <h3 className="text-sm font-serif font-bold text-[#1A1A1A] border-b pb-2.5 border-[#E5E1D9] tracking-wide">
              Project Details
            </h3>

            {/* Meta Row: Client */}
            <div className="space-y-1">
              <span className="flex items-center text-[10px] font-bold text-[#A67C52] uppercase tracking-widest">
                <User size={13} className="mr-1.5" /> Client
              </span>
              <p className="text-[#1A1A1A] text-xs font-semibold pl-4.5">
                {project.client}
              </p>
            </div>

            {/* Meta Row: Location */}
            <div className="space-y-1">
              <span className="flex items-center text-[10px] font-bold text-[#A67C52] uppercase tracking-widest">
                <MapPin size={13} className="mr-1.5" /> Location
              </span>
              <p className="text-[#1A1A1A] text-xs font-semibold pl-4.5">
                {project.location}
              </p>
            </div>

            {/* Meta Row: Completed */}
            <div className="space-y-1">
              <span className="flex items-center text-[10px] font-bold text-[#A67C52] uppercase tracking-widest">
                <Calendar size={13} className="mr-1.5" /> Completed
              </span>
              <p className="text-[#1A1A1A] text-xs font-semibold font-mono pl-4.5">
                {project.completed_year}
              </p>
            </div>

            {/* Verified seal */}
            <div className="pt-4 border-t border-dashed border-[#E5E1D9] flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] font-bold text-[#A67C52] tracking-wider uppercase font-mono">Verified Gujarat Contract</span>
            </div>

          </div>

        </div>
      </div>

      {/* Elegant Architectural Photo Gallery Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 font-sans">
        <div className="border-t border-[#E5E1D9] pt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-[#A67C52] text-xs font-bold uppercase tracking-widest block mb-1">Visual Log</span>
              <h2 className="text-3xl font-serif text-[#1A1A1A] tracking-tight font-semibold flex items-center">
                Project Installation Gallery
              </h2>
            </div>
            <p className="text-xs text-stone-500 max-w-sm sm:text-right font-light leading-relaxed">
              Real-world photographs capture the material weight, scale, and high finish details of this corporate/public commission.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Primary Image View */}
            <div 
              onClick={() => setSelectedImage(project.image_url)}
              className="lg:col-span-3 aspect-[21/9] rounded overflow-hidden border border-[#E5E1D9] shadow-sm relative group cursor-pointer bg-stone-50"
            >
              <img
                src={project.image_url}
                alt={`${project.title} overview`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-[#1A1A1A]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white text-[#1A1A1A] text-[10px] font-bold tracking-widest uppercase px-4.5 py-2.5 rounded shadow-xl flex items-center border border-[#E5E1D9]">
                  <ZoomIn size={12} className="mr-1.5 text-[#A67C52]" /> View Primary Detail
                </span>
              </div>
              <div className="absolute bottom-4 left-4 bg-[#1A1A1A]/85 text-[#E5E1D9] text-[9px] font-mono tracking-widest px-2.5 py-1.5 uppercase rounded">
                PRIMARY REPRESENTATION SHOT
              </div>
            </div>

            {/* Additional gallery images */}
            {galleryImages.length > 0 ? (
              galleryImages.map((imgUrl, idx) => (
                <div 
                  key={idx}
                  onClick={() => setSelectedImage(imgUrl)}
                  className="aspect-[16/10] rounded overflow-hidden border border-[#E5E1D9] shadow-sm relative group cursor-pointer bg-stone-50"
                >
                  <img
                    src={imgUrl}
                    alt={`${project.title} gallery view ${idx + 2}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#1A1A1A]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white text-[#1A1A1A] text-[9px] font-bold tracking-widest uppercase px-3 py-2 rounded shadow flex items-center border border-[#E5E1D9]">
                      <ZoomIn size={11} className="mr-1.2 text-[#A67C52]" /> Spec View
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#FAF8F5]/90 border border-[#E5E1D9] text-[#1A1A1A] text-[8px] font-mono tracking-wider px-2 py-0.5 uppercase rounded-sm">
                    DETAILED SECTOR #{idx + 1}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full border border-dashed border-[#E5E1D9] bg-[#FAF8F5]/50 p-8 text-center rounded text-stone-500 text-xs">
                Additional setup/installation photographs are being processed against security clearances.
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Lightbox / Full-Screen Modal Image Preview Viewer */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-[#1A1A1A]/95 z-50 flex items-center justify-center p-4 sm:p-8 backdrop-blur-md transition-all animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full flex flex-col justify-center items-center">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 sm:top-0 sm:-right-16 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all cursor-pointer border border-white/10"
              title="Close image representation"
            >
              <X size={20} />
            </button>

            {/* Main Picture Frame */}
            <img
              src={selectedImage}
              alt="Expanded configuration detail"
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[82vh] object-contain border border-stone-800 rounded shadow-2xl bg-stone-900"
              onClick={(e) => e.stopPropagation()} // Stop bubble dismiss
            />

            {/* Sub Caption representation */}
            <p className="text-stone-400 text-xs mt-3 select-none text-center italic tracking-wide">
              {project.title} — Premium Wooden Specifications Assembly Details
            </p>

          </div>
        </div>
      )}

    </div>
  );
}
