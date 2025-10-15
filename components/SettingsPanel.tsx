
import React from 'react';
import { AppSettings, Sensitivity } from '../types';
import { CloseIcon } from './icons';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (newSettings: AppSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  onClose,
  settings,
  onSettingsChange,
}) => {
  const handleToggle = (key: keyof AppSettings) => {
    onSettingsChange({ ...settings, [key]: !settings[key] });
  };

  const handleSensitivityChange = (sensitivity: Sensitivity) => {
    onSettingsChange({ ...settings, sensitivity });
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-30 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      ></div>
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-radar-bg shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-light-slate">Settings</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-radar-line transition-colors">
              <CloseIcon />
            </button>
          </div>

          <div className="space-y-6">
            {/* Notifications */}
            <div className="flex items-center justify-between">
              <label htmlFor="notifications" className="text-lg text-slate">Enable Notifications</label>
              <button
                onClick={() => handleToggle('notifications')}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${
                  settings.notifications ? 'bg-radar-dot' : 'bg-radar-line'
                }`}
              >
                <span
                  className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                    settings.notifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Sensitivity */}
            <div>
              <label className="block text-lg text-slate mb-3">Scanning Sensitivity</label>
              <div className="flex space-x-2 bg-radar-line p-1 rounded-lg">
                {(['low', 'normal', 'high'] as Sensitivity[]).map(level => (
                  <button
                    key={level}
                    onClick={() => handleSensitivityChange(level)}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition-colors capitalize ${
                      settings.sensitivity === level
                        ? 'bg-radar-dot text-radar-bg'
                        : 'text-slate hover:bg-slate/20'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="text-xs text-slate mt-2">Higher sensitivity uses more power but finds devices faster.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;
