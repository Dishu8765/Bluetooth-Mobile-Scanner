
import React, { useEffect } from 'react';
import { DetectedDevice } from '../types';
import { WifiIcon } from './icons';

interface NotificationToastProps {
  device: DetectedDevice;
  onDismiss: () => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ device, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [device, onDismiss]);

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 w-11/12 max-w-md bg-slate/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-xl z-50 animate-pulse"
      style={{ animationIterationCount: 1, animationDuration: '0.5s' }}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 text-radar-dot">
          <WifiIcon />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-light-slate">New Device Detected!</p>
          <p className="text-sm text-slate">
            {device.name} ({device.type}) is nearby.
          </p>
        </div>
        <button onClick={onDismiss} className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-lg focus:ring-2 focus:ring-slate inline-flex h-8 w-8 text-slate hover:text-white">
          <span className="sr-only">Dismiss</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
