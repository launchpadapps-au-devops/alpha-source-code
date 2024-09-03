import classNames from 'classnames';
import styles from './activity-bar-chart.module.scss';
import {
    format,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    subWeeks,
    addWeeks,
    isSameDay,
} from 'date-fns';
import { useEffect, useState } from 'react';
import ActivityBarChart from './activitybarchart';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../../app/store';
import { fetchPatientDataOverviewThunk } from '../../patientDataOverviewSlice';

export interface ActivityChartProps {
    className?: string;
}

const sampleData = [
    { date: '2024-08-12T01:30:00.000-05:00', steps: 5000 },
    { date: '2024-08-14T01:30:00.000-05:00', steps: 7000 },
    { date: '2024-08-15T01:30:00.000-05:00', steps: 3000 },
    { date: '2024-08-18T01:30:00.000-05:00', steps: 10000 },
    { date: '2024-08-20T01:30:00.000-05:00', steps: 8000 },
    { date: '2024-08-21T01:30:00.000-05:00', steps: 9000 },
    { date: '2024-08-22T01:30:00.000-05:00', steps: 6000 },
];

export const ActivityChart = ({ className }: ActivityChartProps) => {
    const [currentWeek, setCurrentWeek] = useState(new Date());
    const [chartData, setChartData] = useState<number[]>([]);
    const [labels, setLabels] = useState<string[]>([]);

    const dispatch = useDispatch<AppDispatch>();
    const { loading, data: patientData } = useSelector(
        (state: RootState) => state.patientDataAnalyticsOverview
    );

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const dates = eachDayOfInterval({
    //             start: startOfWeek(currentWeek),
    //             end: endOfWeek(currentWeek),
    //         });

    //         const formattedLabels = dates.map((date) => format(date, 'MMM d'));

    //         const data = dates.map((date) => {
    //             const dayData = sampleData.find((item) => isSameDay(new Date(item.date), date));
    //             return dayData ? dayData.steps : 0;
    //         });

    //         setChartData(data);
    //         setLabels(formattedLabels);
    //     };

    //     fetchData();
    // }, [currentWeek]);

    useEffect(() => {
        const fetchData = async () => {
            const id = localStorage.getItem('selectedPatientId');
            if (!id) return;

            const fromDate = format(startOfWeek(currentWeek), 'yyyy-MM-dd');
            const toDate = format(endOfWeek(currentWeek), 'yyyy-MM-dd');

            // Dispatch the thunk to fetch patient data
            dispatch(fetchPatientDataOverviewThunk({ id, fromDate, toDate }));
        };

        fetchData();
    }, [currentWeek, dispatch]);

    useEffect(() => {
        if (patientData) {
            const dates = eachDayOfInterval({
                start: startOfWeek(currentWeek),
                end: endOfWeek(currentWeek),
            });

            const formattedLabels = dates.map((date) => format(date, 'MMM d'));

            const data = dates.map((date) => {
                const dayData = patientData.stepsPerDay.find((item) =>
                    isSameDay(new Date(item.date), date)
                );
                return dayData ? dayData.steps : 0;
            });

            setChartData(data);
            setLabels(formattedLabels);
        }
    }, [patientData, currentWeek]);

    const handlePrevWeek = () => {
        setCurrentWeek((prev) => subWeeks(prev, 1));
    };

    const handleNextWeek = () => {
        setCurrentWeek((prev) => addWeeks(prev, 1));
    };

    return (
        <div className={classNames(styles['activity-bar-chart'], className)}>
            <button
                className={classNames(styles['arrow-button'], styles['left-arrow'])}
                onClick={handlePrevWeek}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                >
                    <path
                        d="M13.0871 14.325L9.27044 10.5L13.0871 6.675L11.9121 5.5L6.91211 10.5L11.9121 15.5L13.0871 14.325Z"
                        fill="#146CFD"
                    />
                </svg>
            </button>
            <button
                className={classNames(styles['arrow-button'], styles['right-arrow'])}
                onClick={handleNextWeek}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                >
                    <path
                        d="M6.91289 6.675L10.7296 10.5L6.91289 14.325L8.08789 15.5L13.0879 10.5L8.08789 5.5L6.91289 6.675Z"
                        fill="#146CFD"
                    />
                </svg>
            </button>
            <div className={styles['chart-layout']}>
                <ActivityBarChart labels={labels} data={chartData} />
            </div>
        </div>
    );
};
