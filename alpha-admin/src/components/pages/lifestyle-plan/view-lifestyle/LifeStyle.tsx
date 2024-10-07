import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { AppButton } from '../../../app-button/app-button';
import { LifestyleTable } from '../components/lifestyle-table/lifestyleTable';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../app/hooks';
import { fetchPlansThunk } from '../components/lifeStyleSlice';
import { BackButton } from '../../../back-button/backButton';
import styles from './LifeStyle.module.scss';

interface Plan {
    id: number;
    name: string;
    createdAt: string;
    isPublished: boolean;
    themes: any[];
}

export interface ReportsProps {
    className?: string;
}

export const LifeStyle = ({ className }: ReportsProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const handleButtonClick = () => {
        navigate('/lifestyle-plan/new');
    };

    useEffect(() => {
        dispatch(fetchPlansThunk(currentPage)).then((res: any) => {
            if (res.payload) {
                setPlans(res.payload.data);
                setTotalPages(res.payload.meta.totalPages);
                setTotalRecords(res.payload.meta.totalRecords);
            }
        });
    }, [dispatch, currentPage]);

    const handleBackClick = () => {
        navigate(-1); // Navigate to the previous page
    };

    return (
        <div>
            <BackButton onClick={handleBackClick} />
            <div className="mx-5">
                <Row>
                    <Col className="text-right">
                        <div className={styles['container-header']}>
                            <h2 className={styles['container-header-title']}>Lifestyle plans</h2>
                            <AppButton
                                showLeftIcon
                                buttonText="Create lifestyle plan"
                                onButtonClick={handleButtonClick}
                            />
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="mx-5">
                <Row>
                    <LifestyleTable
                        plans={plans}
                        setPlans={setPlans}
                        totalPages={totalPages}
                        totalRecords={totalRecords}
                        setTotalPages={setTotalPages}
                        setTotalRecords={setTotalRecords}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />
                </Row>
            </div>
        </div>
    );
};
