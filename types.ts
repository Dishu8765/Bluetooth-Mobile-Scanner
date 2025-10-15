
export type DeviceType = 'Phone' | 'Laptop' | 'Headphones' | 'Watch' | 'Tablet' | 'Unknown';

export interface DetectedDevice {
  id: string;
  name: string;
  rssi: number;
  type: DeviceType;
  distance: number;
  angle: number; // in degrees
  timestamp: number;
}

export type Sensitivity = 'low' | 'normal' | 'high';

export interface AppSettings {
  notifications: boolean;
  sensitivity: Sensitivity;
}
