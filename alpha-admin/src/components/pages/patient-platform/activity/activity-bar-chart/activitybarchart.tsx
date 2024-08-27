// BarChart.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { LineWeight } from '@mui/icons-material';

// Register components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface ActivityBarChartProps {
    labels: string[];
    data: number[];
}

const ActivityBarChart: React.FC<ActivityBarChartProps> = ({ labels, data }) => {
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Steps',
                data: data,
                // backgroundColor: 'rgba(75, 192, 192, 0.2)',
                backgroundColor: '#146CFD',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                borderRadius: 10,
                barThickness: 24,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    boxWidth: 20,
                    boxHeight: 20,
                    font: {
                        family: 'Public Sans',
                        size: 12,
                        weight: 400,
                        LineHeight: 1.33,
                        textAlign: 'center',
                    },
                    color: '#383838',
                },
                afterFit: (legend: any) => {
                    legend.height += 20;
                },
            },
        },
        scales: {
            x: {
                ticks: {
                    autoSkip: true,
                    autoSkipPadding: 26,
                    maxRotation: 0,
                    font: {
                        family: 'Public Sans',
                        size: 14,
                        weight: 400,
                        lineHeight: 1.42,
                    },
                    letterSpacing: 0.15,
                    color: '#22272B',
                },
            },
            y: {
                ticks: {
                    autoSkip: true,
                    maxRotation: 0,
                    font: {
                        family: 'Public Sans',
                        size: 10,
                        weight: 700,
                        lineHeight: 1,
                    },
                    letterSpacing: 0.15,
                    color: '#A1A1A1',
                },
            },
        },
    };

    return <Bar data={chartData} options={options} />;
};

export default ActivityBarChart;
