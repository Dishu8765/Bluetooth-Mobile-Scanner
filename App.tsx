
import React, { useState, useEffect, useCallback } from 'react';
import { DetectedDevice, AppSettings } from './types';
import { startScanning, stopScanning } from './services/bluetoothSimulator';
import Radar from './components/Radar';
import DeviceList from './components/DeviceList';
import SettingsPanel from './components/SettingsPanel';
import NotificationToast from './components/NotificationToast';
import { SettingsIcon } from './components/icons';
import { SCAN_INTERVAL_FAST, SCAN_INTERVAL_NORMAL, SCAN_INTERVAL_SLOW } from './constants';

const App: React.FC = () => {
  const [devices, setDevices] = useState<DetectedDevice[]>([]);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [settings, setSettings] = useState<AppSettings>({
    notifications: true,
    sensitivity: 'normal',
  });
  const [newDevice, setNewDevice] = useState<DetectedDevice | null>(null);

  const getScanInterval = useCallback(() => {
    switch (settings.sensitivity) {
      case 'high':
        return SCAN_INTERVAL_FAST;
      case 'low':
        return SCAN_INTERVAL_SLOW;
      default:
        return SCAN_INTERVAL_NORMAL;
    }
  }, [settings.sensitivity]);

  const handleDeviceUpdate = useCallback((updatedDevices: DetectedDevice[]) => {
    setDevices(prevDevices => {
      if (settings.notifications) {
        const prevDeviceIds = new Set(prevDevices.map(d => d.id));
        const newDiscoveredDevice = updatedDevices.find(d => !prevDeviceIds.has(d.id));
        if (newDiscoveredDevice) {
          setNewDevice(newDiscoveredDevice);
        }
      }
      return updatedDevices;
    });
  }, [settings.notifications]);

  useEffect(() => {
    if (isScanning) {
      startScanning(handleDeviceUpdate, getScanInterval());
    } else {
      stopScanning();
      setDevices([]);
    }

    return () => {
      stopScanning();
    };
  }, [isScanning, handleDeviceUpdate, getScanInterval]);

  const toggleScan = () => {
    setIsScanning(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-radar-bg text-light-slate font-sans flex flex-col items-center justify-center p-4 overflow-hidden relative">
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
        <h1 className="text-xl font-bold text-light-slate">
          BT Radar <span className="text-radar-dot animate-pulse">●</span>
        </h1>
        <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-full hover:bg-radar-line transition-colors">
          <SettingsIcon />
        </button>
      </header>

      <main className="flex flex-col items-center justify-center w-full max-w-md mt-16 md:mt-0">
        <Radar devices={devices} isScanning={isScanning} />
        <button
          onClick={toggleScan}
          className={`mt-8 px-8 py-3 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-radar-bg focus:ring-radar-dot
            ${isScanning ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white shadow-lg`}
        >
          {isScanning ? 'Stop Scan' : 'Start Scan'}
        </button>
      </main>

      <DeviceList devices={devices} />

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={setSettings}
      />

      {newDevice && (
        <NotificationToast
          device={newDevice}
          onDismiss={() => setNewDevice(null)}
        />
      )}
    </div>
  );
};

export default App;
