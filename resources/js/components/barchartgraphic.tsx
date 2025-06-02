import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

export default function BarChartGraphic({ data, title }: { data: { x: string; y: number }[], title: string }) {
  return (
    <div style={{ width: '100%', height: 500 }}>
      <h2 style={{ textAlign: 'center', color: '#ff8800', fontWeight: 700 }}>{title}</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="y" fill="#22aaff">
            <LabelList dataKey="y" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}