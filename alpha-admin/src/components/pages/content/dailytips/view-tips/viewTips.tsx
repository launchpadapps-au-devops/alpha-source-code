import classNames from 'classnames';
import Sidebar from '../../content-components/sidebar/Sidebar';
import { useEffect, useRef, useState } from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Card } from 'react-bootstrap';
import { AppButton } from '../../../../app-button/app-button';
import { Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EditButton } from '../../content-components/edit-button/edit-button';
import { useAppDispatch, useAppSelector } from '../../../../../app/hooks';
import { fetchTipsThunk } from '../viewTipsSlice';
import './viewTips.scss';

export interface ViewTipsProps {
    className?: string;
}

export const ViewTips = ({ className }: ViewTipsProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuWidth, setMenuWidth] = useState<number>(-2);
    const navigate = useNavigate();
    let tips = useAppSelector((state) => state.tips.tips.tips);
    const [currentPage, setCurrentPage] = useState(1);
    const [editing, setEditing] = useState(false);
    const [editSelected, setEditSelected] = useState(-1);
    const [editedContent, setEditedContent] = useState<string>('');
    const dispatch = useAppDispatch();
    const itemsPerPage = 7;
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleClick = (event: any, page: any) => {
        event.preventDefault();
        setCurrentPage(page);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    useEffect(() => {
        console.log(tips, 'tips');
        dispatch(fetchTipsThunk());
    }, [dispatch]);

    const handleTipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditedContent(event.target.value);
    };

    const startEditingTip = (index: number, content: string) => {
        setEditSelected(index);
        setEditedContent(content);
    };

    const handleMenuItemClick = (path: string) => {
        navigate(path);
        handleClose();
    };

    const createNewDailyTip = () => {
        console.log('Create New Daily Tip');
    };

    const renderTableRows = () => {
        const activeTips = tips.filter((tip: any) => tip.status === "ACTIVE");
        const startIndex = (currentPage - 1) * itemsPerPage;
        const selectedTips = activeTips.slice(startIndex, startIndex + itemsPerPage);
        
        const rows = selectedTips.map((tip: any, index: any) =>
            editing ? (
                editSelected >= 0 && editSelected === index ? (
                    <tr key={tip.id}>
                        <td>
                            <input type="text" className="w-25" value={tip.id}   onChange={(e) => setEditedContent(e.target.value)} />
                        </td>
                        <td>
                            <input
                                type="text"
                                className="form-control"
                                value={editedContent}
                                onChange={(e) => handleTipChange(e)}
                            />
                        </td>
                        <td>
                            <button className="btn btn-primary mx-2">Save & add more</button>
                            <button className="btn btn-outline-primary mx-2">Save</button>
                            <button className="btn btn-outline-danger mx-2">Delete</button>
                        </td>
                    </tr>
                ) : (
                    <tr key={tip.id}>
                        <td>{tip.day}</td>
                        <td>{tip.content}</td>
                        <td>
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => startEditingTip(index, tip.content)}
                                style={{ position: 'absolute', right: '5%' }}
                            >
                                Edit
                            </button>
                        </td>
                    </tr>
                )
            ) : (
                <tr key={tip.id}>
                    <td>{tip.day}</td>
                    <td>{tip.content}</td>
                    <td>...</td>
                </tr>
            )
        );

        rows.push(renderPagination());
        return rows;
    };

    const renderPagination = () => {
        const pageCount = Math.ceil(tips.length / itemsPerPage);
        const pages = [];

        for (let i = 1; i <= pageCount; i++) {
            pages.push(
                <li key={i} className={`page-item ${currentPage === i ? 'active' : ''}`}>
                    <a className="page-link" href="#" onClick={(event) => handleClick(event, i)}>
                        {i}
                    </a>
                </li>
            );
        }

        return (
            <tr>
                <td className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <a
                        className="page-link"
                        href="#"
                        onClick={(event) => handleClick(event, currentPage - 1)}
                    >
                        Previous
                    </a>
                </td>
                <td className="page-item">
                    <ul className="pagination justify-content-center">{pages}</ul>
                </td>
                <td className={`page-item ${currentPage === pageCount ? 'disabled' : ''}`}>
                    <a
                        className="page-link "
                        href="#"
                        onClick={(event) => handleClick(event, currentPage + 1)}
                    >
                        Next
                    </a>
                </td>
            </tr>
        );
    };

    return (
        <>
            <div className="row w-100 ">
                <div className="col-2">
                    <Sidebar />
                </div>
                <div className="col-10 mt-5 content">
                        <header className="header">
                            <h5>Daily tips</h5>
                            <div className="rightButtonContainer">
                                <EditButton
                                    showLeftIcon
                                    buttonText="Edit Daily tips"
                                    onButtonClick={() => setEditing(!editing)}
                                />
                                <AppButton
                                    ref={buttonRef}
                                    showLeftIcon
                                    buttonText="Create content"
                                    onButtonClick={handleButtonClick}
                                />
                                <Menu
                                    id="simple-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    slotProps={{
                                        paper: {
                                            style: {
                                                width: menuWidth,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem
                                        onClick={() =>
                                            handleMenuItemClick('/content/createcategories')
                                        }
                                    >
                                        <DashboardIcon style={{ marginRight: 8 }} />
                                        Category
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleMenuItemClick('/content/createtheme')}
                                    >
                                        <MenuBookIcon style={{ marginRight: 8 }} />
                                        Theme
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleMenuItemClick('/content/createlesson')}
                                    >
                                        <LightbulbIcon style={{ marginRight: 8 }} />
                                        Lesson
                                    </MenuItem>
                                    <MenuItem onClick={() => createNewDailyTip()}>
                                        <CalendarMonthIcon style={{ marginRight: 8 }} />
                                        Daily tip
                                    </MenuItem>
                                </Menu>
                            </div>
                        </header>
                    
                    {tips.length === 0 ? (
                        <div className="no-tips text-center" style={{ height: '90%' }}>
                            <Card
                                className="d-flex w-100 h-100 justify-content-center align-items-center"
                            >
                                <Card.Body>
                                    <div className="icon" style={{ marginTop: '100%' }}>
                                        <i
                                            className="bi bi-info-circle-fill"
                                            style={{ fontSize: '3rem', color: '#6f42c1' }}
                                        ></i>
                                    </div>
                                    <h4 className="my-3">No Daily tips available</h4>
                                    <p>When you add Daily tips, they will appear here.</p>
                                    <button className="my-3 btn btn-outline-primary">
                                        <span
                                            className="mx-2"
                                            style={{
                                                color: 'blue',
                                                fontSize: '2vh',
                                            }}
                                        >
                                            +
                                        </span>
                                        Create Daily tip
                                    </button>
                                </Card.Body>
                            </Card>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr
                                            style={{
                                                background: '#EBEBEB',
                                                borderBottom: 'none',
                                            }}
                                        >
                                            <th>Day</th>
                                            <th>Daily tips</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ background: '#FFFFFF' }}>
                                        {renderTableRows()}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};
