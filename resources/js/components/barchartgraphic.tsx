import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BarChartGraphic({ data, title }: { data: { x: string; y: number }[]; title: string }) {
    return (
        <Card className="h-[500px] w-full shadow-md">
            <CardHeader>
                <CardTitle className="text-primary text-center text-xl font-bold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="x" />
                        <YAxis />
                        <Tooltip formatter={(value: number) => [`${value}`, 'Total']} />
                        <Legend />
                        <Bar dataKey="y" fill="#22aaff" name="Total">
                            <LabelList
                                dataKey="y"
                                position="top"
                                style={{
                                    fill: '#666',
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
