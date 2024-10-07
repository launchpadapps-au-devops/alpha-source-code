import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Switch,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../../../app/hooks';
import { fetchPlansThunk, updatePlanThunk } from '../lifeStyleSlice';
import { CustomPagination } from '../../../content/content-components/custom-pagination/customPagination';
import { PublishLessonModal } from '../../../content/lessons/lesson-components/publish-lesson-modal/publishLessonModal';
import { UnpublishLessonModal } from '../../../content/lessons/lesson-components/unpublish-lesson-modal/unpublishLessonModal';
import styles from './lifestyleTable.module.scss';

export interface lifeStyleProps {
    plans: any[];
    setPlans: React.Dispatch<React.SetStateAction<any[]>>;
    totalPages: number;
    totalRecords: number;
    setTotalPages: React.Dispatch<React.SetStateAction<number>>;
    setTotalRecords: React.Dispatch<React.SetStateAction<number>>;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export const LifestyleTable: React.FC<lifeStyleProps> = ({
    plans,
    setPlans,
    totalPages,
    setTotalPages,
    totalRecords,
    setTotalRecords,
    currentPage,
    setCurrentPage,
}) => {
    const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);
    const [openPublishModal, setOpenPublishModal] = useState(false);
    const [openUnpublishModal, setOpenUnpublishModal] = useState(false);
    const itemsPerPage = 10;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            const nextPage = currentPage + 1;
            dispatch(fetchPlansThunk(nextPage)).then((res: any) => {
                setPlans(res.payload.data);
                setTotalPages(res.payload.meta.totalPages);
                setTotalRecords(res.payload.meta.totalRecords);
                setCurrentPage(nextPage);
            });
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            const previousPage = currentPage - 1;
            dispatch(fetchPlansThunk(previousPage)).then((res: any) => {
                setPlans(res.payload.data);
                setTotalPages(res.payload.meta.totalPages);
                setTotalRecords(res.payload.meta.totalRecords);
                setCurrentPage(previousPage);
            });
        }
    };

    const handleToggle = (plan: any) => {
        const updatedPlan = {
            planData: {
                isPublished: !plan.isPublished,
            },
            themes: plan.themes.map((t: any) => t.id),
        };

        dispatch(updatePlanThunk({ id: plan.id, plan: updatedPlan })).then(() => {
            dispatch(fetchPlansThunk(currentPage)); // Refresh plans after updating
        });
    };

    const handlePublish = () => {
        if (selectedPlanIndex !== null) {
            setOpenPublishModal(false);
            const selectedPlan = plans[selectedPlanIndex];
            handleToggle(selectedPlan);
        }
    };

    const handleUnpublish = () => {
        if (selectedPlanIndex !== null) {
            setOpenUnpublishModal(false);
            const selectedPlan = plans[selectedPlanIndex];
            handleToggle(selectedPlan);
        }
    };

    const handleRowClick = (id: any, index: number) => {
        setSelectedPlanIndex(index);
        navigate(`/lifestyle-plan/view/${id}`);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = plans.slice(indexOfFirstItem, indexOfLastItem);

    const formatDate = (data: any) => {
        const date = new Date(data);
        return `${date.getDate() > 9 ? date.getDate() : '0' + date.getDate()}/${
            date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
        }/${date.getFullYear()}`;
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table className={styles['key-contacts-table']}>
                    <TableHead>
                        <TableRow>
                            <TableCell className={styles['code']}>Plan name</TableCell>
                            <TableCell className={styles['date']}>Date created</TableCell>
                            <TableCell className={styles['published']}>Published</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems.map((plan: any, index: any) => (
                            <TableRow
                                key={index}
                                onClick={() => handleRowClick(plan.id, index)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell className={styles['code']}>{plan.name}</TableCell>
                                <TableCell>{formatDate(plan.createdAt)}</TableCell>
                                <TableCell onClick={(event) => event.stopPropagation()}>
                                    <Switch
                                        checked={plan.isPublished}
                                        onChange={() => {
                                            setSelectedPlanIndex(index);
                                            plan.isPublished
                                                ? setOpenUnpublishModal(true)
                                                : setOpenPublishModal(true);
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={styles.pagination}>
                <CustomPagination
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    onPageChange={(page) => {
                        dispatch(fetchPlansThunk(page)).then((res: any) => {
                            setPlans(res.payload.data);
                            setTotalPages(res.payload.meta.totalPages);
                            setTotalRecords(res.payload.meta.totalRecords);
                            setCurrentPage(page);
                        });
                    }}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </div>
            {openPublishModal && selectedPlanIndex !== null && (
                <PublishLessonModal
                    open={openPublishModal}
                    descriptionText={
                        <>
                            <p>Are you sure you wish to publish this plan?</p>
                            <br />
                            <p>This plan will be made available to patients.</p>
                        </>
                    }
                    title="Publish Plan"
                    closeModal={() => setOpenPublishModal(false)}
                    handlePublish={handlePublish}
                />
            )}
            {openUnpublishModal && selectedPlanIndex !== null && (
                <UnpublishLessonModal
                    open={openUnpublishModal}
                    descriptionText={
                        <>
                            <p>Are you sure you wish to unpublish this plan?</p>
                            <br />
                            <p>
                                This plan will be saved to ‘Drafts’ and won’t be visible to patients.
                            </p>
                        </>
                    }
                    title="Unpublish Plan"
                    closeModal={() => setOpenUnpublishModal(false)}
                    handleunpublish={handleUnpublish}
                />
            )}
        </>
    );
};
