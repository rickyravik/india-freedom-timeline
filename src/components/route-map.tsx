import type { Route } from '@/types';
import { useMotionAllowed } from '@/lib/motion';

export function RouteMap({ route, current, onSelect }: { route: Route; current: number; onSelect: (i: number) => void }) {
  const motion = useMotionAllowed();
  const pts = route.stops.map((s) => ({ x: s.x, y: s.y }));
  return (
    <svg viewBox="0 0 100 100" className="h-auto w-full max-w-xl" role="img" aria-label={`Schematic route with ${route.stops.length} stops; ${current} of ${route.stops.length - 1} segments shown`}>
      {/* the coast, for orientation only */}
      <path d="M 70 0 C 75 30 70 60 66 100" fill="none" stroke="rgba(143,122,69,0.5)" strokeDasharray="1 2" strokeWidth="0.6" />
      {pts.slice(1).map((p, i) => {
        const a = pts[i];
        const len = Math.round(Math.hypot(p.x - a.x, p.y - a.y) * 100) / 100;
        const drawn = current > i;
        return (
          <line
            key={route.stops[i + 1].id}
            data-route-segment
            data-drawn={drawn ? 'true' : 'false'}
            x1={a.x}
            y1={a.y}
            x2={p.x}
            y2={p.y}
            stroke="#c4611f"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray={len}
            strokeDashoffset={drawn ? 0 : len}
            style={{ transition: motion ? 'stroke-dashoffset 0.4s cubic-bezier(0.22,0.61,0.36,1)' : 'none' }}
          />
        );
      })}
      {pts.map((p, i) => (
        <g key={route.stops[i].id}>
          <circle cx={p.x} cy={p.y} r={i <= current ? 2.2 : 1.6} fill={i <= current ? '#c4611f' : '#f2ede2'} stroke="#17201c" strokeWidth="0.5" onClick={() => onSelect(i)} className="cursor-pointer" />
          <text x={p.x + 3} y={p.y + 1} fontSize="3" fill="#17201c" fontFamily="Archivo Narrow Variable, sans-serif">
            {i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}
