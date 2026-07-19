/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link, Routes, Route } from "react-router-dom";
import gsap from "gsap";
import { 
  Menu, X, Phone, Mail, MapPin, Award, ShieldAlert, CheckCircle, 
  ArrowRight, Landmark, Building, Users, CalendarCheck, FileText, 
  Plus, ExternalLink, ChevronRight, MessageSquare, Search
} from "lucide-react";

import { Product, Project } from "./types";
import ProductDetail from "./components/ProductDetail";
import ProjectDetail from "./components/ProjectDetail";
import AdminPortal from "./components/AdminPortal";
import Home from "./components/Home";

export default function App() {
  // Navigation State
  const navigate = useNavigate();
  const location = useLocation();
  const pathPart = location.pathname.split("/")[1];
  const currentTab = (pathPart === "" ? "home" : pathPart) as "home" | "products" | "projects" | "about" | "contact" | "admin";

  const setCurrentTab = (tab: "home" | "products" | "projects" | "about" | "contact" | "admin") => {
    if (tab === "home") navigate("/");
    else navigate(`/${tab}`);
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Selected Detail Item state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Database State
  const [products, setProducts] = useState<Product[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin Session Token (in localStorage for convenience)
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem("rasik_admin_token");
  });

  // Filter Categories States
  const [activeProductFilter, setActiveProductFilter] = useState("All Products");
  const [activeProjectFilter, setActiveProjectFilter] = useState("All Projects");

  // Search Input States
  const [productSearch, setProductSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");

  // Contact Form State
  const [contactName, setContactName] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactSent, setContactSent] = useState(false);

  // GSAP Animation Refs
  const headerRef = useRef<HTMLDivElement>(null);
  const introBlockRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch SQLite state components
  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, projectsRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/projects")
      ]);
      if (productsRes.ok) {
        const prods = await productsRes.json();
        setProducts(prods);
      }
      if (projectsRes.ok) {
        const projs = await projectsRes.json();
        setProjects(projs);
      }
    } catch (err) {
      console.warn("Could not retrieve state components. Check backend status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Sync token to persistent storage
  const handleAdminSessionChange = (tok: string | null) => {
    setAdminToken(tok);
    if (tok) {
      localStorage.setItem("rasik_admin_token", tok);
    } else {
      localStorage.removeItem("rasik_admin_token");
    }
    setCurrentTab(tok ? "admin" : "home");
  };

  // GSAP Entrances
  useEffect(() => {
    // 1. Initial Header Intro
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
      );
    }
  }, []);

  // Animate on Tab selection shift
  useEffect(() => {
    // Reset selected items on tab navigations
    setSelectedProduct(null);
    setSelectedProject(null);
    
    if (containerRef.current) {
      // Clean slide upwards opacity fade
      gsap.fromTo(
        containerRef.current.children,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: "power2.out" }
      );
    }
    
    // Smooth scroll back to top on transitions
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentTab]);

  // Product categories list
  const productCategories = [
    "All Products",
    "Office Furniture",
    "School Furniture",
    "Hospital Furniture",
    "Court Furniture",
    "Hotel Furniture",
    "Residential Furniture",
    "Library Furniture",
    "Laboratory Furniture"
  ];

  // Projects categories list with counts
  const projectCategories = [
    "All Projects",
    "Office Furniture",
    "School Furniture",
    "Hospital Furniture",
    "Court Furniture",
    "Hotel Furniture",
    "Residential Furniture"
  ];

  // Helper count for project category buttons
  const getProjectCategoryCount = (cat: string) => {
    if (cat === "All Projects") return projects.length;
    return projects.filter(p => p.category === cat).length;
  };

  // Filter criteria products
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeProductFilter === "All Products" || p.category === activeProductFilter;
    const searchLower = productSearch.toLowerCase().trim();
    if (!searchLower) return matchesCategory;
    
    const matchesTitle = p.title?.toLowerCase().includes(searchLower);
    const matchesCategoryText = p.category?.toLowerCase().includes(searchLower);
    const matchesDesc = p.description?.toLowerCase().includes(searchLower);
    const matchesSpecs = p.specs && typeof p.specs === "object" 
      ? Object.entries(p.specs).some(([key, val]) => 
          key.toLowerCase().includes(searchLower) || String(val).toLowerCase().includes(searchLower)
        )
      : false;
    const matchesFeatures = Array.isArray(p.key_features)
      ? p.key_features.some(f => f.toLowerCase().includes(searchLower))
      : false;

    return matchesCategory && (matchesTitle || matchesCategoryText || matchesDesc || matchesSpecs || matchesFeatures);
  });

  // Filter criteria projects
  const filteredProjects = projects.filter(p => {
    const matchesCategory = activeProjectFilter === "All Projects" || p.category === activeProjectFilter;
    const searchLower = projectSearch.toLowerCase().trim();
    if (!searchLower) return matchesCategory;

    const matchesTitle = p.title?.toLowerCase().includes(searchLower);
    const matchesCategoryText = p.category?.toLowerCase().includes(searchLower);
    const matchesDesc = p.description?.toLowerCase().includes(searchLower);
    const matchesClient = p.client?.toLowerCase().includes(searchLower);
    const matchesLocation = p.location?.toLowerCase().includes(searchLower);
    const matchesYear = String(p.completed_year).includes(searchLower);
    const matchesContract = p.contract_type?.toLowerCase().includes(searchLower);

    return matchesCategory && (
      matchesTitle || matchesCategoryText || matchesDesc || matchesClient || matchesLocation || matchesYear || matchesContract
    );
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactName("");
      setContactPhone("");
      setContactMsg("");
      alert("Consultation Inquiry logged securely. Thank you for choosing Rasik D Chitroda Furniture!");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2]">
      
      {/* Visual top border styling matching golden detail lines */}
      <div className="h-1 bg-[#A67C52]"></div>

      {/* Primary Header/Navbar Layout - Matches screenshot standard header */}
      <header 
        ref={headerRef}
        className="sticky top-0 z-40 bg-[#F9F7F2]/95 backdrop-blur-md border-b border-[#E5E1D9]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo brand signature */}
            <div className="flex-shrink-0 cursor-pointer" onClick={() => setCurrentTab("home")}>
              <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-[#1A1A1A] uppercase block leading-none">
                Rasik D Chitroda
              </span>
              <span className="text-[9px] tracking-widest uppercase text-[#A67C52] block mt-1 font-semibold">
                Leading Furniture Manufacturer Since 2008
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { label: "Home", id: "home" },
                { label: "Products", id: "products" },
                { label: "Projects", id: "projects" },
                { label: "About", id: "about" },
                { label: "Contact", id: "contact" }
              ].map((tab) => (
                <Link
                  key={tab.id}
                  to={tab.id === "home" ? "/" : `/${tab.id}`}
                  className={`text-xs font-semibold tracking-wider uppercase transition-colors duration-200 py-2 border-b-2 hover:text-[#A67C52] ${
                    currentTab === tab.id 
                      ? "border-[#A67C52] text-[#1A1A1A]" 
                      : "border-transparent text-stone-600"
                  }`}
                >
                  {tab.label}
                </Link>
              ))}

              {adminToken && (
                <button
                  onClick={() => setCurrentTab("admin")}
                  className={`text-xs font-bold uppercase py-2 text-emerald-700 bg-emerald-50 px-2.5 rounded border border-emerald-300 hover:bg-emerald-100`}
                >
                  Admin Console
                </button>
              )}
            </nav>

            {/* Call Action Solid right button */}
            <div className="hidden lg:block">
              <button 
                onClick={() => setCurrentTab("contact")}
                className="bg-[#1A1A1A] hover:bg-[#A67C52] text-white text-xs font-semibold tracking-wider uppercase py-3.5 px-6 rounded-sm shadow transition duration-200"
              >
                Get in Touch
              </button>
            </div>

            {/* Mobile menu toggle button */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-stone-700 hover:text-[#A67C52] p-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Menu elements */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#E5E1D9] py-4 px-6 space-y-3 shadow-lg absolute w-full left-0">
            {[
              { label: "Home", id: "home", path: "/" },
              { label: "Products", id: "products", path: "/products" },
              { label: "Projects", id: "projects", path: "/projects" },
              { label: "About", id: "about", path: "/about" },
              { label: "Contact", id: "contact", path: "/contact" }
            ].map((tab) => (
                <Link
                  key={tab.id}
                  to={tab.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full text-left font-bold text-sm uppercase py-2 block ${
                    currentTab === tab.id ? "text-[#A67C52]" : "text-stone-700"
                  }`}
                >
                  {tab.label}
                </Link>
            ))}
            {adminToken && (
              <button
                onClick={() => {
                  navigate("/admin");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left font-bold text-sm uppercase text-emerald-700 py-2 block"
              >
                Admin Panel
              </button>
            )}
            <button
              onClick={() => {
                setCurrentTab("contact");
                setMobileMenuOpen(false);
              }}
              className="w-full text-center bg-[#1A1A1A] hover:bg-[#A67C52] text-white text-xs font-bold py-2.5 uppercase tracking-widest block rounded-sm mt-4"
            >
              Get in Touch
            </button>
          </div>
        )}
      </header>

      {/* Secondary Dynamic View Container Area */}
      <main ref={containerRef} className="flex-grow">
        
        {/* VIEW 1: HOME VIEW */}
        {currentTab === "home" && !selectedProduct && !selectedProject && (
          <Home
            products={products}
            projects={projects}
            onNavigate={setCurrentTab}
            onSelectProduct={setSelectedProduct}
            onSelectProject={setSelectedProject}
          />
        )}

        {/* VIEW 2: PRODUCTS CATALOG (SCREENSHOTS 8, 9, 10) */}
        {currentTab === "products" && !selectedProduct && (
          <div className="space-y-12">
            
            {/* Catalog Banner Headers - Matches Screenshot 9 */}
            <div className="bg-[#1A1A1A] text-white py-16 text-center shadow-inner relative overflow-hidden">
              <div className="absolute inset-0 bg-stone-900/30"></div>
              <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
                <span className="text-[#A67C52] text-xs font-bold tracking-widest uppercase block">Our Catalog</span>
                <h1 className="text-4xl sm:text-5xl font-serif tracking-tight leading-tight">
                  Products & Collections
                </h1>
                <p className="text-stone-300 text-xs sm:text-sm max-w-xl mx-auto font-sans font-light leading-relaxed">
                  Precision-engineered furniture built for permanence. From government offices to luxury hotels, every piece in our catalog is crafted to outlast trends and stand the test of time.
                </p>
              </div>
            </div>

            {/* Category selection scroll bar & Search Controls - Matches Screenshot 8 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5E1D9] pb-2 md:pb-0">
                <div className="flex overflow-x-auto py-2 class-no-scrollbar space-x-4 max-w-full md:max-w-3xl shrink">
                  {productCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveProductFilter(cat)}
                      className={`whitespace-nowrap pb-2 text-xs font-bold uppercase tracking-wider transition border-b-2 -mb-2 ${
                        activeProductFilter === cat
                          ? "border-[#A67C52] text-[#A67C52] font-bold"
                          : "border-transparent text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Elegant Search bar for Products */}
                <div className="relative w-full md:w-80 shrink-0 mb-2 md:mb-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={14} className="text-stone-450" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search product name, feature, specs..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-xs border border-[#E5E1D9] rounded bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#A67C52] focus:border-[#A67C52] text-[#1A1A1A] placeholder-stone-400 pb-2 pt-2 transition shadow-xs"
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch("")}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-stone-400 hover:text-stone-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Catalog Product Grid - Matches Screenshot 10 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className="group cursor-pointer bg-white border border-[#E5E1D9] rounded overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="relative aspect-square w-full bg-stone-50 overflow-hidden border-b flex items-center justify-center">
                      <img
                        src={p.image_url}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-[#1A1A1A] text-[#E5E1D9] text-[8px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                        {p.category}
                      </div>
                    </div>
                    
                    <div className="p-5 space-y-2">
                      <h3 className="text-sm font-bold text-[#1A1A1A] group-hover:text-[#A67C52] transition truncate">
                        {p.title}
                      </h3>
                      
                      <div className="text-xs text-[#A67C52] font-semibold font-mono">
                        ₹{p.price_min?.toLocaleString()} - ₹{p.price_max?.toLocaleString()}
                      </div>

                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>

                      <div className="text-[10px] uppercase font-bold tracking-wider text-stone-700 pt-3 flex items-center group-hover:translate-x-1 transition-transform">
                        View Details <ChevronRight size={10} className="ml-0.5" />
                      </div>
                    </div>
                  </div>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-16 text-center text-stone-500 bg-white border border-[#E5E1D9] rounded p-8 animate-fadeIn">
                    <p className="text-sm font-medium">No products match your current filters and search criteria.</p>
                    {productSearch && (
                      <button
                        onClick={() => setProductSearch("")}
                        className="mt-3 text-xs text-[#A67C52] hover:underline uppercase font-bold tracking-wider cursor-pointer"
                      >
                        Clear Search Query
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Need Custom Solution Banner - Matches Screenshot 8 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="bg-[#1A1A1A] border border-[#E5E1D9] text-[#E5E1D9] p-8 sm:p-12 rounded grid grid-cols-1 md:grid-cols-12 gap-6 items-center w-full">
                <div className="md:col-span-8 space-y-2">
                  <h3 className="text-2xl font-serif text-white tracking-tight leading-snug">Need a custom solution?</h3>
                  <p className="text-xs text-stone-400 leading-relaxed font-sans font-light">
                    Every piece can be tailored to your exact specifications. From wood timber grade selection to customized sizing and regional freight transport. Government or private — we deliver.
                  </p>
                </div>
                <div className="md:col-span-4 flex justify-start md:justify-end">
                  <button
                    onClick={() => setCurrentTab("contact")}
                    className="w-full sm:w-auto bg-[#A67C52] hover:bg-[#A67C52]/90 text-white font-bold py-3.5 px-6 uppercase text-xs tracking-widest shadow transition-colors"
                  >
                    Request a Quote
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 3: PROJECTS / WORK PORTFOLIO (SCREENSHOTS 4, 3) */}
        {currentTab === "projects" && !selectedProject && (
          <div className="space-y-12 py-12">
            
            {/* Majestic Title block - Matches Screenshot 4 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
              <span className="text-xs uppercase tracking-widest text-[#A67C52] font-bold">Work History</span>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#1A1A1A] tracking-tight leading-none">
                Our Portfolio
              </h1>
              <p className="text-stone-600 text-xs sm:text-sm max-w-2xl leading-relaxed">
                A showcase of our monumental craftsmanship across Gujarat. From state government tenders to luxury private hotels and schools, every piece is built for decades of use.
              </p>
            </div>

            {/* Project Categories list with Counts & Search - Matches Screenshot 4 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  {projectCategories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveProjectFilter(cat)}
                      className={`px-4 py-2 border rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-150 ${
                        activeProjectFilter === cat
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow"
                          : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                      }`}
                    >
                      {cat} <span className={`ml-1 font-mono text-[9px] ${activeProjectFilter === cat ? "text-amber-300" : "text-stone-400"}`}>({getProjectCategoryCount(cat)})</span>
                    </button>
                  ))}
                </div>

                {/* Elegant Search bar for Projects */}
                <div className="relative w-full md:w-80 shrink-0">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={14} className="text-stone-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search query (e.g. city, client, contract)..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-xs border border-[#E5E1D9] rounded bg-white focus:outline-none focus:ring-1 focus:ring-[#A67C52] focus:border-[#A67C52] text-[#1A1A1A] placeholder-stone-400 shadow-xs transition"
                  />
                  {projectSearch && (
                    <button
                      onClick={() => setProjectSearch("")}
                      className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-stone-400 hover:text-stone-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Projects card grid layout - Matches screenshot 3 & 4 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredProjects.map((pj) => (
                  <div
                    key={pj.id}
                    onClick={() => setSelectedProject(pj)}
                    className="group cursor-pointer bg-white border border-[#E5E1D9] rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="relative h-64 w-full overflow-hidden bg-stone-100">
                      <img
                        src={pj.image_url}
                        alt={pj.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-[#F9F7F2]/90 border border-[#E5E1D9] text-[#1A1A1A] text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider">
                        {pj.completed_year}
                      </div>
                    </div>
                    
                    <div className="p-5 space-y-2">
                       <div className="text-[10px] text-[#A67C52] tracking-widest uppercase font-semibold">
                        {pj.contract_type} • {pj.category}
                      </div>

                      <h3 className="text-xl font-serif font-bold text-[#1A1A1A] group-hover:text-[#A67C52] transition duration-150 leading-tight truncate">
                        {pj.title}
                      </h3>

                      <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed pt-1">
                        {pj.description}
                      </p>

                      <div className="text-[10px] uppercase font-bold tracking-wider text-stone-700 pt-3 flex items-center group-hover:translate-x-1 transition-transform">
                        Explore Case details <ArrowRight size={11} className="ml-1" />
                      </div>
                    </div>
                  </div>
                ))}

                {filteredProjects.length === 0 && (
                  <div className="col-span-full py-16 text-center text-stone-500 bg-white border border-[#E5E1D9] rounded p-8 animate-fadeIn">
                    <p className="text-sm font-medium">No projects match your current filters and search criteria.</p>
                    {projectSearch && (
                      <button
                        onClick={() => setProjectSearch("")}
                        className="mt-3 text-xs text-[#A67C52] hover:underline uppercase font-bold tracking-wider cursor-pointer"
                      >
                        Clear Search Query
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* VIEW 4: ABOUT PAGE */}
        {currentTab === "about" && (
          <div className="space-y-16 py-12 max-w-5xl mx-auto px-4 sm:px-6">
            
            {/* Header intro */}
            <div className="space-y-4 text-center">
              <span className="text-[#A67C52] text-xs font-bold tracking-widest uppercase block">No 1 Furniture Brand in Gujarat</span>
              <h1 className="text-4xl sm:text-5xl font-serif text-[#1A1A1A] tracking-tight leading-tight">
                Crafting the Best Furniture Since 2008
              </h1>
              <p className="text-stone-600 text-xs sm:text-sm max-w-xl mx-auto font-sans font-light leading-relaxed">
                Learn how Rasik D Chitroda established Gujarat's premier commercial tender supplier of robust School Benches, School Furniture, Office Furniture, Hospital Furniture, and luxury Interior designs.
              </p>
            </div>

            {/* Split row description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-serif text-[#1A1A1A] tracking-tight font-medium">Gujarat's No 1 Furniture & Interior Craftsmanship Partner</h3>
                <p className="text-[#4A4A4A] text-xs sm:text-sm leading-relaxed font-sans font-light">
                  Founded in Gujarat, Rasik D Chitroda has successfully engineered and deployed heavy-grade, top-tier school, clinic, and office layouts across regional institutions. As a certified sector leader, we manufacture high-durability double-seater <strong>School Benches</strong>, modern academic <strong>School Furniture</strong>, certified clinic-grade <strong>Hospital Furniture</strong>, ergonomic <strong>Office Furniture</strong>, and tailored luxurious wood <strong>Interior</strong> outfitting.
                </p>
                <p className="text-[#4A4A4A] text-xs sm:text-sm leading-relaxed font-sans font-light">
                  We house over 50 skilled master craftsmen who shape the <strong>Best Furniture</strong> catalog using real seasoned logs of premium Indian teak, rosewood, and mahogany, securing high-strength structural contracts that withstand heavy weight loads across Ahmedabad & Gandhinagar.
                </p>
                <div className="flex space-x-6 pt-4 text-center">
                  <div>
                    <span className="text-3xl font-bold text-[#A67C52] font-serif block">15+</span>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold font-sans">Years in Gujarat</span>
                  </div>
                  <div>
                    <span className="text-3xl font-bold text-[#A67C52] font-serif block">50+</span>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold font-sans">Artisans</span>
                  </div>
                  <div>
                    <span className="text-3xl font-bold text-[#A67C52] font-serif block">100+</span>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold font-sans">Tenders Executed</span>
                  </div>
                </div>
              </div>
              <div className="relative select-none h-[440px] border border-[#E5E1D9] rounded overflow-hidden shadow-lg bg-stone-100">
                <img
                  src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800"
                  alt="Traditional Wood Joinery Craftsman Workshop"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Quality focus blocks */}
            <div className="bg-white border border-[#E5E1D9] rounded p-8 sm:p-12 space-y-6">
              <h3 className="text-xl font-serif font-bold text-[#1A1A1A] text-center border-b border-[#E5E1D9]/60 pb-3">Our Structural Guarantees</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="space-y-2 text-center">
                  <div className="mx-auto w-10 h-10 bg-amber-100/60 text-[#A67C52] flex items-center justify-center rounded-full">
                    <Award size={18} />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-[#1A1A1A]">Premium Wood Choice</h4>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans font-light">Selected Premium Indian Teak and Mahogany seasoned against Gujarat climates.</p>
                </div>
                <div className="space-y-2 text-center">
                  <div className="mx-auto w-10 h-10 bg-amber-100/60 text-[#A67C52] flex items-center justify-center rounded-full">
                    <Landmark size={18} />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-[#1A1A1A]">Contract Compliance</h4>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans font-light">Meticulous alignment with regional government tender specifications and security compliance.</p>
                </div>
                <div className="space-y-2 text-center">
                  <div className="mx-auto w-10 h-10 bg-amber-100/60 text-[#A67C52] flex items-center justify-center rounded-full">
                    <Users size={18} />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wide text-[#1A1A1A]">Artisan Longevity</h4>
                  <p className="text-xs text-stone-500 leading-relaxed font-sans font-light">Generational craftsman details ensure joints and fixtures never buckle under weight loads.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* VIEW 5: CONTACT & CONSULTATION INQUIRY */}
        {currentTab === "contact" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
            
            {/* Header intro */}
            <div className="space-y-3 text-center max-w-2xl mx-auto">
              <span className="text-xs uppercase font-bold tracking-widest text-[#A67C52]">Connect with Gujarat's No 1 Furniture brand</span>
              <h1 className="text-4xl font-serif font-bold text-[#1A1A1A] tracking-tight">Request Best Furniture & Interior Quote</h1>
              <p className="text-stone-500 text-xs sm:text-sm">
                Discuss custom sizes and competitive bidding for heavy-duty <strong>School Benches</strong>, modern <strong>School Furniture</strong>, premium <strong>Office Furniture</strong>, healthcare-grade <strong>Hospital Furniture</strong>, and luxury wooden <strong>Interior</strong> outfittings.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
              
              {/* Form elements (Left 7 Units) */}
              <div className="lg:col-span-7 bg-white border border-[#E5E1D9] rounded p-6 sm:p-10 shadow-sm">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Your Name / Corporation</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={e => setContactName(e.target.value)}
                        placeholder="e.g. Brijesh Chitroda"
                        className="w-full px-3 py-2 border border-stone-200 rounded text-xs text-[#1A1A1A] outline-none bg-[#F9F7F2]/50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Contact Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={e => setContactPhone(e.target.value)}
                        placeholder="e.g. +91 96386 16995"
                        className="w-full px-3 py-2 border border-stone-200 rounded text-xs text-[#1A1A1A] outline-none bg-[#F9F7F2]/50 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">Scope of Inquiry</label>
                    <select className="w-full px-3 py-1.5 border border-stone-200 rounded text-xs text-[#1A1A1A] bg-[#F9F7F2]/50 focus:bg-white">
                      <option>Government Administrative Contract / Tender</option>
                      <option>Hotel / Resort Full Outfitting</option>
                      <option>Educational Sector Modular Bench Order</option>
                      <option>Hospital Clinic Hygienic Setup</option>
                      <option>Private Residence Premium Mahogany Cabinets</option>
                      <option>Custom Carpentry Request</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1 font-serif font-light">Inquiry Specifications Notes</label>
                    <textarea
                      rows={5}
                      required
                      value={contactMsg}
                      onChange={e => setContactMsg(e.target.value)}
                      placeholder="Discuss expected furniture volumes, delivery location, wood material preference, and delivery budget constraints..."
                      className="w-full px-3 py-2 border border-stone-200 rounded text-xs text-[#1A1A1A] outline-none bg-[#F9F7F2]/50 focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="py-3 px-6 bg-[#A67C52] hover:bg-[#A67C52]/90 text-white text-xs font-bold uppercase tracking-widest rounded-sm transition shadow-md"
                  >
                    Submit Quotation Inquiry
                  </button>
                </form>
              </div>

              {/* Contact numbers and regional details (Right 5 Units) */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className="bg-[#FAF8F5] border border-[#E5E1D9] rounded p-6 sm:p-8 space-y-6">
                  <h4 className="text-sm font-serif font-bold text-[#1A1A1A] border-b pb-2">Regional Offices & Showrooms</h4>
                  
                  {/* Address element */}
                  <div className="flex items-start space-x-3 text-xs text-[#1A1A1A]">
                    <MapPin size={16} className="text-[#A67C52] mt-0.5 shrink-0" />
                    <div>
                      <h5 className="font-bold">Ahmedabad Head Office</h5>
                      <p className="text-stone-500">6 - Sai Industrial Estate-I, S.P. Ring Road , Nana Chiloda, Ahmedabad</p>
                    </div>
                  </div>

                  {/* Address element */}
                  <div className="flex items-start space-x-3 text-xs text-[#1A1A1A]">
                    <MapPin size={16} className="text-[#A67C52] mt-0.5 shrink-0" />
                    <div>
                      <h5 className="font-bold font-serif">Manufacturing Unit</h5>
                      <p className="text-stone-500">47,48 - Sai Industrial Estate - II, S.P. Ring Road, Nana Chiloda , Ahmedabad</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-dashed border-stone-200 space-y-3">
                    {/* Mail element */}
                    <div className="flex items-center space-x-3 text-xs text-stone-700">
                      <Mail size={14} className="text-[#A67C52]" />
                      <span>office.rasikdchitroda@gmail.com</span>
                    </div>

                    {/* Phone element */}
                    <div className="flex items-center space-x-3 text-xs text-stone-700">
                      <Phone size={14} className="text-[#A67C52]" />
                      <span>+91 96386 16995</span>
                    </div>
                  </div>
                </div>

                {/* <div className="bg-amber-50/50 border border-amber-200 rounded p-6 text-xs text-[#1A1A1A] space-y-2">
                  <h5 className="font-bold uppercase tracking-wider text-[#A67C52]">Call directly for urgent tenders:</h5>
                  <p className="leading-relaxed">
                    Our managing director, Brijesh Chitroda, validates state procurement schedules and private tender allocations within 24 working hours.
                  </p>
                  <p className="font-medium inline-block underline pt-1">+91 96386 16995</p>
                </div> */}

              </div>

            </div>
          </div>
        )}

        {/* VIEW 6: DETAILED EXPANDED PRODUCT STATE */}
        {selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
          />
        )}

        {/* VIEW 7: DETAILED EXPANDED PROJECT STATE */}
        {selectedProject && (
          <ProjectDetail
            project={selectedProject}
            onBack={() => setSelectedProject(null)}
          />
        )}

        {/* VIEW 8: ADMIN WORKSPACE CONSOLE */}
        {currentTab === "admin" && (
          <AdminPortal
            token={adminToken}
            onSessionChange={handleAdminSessionChange}
            onRefreshData={fetchData}
            products={products}
            projects={projects}
          />
        )}

      </main>

      {/* FOOTER COMPONENT - Matches standard design layout */}
      <footer className="bg-[#1A1A1A] text-white pt-16 pb-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-stone-800">
          
          {/* Column 1: Company Meta */}
          <div className="md:col-span-6 space-y-4">
            <span className="text-xl font-serif font-extrabold uppercase tracking-tight text-white block leading-none">
              Rasik D Chitroda
            </span>
            <p className="text-xs text-stone-400 leading-relaxed max-w-md font-sans font-light">
              Gujarat's most trusted furniture manufacturer. Crafting monumental, reliable, and precise furniture for government and private sectors since 2008.
            </p>
            <div className="flex items-center space-x-2 text-[10px] text-stone-500 font-mono">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
              <span>ESTD 2008 • VERIFIED GUJARAT SUPPLIER TENDER</span>
            </div>
          </div>

          {/* Column 2: Quick navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase text-[#A67C52] tracking-widest font-bold">Quick Links</h4>
            <div className="grid grid-cols-1 gap-2 text-xs text-stone-400 font-medium">
              <Link to="/" onClick={() => { setSelectedProduct(null); setSelectedProject(null); }} className="text-left hover:text-white transition duration-150 cursor-pointer block">Home</Link>
              <Link to="/products" onClick={() => { setSelectedProduct(null); setSelectedProject(null); }} className="text-left hover:text-white transition duration-150 cursor-pointer block">Products</Link>
              <Link to="/projects" onClick={() => { setSelectedProduct(null); setSelectedProject(null); }} className="text-left hover:text-white transition duration-150 cursor-pointer block">Projects</Link>
              <Link to="/about" onClick={() => { setSelectedProduct(null); setSelectedProject(null); }} className="text-left hover:text-white transition duration-150 cursor-pointer block">About Us</Link>
              <Link to="/contact" onClick={() => { setSelectedProduct(null); setSelectedProject(null); }} className="text-left hover:text-white transition duration-150 cursor-pointer block">Contact</Link>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase text-[#A67C52] tracking-widest font-bold text-stone-400">Contact</h4>
            <div className="space-y-2 text-xs text-stone-400">
              <p className="flex items-start">
                <MapPin size={14} className="text-[#A67C52] mr-2 shrink-0 mt-0.5" />
                <span>Ahmedabad, Gujarat, India</span>
              </p>
              <p className="flex items-center">
                <Mail size={14} className="text-[#A67C52] mr-2 shrink-0" />
                <span>office.rasikdchitroda@gmail.com</span>
              </p>
              <p className="flex items-center">
                <Phone size={14} className="text-[#A67C52] mr-2 shrink-0" />
                <span>+91 96386 16995</span>
              </p>
            </div>
          </div>

        </div>

        {/* Footer legalities and admin portal entrance - matches Screenshot 8 footer */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-stone-500 font-sans">
          <p>© 2026 Rasik D Chitroda. All rights reserved.</p>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <button 
              onClick={() => { setCurrentTab("admin"); setSelectedProduct(null); setSelectedProject(null); }} 
              className="hover:text-white transition duration-150 font-semibold uppercase tracking-wider flex items-center cursor-pointer"
            >
              <FileText size={11} className="mr-1 inline" /> Admin Portal
            </button>
          </div>
        </div>

      </footer>

    </div>
  );
}
