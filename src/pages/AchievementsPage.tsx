import React from 'react';
import AchievementsDisplay from '@/components/achievements/AchievementsDisplay';
import { Trophy } from 'lucide-react';

const AchievementsPage: React.FC = () => {
  return (
    <div className="container px-4 py-6 mx-auto">
      <div className="flex flex-col items-center space-y-2 text-center mb-8">
        <Trophy className="h-12 w-12 text-yellow-500" />
        <h1 className="text-3xl font-bold">Achievements & Progress</h1>
        <p className="text-muted-foreground max-w-2xl">
          Track your health journey, unlock achievements, and view your progress milestones.
        </p>
      </div>
      
      <AchievementsDisplay />
    </div>
  );
};

export default AchievementsPage; 