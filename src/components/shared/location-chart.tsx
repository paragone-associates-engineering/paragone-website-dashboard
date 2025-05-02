import { SetStateAction, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const PropertyMapChart = () => {
  const [activeRegion, setActiveRegion] = useState(null);
  
  // Data for the chart
  const data = [
    { name: 'Europe', value: 224, color: '#EAB308' },
    { name: 'Asia', value: 532, color: '#6B7280' },
    { name: 'Africa', value: 653, color: '#6B7280' },
    { name: 'Australia', value: 567, color: '#6B7280' },
    { name: 'America', value: 234, color: '#6B7280' },
  ];
  
  const handleBarClick = (entry: { name: SetStateAction<null>; }) => {
    setActiveRegion(entry.name);
  };
  
  return (
    <Card className="lg:col-span-2">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Properties Map Location</h3>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Chart replacing the map */}
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" onClick={handleBarClick}>
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.name === activeRegion ? '#EAB308' : entry.color} 
                    cursor="pointer"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div>
            <h4 className="text-sm">Europe</h4>
            <div className="flex items-center gap-2">
              <Progress value={60} className="h-2 bg-gray-200 flex-1" />
              <span className="text-xs">653 Unit</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm">Asia</h4>
            <div className="flex items-center gap-2">
              <Progress value={50} className="h-2 bg-gray-200 flex-1" />
              <span className="text-xs">653 Unit</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm">Africa</h4>
            <div className="flex items-center gap-2">
              <Progress value={70} className="h-2 bg-gray-200 flex-1" />
              <span className="text-xs">653 Unit</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm">Australia</h4>
            <div className="flex items-center gap-2">
              <Progress value={30} className="h-2 bg-gray-200 flex-1" />
              <span className="text-xs">653 Unit</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm">America</h4>
            <div className="flex items-center gap-2">
              <Progress value={45} className="h-2 bg-gray-200 flex-1" />
              <span className="text-xs">653 Unit</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyMapChart;