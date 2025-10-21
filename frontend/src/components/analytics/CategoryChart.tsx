import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CategoryData {
  _id: string;
  total: number;
}

interface CategoryChartProps {
  data: CategoryData[];
}

const COLORS = [
  '#673ab7', '#00bcd4', '#ff9800', '#f44336', '#4caf50', 
  '#2196f3', '#e91e63', '#9c27b0', '#009688', '#ffc107'
];

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  const chartData = data.map(item => ({ ...item, name: item._id }));

  return (
    <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="total"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            labelLine={false}
            label={(props: any) => {
              const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
              return (
                <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

  );
};

export default CategoryChart;
