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
    Pagination,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from './lifestyleTable.module.scss';
import { useAppDispatch } from '../../../../../app/hooks';
import { fetchPlansThunk, updatePlanThunk } from '../lifeStyleSlice';
import TableFooter from '../../../content/content-components/table-footer/TableFooter';

const initialLifeStyles = [
    { code: 1, name: 'Heart health', dateCreated: '26/06/2024', published: false },
    { code: 2, name: 'Healthy Plan', dateCreated: '26/06/2024', published: false },
    { code: 3, name: 'Pregnancy', dateCreated: '26/06/2024', published: true },
];

export interface lifeStyleProps {
    plans: any;
    setPlans: any;
    totalPages: number;
    setTotalPages: any;
    totalRecords: number;
    setTotalRecords: any;
}

export const LifestyleTable: React.FC<lifeStyleProps> = ({
    plans,
    setPlans,
    totalPages,
    setTotalPages,
    totalRecords,
    setTotalRecords,
}) => {
    const [LifeStyles, setLifeStyles] = useState(initialLifeStyles);
    const [selectedThemeIndex, setSelectedThemeIndex] = useState<number | null>(null);
    const [openPublishModal, setOpenPublishModal] = useState(false);
    const [openUnpublishModal, setOpenUnpublishModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleNextPage = () => {
        console.log('currentPage', currentPage);
        dispatch(fetchPlansThunk(currentPage + 1)).then((res: any) => {
            console.log('res', res);
            setLifeStyles(res.payload.data);
            setTotalPages(res.payload.meta.totalPages);
            setTotalRecords(res.payload.meta.totalRecords);
        });
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePreviousPage = () => {
        // setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
        dispatch(fetchPlansThunk(currentPage - 1)).then((res: any) => {
            setLifeStyles(res.payload.data);
            setTotalPages(res.payload.meta.totalPages);
            setTotalRecords(res.payload.meta.totalRecords);
        });
        setCurrentPage((prevPage) => Math.min(prevPage - 1, totalPages));
    };

    const handleToggle = (plan: any) => {
        const newTheme = {
            planData: {
                planCode: parseInt(plan.code, 10),
                name: plan.name,
                image: plan.image,
                description: plan.description,
                internalNotes: plan.internalNotes,
                status: plan.status,
                isPublished: !plan.isPublished,
                id: parseInt(plan.id, 10),
            },
            themes: plan.themes.map((t: any) => ({
                ...t,
                id: parseInt(t.id, 10),
                themeCode: parseInt(t.themeCode, 10),
                categoryId: parseInt(t.categoryId, 10),
            })),
        };
        dispatch(updatePlanThunk({ id: newTheme.planData.id, plan: newTheme })).then(
            (data: any) => {
                dispatch(fetchPlansThunk(1)).then((data: any) => {
                    if (data.payload) {
                        setPlans(data.payload.data);
                    }
                });
            }
        );
    };

    const handlePublish = () => {
        if (selectedThemeIndex !== null) {
            setLifeStyles((prevLifeStyles) =>
                prevLifeStyles.map((theme, i) =>
                    i === selectedThemeIndex ? { ...theme, published: true } : theme
                )
            );
        }
        setOpenPublishModal(false);
    };

    const handleUnpublish = () => {
        if (selectedThemeIndex !== null) {
            setLifeStyles((prevLifeStyles) =>
                prevLifeStyles.map((theme, i) =>
                    i === selectedThemeIndex ? { ...theme, published: false } : theme
                )
            );
        }
        setOpenUnpublishModal(false);
    };

    const handleCloseModal = () => {
        setOpenPublishModal(false);
        setOpenUnpublishModal(false);
    };

    const handleRowClick = (id: any) => {
        navigate(`/lifestyle-plan/view/${id}`);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = plans.slice(indexOfFirstItem, indexOfLastItem);

    const activePlans = plans.filter((plan: any) => plan.status.toLowerCase() === 'active');

    return (
        <>
            <TableContainer component={Paper}>
                <Table className={styles['key-contacts-table']}>
                    <TableHead>
                        <TableRow
                            style={{
                                textTransform: 'none',
                                fontFamily: 'Public Sans',
                                fontSize: '14px',
                            }}
                        >
                            <TableCell className={styles['code']}>Plan name</TableCell>
                            <TableCell className={styles['date']}>Date created</TableCell>
                            <TableCell className={styles['published']}>Published</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {activePlans.map((plan: any, index: any) => (
                            <TableRow
                                key={index}
                                onClick={() => handleRowClick(plan.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell className={styles['code']}>{plan.name}</TableCell>
                                <TableCell>{plan.createdAt}</TableCell>
                                <TableCell onClick={(event) => event.stopPropagation()}>
                                    <Switch
                                        checked={plan.isPublished}
                                        onChange={() => handleToggle(plan)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={styles.pagination}>
                <TableFooter
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </div>
            {/* {openPublishModal && selectedThemeIndex !== null && (
                <PublishLessonModal
                    open={openPublishModal}
                    descriptionText={
                        <>
                            <p>Are you sure you wish to publish this lesson?</p>
                            <br />
                            <p>This lesson will be made available to patients.</p>
                        </>
                    }
                    title="Publish lesson"
                    closeModal={handleCloseModal}
                    handlePublish={handlePublish}
                />
            )} */}
            {/* {openUnpublishModal && selectedThemeIndex !== null && (
                <UnpublishLessonModal
                    open={openUnpublishModal}
                    descriptionText={
                        <>
                            <p>Are you sure you wish to unpublish this lesson?</p>
                            <br />
                            <p>
                                This lesson will be saved to ‘Drafts’ and won’t be visible to
                                patients.
                            </p>
                        </>
                    }
                    title="Unpublish lesson"
                    closeModal={handleCloseModal}
                    handleunpublish={handleUnpublish}
                />
            )} */}
        </>
    );
};
