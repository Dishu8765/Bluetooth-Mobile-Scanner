
import { DetectedDevice, DeviceType } from '../types';
import { RADAR_MAX_DISTANCE_METERS, TX_POWER, ENVIRONMENTAL_FACTOR } from '../constants';

let scanInterval: number | null = null;
const detectedDevices: Map<string, DetectedDevice> = new Map();

const MOCK_DEVICE_NAMES: { name: string; type: DeviceType }[] = [
  { name: 'iPhone 15 Pro', type: 'Phone' },
  { name: 'Galaxy S24 Ultra', type: 'Phone' },
  { name: 'MBP 16-inch', type: 'Laptop' },
  { name: 'Sony WH-1000XM5', type: 'Headphones' },
  { name: 'Pixel Watch 2', type: 'Watch' },
  { name: 'iPad Air', type: 'Tablet' },
  { name: 'AirPods Pro', type: 'Headphones' },
  { name: 'Dell XPS 15', type: 'Laptop' },
  { name: 'Galaxy Tab S9', type: 'Tablet' },
];

const calculateDistance = (rssi: number): number => {
  return Math.pow(10, (TX_POWER - rssi) / (10 * ENVIRONMENTAL_FACTOR));
};

const createNewDevice = (): DetectedDevice => {
  const id = `dev_${Math.random().toString(36).substr(2, 9)}`;
  const mock = MOCK_DEVICE_NAMES[Math.floor(Math.random() * MOCK_DEVICE_NAMES.length)];
  const rssi = -30 - Math.random() * 60; // RSSI between -30 and -90
  const distance = calculateDistance(rssi);

  return {
    id,
    name: mock.name,
    rssi: Math.round(rssi),
    type: mock.type,
    distance,
    angle: Math.random() * 360,
    timestamp: Date.now(),
  };
};

const updateDevice = (device: DetectedDevice): DetectedDevice => {
  const rssiChange = (Math.random() - 0.5) * 5;
  const newRssi = Math.max(-100, Math.min(-30, device.rssi + rssiChange));
  const newDistance = calculateDistance(newRssi);

  return {
    ...device,
    rssi: Math.round(newRssi),
    distance: newDistance,
    timestamp: Date.now(),
  };
};

const simulateScan = (callback: (devices: DetectedDevice[]) => void) => {
  // 1. Update existing devices and remove ones that are too far or too old
  for (const [id, device] of detectedDevices.entries()) {
    const updatedDevice = updateDevice(device);
    if (updatedDevice.distance > RADAR_MAX_DISTANCE_METERS || Date.now() - device.timestamp > 30000) {
      detectedDevices.delete(id);
    } else {
      detectedDevices.set(id, updatedDevice);
    }
  }

  // 2. Potentially add a new device
  if (Math.random() < 0.25 && detectedDevices.size < 8) {
    const newDevice = createNewDevice();
    if (newDevice.distance <= RADAR_MAX_DISTANCE_METERS) {
        detectedDevices.set(newDevice.id, newDevice);
    }
  }

  callback(Array.from(detectedDevices.values()));
};

export const startScanning = (
  callback: (devices: DetectedDevice[]) => void,
  interval: number
) => {
  if (scanInterval) {
    stopScanning();
  }
  
  // Initial call
  simulateScan(callback);

  scanInterval = window.setInterval(() => {
    simulateScan(callback);
  }, interval);
};

export const stopScanning = () => {
  if (scanInterval) {
    clearInterval(scanInterval);
    scanInterval = null;
  }
  detectedDevices.clear();
};
