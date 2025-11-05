import * as d3 from "d3";
import React, { useEffect, useRef } from "react";

export interface ChapterData {
  id: string;
  name: string;
  popularity: number;
  region: string;
}

interface Props {
  data: ChapterData[];
  searchQuery: string;
}

interface Node extends ChapterData {
  radius: number;
  x: number;
  y: number;
  fx?: number | null;
  fy?: number | null;
}

export default function ChapterBubbles({ data, searchQuery }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

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

    // Define size scale based on popularity
    const sizeScale = d3
      .scaleSqrt()
      .domain(d3.extent(filteredData, (d) => d.popularity) as [number, number])
      .range([30, 100]);

    // Color palette matching the design
    const colors = [
      "hsl(var(--bubble-orange))",
      "hsl(var(--bubble-blue))",
      "hsl(var(--bubble-coral))",
      "hsl(var(--bubble-teal))",
    ];

    const colorScale = d3
      .scaleOrdinal(colors)
      .domain(filteredData.map((d) => d.region));

    // Setup nodes with initial random positions
    const nodes: Node[] = filteredData.map((d) => ({
      ...d,
      radius: sizeScale(d.popularity),
      x: Math.random() * width,
      y: Math.random() * height,
    }));

    // Setup force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force("x", d3.forceX(width / 2).strength(0.03))
      .force("y", d3.forceY(height / 2).strength(0.03))
      .force("charge", d3.forceManyBody().strength(0))
      .force(
        "collide",
        d3.forceCollide<Node>().radius((d) => d.radius + 8).iterations(3)
      )
      .alphaDecay(0.02)
      .on("tick", ticked);

    // Create node groups
    const nodeGroup = svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .selectAll<SVGGElement, Node>("g")
      .data(nodes)
      .join("g")
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
      .attr("fill", (d) => colorScale(d.region) as string)
      .attr("fill-opacity", 0.85)
      .attr("stroke", "#111")
      .attr("stroke-width", 2);

    // Add text labels
    nodeGroup
      .append("text")
      .text((d) => d.name)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "white")
      .attr("font-size", (d) => Math.max(12, d.radius / 4))
      .attr("font-weight", "600")
      .attr("pointer-events", "none")
      .style("user-select", "none");

    function ticked() {
      nodeGroup.attr("transform", (d) => `translate(${d.x},${d.y})`);
    }

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

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
}
