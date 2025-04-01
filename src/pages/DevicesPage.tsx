import React from 'react';
import WearableDeviceConnector from '@/components/wearable/WearableDeviceConnector';
import { Smartphone } from 'lucide-react';

const DevicesPage: React.FC = () => {
  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex flex-col items-center space-y-2 text-center mb-8">
        <Smartphone className="h-12 w-12 text-blue-500" />
        <h1 className="text-3xl font-bold">Connected Devices</h1>
        <p className="text-muted-foreground max-w-2xl">
          Connect your wearable devices and health apps to automatically sync your activity data.
        </p>
      </div>
      
      <WearableDeviceConnector />
    </div>
  );
};

export default DevicesPage; 