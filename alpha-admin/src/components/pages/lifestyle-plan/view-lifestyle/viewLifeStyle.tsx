import React from 'react';
import { Container, Row, Col, Table, Button, ToggleButton } from 'react-bootstrap';
import { Icon } from '../../../icon/icon';
import styles from './viewLifeStyle.module.scss';
import { AppButton } from '../../../app-button/app-button';
import { LifestyleTable } from '../components/lifestyle-table/lifestyleTable';
import { useNavigate } from 'react-router-dom';
export interface ReportsProps {
    className?: string;
}
/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const LifeStyle = ({ className }: ReportsProps) => {
    const navigate = useNavigate();
    const handleButtonClick = () => {
        navigate('/lifestyle-plan/new');
    };
    return (
        <div>
            <Row className="my-3 mx-3">
                <Col>
                    <Button variant="primary">Back</Button>
                </Col>
            </Row>

            <div className="m-5">
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
            <div className="m-5">
                <Row>
                    <LifestyleTable />
                </Row>
            </div>
        </div>
    );
};
