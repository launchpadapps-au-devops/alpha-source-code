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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import styles from './lifestyleTable.module.scss';

const initialLifeStyles = [
    { code: 1, name: 'Heart health', dateCreated: '26/06/2024', published: false },
    { code: 2, name: 'Healthy Plan', dateCreated: '26/06/2024', published: false },
    { code: 3, name: 'Pregnancy', dateCreated: '26/06/2024', published: true },
];

export const LifestyleTable: React.FC<{ className?: string }> = ({ className }) => {
    const [LifeStyles, setLifeStyles] = useState(initialLifeStyles);
    const [selectedThemeIndex, setSelectedThemeIndex] = useState<number | null>(null);
    const [openPublishModal, setOpenPublishModal] = useState(false);
    const [openUnpublishModal, setOpenUnpublishModal] = useState(false);
    const navigate = useNavigate();

    const handleToggle = (index: number) => {
        const theme = LifeStyles[index];
        setSelectedThemeIndex(index);
        if (!theme.published) {
            setOpenPublishModal(true);
        } else {
            setOpenUnpublishModal(true);
        }
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

    const handleRowClick = (index: number) => {
        navigate(`/lifestyle-plan/view/${LifeStyles[index].code}`, {
            state: { isPublished: LifeStyles[index].published },
        });
    };

    return (
        <>
            <TableContainer component={Paper}>
                <Table className={classNames(styles['key-contacts-table'], className)}>
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
                        {LifeStyles.map((theme, index) => (
                            <TableRow
                                key={index}
                                onClick={() => handleRowClick(index)}
                                style={{ cursor: 'pointer' }}
                            >
                                <TableCell className={styles['code']}>{theme.name}</TableCell>
                                <TableCell>{theme.dateCreated}</TableCell>
                                <TableCell onClick={(event) => event.stopPropagation()}>
                                    <Switch
                                        checked={theme.published}
                                        onChange={() => handleToggle(index)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={styles.pagination}>
                <Pagination count={10} showFirstButton showLastButton />
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
