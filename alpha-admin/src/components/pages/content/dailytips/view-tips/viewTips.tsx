import classNames from 'classnames';
import Sidebar from '../../content-components/sidebar/Sidebar';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../../../icon/icon';
import './viewTips.scss';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Card, Container } from 'react-bootstrap';
import { AppButton } from '../../../../app-button/app-button';
import { Menu, MenuItem, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { EditButton } from '../../content-components/edit-button/edit-button';
export interface ViewTipsProps {
    className?: string;
}

export const ViewTips = ({ className }: ViewTipsProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuWidth, setMenuWidth] = useState<number>(-2);
    const navigate = useNavigate();
    let [tips, setTips] = useState([
        {
            id: 1,
            day: 1,
            tip: 'Choose one learning card each day to inspire you. If you feel like it, you can pick more for extra learning!',
        },
        {
            id: 2,
            day: 2,
            tip: 'Reflect on Progress: At the end of the day, review what you’ve accomplished and plan for tomorrow.',
        },
        {
            id: 3,
            day: 3,
            tip: 'Take Breaks: Short breaks help maintain productivity and prevent burnout.',
        },
        {
            id: 4,
            day: 4,
            tip: 'Set Small, Achievable Goals: Break your tasks into smaller steps and celebrate each accomplishment.',
        },
        {
            id: 5,
            day: 5,
            tip: 'Connect with Positive People: Surround yourself with supportive and encouraging individuals.',
        },
        {
            id: 6,
            day: 6,
            tip: 'Visualize Success: Spend a few minutes picturing your goals and the success you want to achieve.',
        },
        {
            id: 7,
            day: 7,
            tip: 'Start Your Day with Gratitude: Take a moment each morning to appreciate what you have. It sets a positive tone for the day.',
        },
        {
            id: 8,
            day: 8,
            tip: 'Practice Self-Care: Ensure you’re eating well, staying hydrated, and getting enough sleep.',
        },
        {
            id: 9,
            day: 9,
            tip: 'Stay Active: Exercise boosts endorphins and helps maintain energy levels throughout the day.',
        },
        {
            id: 10,
            day: 10,
            tip: 'Stay Organized: Keep a to-do list or planner to track your tasks and stay focused.',
        },
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const [editing, setEditing] = useState(false);
    const [editSelected, setEditSelected] = useState(-1);
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

    const handleTipChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        console.log(event.target.value, 'event.target.value');
        tips[index].tip = event.target.value;
        setTips([...tips]);
    };

    useEffect(() => {
        if (buttonRef.current) {
            setMenuWidth(buttonRef.current.offsetWidth);
        }
    }, [buttonRef.current]);

    const renderTableRows = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const selectedTips = tips.slice(startIndex, startIndex + itemsPerPage);

        // Map over selectedTips and return the table rows
        console.log(selectedTips, 'selectedTips');
        const rows = selectedTips.map((tip, index) =>
            editing ? (
                editSelected >= 0 && editSelected === index ? (
                    <tr key={tip.id}>
                        <td>
                            <input type="text" className="w-25" value={tip.day} />
                        </td>
                        <td>
                            <input
                                type="text"
                                className="form-control"
                                value={tip.tip}
                                onChange={(e) => handleTipChange(e, index)}
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
                        <td>{tip.tip}</td>
                        <td>
                            <button
                                className="btn btn-outline-primary"
                                onClick={() => setEditSelected(tip.day - 1)}
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
                    <td>{tip.tip}</td>
                    <td>...</td>
                </tr>
            )
        );

        // Append pagination row if needed
        rows.push(renderPagination());
        console.log(rows, 'rows');
        return rows;
    };

    // create a function to create a new daily tip add new daily tip to the list
    const createNewDailyTip = () => {
        const newTip = {
            id: tips.length + 1,
            day: tips.length + 1,
            tip: '',
        };
        setTips([newTip, ...tips]); // Add the new tip to the top of the list
        setEditSelected(0); // Set editSelected to the new tip at index 0
        setEditing(true);
        handleClose();
        setTimeout(() => {
            console.log(newTip, 'createNewDailyTip', tips, [newTip, ...tips]);
            console.log(tips, 'editSelected');
        }, 1000);
    };

    const handleCancel = (value: boolean) => {
        setEditing(value);
        setEditSelected(-1);
    };

    const handleMenuItemClick = (path: string) => {
        navigate(path);
        handleClose();
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
                    <ul className="pagination  justify-content-center">{pages}</ul>
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
        <div>
            <div className="row w-100">
                <div className="col-2">
                    <Sidebar />
                </div>
                <div className="col-10 mt-5">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <header className="header">
                            <h5>Daily tips</h5>
                            <div className="buttonContainer">
                                {editing ? (
                                    <>
                                        <EditButton
                                            showLeftIcon
                                            buttonText="Cancel"
                                            onButtonClick={() => handleCancel(!editing)}
                                        />
                                        <EditButton
                                            showLeftIcon
                                            buttonText="Save"
                                            onButtonClick={() => setEditing(!editing)}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <EditButton
                                            showLeftIcon
                                            buttonText="Edit categories"
                                            onButtonClick={() => setEditing(!editing)}
                                        />
                                        <AppButton
                                            ref={buttonRef}
                                            showLeftIcon
                                            buttonText="Create content"
                                            onButtonClick={handleButtonClick}
                                        />
                                    </>
                                )}

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
                    </div>
                    {tips.length === 0 ? (
                        <div className="no-tips text-center" style={{ height: '90%' }}>
                            {/* <Container className="h-100"> */}
                            {/* height 100% */}
                            <Card
                                className="d-flex w-100 h-100 justify-content-center align-items-center"
                                // style={{ height: '900px' }}
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
                            {/* </Container> */}
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
        </div>
    );
};
