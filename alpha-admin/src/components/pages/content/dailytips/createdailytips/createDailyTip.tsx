import classNames from 'classnames';
import { List, Typography } from '@mui/material';
import styles from './createDailyTip.module.scss';
import { AppButton } from '../../../../app-button/app-button';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../content-components/sidebar/Sidebar';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { addTipThunk, fetchTipsThunk } from '../viewTipsSlice';
import { EditButton } from '../../content-components/edit-button/edit-button';
import { DeleteButton } from '../../content-components/delete-button/delete-button';
import { RootState } from '../../../../../app/store'; // Adjust import path as necessary
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { BackButton } from '../../../../back-button/backButton';
import TableFooter from '../../content-components/table-footer/TableFooter';

export interface ContentProps {
    className?: string;
}

interface Tip {
    id: number;
    day: number;
    content: string;
    status: string;
    version: number;
    createdAt: string;
    updatedAt: string;
    tip: string; // Add this property if required
    date: string; // Add this property if required
    totalPages: number;
    setTotalPages: any;
    totalRecords: number;
    setTotalRecords: any;
}

export const CreateDailyTips = ({ className }: ContentProps) => {
    // const navigate = useNavigate();
    // const [newDailyTip, setNewDailyTip] = useState(false);
    // const buttonRef = useRef<HTMLButtonElement>(null);
    // const [newDailytipName, setNewDailytipName] = useState('');
    // const dispatch = useAppDispatch();
    // const [isEditable, setIsEditable] = useState(false);
    // const [editTipId, setEditTipId] = useState<number | null>(null);
    // const [editContent, setEditContent] = useState('');
    // const [editDay, setEditDay] = useState('');

    // // Use RootState to correctly type the selector
    // const tips = useAppSelector((state: RootState) => state.tips.tips);

    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuWidth, setMenuWidth] = useState<number>(0);
    const buttonRef = useRef<HTMLButtonElement>(null);
    let tips = useAppSelector((state) => state.tips.tips.tips);
    const dispatch = useAppDispatch();

    // State to track if tips are editable
    const [isEditable, setIsEditable] = useState(false);
    const [editTipId, setEditTipId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [newDailyTip, setnewDailyTip] = useState(false);
    const [newDailytipName, setNewDailytipName] = useState('');
    const [newDailytipDay, setNewDailytipDay] = useState('');
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const handleNextPage = () => {
        console.log('currentPage', currentPage);
        dispatch(fetchTipsThunk(currentPage + 1)).then((res: any) => {
            console.log('res', res);
            setTotalPages(res.payload.meta.totalPages);
            setTotalRecords(res.payload.meta.totalRecords);
        });
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };
    const handlePreviousPage = () => {
        dispatch(fetchTipsThunk(currentPage - 1)).then((res: any) => {
            setTotalPages(res.payload.meta.totalPages);
            setTotalRecords(res.payload.meta.totalRecords);
        });
        setCurrentPage((prevPage) => Math.min(prevPage - 1, totalPages));
    };


    const handleEditClick = (tipId: number, content: string) => {
        setIsEditable(true);
        setEditTipId(tipId);
        setEditContent(content);
    };

    const handleSaveClick = (tipId: number) => {
        if (editContent.trim() === '') {
            alert('Tip content cannot be empty.');
            return;
        }

        console.log('Saving tip with ID:', tipId, 'Content:', editContent);

        // Find and update the specific tip by ID
        const updatedTip = tips.find((tip: Tip) => tip.id === tipId);
        if (!updatedTip) {
            alert('Tip not found.');
            return;
        }

        // Construct the updated tip data with all required fields
        const updatedTipData: any = {
            ...updatedTip,
            content: newDailytipName,
            status: "ACTIVE",
            // Include default or computed values for required fields
            tip: updatedTip.tip || '', // Set a default value if necessary
            date: updatedTip.date || new Date().toISOString(), // Set the current date or another appropriate value
        };

        console.log('Updated Tip Data:', updatedTipData);
        const newUpdatedValue = {
            
                content: newDailytipName,
                day: newDailytipDay,
                status: "ACTIVE",
            
        };
        // Dispatch the updated single tip object
        dispatch(addTipThunk(newUpdatedValue));
        dispatch(fetchTipsThunk(1));

        setnewDailyTip(false);
        setEditContent('');
    };


    const handleDeleteClick = (tipId: number) => {
        // Dispatch an action to delete the tip by its id
        setEditTipId(null);
        setEditContent('');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditContent(e.target.value);
    };

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (path: string) => {
        navigate(path);
        handleClose();
    };

    useEffect(() => {
        if (buttonRef.current) {
            setMenuWidth(buttonRef.current.offsetWidth);
        }
    }, [buttonRef.current]);

    useEffect(() => {
        dispatch(fetchTipsThunk(1)).then((res: any) => {
            console.log('res', res);
            setTotalPages(res.payload.meta.totalPages);
            setTotalRecords(res.payload.meta.totalRecords);
        });
    }, [dispatch]);
    
    const handleNewDailyTip = () => {
        const newUpdatedValue = {
            
                content: newDailytipName,
                day: newDailytipDay,
                status: "ACTIVE",
            
        };
        // Dispatch the updated single tip object
        dispatch(addTipThunk(newUpdatedValue));
        dispatch(fetchTipsThunk(1));

        setnewDailyTip(false);
        // setEditTipId(null);
        // setEditContent('');
    };

    useEffect(() => {
        setnewDailyTip(true);
    }, []);

    function handleSaveAndAddMoreClick(tips: any): void {
        throw new Error('Function not implemented.');
    }

    const handleBackClick = () => {
        navigate(-1); // This will navigate to the previous page
    };

    return (
        <>
         <BackButton onClick={handleBackClick}/>
        <div className={classNames(styles.container, className)}>
            <Sidebar />
            <div className={styles.content}>
                <header className={styles.header}>
                    <Typography variant="h5">Create Daily tips</Typography>

                    <div className={styles.leftButtonContainer}>
                        <DeleteButton showLeftIcon />
                        <EditButton buttonText="Cancel"  onButtonClick={() => navigate('/content/dailytips')}/>
                    </div>
                    <div className={styles.rightButtonContainer}>
                        <AppButton buttonText="Save" />
                    </div>
                </header>

                <div className={styles.categories}>
                    <div className={styles.tableheader}>
                        <span className={styles.headerText}>Day</span>
                        <span className={styles.headerText}>Daily tips</span>
                    </div>
                       
                    <List>
                    {newDailyTip && (
                            <tr>
                                <td>
                                    <div className={styles.categoryCell}>
                                        <input
                                            type="text"
                                            className={styles.contentInput1}
                                            value={newDailytipDay}
                                            onChange={(e: { target: { value: SetStateAction<string>; }; }) => setNewDailytipDay(e.target.value)}
                                            required
                                        />
                                        <input
                                            type="text"
                                            className={styles.contentInput}
                                            value={newDailytipName}
                                            onChange={(e) => setNewDailytipName(e.target.value)}
                                            required
                                        />

                                        <AppButton
                                        buttonText="Save & add more"
                                        className={styles.button}
                                        onButtonClick={() => handleSaveAndAddMoreClick(tips)}
                                    />
                                        <EditButton
                                            buttonText="Save"
                                            className={styles.button}
                                            onButtonClick={handleNewDailyTip}
                                        />
                                        <DeleteButton
                                            buttonText="Delete"
                                            className={styles.button}
                                            onButtonClick={() => setnewDailyTip(false)}
                                        />
                                    </div>
                                </td>
                            </tr>
                        )}
                    
                        {tips &&
                            tips.length > 0 &&
                            tips
                                .filter((tip: Tip) => tip.status.toLowerCase() === 'active')
                                .map((tip: Tip) => (
                                    <div className={styles.listItem} key={tip.id}>
                                        {editTipId === tip.id ? (
                                            <>
                                                <div className={styles.dayInput}>{tip.day}</div>
                                                <input
                                                    className={styles.contentInput}
                                                    type="text"
                                                    value={editContent}
                                                    onChange={handleInputChange}
                                                />
                                                <AppButton
                                                    buttonText="Save & add more"
                                                    className={styles.button}
                                                />
                                                <EditButton
                                                    buttonText="Save"
                                                    className={styles.button}
                                                    onButtonClick={() => handleSaveClick(tip.id)}
                                                />
                                                <DeleteButton
                                                    buttonText="Delete"
                                                    className={styles.button}
                                                    onButtonClick={() => handleDeleteClick(tip.id)}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <div className={styles.day}>{tip.day}</div>
                                                <div className={styles.content}>{tip.content}</div>
                                                <EditButton
                                                    buttonText="Edit"
                                                    className={styles.editButton}
                                                    onButtonClick={() =>
                                                        handleEditClick(tip.id, tip.content)
                                                    }
                                                />
                                            </>
                                        )}
                                    </div>
                                ))}
                    </List>
                </div>
                <div className={styles.pagination}>
                    <TableFooter
                        onNextPage={handleNextPage}
                        onPreviousPage={handlePreviousPage}
                        currentPage={currentPage}
                        totalPages={totalPages}
                    />
                </div>
            </div>
        </div>
        </>
    );
};
