import { Globe, MapPin, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const REGIONS = [
  "All Regions",
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East & Africa",
] as const;

export type Region = typeof REGIONS[number];

interface RegionSelectorProps {
  selectedRegion: Region;
  onRegionChange: (region: Region) => void;
  isAutoDetected?: boolean;
}

export default function RegionSelector({
  selectedRegion,
  onRegionChange,
  isAutoDetected = false,
}: RegionSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 bg-card border-border hover:bg-secondary"
        >
          {isAutoDetected && selectedRegion !== "All Regions" ? (
            <MapPin className="h-4 w-4 text-primary" />
          ) : (
            <Globe className="h-4 w-4" />
          )}
          <span className="font-medium">{selectedRegion}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        className="w-56 bg-card border-border z-50"
      >
        {REGIONS.map((region) => (
          <DropdownMenuItem
            key={region}
            onClick={() => onRegionChange(region)}
            className="cursor-pointer hover:bg-secondary focus:bg-secondary"
          >
            <div className="flex items-center justify-between w-full">
              <span>{region}</span>
              {selectedRegion === region && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
        {isAutoDetected && selectedRegion !== "All Regions" && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 inline mr-1" />
              Auto-detected from your location
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
