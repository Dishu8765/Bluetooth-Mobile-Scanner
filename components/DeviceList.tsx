
import React from 'react';
import { DetectedDevice } from '../types';
import { WifiIcon, SignalIcon } from './icons';

interface DeviceListProps {
  devices: DetectedDevice[];
}

const getRssiColor = (rssi: number) => {
  if (rssi > -60) return 'text-green-400';
  if (rssi > -80) return 'text-yellow-400';
  return 'text-red-400';
};

const DeviceList: React.FC<DeviceListProps> = ({ devices }) => {
  const sortedDevices = [...devices].sort((a, b) => a.distance - b.distance);

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 max-h-48 overflow-y-auto bg-radar-bg/70 backdrop-blur-sm z-10">
      <h2 className="text-lg font-semibold text-light-slate mb-2">Detected Devices ({devices.length})</h2>
      {sortedDevices.length > 0 ? (
        <ul className="space-y-2">
          {sortedDevices.map(device => (
            <li key={device.id} className="flex items-center justify-between p-2 rounded-md bg-radar-line/50">
              <div className="flex items-center space-x-3">
                <WifiIcon />
                <div>
                  <p className="font-medium text-light-slate">{device.name}</p>
                  <p className="text-xs text-slate">{device.type}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className={`flex items-center font-mono ${getRssiColor(device.rssi)}`}>
                  <SignalIcon />
                  <span className="ml-1">{device.rssi}</span>
                </div>
                <div className="font-mono text-slate w-20 text-right">
                  {device.distance.toFixed(1)}m
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate text-center py-4">No devices detected...</p>
      )}
    </div>
  );
};

export default DeviceList;
