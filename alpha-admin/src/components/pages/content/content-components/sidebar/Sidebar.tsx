import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { List, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import styled from '@emotion/styled';
import CategoryIcon from '@mui/icons-material/Category';
import BookIcon from '@mui/icons-material/Book';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import './sidebar.module.scss';
import { UnsavedChangesModal } from '../unsaved-changes-alert/unsavedChanges';


const SidebarContainer = styled('div')<{ collapsed: boolean }>(({ collapsed }) => ({
    width: collapsed ? '85px' : '250px',
    height: '100vh',
    backgroundColor: '#ffffff',
    padding: '16px',
    boxSizing: 'border-box',
    borderRight: '1px solid #e0e0e0',
    position: 'relative',
    transition: 'width 0.3s',
}));

const ArrowButton = styled(IconButton)({
    position: 'absolute',
    right: '-14px',
    top: '12px',
    width: '28px',
    height: '28px',
    padding: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #eff0f0',
    borderRadius: '50%',
    boxShadow: '0px 2px 4px 0px rgba(54, 54, 54, 0.05)',
});

const StyledListItemButton = styled(ListItemButton)<{ selected: boolean }>(({ selected }) => ({
    '&.Mui-selected': {
        backgroundColor: '#cbe0fd',
        color: '#146cfd',
        '& .MuiListItemIcon-root': {
            color: '#146cfd',
        },
    },
}));

// Add dirty and handlers for blocking navigation
const Sidebar: React.FC<{ dirty?: boolean, setDirty?: any ,  saveAsDraft?: () => void, discardChanges?: () => void, cancelNavigation?: () => void }> = ({ dirty, saveAsDraft, discardChanges, cancelNavigation }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedItem, setSelectedItem] = useState('');
    const [showPrompt, setShowPrompt] = useState(false); // Track if the unsaved changes modal is shown
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const pathMap: { [key: string]: string } = {
            '/content/categories': 'Categories',
            '/content/themes': 'Themes',
            '/content/lessons': 'Lessons',
            '/content/dailytips': 'Daily tips',
        };
        setSelectedItem(pathMap[location.pathname.split('/').slice(0, 3).join('/')] || 'Categories');
    }, [location.pathname]);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const handleItemClick = (item: string, path: string) => {
        if (dirty) {
            setShowPrompt(true); // Show prompt when form is dirty
        } else {
            setSelectedItem(item);
            navigate(path, { replace: true });
        }
    };

    const handleConfirmNavigation = (path: string) => {
        setSelectedItem(path);
        navigate(path, { replace: true });
        setShowPrompt(false); // Close the prompt
    };

    const handleNavigation = () => {
        if (dirty) {
            setShowPrompt(true);  // Show the unsaved changes modal
        } else {
            navigate( '/');  // No unsaved changes, proceed with navigation
        }
    };

    // Handle modal actions
    const handleSaveAsDraft = () => {
       // discardChanges();  // Discard unsaved changes
        setShowPrompt(false);  // Close the modal
        navigate('/');  // Navigate after saving or discarding
    };

    const handleDiscardChanges = () => {
       // discardChanges();  // Reset unsaved changes
        setShowPrompt(false);  // Close the modal
        navigate( '/');  // Proceed with navigation
    };

    const handleCancelNavigation = () => {
        setShowPrompt(false);  // Close the modal, stay on the current page
    };

    return (
        <>
            <SidebarContainer collapsed={collapsed}>
                <ArrowButton onClick={toggleSidebar}>
                    {collapsed ? <KeyboardArrowRightIcon color="primary" /> : <KeyboardArrowLeftIcon color="primary" />}
                </ArrowButton>
                <List component="nav">
                    <StyledListItemButton selected={selectedItem === 'Categories'} onClick={() => handleItemClick('Categories', '/content/categories')}>
                        <ListItemIcon>
                            <CategoryIcon />
                        </ListItemIcon>
                        {!collapsed && <ListItemText primary="Categories" />}
                    </StyledListItemButton>
                    <StyledListItemButton selected={selectedItem === 'Themes'} onClick={() => handleItemClick('Themes', '/content/themes')}>
                        <ListItemIcon>
                            <BookIcon />
                        </ListItemIcon>
                        {!collapsed && <ListItemText primary="Themes" />}
                    </StyledListItemButton>
                    <StyledListItemButton selected={selectedItem === 'Lessons'} onClick={() => handleItemClick('Lessons', '/content/lessons')}>
                        <ListItemIcon>
                            <LightbulbIcon />
                        </ListItemIcon>
                        {!collapsed && <ListItemText primary="Lessons" />}
                    </StyledListItemButton>
                    <StyledListItemButton selected={selectedItem === 'Daily tips'} onClick={() => handleItemClick('Daily tips', '/content/dailytips')}>
                        <ListItemIcon>
                            <CalendarTodayIcon />
                        </ListItemIcon>
                        {!collapsed && <ListItemText primary="Daily tips" />}
                    </StyledListItemButton>
                </List>
            </SidebarContainer>

            {showPrompt && (
                <UnsavedChangesModal
                    open={showPrompt}
                    handleSaveAsDraft={handleSaveAsDraft}
                    handleCancel={handleDiscardChanges}
                    closeModal={handleCancelNavigation}
                    descriptionText="You have unsaved changes. Do you want to save them before leaving?"
                />
            )}
        </>
    );
};

export default Sidebar;
