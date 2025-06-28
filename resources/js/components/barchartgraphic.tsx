import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

export default function BarChartGraphic({ data, title }: { data: { x: string; y: number }[], title: string }) {
  return (
    <div style={{ height: 500, width: '100%' }}>
      <h2 style={{ color: '#ff8800', fontWeight: 700, textAlign: 'center' }}>{title}</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [`${value}`, 'Total']}
            // labelFormatter={(label) => `Categoría: ${label}`}
          />
          <Legend />
          <Bar dataKey="y" fill="#22aaff" name="Total">
                        <LabelList
              dataKey="y"
              position="top"
              style={{ fill: '#666', fontSize: 12, fontWeight: 'bold' }}
              formatter={(value: number) => `${value}`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}