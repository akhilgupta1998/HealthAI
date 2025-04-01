
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export interface NutritionChartProps {
  protein: number;
  carbs: number;
  fat: number;
}

const NutritionChart: React.FC<NutritionChartProps> = ({ protein, carbs, fat }) => {
  const data = [
    { name: 'Protein', value: protein, color: '#10b981' },
    { name: 'Carbs', value: carbs, color: '#3b82f6' },
    { name: 'Fat', value: fat, color: '#f97316' },
  ];

  return (
    <Card className="glass-card">
      <CardContent className="p-5">
        <h3 className="font-medium mb-4">Macronutrient Distribution</h3>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}g`, null]}
                labelFormatter={() => ''}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 text-center">
          {data.map((item) => (
            <div key={item.name} className="flex flex-col items-center">
              <div
                className="w-3 h-3 rounded-full mb-1"
                style={{ backgroundColor: item.color }}
              ></div>
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.value}g</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionChart;
