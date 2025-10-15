
import React from 'react';
import { RADAR_MAX_DISTANCE_METERS } from '../constants';
import { DetectedDevice } from '../types';

interface RadarProps {
  devices: DetectedDevice[];
  isScanning: boolean;
}

const Radar: React.FC<RadarProps> = ({ devices, isScanning }) => {
  const radarSize = 300;
  const center = radarSize / 2;

  const getPosition = (distance: number, angle: number) => {
    const radius = (Math.min(distance, RADAR_MAX_DISTANCE_METERS) / RADAR_MAX_DISTANCE_METERS) * center * 0.95;
    const x = center + radius * Math.cos((angle - 90) * (Math.PI / 180));
    const y = center + radius * Math.sin((angle - 90) * (Math.PI / 180));
    return { x, y };
  };

  return (
    <div className="relative" style={{ width: radarSize, height: radarSize }}>
      {/* Radar Grid */}
      <svg width={radarSize} height={radarSize} className="absolute inset-0">
        <circle cx={center} cy={center} r={center * 0.95} fill="none" stroke="#0e2a47" strokeWidth="1" />
        <circle cx={center} cy={center} r={center * 0.66} fill="none" stroke="#0e2a47" strokeWidth="1" />
        <circle cx={center} cy={center} r={center * 0.33} fill="none" stroke="#0e2a47" strokeWidth="1" />
        <line x1={center} y1={0} x2={center} y2={radarSize} stroke="#0e2a47" strokeWidth="1" />
        <line x1={0} y1={center} x2={radarSize} y2={center} stroke="#0e2a47" strokeWidth="1" />
      </svg>
      
      {/* Radar Sweep */}
      {isScanning && (
         <div className="absolute inset-0 w-full h-full origin-center animate-sweep">
            <div className="w-full h-full" style={{ background: 'linear-gradient(0deg, transparent 50%, #64ffda33 100%)' }}></div>
        </div>
      )}

      {/* Center Dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-radar-dot rounded-full"></div>

      {/* Devices */}
      <div className="absolute inset-0">
        {devices.map(device => {
          const { x, y } = getPosition(device.distance, device.angle);
          return (
            <div
              key={device.id}
              className="absolute group"
              style={{ left: `${x}px`, top: `${y}px`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="w-3 h-3 bg-radar-dot rounded-full animate-pulse transition-all duration-300"></div>
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate/90 text-white text-xs px-2 py-1 rounded">
                {device.name} ({device.distance.toFixed(1)}m)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Radar;
