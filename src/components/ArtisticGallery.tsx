import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Eye, Heart, Layers, Lock, Sparkles, Filter, ShieldCheck, Cpu } from "lucide-react";
import { AutomationPreset } from "../types";

interface GallerySpecimen {
  id: string;
  name: string;
  creator: string;
  imageUrl: string;
  preset: AutomationPreset;
  complexity: number;
  symmetry: number;
  generationEpoch: string;
  likes: number;
  views: number;
}

interface ArtisticGalleryProps {
  onSelectPreset?: (preset: AutomationPreset) => void;
}

export const ArtisticGallery: React.FC<ArtisticGalleryProps> = ({ onSelectPreset }) => {
  const [filter, setFilter] = useState<AutomationPreset | "all">("all");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedSpecimen, setSelectedSpecimen] = useState<GallerySpecimen | null>(null);

  const galleryItems: GallerySpecimen[] = [
    {
      id: "gal-1",
      name: "E-Commerce Autopilot v2",
      creator: "arka_core",
      imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
      preset: "workflow",
      complexity: 84,
      symmetry: 12,
      generationEpoch: "SYS-409",
      likes: 1240,
      views: 8930
    },
    {
      id: "gal-2",
      name: "Omnilingual Concierge Bot",
      creator: "arka_chat",
      imageUrl: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?auto=format&fit=crop&q=80&w=800",
      preset: "chatbot",
      complexity: 92,
      symmetry: 8,
      generationEpoch: "SYS-812",
      likes: 984,
      views: 4520
    },
    {
      id: "gal-3",
      name: "Arka Bento Web Design Portal",
      creator: "arka_studios",
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800",
      preset: "webdesign",
      complexity: 65,
      symmetry: 6,
      generationEpoch: "SYS-310",
      likes: 1845,
      views: 11020
    },
    {
      id: "gal-4",
      name: "Autonomous Lead Generator",
      creator: "arka_agents",
      imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
      preset: "agents",
      complexity: 78,
      symmetry: 16,
      generationEpoch: "SYS-941",
      likes: 2132,
      views: 15420
    }
  ];

  const filteredItems = filter === "all" ? galleryItems : galleryItems.filter(item => item.preset === filter);

  return (
    <div id="art_gallery_module" className="flex flex-col gap-5 h-full justify-between">
      {/* Search and filters row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          {["all", "chatbot", "workflow", "webdesign", "agents"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item as any)}
              className={`px-3 py-1.5 rounded-full text-[9px] uppercase font-bold tracking-wider transition-all duration-300 interactive ${
                filter === item
                  ? "bg-white text-black font-semibold scale-102"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="text-[10px] font-mono text-white/30 hidden sm:block">
          TEMPLATES: {filteredItems.length}
        </div>
      </div>

      {/* Dynamic scrolling vertical list with staggering cards */}
      <div className="flex-1 overflow-y-auto max-h-[48vh] xl:max-h-[58vh] pr-1 flex flex-col gap-3 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((spec, index) => (
            <motion.div
              key={spec.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              onMouseEnter={() => setHoveredId(spec.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setSelectedSpecimen(spec)}
              className="liquid-glass p-3 rounded-2xl cursor-pointer hover:bg-white/[0.04] active:scale-[0.99] transition-all grid grid-cols-[90px_1fr] md:grid-cols-[110px_1fr] gap-3.5 items-center group relative border-none"
            >
              {/* Image holder with unique morph overlay and zoom effect */}
              <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900 relative">
                <img
                  src={spec.imageUrl}
                  alt={spec.name}
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-108 filter grayscale group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Specs and tags */}
              <div className="flex flex-col text-left justify-between h-full py-1">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                      {spec.preset}
                    </span>
                    <span className="text-[9px] font-mono text-white/35">{spec.generationEpoch}</span>
                  </div>
                  <h4 className="text-xs font-semibold tracking-tight text-white group-hover:text-white transition-colors duration-300 leading-tight">
                    {spec.name}
                  </h4>
                  <p className="text-[10px] text-white/50 font-sans mt-0.5">Built by @{spec.creator}</p>
                </div>

                {/* Metrics */}
                <div className="flex gap-3 items-center mt-2 text-[9px] font-mono text-white/40">
                  <span className="flex items-center gap-1 hover:text-white/80 transition-colors">
                    <Eye className="w-3 h-3" /> {spec.views}
                  </span>
                  <span className="flex items-center gap-1 hover:text-white/80 transition-colors">
                    <Heart className="w-3 h-3" /> {spec.likes}
                  </span>
                  <span className="hidden sm:inline-block">Sync: {spec.symmetry} ports</span>
                </div>
              </div>

              {/* Ambient absolute glass line overlay */}
              <div className="absolute top-0 right-0 h-full w-[1.5px] bg-gradient-to-b from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[0.6s]" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Template Detailed Preview Modal */}
      <AnimatePresence>
        {selectedSpecimen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <div className="absolute inset-0 z-0" onClick={() => setSelectedSpecimen(null)} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-lg p-5 rounded-[2rem] liquid-glass-strong text-white flex flex-col gap-4 relative z-10"
            >
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-white/5 group">
                <img
                  src={selectedSpecimen.imageUrl}
                  alt={selectedSpecimen.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="text-[8px] uppercase tracking-widest text-white/50 block font-bold mb-1">SYSTEM INTEGRATION BLOCK</span>
                  <h3 className="font-sans text-lg leading-none">{selectedSpecimen.name}</h3>
                </div>
              </div>

              {/* Genomic Data Card */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-white/[0.02] text-left">
                  <span className="text-[9px] uppercase tracking-wider text-white/40 block font-semibold">Deployer</span>
                  <span className="text-xs font-semibold text-white/90">@{selectedSpecimen.creator}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] text-left">
                  <span className="text-[9px] uppercase tracking-wider text-white/40 block font-semibold">Automation Hub</span>
                  <span className="text-xs font-semibold uppercase text-white/90">{selectedSpecimen.preset}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] text-left">
                  <span className="text-[9px] uppercase tracking-wider text-white/40 block font-semibold">Core Reliability</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white" style={{ width: `${selectedSpecimen.complexity}%` }} />
                    </div>
                    <span className="text-xs font-mono font-bold">{selectedSpecimen.complexity}%</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] text-left">
                  <span className="text-[9px] uppercase tracking-wider text-white/40 block font-semibold">Sync Sync Nodes</span>
                  <span className="text-xs font-mono font-semibold text-white/95">{selectedSpecimen.symmetry} webhook avenues</span>
                </div>
              </div>

              {/* Access control */}
              <div className="flex gap-2 w-full mt-1">
                <button
                  onClick={() => {
                    if (onSelectPreset) {
                      onSelectPreset(selectedSpecimen.preset);
                    }
                    setSelectedSpecimen(null);
                  }}
                  className="flex-1 py-2.5 bg-white text-black font-bold text-xs rounded-xl flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all cursor-pointer"
                >
                  <Cpu className="w-3.5 h-3.5" /> Inject Ecosystem Parameters
                </button>
                <button
                  onClick={() => setSelectedSpecimen(null)}
                  className="px-4 py-2.5 bg-white/5 text-white/70 font-semibold text-xs rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
