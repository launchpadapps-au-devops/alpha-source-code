import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { List, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import styled from '@emotion/styled';
import CategoryIcon from '@mui/icons-material/Category';
import './patientSidebar.module.scss';

const SidebarPatientContainer = styled('div')<{ collapsed: boolean }>(({ collapsed }) => ({
    width: collapsed ? '85px' : '250px',
    height: 'calc(100vh - 130px)', // Height calculation to fit within viewport with top margin
    backgroundColor: '#ffffff',
    padding: '16px',
    boxSizing: 'border-box',
    borderRight: '1px solid #e0e0e0',
    position: 'absolute', // Ensures the sidebar stays fixed in place
    top: 130, // Margin from the top of the viewport
    left: 0,
    transition: 'width 0.3s',
    overflowY: 'auto', // Enables scrolling within the sidebar
    zIndex: 10,
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

export const SidebarPatient: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [selectedItem, setSelectedItem] = useState('');
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const pathMap: { [key: string]: string } = {
            '/patient-dashboard': 'Patient Dashboard',
            '/patient-profile': 'Patient Profile',
        };
        setSelectedItem(pathMap[location.pathname.split('/').slice(0, 3).join('/')] || 'Patients');
    }, [location.pathname]);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const handleItemClick = (item: string, path?: string) => {
        if (item === 'Patient Dashboard') {
            setExpandedCategory(expandedCategory === item ? null : item);
        } else {
            setExpandedCategory(null);
            navigate(path || '', { replace: true });
        }
        setSelectedItem(item);
    };

    return (
        <SidebarPatientContainer collapsed={collapsed}>
            <List component="nav">
                <StyledListItemButton
                    selected={selectedItem === 'Patient Dashboard'}
                    onClick={() => handleItemClick('Patient Dashboard')}
                >
                    <ListItemIcon>
                        <CategoryIcon />
                    </ListItemIcon>
                    {!collapsed && <ListItemText primary="Patient Dashboard" />}
                </StyledListItemButton>
                
                {/* Subcategories for Patient Dashboard */}
                {expandedCategory === 'Patient Dashboard' && !collapsed && (
                    <>
                        <StyledListItemButton
                            selected={selectedItem === 'Assessments'}
                            onClick={() => handleItemClick('Assessments', '/patient-dashboard/assessments')}
                            style={{ paddingLeft: '32px' }}
                        >
                            <ListItemText primary="Assessments" />
                        </StyledListItemButton>
                        <StyledListItemButton
                            selected={selectedItem === 'Lifestyle plan'}
                            onClick={() => handleItemClick('Lifestyle plan', '/patient-dashboard/lifestyle-plan')}
                            style={{ paddingLeft: '32px' }}
                        >
                            <ListItemText primary="Lifestyle plan" />
                        </StyledListItemButton>
                        <StyledListItemButton
                            selected={selectedItem === 'Activity'}
                            onClick={() => handleItemClick('Activity', '/patient-dashboard/activity')}
                            style={{ paddingLeft: '32px' }}
                        >
                            <ListItemText primary="Activity" />
                        </StyledListItemButton>
                        <StyledListItemButton
                            selected={selectedItem === 'Nutrition'}
                            onClick={() => handleItemClick('Nutrition', '/patient-dashboard/nutrition')}
                            style={{ paddingLeft: '32px' }}
                        >
                            <ListItemText primary="Nutrition" />
                        </StyledListItemButton>
                        <StyledListItemButton
                            selected={selectedItem === 'Sleep analysis'}
                            onClick={() => handleItemClick('Sleep analysis', '/patient-dashboard/sleep-analysis')}
                            style={{ paddingLeft: '32px' }}
                        >
                            <ListItemText primary="Sleep analysis" />
                        </StyledListItemButton>
                    </>
                )}

                <StyledListItemButton
                    selected={selectedItem === 'Patient Profile'}
                    onClick={() => handleItemClick('Patient Profile', '/patient-profile')}
                >
                    <ListItemIcon>
                        <CategoryIcon />
                    </ListItemIcon>
                    {!collapsed && <ListItemText primary="Patient Profile" />}
                </StyledListItemButton>
            </List>
        </SidebarPatientContainer>
    );
};
