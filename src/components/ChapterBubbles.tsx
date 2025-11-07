import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import { Chapter } from "@/types/owasp";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface Props {
  data: Chapter[];
  searchQuery: string;
  onChapterClick: (chapter: Chapter) => void;
}

interface Node extends Chapter {
  radius: number;
  x: number;
  y: number;
  fx?: number | null;
  fy?: number | null;
}


// Region colors matching the design system
const REGION_COLORS: Record<string, string> = {
  "North America": "#FF6B35",
  "Europe": "#4ECDC4",
  "Asia Pacific": "#FF6B9D",
  "Latin America": "#95E1D3",
  "Middle East & Africa": "#F38181",
};

export default function ChapterBubbles({ data, searchQuery, onChapterClick }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const minimapRef = useRef<SVGSVGElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Filter data based on search query
    const filteredData = data.filter((d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredData.length === 0) return;

    // Define size scale based on popularity - optimized for many circles
    const sizeScale = d3
      .scaleSqrt()
      .domain(d3.extent(filteredData, (d) => d.popularity) as [number, number])
      .range([40, 120]); // Maintain good size even with 100+ circles

    // Get unique regions for clustering
    const regions = Array.from(new Set(filteredData.map((d) => d.region)));
    
    // Calculate cluster centers based on regions
    const clusterCenters: Record<string, { x: number; y: number }> = {};
    const numRegions = regions.length;
    const radius = Math.min(width, height) * 0.35;
    regions.forEach((region, i) => {
      const angle = (i / numRegions) * 2 * Math.PI;
      clusterCenters[region] = {
        x: width / 2 + radius * Math.cos(angle),
        y: height / 2 + radius * Math.sin(angle),
      };
    });

    // Setup nodes with initial positions near their cluster centers
    const nodes: Node[] = filteredData.map((d) => {
      const center = clusterCenters[d.region];
      return {
        ...d,
        radius: sizeScale(d.popularity),
        x: center.x + (Math.random() - 0.5) * 100,
        y: center.y + (Math.random() - 0.5) * 100,
      };
    });

    // Setup force simulation with clustering
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "x",
        d3.forceX<Node>((d) => clusterCenters[d.region].x).strength(0.1)
      )
      .force(
        "y",
        d3.forceY<Node>((d) => clusterCenters[d.region].y).strength(0.1)
      )
      .force("charge", d3.forceManyBody().strength(-5)) // Repulsion
      .force(
        "collide",
        d3.forceCollide<Node>()
          .radius((d) => d.radius + 5)
          .iterations(2)
      )
      .alphaDecay(0.015)
      .velocityDecay(0.4)
      .on("tick", ticked);

    // Setup zoom behavior
    const g = svg.append("g").attr("class", "zoom-group");
    
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
        setZoomLevel(event.transform.k);
        updateMinimap(event.transform);
      });

    svg.attr("viewBox", `0 0 ${width} ${height}`).call(zoom);
    zoomRef.current = zoom;

    // Add region labels
    const regionLabels = g
      .selectAll<SVGTextElement, string>("text.region-label")
      .data(regions)
      .join("text")
      .attr("class", "region-label")
      .attr("x", (d) => clusterCenters[d].x)
      .attr("y", (d) => clusterCenters[d].y - radius * 0.7)
      .attr("text-anchor", "middle")
      .attr("fill", "hsl(var(--muted-foreground))")
      .attr("font-size", "18")
      .attr("font-weight", "700")
      .attr("opacity", 0.6)
      .text((d) => d);

    // Create node groups
    const nodeGroup = g
      .selectAll<SVGGElement, Node>("g.node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .style("cursor", "grab")
      .call(
        d3
          .drag<SVGGElement, Node>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    // Draw circles
    nodeGroup
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", (d) => REGION_COLORS[d.region] || "#4ECDC4")
      .attr("fill-opacity", 0.85)
      .attr("stroke", "#111")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation();
        onChapterClick(d);
      });

    // Add text labels with better sizing for many circles
    nodeGroup
      .append("text")
      .text((d) => d.name)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", (d) => Math.max(14, d.radius / 3.5)) // Better text sizing
      .attr("font-weight", "600")
      .attr("pointer-events", "none")
      .style("user-select", "none")
      .each(function(d) {
        const text = d3.select(this);
        const words = d.name.split(/\s+/);
        // Wrap text if circle is large and name is long
        if (d.radius > 60 && words.length > 2) {
          text.text("");
          words.forEach((word, i) => {
            text.append("tspan")
              .attr("x", 0)
              .attr("dy", i === 0 ? 0 : "1.1em")
              .text(word);
          });
        }
      });

    function ticked() {
      nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);
      updateMinimap();
    }

    // Setup minimap
    function setupMinimap() {
      if (!minimapRef.current) return;

      const minimapSvg = d3.select(minimapRef.current);
      minimapSvg.selectAll("*").remove();

      const minimapWidth = 200;
      const minimapHeight = 150;
      const scale = Math.min(minimapWidth / width, minimapHeight / height);

      minimapSvg.attr("viewBox", `0 0 ${minimapWidth} ${minimapHeight}`);

      // Draw minimap background
      minimapSvg
        .append("rect")
        .attr("width", minimapWidth)
        .attr("height", minimapHeight)
        .attr("fill", "hsl(var(--background))")
        .attr("stroke", "hsl(var(--border))")
        .attr("stroke-width", 1)
        .attr("opacity", 0.9);

      // Draw minimap nodes
      minimapSvg
        .selectAll("circle.minimap-node")
        .data(nodes)
        .join("circle")
        .attr("class", "minimap-node")
        .attr("cx", (d) => d.x * scale)
        .attr("cy", (d) => d.y * scale)
        .attr("r", (d) => d.radius * scale * 0.5)
        .attr("fill", (d) => REGION_COLORS[d.region] || "#4ECDC4")
        .attr("opacity", 0.7);

      // Draw viewport indicator
      minimapSvg
        .append("rect")
        .attr("class", "viewport-indicator")
        .attr("fill", "none")
        .attr("stroke", "hsl(var(--primary))")
        .attr("stroke-width", 2);
    }

    function updateMinimap(transform?: d3.ZoomTransform) {
      if (!minimapRef.current) return;

      const minimapSvg = d3.select(minimapRef.current);
      const minimapWidth = 200;
      const minimapHeight = 150;
      const scale = Math.min(minimapWidth / width, minimapHeight / height);

      // Update minimap nodes positions
      minimapSvg
        .selectAll<SVGCircleElement, Node>("circle.minimap-node")
        .attr("cx", (d) => d.x * scale)
        .attr("cy", (d) => d.y * scale);

      // Update viewport indicator
      if (transform) {
        const viewportWidth = width / transform.k;
        const viewportHeight = height / transform.k;
        const viewportX = -transform.x / transform.k;
        const viewportY = -transform.y / transform.k;

        minimapSvg
          .select<SVGRectElement>(".viewport-indicator")
          .attr("x", viewportX * scale)
          .attr("y", viewportY * scale)
          .attr("width", viewportWidth * scale)
          .attr("height", viewportHeight * scale);
      }
    }

    setupMinimap();

    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
      d3.select(event.sourceEvent.target.parentNode).style("cursor", "grabbing");
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
      d3.select(event.sourceEvent.target.parentNode).style("cursor", "grab");
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [data, searchQuery]);

  const handleZoomIn = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.scaleBy, 0.7);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(zoomRef.current.transform, d3.zoomIdentity);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <svg ref={svgRef} className="w-full h-full" />
      
      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-10">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomIn}
          className="bg-card/90 backdrop-blur-sm hover:bg-card shadow-lg"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomOut}
          className="bg-card/90 backdrop-blur-sm hover:bg-card shadow-lg"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleResetZoom}
          className="bg-card/90 backdrop-blur-sm hover:bg-card shadow-lg"
          title="Reset Zoom"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-6 left-6 z-10">
        <div className="bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-border">
          <span className="text-sm font-medium text-foreground">
            {Math.round(zoomLevel * 100)}%
          </span>
        </div>
      </div>

      {/* Mini-map */}
      <div className="absolute top-4 right-4 z-10">
        <div className="bg-card/90 backdrop-blur-sm rounded-lg shadow-lg border border-border p-2">
          <div className="text-xs font-medium text-muted-foreground mb-1 px-1">
            Overview
          </div>
          <svg
            ref={minimapRef}
            className="w-[200px] h-[150px] rounded"
          />
        </div>
      </div>
    </div>
  );
}
