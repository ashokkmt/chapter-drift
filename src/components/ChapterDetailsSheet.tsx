import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Chapter } from "@/types/owasp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users, MapPin, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ChapterDetailsSheetProps {
  chapter: Chapter | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ChapterDetailsSheet({
  chapter,
  open,
  onOpenChange,
}: ChapterDetailsSheetProps) {
  if (!chapter) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <SheetTitle className="text-2xl font-bold">
                {chapter.name}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4" />
                {chapter.region}
              </SheetDescription>
            </div>
            <Badge variant="secondary" className="ml-2">
              Chapter
            </Badge>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Description */}
          {chapter.description && (
            <div>
              <h3 className="font-semibold mb-2 text-foreground">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {chapter.description}
              </p>
            </div>
          )}

          <Separator />

          {/* Leaders */}
          {chapter.leaders && chapter.leaders.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-foreground">
                <Users className="h-4 w-4" />
                Chapter Leaders
              </h3>
              <div className="flex flex-wrap gap-2">
                {chapter.leaders.map((leader, idx) => (
                  <Badge key={idx} variant="outline">
                    {leader}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Meeting Info */}
          {chapter.meetingInfo && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-foreground">
                <Calendar className="h-4 w-4" />
                Meetings
              </h3>
              <p className="text-sm text-muted-foreground">
                {chapter.meetingInfo}
              </p>
            </div>
          )}

          <Separator />

          {/* Social Media & Links */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground">Links</h3>
            <div className="space-y-2">
              {chapter.url && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a
                    href={chapter.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Chapter Website
                  </a>
                </Button>
              )}
              {chapter.socialMedia?.twitter && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a
                    href={chapter.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter/X
                  </a>
                </Button>
              )}
              {chapter.socialMedia?.linkedin && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a
                    href={chapter.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </Button>
              )}
              {chapter.socialMedia?.slack && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <a
                    href={chapter.socialMedia.slack}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Slack
                  </a>
                </Button>
              )}
            </div>
          </div>

          {/* Activity Stats */}
          <div className="p-4 rounded-lg bg-secondary/50">
            <h3 className="font-semibold mb-2 text-foreground">
              Activity Score
            </h3>
            <div className="text-3xl font-bold text-primary">
              {chapter.popularity}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on events, members, and contributions
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
