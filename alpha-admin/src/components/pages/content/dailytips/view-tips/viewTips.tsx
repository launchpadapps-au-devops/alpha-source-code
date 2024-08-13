import classNames from 'classnames';
import Sidebar from '../../content-components/sidebar/Sidebar';
import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../../../icon/icon';
import './viewTips.scss';
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
import { fetchTipsThunk } from './viewTipsSlice';

export interface ViewTipsProps {
    className?: string;
}

export const ViewTips = ({ className }: ViewTipsProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [menuWidth, setMenuWidth] = useState<number>(-2);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [editSelected, setEditSelected] = useState(-1);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    let tips = useAppSelector((state) => state.tips.tips.tips.data) || []; // Ensure tips is an array
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const fetchTips = async () => {
            try {
                await dispatch(fetchTipsThunk());
            } catch (err) {
                setError('Failed to load tips. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTips();
    }, [dispatch]);

    const handleTipChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newTips = [...tips];
        newTips[index].tip = event.target.value;
        tips = newTips;
    };

    useEffect(() => {
        if (buttonRef.current) {
            setMenuWidth(buttonRef.current.offsetWidth);
        }
    }, [buttonRef.current]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (path: string) => {
        navigate(path);
        handleClose();
    };

    const createNewDailyTip = () => {
        // Implement function to create a new daily tip
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
                                <EditButton
                                    showLeftIcon
                                    buttonText="Edit categories"
                                    onButtonClick={() => setEditing(!editing)}
                                />
                                <AppButton
                                    ref={buttonRef}
                                    showLeftIcon
                                    buttonText="Create content"
                                    onButtonClick={handleClick}
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
                    </div>
                    {loading ? (
                        <div className="loading text-center">
                            <p>Loading...</p>
                        </div>
                    ) : error ? (
                        <div className="error text-center">
                            <p>{error}</p>
                        </div>
                    ) : tips.length === 0 ? (
                        <div className="no-tips text-center">
                            <Card className="d-flex w-100 h-100 justify-content-center align-items-center">
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
                                    {tips &&
                                        tips.length > 0 &&
                                        tips.map((tip: any, index: number) =>
                                            editing && editSelected === index ? (
                                                <tr key={tip.id}>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="w-25"
                                                            value={tip.day}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={tip.content}
                                                            onChange={(e) =>
                                                                handleTipChange(e, index)
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-primary mx-2">
                                                            Save & add more
                                                        </button>
                                                        <button className="btn btn-outline-primary mx-2">
                                                            Save
                                                        </button>
                                                        <button className="btn btn-outline-danger mx-2">
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ) : (
                                                <tr key={tip.id}>
                                                    <td>{tip.day}</td>
                                                    <td>{tip.content}</td>
                                                    <td>
                                                        {editing ? (
                                                            <button
                                                                className="btn btn-outline-primary"
                                                                onClick={() =>
                                                                    setEditSelected(tip.day - 1)
                                                                }
                                                                style={{
                                                                    position: 'absolute',
                                                                    right: '5%',
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                        ) : (
                                                            <span>...</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
