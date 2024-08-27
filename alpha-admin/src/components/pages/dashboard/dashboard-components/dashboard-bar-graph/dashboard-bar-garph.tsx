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

// Register components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardBarGarph: React.FC = () => {
    const data = {
        labels: ['Age 40-50', 'Age 40-50', 'Age 40-50', 'Age 40-50', 'Age 40-50'],
        datasets: [
            {
                label: 'Male',
                data: [20.4, 20.4, 20.4, 20.4, 20.4],
                backgroundColor: '#146CFD',
                barThickness: 24,
            },
            {
                label: 'Female',
                data: [20.4, 20.4, 20.4, 20.4, 20.4],
                backgroundColor: '#F59E0B',
                barThickness: 24,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom' as const,
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    boxWidth: 10,
                    boxHeight: 10,
                    font: {
                        family: 'Public Sans',
                        size: 12,
                        weight: 400,
                        lineHeight: 1.33,
                        textAlign: 'center',
                    },
                    color: '#383838',
                },
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                grid: {
                    drawBorder: false,
                    lineWidth: 0,
                },
                ticks: {
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
                grid: {
                    drawBorder: false,
                    lineWidth: 0,
                },
                ticks: {
                    font: {
                        family: 'Public Sans',
                        size: 10,
                        weight: 700,
                        lineHeight: 1,
                    },
                    letterSpacing: 0.15,
                    color: '#A1A1A1',
                    callback: (value: any) => `${value}%`, // Add % to the y-axis labels
                },
            },
        },
    };

    return <Bar data={data} options={options} />;
};

export default DashboardBarGarph;
