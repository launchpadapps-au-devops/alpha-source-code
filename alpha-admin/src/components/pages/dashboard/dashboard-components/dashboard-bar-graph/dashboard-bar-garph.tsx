// import React from 'react';
// import { Bar } from 'react-chartjs-2';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     BarElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';

// // Register components
// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// interface DashboardBarGraphProps {
//     users: { id: string; gender: string; age: number }[];
//     count: number;
// }

// const DashboardBarGarph: React.FC<DashboardBarGraphProps> = ({ users, count }) => {
//     const ageGroups = ['10-20', '21-30', '31-40', '41-50', '51-60', '61-70'];
//     const maleCounts = ageGroups.map(
//         (group) =>
//             users.filter(
//                 (user) =>
//                     user.gender === 'male' &&
//                     user.age >= parseInt(group.split('-')[0]) &&
//                     user.age <= parseInt(group.split('-')[1])
//             ).length
//     );
//     const femaleCounts = ageGroups.map(
//         (group) =>
//             users.filter(
//                 (user) =>
//                     user.gender === 'female' &&
//                     user.age >= parseInt(group.split('-')[0]) &&
//                     user.age <= parseInt(group.split('-')[1])
//             ).length
//     );

//     console.log('maleCounts', maleCounts);
//     console.log('femaleCounts', femaleCounts);
//     console.log('users', users);
//     const data = {
//         labels: ageGroups.map((group) => `Age ${group}`),
//         // labels: ['Age 10-20', 'Age 20-30', 'Age 30-40', 'Age 40-50', 'Age 50-60', 'Age 60-70'],
//         datasets: [
//             {
//                 label: 'Male',
//                 data: maleCounts,
//                 // data: [20.4, 20.4, 20.4, 20.4, 20.4],
//                 backgroundColor: '#146CFD',
//                 barThickness: 24,
//             },
//             {
//                 label: 'Female',
//                 data: femaleCounts,
//                 // data: [20.4, 20.4, 20.4, 20.4, 20.4],
//                 backgroundColor: '#F59E0B',
//                 barThickness: 24,
//             },
//         ],
//     };

//     const options = {
//         responsive: true,
//         plugins: {
//             legend: {
//                 display: true,
//                 position: 'bottom' as const,
//                 labels: {
//                     usePointStyle: true,
//                     padding: 20,
//                     boxWidth: 10,
//                     boxHeight: 10,
//                     font: {
//                         family: 'Public Sans',
//                         size: 12,
//                         weight: 400,
//                         lineHeight: 1.33,
//                         textAlign: 'center',
//                     },
//                     color: '#383838',
//                 },
//             },
//             tooltip: {
//                 enabled: true,
//             },
//         },
//         scales: {
//             x: {
//                 grid: {
//                     drawBorder: false,
//                     lineWidth: 0,
//                 },
//                 ticks: {
//                     font: {
//                         family: 'Public Sans',
//                         size: 14,
//                         weight: 400,
//                         lineHeight: 1.42,
//                     },
//                     letterSpacing: 0.15,
//                     color: '#22272B',
//                 },
//             },
//             y: {
//                 grid: {
//                     drawBorder: false,
//                     lineWidth: 0,
//                 },
//                 ticks: {
//                     font: {
//                         family: 'Public Sans',
//                         size: 10,
//                         weight: 700,
//                         lineHeight: 1,
//                     },
//                     letterSpacing: 0.15,
//                     color: '#A1A1A1',
//                     callback: (value: any) => `${value}%`, // Add % to the y-axis labels
//                 },
//             },
//         },
//     };

//     return <Bar data={data} options={options} />;
// };

// export default DashboardBarGarph;

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

interface DashboardBarGraphProps {
    users: { id: string; gender: string; age: number }[];
    count: number;
}

const DashboardBarGarph: React.FC<DashboardBarGraphProps> = ({ users, count }) => {
    const ageGroups = ['10-20', '21-30', '31-40', '41-50', '51-60', '61-70'];

    const getPercentage = (num: number) => (num / count) * 100;

    const maleCounts = ageGroups.map((group) =>
        getPercentage(
            users.filter(
                (user) =>
                    user.gender.toLowerCase() === 'male' &&
                    user.age >= parseInt(group.split('-')[0]) &&
                    user.age <= parseInt(group.split('-')[1])
            ).length
        )
    );

    const femaleCounts = ageGroups.map((group) =>
        getPercentage(
            users.filter(
                (user) =>
                    user.gender.toLowerCase() === 'female' &&
                    user.age >= parseInt(group.split('-')[0]) &&
                    user.age <= parseInt(group.split('-')[1])
            ).length
        )
    );

    const data = {
        labels: ageGroups.map((group) => `Age ${group}`),
        datasets: [
            {
                label: 'Male',
                data: maleCounts,
                backgroundColor: '#146CFD',
                barThickness: 24,
            },
            {
                label: 'Female',
                data: femaleCounts,
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
