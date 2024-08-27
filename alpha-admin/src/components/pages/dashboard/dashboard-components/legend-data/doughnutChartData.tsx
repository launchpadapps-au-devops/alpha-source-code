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
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({ legendItems }) => {
    const labels = legendItems.map((item: { label: any }) => item.label);
    const data = legendItems.map((item: { percentage: string }) => parseFloat(item.percentage));
    const backgroundColor = legendItems.map((item: { color: any }) => item.color);
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
