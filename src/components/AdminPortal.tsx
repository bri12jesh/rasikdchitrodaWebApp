import React, { useState } from "react";
import { Trash2, Plus, Upload, Tag, Calendar, MapPin, Briefcase, FileText, CheckCircle, Package, LogOut, Edit3, X, Image as ImageIcon } from "lucide-react";
import { Product, Project } from "../types";

export interface AdminPortalProps {
  onSessionChange: (token: string | null) => void;
  token: string | null;
  onRefreshData: () => void;
  products: Product[];
  projects: Project[];
}

export default function AdminPortal({
  onSessionChange,
  token,
  onRefreshData,
  products,
  projects
}: AdminPortalProps) {
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"products" | "projects">("products");

  // Edit identifier state
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  // Product Form State
  const [prodTitle, setProdTitle] = useState("");
  const [prodCategory, setProdCategory] = useState("Office Furniture");
  const [prodPriceMin, setProdPriceMin] = useState(10000);
  const [prodPriceMax, setProdPriceMax] = useState(50000);
  const [prodDesc, setProdDesc] = useState("");
  const [prodImage, setProdImage] = useState("");
  const [prodFeatures, setProdFeatures] = useState<string[]>([""]);
  const [prodSpecs, setProdSpecs] = useState<Array<{ name: string; value: string }>>([
    { name: "Material", value: "Solid Premium Teak" },
    { name: "Dimensions", value: "180 × 90 × 76 cm" },
    { name: "Finish", value: "Natural Walnut Polish" }
  ]);

  // Project Form State
  const [projTitle, setProjTitle] = useState("");
  const [projCategory, setProjCategory] = useState("Office Furniture");
  const [projDesc, setProjDesc] = useState("");
  const [projImage, setProjImage] = useState("");
  const [projClient, setProjClient] = useState("");
  const [projLocation, setProjLocation] = useState("Ahmedabad, Gujarat");
  const [projYear, setProjYear] = useState(2025);
  const [projContract, setProjContract] = useState("Government Contract");
  const [projGalleryUrls, setProjGalleryUrls] = useState<string[]>([]);

  // Bulk Workspace State
  const [showBulkWorkspace, setShowBulkWorkspace] = useState(false);
  const [workspaceFiles, setWorkspaceFiles] = useState<string[]>([]);
  const [workspaceLoading, setWorkspaceLoading] = useState(false);

  // Upload helpers
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [bulkProgress, setBulkProgress] = useState<string | null>(null);

  const handleBulkFileUploadForGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    setBulkProgress(`Uploading ${files.length} images to local server...`);
    try {
      const res = await fetch("/api/upload-bulk", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.urls && data.urls.length > 0) {
        setProjGalleryUrls(prev => [...prev.filter(url => url.trim() !== ""), ...data.urls]);
        setBulkProgress(`Successfully uploaded and appended ${data.urls.length} images!`);
      } else {
        setBulkProgress("Bulk upload failed.");
      }
    } catch (err) {
      setBulkProgress("Bulk upload connection error.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (data.success) {
        onSessionChange(data.token);
      } else {
        setLoginError(data.message || "Invalid password credential.");
      }
    } catch (err) {
      setLoginError("Could not connect to backend server validation.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "product" | "project" | "gallery", galleryIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploadProgress("Uploading file...");
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        if (target === "product") {
          setProdImage(data.url);
        } else if (target === "project") {
          setProjImage(data.url);
        } else if (target === "gallery" && typeof galleryIndex === "number") {
          const updated = [...projGalleryUrls];
          updated[galleryIndex] = data.url;
          setProjGalleryUrls(updated);
        }
        setUploadProgress("Uploaded successfully!");
      } else {
        setUploadProgress("Upload failed.");
      }
    } catch (err) {
      setUploadProgress("Upload error occurred.");
    }
  };

  const addFeatureInput = () => {
    setProdFeatures([...prodFeatures, ""]);
  };

  const removeFeatureInput = (index: number) => {
    const updated = [...prodFeatures];
    updated.splice(index, 1);
    setProdFeatures(updated);
  };

  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...prodFeatures];
    updated[index] = val;
    setProdFeatures(updated);
  };

  const addSpecInput = () => {
    setProdSpecs([...prodSpecs, { name: "", value: "" }]);
  };

  const removeSpecInput = (index: number) => {
    const updated = [...prodSpecs];
    updated.splice(index, 1);
    setProdSpecs(updated);
  };

  const handleSpecChange = (index: number, type: "name" | "value", val: string) => {
    const updated = [...prodSpecs];
    updated[index][type] = val;
    setProdSpecs(updated);
  };

  // Gallery URLs Management for Projects Form
  const addGalleryUrl = () => {
    setProjGalleryUrls([...projGalleryUrls, ""]);
  };

  const removeGalleryUrl = (index: number) => {
    const updated = [...projGalleryUrls];
    updated.splice(index, 1);
    setProjGalleryUrls(updated);
  };

  const handleGalleryUrlChange = (index: number, val: string) => {
    const updated = [...projGalleryUrls];
    updated[index] = val;
    setProjGalleryUrls(updated);
  };

  // Safe reset utilities
  const resetProductForm = () => {
    setEditingProductId(null);
    setProdTitle("");
    setProdCategory("Office Furniture");
    setProdPriceMin(10000);
    setProdPriceMax(50000);
    setProdDesc("");
    setProdImage("");
    setProdFeatures([""]);
    setProdSpecs([
      { name: "Material", value: "Solid Premium Teak" },
      { name: "Dimensions", value: "180 × 90 × 76 cm" },
      { name: "Finish", value: "Natural Walnut Polish" }
    ]);
    setUploadProgress(null);
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjTitle("");
    setProjCategory("Office Furniture");
    setProjDesc("");
    setProjImage("");
    setProjClient("");
    setProjLocation("Ahmedabad, Gujarat");
    setProjYear(2025);
    setProjContract("Government Contract");
    setProjGalleryUrls([]);
    setUploadProgress(null);
  };

  const startEditProduct = (p: Product) => {
    setEditingProductId(p.id ?? null);
    setProdTitle(p.title);
    setProdCategory(p.category || "Office Furniture");
    setProdPriceMin(p.price_min || 10000);
    setProdPriceMax(p.price_max || 50000);
    setProdDesc(p.description || "");
    setProdImage(p.image_url || "");
    
    const list = Array.isArray(p.key_features) ? p.key_features : [];
    setProdFeatures(list.length > 0 ? list : [""]);

    const specEntries = p.specs && typeof p.specs === "object"
      ? Object.entries(p.specs).map(([name, value]) => ({ name, value }))
      : [];
    setProdSpecs(specEntries.length > 0 ? specEntries : [
      { name: "Material", value: "Solid Premium Teak" },
      { name: "Dimensions", value: "180 × 90 × 76 cm" },
      { name: "Finish", value: "Natural Walnut Polish" }
    ]);

    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const startEditProject = (pj: Project) => {
    setEditingProjectId(pj.id ?? null);
    setProjTitle(pj.title);
    setProjCategory(pj.category || "Office Furniture");
    setProjDesc(pj.description || "");
    setProjImage(pj.image_url || "");
    setProjClient(pj.client || "");
    setProjLocation(pj.location || "Ahmedabad, Gujarat");
    setProjYear(pj.completed_year || 2025);
    setProjContract(pj.contract_type || "Government Contract");

    const gallList = Array.isArray(pj.gallery_urls) ? pj.gallery_urls : [];
    setProjGalleryUrls(gallList);

    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodTitle || !prodDesc) {
      alert("Please enter title and description components");
      return;
    }

    try {
      const specObj: Record<string, string> = {};
      prodSpecs.forEach(s => {
        if (s.name.trim()) specObj[s.name.trim()] = s.value;
      });

      const filteredFeatures = prodFeatures.filter(f => f.trim() !== "");

      const url = editingProductId ? `/api/products/${editingProductId}` : "/api/products";
      const method = editingProductId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth: token,
          title: prodTitle,
          category: prodCategory,
          price_min: prodPriceMin,
          price_max: prodPriceMax,
          description: prodDesc,
          image_url: prodImage || "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800",
          key_features: filteredFeatures,
          specs: specObj
        })
      });

      if (res.ok) {
        alert(editingProductId ? "Product changes saved precisely." : "Product added to catalog successfully!");
        resetProductForm();
        onRefreshData();
      } else {
        alert("Unable to save product.");
      }
    } catch (err) {
      alert("Error saving item.");
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projDesc || !projClient) {
      alert("Required title, client, and description values.");
      return;
    }

    try {
      const filteredGallery = projGalleryUrls.filter(u => u.trim() !== "");

      const url = editingProjectId ? `/api/projects/${editingProjectId}` : "/api/projects";
      const method = editingProjectId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auth: token,
          title: projTitle,
          category: projCategory,
          description: projDesc,
          image_url: projImage || "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=1200",
          client: projClient,
          location: projLocation,
          completed_year: projYear,
          contract_type: projContract,
          gallery_urls: filteredGallery
        })
      });

      if (res.ok) {
        alert(editingProjectId ? "Project updated perfectly!" : "Project saved successfully!");
        resetProjectForm();
        onRefreshData();
      } else {
        alert("Failed to write project state.");
      }
    } catch (err) {
      alert("Network exception creating project.");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: { "Authorization": token || "" }
      });
      if (res.ok) {
        onRefreshData();
      } else {
        alert("Couldn't remove.");
      }
    } catch (err) {
      alert("Delete exception.");
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { "Authorization": token || "" }
      });
      if (res.ok) {
        onRefreshData();
      } else {
        alert("Couldn't remove project.");
      }
    } catch (err) {
      alert("Error processing project deletion.");
    }
  };

  if (!token) {
    return (
      <div className="py-24 max-w-md mx-auto p-4 font-sans">
        <div className="bg-white border border-[#E5E1D9] rounded p-8 shadow-sm">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-serif text-[#1A1A1A] tracking-tight font-medium">Administration Portal</h2>
            <p className="text-xs text-[#A67C52] tracking-widest uppercase mt-2 font-medium">Rasik D Chitroda Furniture</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Enter Master Password</label>
              <input
                type="password"
                id="admin-password-input"
                name="admin-password"
                placeholder="Enter Password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setLoginError("");
                }}
                className="w-full px-3 py-2 border border-stone-200 rounded focus:ring-1 focus:ring-[#A67C52] focus:border-[#A67C52] outline-none text-[#1A1A1A] bg-[#FAF8F5]"
              />
            </div>
            {loginError && <p className="text-xs text-red-600 font-medium ">{loginError}</p>}
            <button
              type="submit"
              className="w-full py-2 bg-[#A67C52] hover:bg-[#A67C52]/90 text-white font-medium uppercase text-xs tracking-wider transition-colors duration-200 cursor-pointer rounded-sm"
            >
              Authorize Access
            </button>
          </form>
          <div className="mt-6 pt-4 border-t border-dashed border-stone-200 text-center text-xs text-stone-400">
            Secure admin connection. Only authorized managers allowed. Password is 'Bri@12JesH'.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b pb-4 border-stone-200">
        <div>
          <span className="text-xs tracking-widest text-[#A67C52] uppercase font-semibold">Workspace Console</span>
          <h1 className="text-4xl font-serif tracking-tight text-[#1A1A1A]">Industrial Dashboard</h1>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-medium border border-emerald-250">Authorized Session</span>
          <button
            onClick={() => onSessionChange(null)}
            className="flex items-center text-xs text-stone-500 hover:text-red-700 font-semibold px-3 py-1.5 border border-stone-300 rounded transition-all cursor-pointer bg-white"
          >
            <LogOut size={14} className="mr-1.5" /> Log Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-2">
          <button
            onClick={() => {
              setActiveSubTab("products");
              setEditingProductId(null);
            }}
            className={`w-full flex items-center justify-between p-3.5 rounded text-left transition-all cursor-pointer ${
              activeSubTab === "products"
                ? "bg-[#A67C52] text-white shadow font-medium"
                : "bg-white border border-stone-200 text-stone-700 hover:bg-[#FAF8F5]"
            }`}
          >
            <span className="flex items-center text-sm"><Package size={16} className="mr-2" /> Product Inventory</span>
            <span className="bg-[#FAF8F5] text-stone-800 text-xs px-2 py-0.5 rounded-full font-mono font-bold">{products.length}</span>
          </button>
          <button
            onClick={() => {
              setActiveSubTab("projects");
              setEditingProjectId(null);
            }}
            className={`w-full flex items-center justify-between p-3.5 rounded text-left transition-all cursor-pointer ${
              activeSubTab === "projects"
                ? "bg-[#A67C52] text-white shadow font-medium"
                : "bg-white border border-stone-200 text-stone-700 hover:bg-[#FAF8F5]"
            }`}
          >
            <span className="flex items-center text-sm"><Briefcase size={16} className="mr-2" /> Project Portfolio</span>
            <span className="bg-[#FAF8F5] text-stone-800 text-xs px-2 py-0.5 rounded-full font-mono font-bold">{projects.length}</span>
          </button>
        </div>

        {/* Dynamic Form Area */}
        <div className="lg:col-span-9 space-y-8 animate-fadeIn">

          {/* Local Bulk Image Upload Workspace */}
          <div className="bg-gradient-to-r from-stone-50 to-[#FAF8F5] border border-[#E5E1D9] rounded p-5 shadow-sm">
            <div 
              className="flex items-center justify-between cursor-pointer select-none" 
              onClick={() => setShowBulkWorkspace(!showBulkWorkspace)}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-[#A67C52]/10 text-[#A67C52] p-2 rounded-sm border border-[#A67C52]/20">
                  <Upload size={20} />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-[#1A1A1A] font-serif tracking-tight flex items-center">
                    ⚡ Bulk Image Upload Workspace
                    <span className="ml-2 text-[10px] bg-amber-100 text-[#A67C52] font-semibold font-sans px-2 py-0.5 rounded-full uppercase tracking-wider">Production tool</span>
                  </h4>
                  <p className="text-[11px] text-[#A67C52] font-medium mt-0.5">Upload multiple photos simultaneously directly to your server, auto-copy links, or assign them instantly to forms & portfolio</p>
                </div>
              </div>
              <button 
                type="button"
                className="text-xs text-[#A67C52] font-semibold hover:underline bg-white px-3 py-1.5 border border-[#E5E1D9] rounded shadow-xs cursor-pointer select-none"
              >
                {showBulkWorkspace ? "Collapse Tool" : "Expand Tool"}
              </button>
            </div>

            {showBulkWorkspace && (
              <div className="mt-5 border-t border-dashed border-stone-200 pt-5 space-y-4 animate-fadeIn">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white border border-dashed border-[#E5E1D9] rounded hover:border-[#A67C52]/50 transition-colors duration-200">
                  <div className="flex items-center space-x-3 text-left">
                    <ImageIcon className="text-[#A67C52]/70 shrink-0" size={24} />
                    <div>
                      <span className="text-xs font-bold text-stone-700 block">Select or Drag Multiple Images Together</span>
                      <span className="text-[10px] text-stone-400">Supports up to 20 files (JPG, PNG, WEBP) sequentially upload in parallel</span>
                    </div>
                  </div>
                  <label className="bg-[#A67C52] hover:bg-[#A67C52]/90 text-white font-medium text-xs px-4 py-2.5 rounded transition-colors duration-200 cursor-pointer flex items-center shrink-0 shadow-sm uppercase tracking-wider font-semibold">
                    <Upload size={14} className="mr-2" /> Upload Multiple Images
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        setWorkspaceLoading(true);
                        const formData = new FormData();
                        for (let i = 0; i < files.length; i++) {
                          formData.append("images", files[i]);
                        }
                        try {
                          const res = await fetch("/api/upload-bulk", {
                            method: "POST",
                            body: formData
                          });
                          if (!res.ok) throw new Error("Bulk upload issue");
                          const data = await res.json();
                          if (data.urls && Array.isArray(data.urls)) {
                            setWorkspaceFiles(prev => [...data.urls, ...prev]);
                          } else {
                            alert("Upload encountered issues. Please verify selected files.");
                          }
                        } catch (err) {
                          alert("Bulk upload failed. Server might be running in fallback mode or storage is full.");
                        } finally {
                          setWorkspaceLoading(false);
                        }
                      }}
                    />
                  </label>
                </div>

                {workspaceLoading && (
                  <div className="text-xs text-[#A67C52] font-semibold flex items-center justify-center py-2.5 animate-pulse bg-white border border-[#E5E1D9] rounded">
                    Uploading files safely... Saving and optimizing high resolution photos...
                  </div>
                )}

                {workspaceFiles.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-stone-500 font-mono">Uploaded Assets ({workspaceFiles.length})</span>
                      <button
                        type="button"
                        onClick={() => setWorkspaceFiles([])}
                        className="text-[10px] text-red-600 hover:underline font-bold font-sans cursor-pointer"
                      >
                        Clear Assets List
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {workspaceFiles.map((url, i) => (
                        <div key={i} className="bg-white border border-[#E5E1D9] rounded p-2.5 flex flex-col justify-between shadow-xs animate-fadeIn">
                          <div className="relative group aspect-square bg-stone-100 rounded overflow-hidden mb-2 border border-stone-100">
                            <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <a href={url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-medium underline font-sans">
                              View Original
                            </a>
                          </div>
                          <div className="space-y-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(url);
                                alert("Image URL successfully copied to clipboard.");
                              }}
                              className="w-full text-center py-1.5 bg-stone-100 hover:bg-[#A67C52]/10 hover:text-[#A67C52] border border-stone-200 text-[10px] font-bold rounded transition-colors duration-150 cursor-pointer"
                            >
                              📋 Copy URL
                            </button>
                            <div className="grid grid-cols-3 gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setProdImage(url);
                                  alert("Assigned to Product Main Image slot.");
                                }}
                                className="py-1 bg-stone-50 hover:bg-[#A67C52]/10 border border-stone-200 text-[8px] font-bold rounded text-stone-700 transition"
                                title="Assign to product main photo field"
                              >
                                Prod
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setProjImage(url);
                                  alert("Assigned to Project Main Banner slot.");
                                }}
                                className="py-1 bg-stone-50 hover:bg-[#A67C52]/10 border border-stone-200 text-[8px] font-bold rounded text-stone-700 transition"
                                title="Assign to project main banner field"
                              >
                                Proj
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setProjGalleryUrls(prev => [...prev.filter(u => u.trim() !== ""), url]);
                                  alert("Appended directly to Project Gallery selection.");
                                }}
                                className="py-1 bg-stone-50 hover:bg-emerald-50 hover:text-emerald-700 border border-stone-200 text-[8px] font-bold rounded text-stone-700 transition"
                                title="Append directly to Active Project Gallery"
                              >
                                +Gall
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {activeSubTab === "products" ? (
            <div className="space-y-8">
              {/* Add/Edit Product Form */}
              <div className={`bg-white border rounded p-6 shadow-sm transition-all duration-300 ${
                editingProductId ? "border-amber-500 ring-2 ring-amber-500/20" : "border-[#E5E1D9]"
              }`}>
                <div className="flex items-center justify-between border-b pb-2 mb-4">
                  <h3 className="text-lg font-serif text-[#1A1A1A] flex items-center">
                    {editingProductId ? (
                      <>
                        <Edit3 size={18} className="mr-2 text-amber-600" />
                        Edit Product <span className="text-amber-700 ml-1.5 font-sans font-bold text-sm">#{editingProductId}</span>
                      </>
                    ) : (
                      <>
                        <Plus size={18} className="mr-2 text-[#A67C52]" />
                        Add New Craft Product
                      </>
                    )}
                  </h3>
                  {editingProductId && (
                    <button 
                      type="button"
                      onClick={resetProductForm}
                      className="text-xs text-stone-400 hover:text-stone-700 flex items-center border border-stone-200 rounded px-2.5 py-1 bg-stone-50 cursor-pointer font-medium"
                    >
                      <X size={12} className="mr-1" /> Reset / Create New
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        value={prodTitle}
                        onChange={e => setProdTitle(e.target.value)}
                        placeholder="e.g. Classic Teak Dining Bench"
                        className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-[#A67C52] focus:border-[#A67C52] outline-none text-[#1A1A1A] text-sm bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Catalog Category</label>
                      <select
                        value={prodCategory}
                        onChange={e => setProdCategory(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-[#A67C52] focus:border-[#A67C52] outline-none text-[#1A1A1A] text-sm bg-white cursor-pointer"
                      >
                        <option>Office Furniture</option>
                        <option>School Furniture</option>
                        <option>Hospital Furniture</option>
                        <option>Court Furniture</option>
                        <option>Hotel Furniture</option>
                        <option>Residential Furniture</option>
                        <option>Library Furniture</option>
                        <option>Laboratory Furniture</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Price Range Minimum (₹)</label>
                      <input
                        type="number"
                        value={prodPriceMin}
                        onChange={e => setProdPriceMin(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded text-sm text-[#1A1A1A] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Price Range Maximum (₹)</label>
                      <input
                        type="number"
                        value={prodPriceMax}
                        onChange={e => setProdPriceMax(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded text-sm text-[#1A1A1A] bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Product Image (Physical image upload or custom link)</label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <input
                        type="text"
                        value={prodImage}
                        onChange={e => setProdImage(e.target.value)}
                        placeholder="Path /uploads/file.png or external link"
                        className="flex-1 px-3 py-2 border rounded text-sm text-[#1A1A1A] bg-white"
                      />
                      <label className="flex items-center justify-center bg-stone-100 border border-stone-300 hover:border-stone-400 rounded px-4 py-2 cursor-pointer transition text-xs font-medium text-stone-700">
                        <Upload size={14} className="mr-2" /> Upload Photo
                        <input
                           type="file"
                           accept="image/*"
                           onChange={e => handleFileUpload(e, "product")}
                           className="hidden"
                        />
                      </label>
                    </div>
                    {uploadProgress && <p className="text-xs text-[#A67C52] mt-1 font-medium">{uploadProgress}</p>}
                    {prodImage && (
                      <div className="mt-2 text-xs text-stone-400 flex items-center">
                        <CheckCircle size={12} className="text-emerald-600 mr-1" /> Active path: <span className="font-mono text-[10px] ml-1 bg-stone-100 p-0.5">{prodImage}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Description *</label>
                    <textarea
                      rows={3}
                      required
                      value={prodDesc}
                      onChange={e => setProdDesc(e.target.value)}
                      placeholder="Comprehensive description containing engineering value..."
                      className="w-full px-3 py-2 border text-[#1A1A1A] text-sm bg-white rounded"
                    />
                  </div>

                  {/* Key Features Inputs */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-stone-600 uppercase">Key Features Checklist</label>
                      <button
                        type="button"
                        onClick={addFeatureInput}
                        className="text-[11px] text-[#A67C52] hover:underline flex items-center font-bold cursor-pointer"
                      >
                        <Plus size={11} className="mr-0.5" /> Adjoin row
                      </button>
                    </div>
                    <div className="space-y-2">
                      {prodFeatures.map((feat, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={feat}
                            onChange={e => handleFeatureChange(index, e.target.value)}
                            placeholder={`Feature Checklist #${index + 1}`}
                            className="flex-1 px-3 py-1.5 border rounded text-xs text-[#1A1A1A] bg-white"
                          />
                          {prodFeatures.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFeatureInput(index)}
                              className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Specifications Grid Inputs */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-stone-600 uppercase">Technical Specifications Sheet</label>
                      <button
                        type="button"
                        onClick={addSpecInput}
                        className="text-[11px] text-[#A67C52] hover:underline flex items-center font-bold cursor-pointer"
                      >
                        <Plus size={11} className="mr-0.5" /> Append parameter
                      </button>
                    </div>
                    <div className="space-y-2">
                      {prodSpecs.map((spec, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="Aspect (e.g. Dimensions)"
                            value={spec.name}
                            onChange={e => handleSpecChange(index, "name", e.target.value)}
                            className="w-1/3 px-3 py-1.5 border rounded text-xs text-[#1A1A1A] bg-white"
                          />
                          <input
                            type="text"
                            placeholder="Specification value"
                            value={spec.value}
                            onChange={e => handleSpecChange(index, "value", e.target.value)}
                            className="flex-1 px-3 py-1.5 border rounded text-xs text-[#1A1A1A] bg-white"
                          />
                          {prodSpecs.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSpecInput(index)}
                              className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="py-2.5 px-6 bg-[#A67C52] hover:bg-[#A67C52]/90 text-white rounded font-medium uppercase text-xs tracking-wider transition duration-150 shadow-sm cursor-pointer"
                    >
                      {editingProductId ? "Save Changes" : "Commit Product to Database"}
                    </button>
                    {editingProductId && (
                      <button
                        type="button"
                        onClick={resetProductForm}
                        className="py-2.5 px-6 border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 rounded font-medium uppercase text-xs tracking-wider transition cursor-pointer"
                      >
                        Cancel Editing
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Active Product Inventory List */}
              <div className="bg-white border border-stone-200 rounded p-6 shadow-sm">
                <h3 className="text-lg font-serif text-[#1A1A1A] mb-4">Current Registered Products ({products.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 uppercase tracking-wider font-bold">
                        <th className="py-2.5 px-3">Thumbnail</th>
                        <th className="py-2.5 px-3">Title</th>
                        <th className="py-2.5 px-3">Category</th>
                        <th className="py-2.5 px-3">Estimated Price</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {products.map(p => (
                        <tr key={p.id} className={`hover:bg-stone-50 text-[#1A1A1A] ${editingProductId === p.id ? "bg-amber-50/50" : ""}`}>
                          <td className="py-2 px-3">
                            <img
                              src={p.image_url}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 object-cover rounded border border-stone-200"
                            />
                          </td>
                          <td className="py-2 px-3 font-semibold text-sm">
                            {p.title}
                            {editingProductId === p.id && (
                              <span className="ml-2 inline-block text-[9px] font-bold text-amber-800 bg-amber-100 uppercase px-1.5 py-0.5 rounded-sm">Currently Editing</span>
                            )}
                          </td>
                          <td className="py-2 px-3">
                            <span className="bg-stone-100 text-stone-800 px-2 py-0.5 rounded text-[10px] font-medium border uppercase">{p.category}</span>
                          </td>
                          <td className="py-2 px-3 font-mono text-stone-700">₹{p.price_min?.toLocaleString()} - ₹{p.price_max?.toLocaleString()}</td>
                          <td className="py-2 px-3 text-right space-x-1.5">
                            <button
                              onClick={() => startEditProduct(p)}
                              className="text-stone-500 hover:text-[#A67C52] p-2 transition-colors duration-150 inline-flex items-center border border-stone-200 hover:border-[#A67C52]/40 rounded bg-white cursor-pointer"
                              title="Edit product spec sheet"
                            >
                              <Edit3 size={13} className="mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id!)}
                              className="text-stone-400 hover:text-red-600 p-2 transition-colors duration-150 border border-stone-200 hover:border-red-200 rounded bg-white cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-stone-400">No active products found in inventory.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 col-span-1">
              {/* Add/Edit Project Form */}
              <div className={`bg-white border rounded p-6 shadow-sm transition-all duration-300 ${
                editingProjectId ? "border-amber-500 ring-2 ring-amber-500/20" : "border-[#E5E1D9]"
              }`}>
                <div className="flex items-center justify-between border-b pb-2 mb-4">
                  <h3 className="text-lg font-serif text-[#1A1A1A] flex items-center">
                    {editingProjectId ? (
                      <>
                        <Edit3 size={18} className="mr-2 text-amber-600" />
                        Edit Project Case Study <span className="text-amber-700 ml-1.5 font-sans font-bold text-sm">#{editingProjectId}</span>
                      </>
                    ) : (
                      <>
                        <Plus size={18} className="mr-2 text-[#A67C52]" />
                        Register Corporate/Govt Project Outfitting
                      </>
                    )}
                  </h3>
                  {editingProjectId && (
                    <button 
                      type="button"
                      onClick={resetProjectForm}
                      className="text-xs text-stone-400 hover:text-stone-700 flex items-center border border-stone-200 rounded px-2.5 py-1 bg-stone-50 cursor-pointer font-medium"
                    >
                      <X size={12} className="mr-1" /> Reset / Register New
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveProject} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Project Title/Name *</label>
                      <input
                        type="text"
                        required
                        value={projTitle}
                        onChange={e => setProjTitle(e.target.value)}
                        placeholder="e.g. Vadodara Luxury Resort Suite Upgrade"
                        className="w-full px-3 py-2 border rounded text-sm text-[#1A1A1A] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase mb-1 font-serif">Category Segment</label>
                      <select
                        value={projCategory}
                        onChange={e => setProjCategory(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-sm text-[#1A1A1A] bg-white cursor-pointer"
                      >
                        <option>Office Furniture</option>
                        <option>School Furniture</option>
                        <option>Hospital Furniture</option>
                        <option>Court Furniture</option>
                        <option>Hotel Furniture</option>
                        <option>Residential Furniture</option>
                        <option>Library Furniture</option>
                        <option>Laboratory Furniture</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase mb-1 text-stone-500">Contract Designation</label>
                      <select
                        value={projContract}
                        onChange={e => setProjContract(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-sm text-[#1A1A1A] cursor-pointer bg-white"
                      >
                        <option>Government Contract</option>
                        <option>Private Contract</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Client Organization *</label>
                      <input
                        type="text"
                        required
                        value={projClient}
                        onChange={e => setProjClient(e.target.value)}
                        placeholder="e.g. Gujarat Educational Board Authority"
                        className="w-full px-3 py-2 border rounded text-sm text-[#1A1A1A] bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Execution Location</label>
                      <input
                        type="text"
                        value={projLocation}
                        onChange={e => setProjLocation(e.target.value)}
                        placeholder="e.g. Gandhinagar, Gujarat"
                        className="w-full px-3 py-2 border rounded text-sm text-[#1A1A1A] bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Completed Year</label>
                      <input
                        type="number"
                        value={projYear}
                        onChange={e => setProjYear(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded text-sm text-[#1A1A1A] bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Project Layout Banner Photo</label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                      <input
                        type="text"
                        value={projImage}
                        onChange={e => setProjImage(e.target.value)}
                        placeholder="Path /uploads/project_photo.png or unsplash URL"
                        className="flex-1 px-3 py-2 border rounded text-sm text-[#1A1A1A] bg-white"
                      />
                      <label className="flex items-center justify-center bg-stone-100 border border-stone-300 hover:border-stone-400 rounded px-4 py-2 cursor-pointer transition text-xs font-medium text-stone-700">
                        <Upload size={14} className="mr-2" /> Upload Banner
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleFileUpload(e, "project")}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* PROJECT MULTI-IMAGE GALLERY INTERACTIVE INTERFACE */}
                  <div className="bg-[#FAF8F5] p-4 rounded border border-[#E5E1D9] space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#A67C52] tracking-wider block font-sans">Multi-Photo Showcase</span>
                        <h4 className="text-sm font-serif font-bold text-[#1A1A1A] flex items-center">
                          <ImageIcon size={14} className="mr-1.5 text-[#A67C52]" /> Project Gallery ({projGalleryUrls.length} images)
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs bg-[#A67C52] hover:bg-[#A67C52]/90 text-white px-3 py-1.5 rounded transition duration-150 flex items-center font-bold cursor-pointer shadow-sm uppercase tracking-wider text-[10px]">
                          <Upload size={11} className="mr-1" /> ⚡ Bulk Upload
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleBulkFileUploadForGallery}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={addGalleryUrl}
                          className="text-xs bg-white text-[#A67C52] hover:text-[#A67C52]/85 px-3 py-1.5 border border-[#E5E1D9] hover:border-[#A67C52]/30 rounded transition flex items-center font-bold cursor-pointer"
                        >
                          <Plus size={11} className="mr-1" /> Add Empty Row
                        </button>
                      </div>
                    </div>

                    {bulkProgress && (
                      <p className="text-xs text-[#A67C52] bg-white border border-[#E5E1D9] p-2 rounded text-center font-medium animate-pulse">
                        {bulkProgress}
                      </p>
                    )}

                    <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                      Upload physical detail macro-shots or supply external image URLs. Click <b>⚡ Bulk Upload</b> to upload multiple images at once and instantly append them to the gallery below.
                    </p>

                    <div className="space-y-3">
                      {projGalleryUrls.map((gUrl, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white p-2.5 rounded border border-stone-100 shadow-sm">
                          
                          {/* Image preview slot */}
                          <div className="h-10 w-16 bg-stone-100 rounded overflow-hidden flex items-center justify-center border shrink-0">
                            {gUrl ? (
                              <img src={gUrl} alt="prev" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                            ) : (
                              <span className="text-[9px] text-stone-400 font-mono">NO IMAGE</span>
                            )}
                          </div>

                          {/* URL input text */}
                          <input
                            type="text"
                            placeholder="Detail Image path or URL"
                            value={gUrl}
                            onChange={e => handleGalleryUrlChange(idx, e.target.value)}
                            className="flex-1 px-2 py-1.5 border rounded text-xs text-[#1A1A1A]"
                          />

                          {/* Individual Upload element */}
                          <label className="flex items-center justify-center bg-stone-50 border hover:bg-stone-100 rounded px-2.5 py-1.5 cursor-pointer text-[11px] text-stone-700 transition font-medium">
                            <Upload size={12} className="mr-1" /> Upload Image
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleFileUpload(e, "gallery", idx)}
                              className="hidden"
                            />
                          </label>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => removeGalleryUrl(idx)}
                            className="text-stone-400 hover:text-red-600 p-1 rounded hover:bg-red-50 text-xs inline-flex items-center justify-center shrink-0"
                            title="Remove Photo"
                          >
                            <Trash2 size={13} />
                          </button>

                        </div>
                      ))}

                      {projGalleryUrls.length === 0 && (
                        <div className="border border-dashed border-[#E5E1D9] bg-white p-6 text-center text-xs text-stone-400 rounded">
                          No gallery images defined. Click "Add Empty Row" or upload files to configure installation photos!
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-600 uppercase mb-1">Detailed Case Study Description *</label>
                    <textarea
                      rows={4}
                      required
                      value={projDesc}
                      onChange={e => setProjDesc(e.target.value)}
                      placeholder="Discuss construction techniques, architectural scale, and user satisfaction details"
                      className="w-full px-3 py-2 border rounded text-sm text-[#201611] bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      className="py-2.5 px-6 bg-[#A67C52] hover:bg-[#A67C52]/90 text-white rounded font-medium uppercase text-xs tracking-wider transition duration-150 shadow-sm cursor-pointer"
                    >
                      {editingProjectId ? "Modify Case Study" : "Commit Project Case Study"}
                    </button>
                    {editingProjectId && (
                      <button
                        type="button"
                        onClick={resetProjectForm}
                        className="py-2.5 px-6 border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 rounded font-medium uppercase text-xs tracking-wider transition cursor-pointer"
                      >
                        Cancel Modification
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Active Portfolio Lists */}
              <div className="bg-white border border-stone-200 rounded p-6 shadow-sm">
                <h3 className="text-lg font-serif text-[#1A1A1A] mb-4 font-semibold">Registered Works / Handcrafted Contracts ({projects.length})</h3>
                <div className="overflow-x-auto overflow-y-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 uppercase tracking-wider font-bold">
                        <th className="py-2.5 px-3">Photo</th>
                        <th className="py-2.5 px-3">Project Title</th>
                        <th className="py-2.5 px-3">Contract Nature</th>
                        <th className="py-2.5 px-3">Client</th>
                        <th className="py-2.5 px-3">Gallery images</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {projects.map(pj => (
                        <tr key={pj.id} className={`hover:bg-stone-50 text-[#1A1A1A] ${editingProjectId === pj.id ? "bg-amber-50/50" : ""}`}>
                          <td className="py-2 px-3">
                            <img
                              src={pj.image_url}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 object-cover rounded border border-stone-200"
                            />
                          </td>
                          <td className="py-2 px-3 font-semibold text-sm">
                            <div>{pj.title}</div>
                            <div className="text-[10px] text-[#A67C52] italic font-medium flex items-center mt-0.5">
                              <MapPin size={9} className="mr-0.5 inline" /> {pj.location}
                            </div>
                            {editingProjectId === pj.id && (
                              <span className="inline-block mt-1 text-[8px] font-bold text-amber-800 bg-amber-100 uppercase px-1 py-0.5 rounded-sm">Editing in form</span>
                            )}
                          </td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase border ${
                              pj.contract_type === "Government Contract"
                                ? "bg-amber-150 text-amber-900 border-amber-300"
                                : "bg-teal-150 text-teal-900 border-teal-300"
                            }`}>
                              {pj.contract_type}
                            </span>
                          </td>
                          <td className="py-2 px-3 font-medium text-stone-600">{pj.client}</td>
                          <td className="py-2 px-3">
                            <span className="font-mono bg-stone-100 text-stone-800 border px-2 py-0.5 rounded text-[10px] font-semibold font-mono">
                              {Array.isArray(pj.gallery_urls) ? pj.gallery_urls.length : 0} photos
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right space-x-1.5 flex items-center justify-end h-16">
                            <button
                              onClick={() => startEditProject(pj)}
                              className="text-stone-500 hover:text-[#A67C52] p-2 transition-colors duration-150 border border-stone-200 hover:border-[#A67C52]/40 rounded bg-white cursor-pointer inline-flex items-center"
                              title="Edit Case Study content & gallery"
                            >
                              <Edit3 size={13} className="mr-1" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProject(pj.id!)}
                              className="text-stone-400 hover:text-red-600 p-2 transition-colors duration-150 border border-stone-200 hover:border-red-200 rounded bg-white cursor-pointer"
                              title="Delete case Study"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {projects.length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-stone-400">No projects listed yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
