import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PieChartGraphic({ data, title }: { data: { x: string; y: number }[], title: string }) {
    const COLORS = ['#0067b4', '#f68b25', '#2ecc71', '#e74c3c', '#9b59b6', '#f1c40f'];

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, innerRadius, midAngle, outerRadius, percent }: {
        cx: number;
        cy: number;
        midAngle: number;
        innerRadius: number;
        outerRadius: number;
        percent: number;
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? 'start' : 'end'}
                dominantBaseline="central"
                style={{ fontSize: '12px', fontWeight: 'bold' }}
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div style={{ height: 500, padding: '20px', width: '100%' }}>
            <h2 style={{ color: '#0067b4', fontWeight: 700, marginBottom: '20px', textAlign: 'center' }}>{title}</h2>
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="y"
                        nameKey="x"
                        cx="50%"
                        cy="50%"
                        outerRadius={170}
                        fill="#8884d8"
                        label={renderCustomizedLabel}
                        labelLine={false}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => [`${value}`, 'Valor']}
                        labelFormatter={(label) => `Categoría: ${label}`}
                    />
                    <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        wrapperStyle={{ paddingTop: '20px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}