import React from 'react';
import { CategoryIntersection } from '../types';

interface VennDiagramProps {
  intersectionData: CategoryIntersection[];
}

const VennDiagram: React.FC<VennDiagramProps> = ({ intersectionData }) => {
  const uniqueCategories = [...new Set(intersectionData.flatMap(d => d.categories))];
  const numCategories = uniqueCategories.length;

  if (numCategories < 2) {
    return <p className="text-center text-slate-400 py-8">Not enough category overlap to generate a diagram.</p>;
  }

  const findSegment = (cats: string[]) => {
    return intersectionData.find(d => 
        d.categories.length === cats.length && 
        cats.every(c => d.categories.includes(c))
    );
  };
  
  const SegmentData: React.FC<{segment: CategoryIntersection | undefined}> = ({segment}) => {
    if (!segment || segment.reviewCount === 0) return null;
    return (
       <>
        <tspan x="0" dy="1.2em" className="text-3xl font-bold fill-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">{segment.reviewCount}</tspan>
        <tspan x="0" dy="1.4em" className="text-sm fill-slate-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]">reviews</tspan>
        <tspan x="0" dy="1.6em" className="font-semibold text-sm">
             <tspan className="fill-green-300">▲{segment.positiveCount}</tspan>
             <tspan className="fill-red-300 ml-2.5">▼{segment.negativeCount}</tspan>
        </tspan>
       </>
    );
  }
  
  const svgDefs = (
      <defs>
        <radialGradient id="gradA" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(167, 139, 250, 0.6)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.4)" />
        </radialGradient>
        <radialGradient id="gradB" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(52, 211, 153, 0.6)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0.4)" />
        </radialGradient>
        <radialGradient id="gradC" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="rgba(252, 211, 77, 0.6)" />
            <stop offset="100%" stopColor="rgba(251, 191, 36, 0.4)" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
      </defs>
  );

  return (
    <div className="w-full h-auto max-w-lg mx-auto animate-fade-in">
        {numCategories === 2 && (() => {
            const [A, B] = uniqueCategories;
            const segA = findSegment([A]);
            const segB = findSegment([B]);
            const segAB = findSegment([A, B]);

            return (
                <svg viewBox="0 0 400 230" width="100%" height="auto">
                    {svgDefs}
                    <g transform="translate(0, 10)">
                        <g filter="url(#glow)">
                          <circle cx="135" cy="100" r="80" fill="url(#gradA)" stroke="#c4b5fd" strokeWidth="1" />
                          <circle cx="265" cy="100" r="80" fill="url(#gradB)" stroke="#a7f3d0" strokeWidth="1" />
                        </g>

                        <text textAnchor="middle" className="text-sm font-bold fill-slate-200" x="135" y="210">{A}</text>
                        <text textAnchor="middle" className="text-sm font-bold fill-slate-200" x="265" y="210">{B}</text>

                        <text textAnchor="middle" x="100" y="90" className="text-xs pointer-events-none">
                            <SegmentData segment={segA} />
                        </text>
                        <text textAnchor="middle" x="300" y="90" className="text-xs pointer-events-none">
                            <SegmentData segment={segB} />
                        </text>
                        <text textAnchor="middle" x="200" y="90" className="text-xs pointer-events-none">
                            <SegmentData segment={segAB} />
                        </text>
                    </g>
                </svg>
            );
        })()}

        {numCategories >= 3 && (() => {
            const [A, B, C] = uniqueCategories;
            const segA = findSegment([A]);
            const segB = findSegment([B]);
            const segC = findSegment([C]);
            const segAB = findSegment([A, B]);
            const segAC = findSegment([A, C]);
            const segBC = findSegment([B, C]);
            const segABC = findSegment([A, B, C]);

            return (
                <svg viewBox="0 0 450 340" width="100%" height="auto">
                    {svgDefs}
                    <g transform="translate(0, 20)">
                        <g filter="url(#glow)">
                          <circle cx="160" cy="120" r="90" fill="url(#gradA)" stroke="#c4b5fd" strokeWidth="1" />
                          <circle cx="290" cy="120" r="90" fill="url(#gradB)" stroke="#a7f3d0" strokeWidth="1" />
                          <circle cx="225" cy="210" r="90" fill="url(#gradC)" stroke="#fde047" strokeWidth="1" />
                        </g>

                        <text textAnchor="middle" className="text-sm font-bold fill-slate-200" x="100" y="40">{A}</text>
                        <text textAnchor="middle" className="text-sm font-bold fill-slate-200" x="350" y="40">{B}</text>
                        <text textAnchor="middle" className="text-sm font-bold fill-slate-200" x="225" y="320">{C}</text>

                        <text textAnchor="middle" x="125" y="120" className="text-xs pointer-events-none"><SegmentData segment={segA} /></text>
                        <text textAnchor="middle" x="325" y="120" className="text-xs pointer-events-none"><SegmentData segment={segB} /></text>
                        <text textAnchor="middle" x="225" y="270" className="text-xs pointer-events-none"><SegmentData segment={segC} /></text>
                        
                        <text textAnchor="middle" x="225" y="100" className="text-xs pointer-events-none"><SegmentData segment={segAB} /></text>
                        <text textAnchor="middle" x="165" y="195" className="text-xs pointer-events-none"><SegmentData segment={segAC} /></text>
                        <text textAnchor="middle" x="285" y="195" className="text-xs pointer-events-none"><SegmentData segment={segBC} /></text>
                        
                        <text textAnchor="middle" x="225" y="170" className="text-xs pointer-events-none"><SegmentData segment={segABC} /></text>
                    </g>
                </svg>
            );
        })()}
    </div>
  );
};

export default VennDiagram;