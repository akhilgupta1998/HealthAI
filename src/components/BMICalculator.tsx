
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BMICalculator = () => {
  const [weight, setWeight] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState<string>('');

  // Calculate BMI whenever inputs change
  useEffect(() => {
    if (weight && height && height > 0) {
      let heightInMeters: number;
      
      if (heightUnit === 'cm') {
        heightInMeters = Number(height) / 100;
      } else {
        // Convert feet to meters (1 foot = 0.3048 meters)
        heightInMeters = Number(height) * 0.3048;
      }
      
      const calculatedBMI = Number(weight) / (heightInMeters * heightInMeters);
      const roundedBMI = Math.round(calculatedBMI * 10) / 10;
      setBmi(roundedBMI);
      
      // Determine BMI category
      if (roundedBMI < 18.5) {
        setBmiCategory('Underweight');
      } else if (roundedBMI >= 18.5 && roundedBMI < 25) {
        setBmiCategory('Normal weight');
      } else if (roundedBMI >= 25 && roundedBMI < 30) {
        setBmiCategory('Overweight');
      } else {
        setBmiCategory('Obese');
      }
    } else {
      setBmi(null);
      setBmiCategory('');
    }
  }, [weight, height, heightUnit]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>BMI Calculator</CardTitle>
        <CardDescription>Calculate your Body Mass Index</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Enter weight"
              value={weight}
              onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                type="number"
                placeholder={`Enter height in ${heightUnit}`}
                value={height}
                onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : '')}
              />
            </div>
            <div>
              <Label htmlFor="height-unit">Unit</Label>
              <Select value={heightUnit} onValueChange={(value) => setHeightUnit(value as 'cm' | 'ft')}>
                <SelectTrigger id="height-unit">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cm">cm</SelectItem>
                  <SelectItem value="ft">ft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {bmi !== null && (
            <div className="mt-4 p-4 rounded-md bg-primary/10 text-center">
              <p className="text-lg font-semibold">Your BMI: {bmi}</p>
              <p className="text-sm text-muted-foreground">
                Category: <span className="font-medium">{bmiCategory}</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BMICalculator;
