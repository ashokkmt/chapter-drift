import { useState, useEffect } from "react";
import ChapterBubbles from "@/components/ChapterBubbles";
import ChapterDetailsSheet from "@/components/ChapterDetailsSheet";
import RegionSelector, { Region } from "@/components/RegionSelector";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Chapter } from "@/types/owasp";
import { mockChapters } from "@/data/mockOwaspData";
import { detectUserRegion } from "@/utils/geolocation";
import { toast } from "sonner";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region>("All Regions");
  const [isAutoDetected, setIsAutoDetected] = useState(false);

  // Load chapter data
  useEffect(() => {
    // TODO: Replace with actual API call
    // fetchChapters().then(setChapters);
    setChapters(mockChapters);
  }, []);

  // Detect user's region on mount
  useEffect(() => {
    const detectRegion = async () => {
      const region = await detectUserRegion();
      if (region && region !== "All Regions") {
        setSelectedRegion(region);
        setIsAutoDetected(true);
        toast.success(`Showing chapters in ${region}`, {
          description: "You can change the region using the selector",
        });
      }
    };

    detectRegion();
  }, []);

  // Filter chapters by region and search query
  const filteredChapters = chapters.filter((chapter) => {
    const matchesRegion =
      selectedRegion === "All Regions" || chapter.region === selectedRegion;
    const matchesSearch = chapter.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const handleChapterClick = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setSheetOpen(true);
  };

  const handleRegionChange = (region: Region) => {
    setSelectedRegion(region);
    setIsAutoDetected(false); // User manually changed region
    toast.info(`Showing chapters in ${region}`);
  };


  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="w-full border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left side: Region selector and title */}
            <div className="flex items-center gap-4">
              <RegionSelector
                selectedRegion={selectedRegion}
                onRegionChange={handleRegionChange}
                isAutoDetected={isAutoDetected}
              />
              <div className="border-l border-border pl-4 hidden sm:block">
                <h1 className="text-xl font-bold text-foreground">
                  OWASP Universe
                </h1>
                <p className="text-xs text-muted-foreground">
                  {filteredChapters.length} chapters
                </p>
              </div>
            </div>

            {/* Right side: Search */}
            <div className="relative max-w-md w-full sm:w-auto flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search chapters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Bubble Visualization */}
      <main className="flex-1 relative overflow-hidden">
        <ChapterBubbles
          data={filteredChapters}
          searchQuery=""
          onChapterClick={handleChapterClick}
        />
      </main>

      {/* Details Sheet */}
      <ChapterDetailsSheet
        chapter={selectedChapter}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
};

export default Index;
