import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { EmptyComponent } from '../../../../empty-state-component/empty-component';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface LegendItemData {
    label: string;
    percentage: string;
    color: string;
}

interface DoughnutChartProps {
    legendItems: LegendItemData[];
    emptyDoughnut?: {
        color: string;
        width: number;
        radiusDecrease: number;
    };
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({ legendItems, emptyDoughnut }) => {
    const labels = legendItems.map((item: { label: any }) => item.label);
    const data = legendItems.map((item: { percentage: string }) => parseFloat(item.percentage));
    const backgroundColor = legendItems.map((item: { color: any }) => item.color);

    // Check if all the values are zero
    const allValuesAreZero = data.every((value) => value === 0);

    if (allValuesAreZero && emptyDoughnut) {
        // If all values are zero, return an empty doughnut with custom style
        const emptyDoughnutData = {
            labels: ['Empty'],
            datasets: [
                {
                    data: [1],
                    backgroundColor: [emptyDoughnut.color],
                    borderWidth: emptyDoughnut.width,
                    hoverBackgroundColor: [emptyDoughnut.color],
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                },
            ],
        };

        const emptyDoughnutOptions = {
            cutout: `${emptyDoughnut.radiusDecrease}%`,
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: {
                    enabled: false,
                },
            },
        };

        return <Doughnut data={emptyDoughnutData} options={emptyDoughnutOptions} />;
    }

    const doughnutData = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: backgroundColor,
                hoverBackgroundColor: backgroundColor,
                borderWidth: 1,
                borderColor: '#ffffff',
            },
        ],
    };

    const doughnutOptions = {
        cutout: '50%',
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.raw !== null) {
                            label += `${context.raw}%`;
                        }
                        return label;
                    },
                },
            },
        },
    };

    if (legendItems.length === 0) {
        return (
            <EmptyComponent
                title="No Data Available"
                description="There is currently no data to display."
            />
        );
    }

    return <Doughnut data={doughnutData} options={doughnutOptions} />;
};
