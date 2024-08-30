import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, ToggleButton } from 'react-bootstrap';
import { Icon } from '../../../icon/icon';
import styles from './viewLifeStyle.module.scss';
import { AppButton } from '../../../app-button/app-button';
import { LifestyleTable } from '../components/lifestyle-table/lifestyleTable';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../app/hooks';
import { fetchPlansThunk } from '../components/lifeStyleSlice';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { BackButton } from '../../../back-button/backButton';

export interface ReportsProps {
    className?: string;
}
/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const LifeStyle = ({ className }: ReportsProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [plans, setPlans] = React.useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const handleButtonClick = () => {
        navigate('/lifestyle-plan/new');
    };

    useEffect(() => {
        dispatch(fetchPlansThunk(1)).then((res: any) => {
            console.log('data', res);
            if (res.payload) {
                setPlans(res.payload.data);
                setTotalPages(res.payload.meta.totalPages);
                setTotalRecords(res.payload.meta.totalRecords);
            }
        });
    }, []);

    const handleBackClick = () => {
        navigate(-1); // This will navigate to the previous page
    };

    return (
        <div>
            <BackButton onClick={handleBackClick}/>

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
                    />
                </Row>
            </div>
        </div>
    );
};
