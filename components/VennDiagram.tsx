import React from 'react';
import { CategoryIntersection } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface VennDiagramProps {
  intersectionData: CategoryIntersection[];
}

const VennDiagram: React.FC<VennDiagramProps> = ({ intersectionData }) => {
  const uniqueCategories = [...new Set(intersectionData.flatMap(d => d.categories))];
  const numCategories = uniqueCategories.length;

  if (numCategories < 2) {
    return <p className="text-center text-gray-400">Not enough category overlap to generate a diagram.</p>;
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
        <tspan x="0" dy="1.2em" className="text-2xl font-bold fill-white">{segment.reviewCount}</tspan>
        <tspan x="0" dy="1.2em" className="text-xs fill-gray-400">reviews</tspan>
        <tspan x="0" dy="1.4em" className="font-medium">
             <tspan className="fill-green-400">▲{segment.positiveCount}</tspan>
             <tspan className="fill-red-400 ml-2">▼{segment.negativeCount}</tspan>
        </tspan>
       </>
    );
  }

  if (numCategories === 2) {
    const [A, B] = uniqueCategories;
    const segA = findSegment([A]);
    const segB = findSegment([B]);
    const segAB = findSegment([A, B]);

    return (
        <div className="flex justify-center items-center">
            <svg width="400" height="250" viewBox="0 0 400 250">
                <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.4"/>
                    </filter>
                </defs>
                <g transform="translate(0, 20)">
                    <circle cx="135" cy="100" r="80" fill="rgba(88, 131, 219, 0.4)" stroke="#818cf8" strokeWidth="2" filter="url(#shadow)" />
                    <circle cx="265" cy="100" r="80" fill="rgba(52, 211, 153, 0.4)" stroke="#34d399" strokeWidth="2" filter="url(#shadow)" />

                    <text textAnchor="middle" className="text-sm font-bold fill-gray-200" x="135" y="210">{A}</text>
                    <text textAnchor="middle" className="text-sm font-bold fill-gray-200" x="265" y="210">{B}</text>

                    <text textAnchor="middle" x="100" y="90" className="text-xs">
                        <SegmentData segment={segA} />
                    </text>
                    <text textAnchor="middle" x="300" y="90" className="text-xs">
                         <SegmentData segment={segB} />
                    </text>
                    <text textAnchor="middle" x="200" y="90" className="text-xs">
                        <SegmentData segment={segAB} />
                    </text>
                </g>
            </svg>
        </div>
    );
  }

  if (numCategories >= 3) {
      const [A, B, C] = uniqueCategories;
      const segA = findSegment([A]);
      const segB = findSegment([B]);
      const segC = findSegment([C]);
      const segAB = findSegment([A, B]);
      const segAC = findSegment([A, C]);
      const segBC = findSegment([B, C]);
      const segABC = findSegment([A, B, C]);
      
      return (
        <div className="flex justify-center items-center">
            <svg width="450" height="350" viewBox="0 0 450 350">
                <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.4"/>
                    </filter>
                </defs>
                 <g transform="translate(0, 20)">
                    <circle cx="160" cy="120" r="90" fill="rgba(88, 131, 219, 0.4)" stroke="#818cf8" strokeWidth="2" filter="url(#shadow)" />
                    <circle cx="290" cy="120" r="90" fill="rgba(52, 211, 153, 0.4)" stroke="#34d399" strokeWidth="2" filter="url(#shadow)" />
                    <circle cx="225" cy="210" r="90" fill="rgba(251, 191, 36, 0.4)" stroke="#fbb_f24" strokeWidth="2" filter="url(#shadow)" />
                    
                    <text textAnchor="middle" className="text-sm font-bold fill-gray-200" x="100" y="40">{A}</text>
                    <text textAnchor="middle" className="text-sm font-bold fill-gray-200" x="350" y="40">{B}</text>
                    <text textAnchor="middle" className="text-sm font-bold fill-gray-200" x="225" y="320">{C}</text>

                    <text textAnchor="middle" x="125" y="120" className="text-xs"><SegmentData segment={segA} /></text>
                    <text textAnchor="middle" x="325" y="120" className="text-xs"><SegmentData segment={segB} /></text>
                    <text textAnchor="middle" x="225" y="270" className="text-xs"><SegmentData segment={segC} /></text>

                    <text textAnchor="middle" x="225" y="100" className="text-xs"><SegmentData segment={segAB} /></text>
                    <text textAnchor="middle" x="165" y="195" className="text-xs"><SegmentData segment={segAC} /></text>
                    <text textAnchor="middle" x="285" y="195" className="text-xs"><SegmentData segment={segBC} /></text>

                    <text textAnchor="middle" x="225" y="170" className="text-xs"><SegmentData segment={segABC} /></text>
                 </g>
            </svg>
        </div>
      );
  }
  
  return null;
};

export default VennDiagram;
