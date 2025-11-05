import { useState, useEffect } from "react";
import ChapterBubbles from "@/components/ChapterBubbles";
import ChapterDetailsSheet from "@/components/ChapterDetailsSheet";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Chapter } from "@/types/owasp";
import { mockChapters } from "@/data/mockOwaspData";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  // Load chapter data
  useEffect(() => {
    // TODO: Replace with actual API call
    // fetchChapters().then(setChapters);
    setChapters(mockChapters);
  }, []);

  const handleChapterClick = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setSheetOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="w-full border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                OWASP Universe
              </h1>
              <p className="text-sm text-muted-foreground">
                Explore chapters, projects, and communities
              </p>
            </div>
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search chapters by name or region..."
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
          data={chapters}
          searchQuery={searchQuery}
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
