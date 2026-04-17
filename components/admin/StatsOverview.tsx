import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, AlertTriangle, MapPin } from 'lucide-react'

export function StatsOverview() {
  const stats = [
    { title: 'Total Users', value: '1,234', icon: BarChart3, color: 'bg-blue-500' },
    { title: 'Active Alerts', value: '12', icon: AlertTriangle, color: 'bg-orange-500' },
    { title: 'Safe Routes', value: '45', icon: MapPin, color: 'bg-green-500' },
    { title: 'Risk Zones', value: '8', icon: BarChart3, color: 'bg-red-500' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-8 w-8 ${stat.color} text-white p-2 rounded-lg`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}