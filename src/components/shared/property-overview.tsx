//import { useState } from 'react';
import { MoreHorizontal, ChevronUp, Package } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PropertyOverviewChart = () => {
  
  const data = [
    { name: 'Jan', sale: 800, rent: 600, shortStay: 300, land: 200 },
    { name: 'Feb', sale: 1000, rent: 700, shortStay: 350, land: 250 },
    { name: 'Mar', sale: 1200, rent: 650, shortStay: 400, land: 300 },
    { name: 'Apr', sale: 1100, rent: 800, shortStay: 450, land: 350 },
    { name: 'May', sale: 1400, rent: 750, shortStay: 500, land: 320 },
    { name: 'Jun', sale: 1300, rent: 650, shortStay: 350, land: 290 },
    { name: 'Jul', sale: 1600, rent: 700, shortStay: 400, land: 310 },
    { name: 'Aug', sale: 1800, rent: 750, shortStay: 500, land: 340 },
    { name: 'Sep', sale: 2000, rent: 800, shortStay: 550, land: 380 },
    { name: 'Oct', sale: 1900, rent: 750, shortStay: 500, land: 350 },
    { name: 'Nov', sale: 2200, rent: 850, shortStay: 650, land: 450 },
    { name: 'Dec', sale: 2346, rent: 458, shortStay: 1446, land: 545 },
  ];

  return (
    <Card className="lg:col-span-2">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-medium">Overview</h3>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Sale</p>
              <p className="font-medium">2,346 Unit</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-green-100 p-2 rounded">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Rent</p>
              <p className="font-medium">458 Unit</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-purple-100 p-2 rounded">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Short Stay</p>
              <p className="font-medium">1,446 Unit</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-red-100 p-2 rounded">
              <Package className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Land</p>
              <p className="font-medium">545 Unit</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full flex items-center">
            <span className="mr-1">0.8%</span>
            <ChevronUp className="h-3 w-3" />
          </div>
          <span className="text-xs text-gray-500">than last week</span>
        </div>

        {/* Line Chart */}
        <div className="h-16 sm:h-[30rem] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.5rem',
                  borderColor: '#e2e8f0',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line 
                type="monotone" 
                dataKey="sale" 
                stroke="#3b82f6" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
                activeDot={{ r: 5 }} 
              />
              <Line 
                type="monotone" 
                dataKey="rent" 
                stroke="#10b981" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
                activeDot={{ r: 5 }} 
              />
              <Line 
                type="monotone" 
                dataKey="shortStay" 
                stroke="#8b5cf6" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
                activeDot={{ r: 5 }} 
              />
              <Line 
                type="monotone" 
                dataKey="land" 
                stroke="#ef4444" 
                strokeWidth={2} 
                dot={{ r: 3 }} 
                activeDot={{ r: 5 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs">Total Sale</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Total Rent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-xs">Short Stay</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs">Total Land</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyOverviewChart;