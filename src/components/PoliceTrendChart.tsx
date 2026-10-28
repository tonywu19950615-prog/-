import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { PoliceHeatPoint } from '../types';

interface PoliceTrendChartProps {
  data: PoliceHeatPoint[];
  shelterName: string;
}

export const PoliceTrendChart: React.FC<PoliceTrendChartProps> = ({ data, shelterName }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activePoint, setActivePoint] = useState<PoliceHeatPoint | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    // Clear previous renders
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = containerRef.current ? containerRef.current.clientWidth : 460;
    const height = 190;
    const margin = { top: 20, right: 25, bottom: 35, left: 35 };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('width', '100%').attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Define Gradients
    const defs = svg.append('defs');

    // Area Gradient: Red at peak down to transparent
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'police-heat-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient.append('stop').attr('offset', '0%').attr('stop-color', '#ef4444').attr('stop-opacity', 0.65);
    areaGradient.append('stop').attr('offset', '50%').attr('stop-color', '#f59e0b').attr('stop-opacity', 0.3);
    areaGradient.append('stop').attr('offset', '100%').attr('stop-color', '#10b981').attr('stop-opacity', 0.02);

    // Line Stroke Gradient
    const lineGradient = defs
      .append('linearGradient')
      .attr('id', 'police-line-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    lineGradient.append('stop').attr('offset', '0%').attr('stop-color', '#10b981');
    lineGradient.append('stop').attr('offset', '45%').attr('stop-color', '#ef4444');
    lineGradient.append('stop').attr('offset', '80%').attr('stop-color', '#f59e0b');
    lineGradient.append('stop').attr('offset', '100%').attr('stop-color', '#10b981');

    // X and Y Scales
    const xScale = d3
      .scalePoint<string>()
      .domain(data.map((d) => d.hour))
      .range([0, innerWidth])
      .padding(0.2);

    const yScale = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);

    // Gridlines
    const yGrid = d3.axisLeft(yScale).ticks(4).tickSize(-innerWidth).tickFormat(() => '');
    g.append('g')
      .attr('class', 'grid text-slate-800')
      .call(yGrid)
      .selectAll('line')
      .attr('stroke', '#334155')
      .attr('stroke-dasharray', '3,3')
      .attr('stroke-opacity', 0.5);

    // High Alert Threshold Zone Line (80% heat)
    const alertY = yScale(80);
    g.append('line')
      .attr('x1', 0)
      .attr('y1', alertY)
      .attr('x2', innerWidth)
      .attr('y2', alertY)
      .attr('stroke', '#ef4444')
      .attr('stroke-dasharray', '4,4')
      .attr('stroke-width', 1.2)
      .attr('stroke-opacity', 0.7);

    g.append('text')
      .attr('x', innerWidth - 5)
      .attr('y', alertY - 4)
      .attr('text-anchor', 'end')
      .attr('fill', '#f87171')
      .attr('font-size', '9px')
      .attr('font-weight', 'bold')
      .text('警政通報高峰警戒線 (80)');

    // D3 Area Generator
    const areaGen = d3
      .area<PoliceHeatPoint>()
      .x((d) => xScale(d.hour) || 0)
      .y0(innerHeight)
      .y1((d) => yScale(d.heat))
      .curve(d3.curveMonotoneX);

    // D3 Line Generator
    const lineGen = d3
      .line<PoliceHeatPoint>()
      .x((d) => xScale(d.hour) || 0)
      .y((d) => yScale(d.heat))
      .curve(d3.curveMonotoneX);

    // Render Area
    g.append('path')
      .datum(data)
      .attr('fill', 'url(#police-heat-gradient)')
      .attr('d', areaGen);

    // Render Line
    g.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'url(#police-line-gradient)')
      .attr('stroke-width', 2.8)
      .attr('d', lineGen);

    // Render Data Circles with Tooltip interaction
    g.selectAll('.data-circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'data-circle cursor-pointer')
      .attr('cx', (d) => xScale(d.hour) || 0)
      .attr('cy', (d) => yScale(d.heat))
      .attr('r', (d) => (d.heat >= 80 ? 5 : 3.5))
      .attr('fill', (d) => (d.heat >= 80 ? '#ef4444' : d.heat >= 50 ? '#f59e0b' : '#10b981'))
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 2)
      .on('mouseenter', (_, d) => {
        setActivePoint(d);
      })
      .on('mouseleave', () => {
        // Keep active or reset
      });

    // X Axis
    const xAxis = d3.axisBottom(xScale);
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('dy', '8px');

    g.selectAll('.domain').attr('stroke', '#475569');
    g.selectAll('.tick line').attr('stroke', '#475569');

    // Y Axis
    const yAxis = d3.axisLeft(yScale).ticks(4).tickFormat((d) => `${d}`);
    g.append('g')
      .call(yAxis)
      .selectAll('text')
      .attr('fill', '#94a3b8')
      .attr('font-size', '9px');

    // Set initial active point to the peak hour (usually 02:00)
    const peak = [...data].sort((a, b) => b.heat - a.heat)[0];
    if (peak) setActivePoint(peak);
  }, [data]);

  return (
    <div ref={containerRef} className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span className="text-xs font-black text-slate-200">
            警政 110 報案熱度即時趨勢圖（D3）
          </span>
        </div>
        <span className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
          開放時段：22:00 - 08:00
        </span>
      </div>

      {/* SVG Canvas for D3 */}
      <div className="w-full overflow-hidden">
        <svg ref={svgRef} className="w-full" />
      </div>

      {/* Interactive Tooltip Inspector */}
      {activePoint && (
        <div className="bg-slate-900 border border-slate-700/80 rounded-lg p-2.5 flex items-center justify-between text-xs text-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-amber-400">{activePoint.hour}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  activePoint.level === '高峰警戒'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : activePoint.level === '偏高'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}
              >
                {activePoint.level}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              平均通報：<strong className="text-slate-200">{activePoint.reports} 件</strong> ｜ 巡邏密度：
              <strong className="text-slate-200">{activePoint.patrols} 班次/時</strong>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">治安熱度指數</span>
            <span
              className={`text-lg font-black ${
                activePoint.heat >= 80
                  ? 'text-red-400'
                  : activePoint.heat >= 50
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {activePoint.heat} <span className="text-xs font-normal">/ 100</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
