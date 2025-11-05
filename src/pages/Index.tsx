import { useState } from "react";
import ChapterBubbles, { ChapterData } from "@/components/ChapterBubbles";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Sample chapter data - you can replace this with your actual data
const generateChapterData = (): ChapterData[] => {
  const chapters: ChapterData[] = [];
  const regions = ["North", "South", "East", "West"];
  
  for (let i = 1; i <= 40; i++) {
    chapters.push({
      id: `chapter-${i}`,
      name: `Chapter ${i}`,
      popularity: Math.floor(Math.random() * 100) + 20, // Random popularity between 20-120
      region: regions[Math.floor(Math.random() * regions.length)],
    });
  }
  
  // Sort by popularity (descending) to show popular chapters first
  return chapters.sort((a, b) => b.popularity - a.popularity);
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const chapterData = generateChapterData();

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Search Bar */}
      <header className="w-full border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search chapters"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </header>

      {/* Bubble Visualization */}
      <main className="flex-1 relative overflow-hidden">
        <ChapterBubbles data={chapterData} searchQuery={searchQuery} />
      </main>
    </div>
  );
};

export default Index;
