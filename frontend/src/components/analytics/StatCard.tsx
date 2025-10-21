import { Card, Typography, Box } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactElement;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2, backgroundColor: color, color: 'white' }}>
      <Box sx={{ mr: 2 }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="h6">{value}</Typography>
        <Typography variant="subtitle2">{title}</Typography>
      </Box>
    </Card>
  );
};

export default StatCard;
