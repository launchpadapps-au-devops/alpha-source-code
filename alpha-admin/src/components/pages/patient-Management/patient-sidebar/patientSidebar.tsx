import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { List, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import styled from '@emotion/styled';
import './patientSidebar.module.scss';
import { BackButtonPatient } from '../../../back-button-patient/backButtonPatient';

const SidebarPatientContainer = styled('div')<{ collapsed: boolean; sidebarHeight: number }>(({ collapsed, sidebarHeight }) => ({
    width: collapsed ? '85px' : '250px',
    height: `${sidebarHeight}px`, // Dynamically adjust height based on scroll
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
        backgroundColor: '#cbecfd', // Apply the background color
        color: '#146CFD', // Apply the text color
        '& .MuiListItemIcon-root': {
            color: '#146CFD', // Ensure the icon color matches the text color
        },
        '&:hover': {
            backgroundColor: '#cbecfd', // Keep the hover state consistent with the selected background
        },
    },
}));

export interface SidebarPatientProps {
    className?: string;
}

export const SidebarPatient = ({ className }: SidebarPatientProps) => {
    const [collapsed, setCollapsed] = useState(false);
    const [sidebarHeight, setSidebarHeight] = useState(window.innerHeight - 130);
    const [selectedItem, setSelectedItem] = useState<string | null>(null); // Manage selected subcategory
    const [selectedParent, setSelectedParent] = useState<string | null>(null); // Manage selected parent category
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null); // Manage expanded categories
    const navigate = useNavigate();
    const location = useLocation();
    const patientId = localStorage.getItem('selectedPatientId');

    // Handle the selection based on the current path
    useEffect(() => {
        const currentPath = location.pathname;

        if (currentPath.startsWith('/patient-profile') || currentPath.startsWith('/create-patient') || currentPath.startsWith('/edit-patient')) {
            setSelectedParent('Patient Profile');
            setSelectedItem(null); // No subcategory
        } else if (currentPath.startsWith('/patient-dashboard')) {
            setSelectedParent('Patient Dashboard');
            setExpandedCategory('Patient Dashboard');
            if (currentPath.includes('/assessments')) {
                setSelectedItem('Assessments');
            } else if (currentPath.includes('/patient-lifestyle-plan')) {
                setSelectedItem('Lifestyle plan');
            } else if (currentPath.includes('/activity')) {
                setSelectedItem('Activity');
            } else if (currentPath.includes('/nutrition')) {
                setSelectedItem('Nutrition');
            } else if (currentPath.includes('/sleep-analysis')) {
                setSelectedItem('Sleep analysis');
            } else {
                setSelectedItem(null); // Reset subcategory selection if not in a specific subcategory
            }
        } else {
            setSelectedParent('Patients'); // Default fallback to Patients
            setSelectedItem(null);
        }
    }, [location.pathname]);

    // Handle sidebar height adjustments on scroll
    useEffect(() => {
        const handleScroll = () => {
            const newHeight = window.innerHeight - 130 + window.scrollY;
            setSidebarHeight(newHeight);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle item click for both parent and subcategories
    const handleItemClick = (item: string, path?: string, parentCategory?: string) => {
        if (parentCategory) {
            // Subcategory is clicked
            setExpandedCategory(parentCategory); // Keep parent expanded
            setSelectedParent(parentCategory); // Highlight the parent
            setSelectedItem(item); // Highlight the subcategory
        } else {
            // Parent category is clicked
            setExpandedCategory(item === expandedCategory ? null : item);
            setSelectedParent(item);
            setSelectedItem(null); // Reset subcategory selection
    
            // Navigate to "Patient Dashboard" main path if no subcategory
            if (item === 'Patient Dashboard') {
                navigate('/patient-dashboard', { state: { patientId }, replace: true });
            }
        }
    
        // Navigate to the path if provided
        if (path) {
            navigate(path, { state: { patientId }, replace: true });
        }
    };
    

    return (
        <>
            <BackButtonPatient />
            <SidebarPatientContainer collapsed={collapsed} sidebarHeight={sidebarHeight}>
                <List component="nav">
                    {/* Parent Category: Patient Dashboard */}
                    <StyledListItemButton
                        selected={selectedParent === 'Patient Dashboard'}
                        onClick={() => handleItemClick('Patient Dashboard')}
                    >
                        <ListItemIcon>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.8333 4.16667V5.83333H12.5V4.16667H15.8333ZM7.5 4.16667V9.16667H4.16667V4.16667H7.5ZM15.8333 10.8333V15.8333H12.5V10.8333H15.8333ZM7.5 14.1667V15.8333H4.16667V14.1667H7.5ZM17.5 2.5H10.8333V7.5H17.5V2.5ZM9.16667 2.5H2.5V10.8333H9.16667V2.5ZM17.5 9.16667H10.8333V17.5H17.5V9.16667ZM9.16667 12.5H2.5V17.5H9.16667V12.5Z" fill="black"/>
                            </svg>
                        </ListItemIcon>
                        {!collapsed && <ListItemText primary="Patient Dashboard" />}
                    </StyledListItemButton>

                    {/* Subcategories for Patient Dashboard */}
                    {expandedCategory === 'Patient Dashboard' && !collapsed && (
                        <>
                            <StyledListItemButton
                                selected={selectedItem === 'Assessments'}
                                onClick={() => handleItemClick('Assessments', '/patient-dashboard/assessments', 'Patient Dashboard')}
                                style={{ paddingLeft: '32px' }}
                            >
                                <ListItemText primary="Assessments" />
                            </StyledListItemButton>
                            <StyledListItemButton
                                selected={selectedItem === 'Lifestyle plan'}
                                onClick={() => handleItemClick('Lifestyle plan', '/patient-dashboard/patient-lifestyle-plan', 'Patient Dashboard')}
                                style={{ paddingLeft: '32px' }}
                            >
                                <ListItemText primary="Lifestyle plan" />
                            </StyledListItemButton>
                            <StyledListItemButton
                                selected={selectedItem === 'Activity'}
                                onClick={() => handleItemClick('Activity', '/patient-dashboard/activity', 'Patient Dashboard')}
                                style={{ paddingLeft: '32px' }}
                            >
                                <ListItemText primary="Activity" />
                            </StyledListItemButton>
                            <StyledListItemButton
                                selected={selectedItem === 'Nutrition'}
                                onClick={() => handleItemClick('Nutrition', '/patient-dashboard/nutrition', 'Patient Dashboard')}
                                style={{ paddingLeft: '32px' }}
                            >
                                <ListItemText primary="Nutrition" />
                            </StyledListItemButton>
                            <StyledListItemButton
                                selected={selectedItem === 'Sleep analysis'}
                                onClick={() => handleItemClick('Sleep analysis', '/patient-dashboard/sleep-analysis', 'Patient Dashboard')}
                                style={{ paddingLeft: '32px' }}
                            >
                                <ListItemText primary="Sleep analysis" />
                            </StyledListItemButton>
                        </>
                    )}

                    {/* Patient Profile */}
                    <StyledListItemButton
                        selected={selectedParent === 'Patient Profile'}
                        onClick={() => handleItemClick('Patient Profile', '/patient-profile')}
                    >
                        <ListItemIcon>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_3659_23016)">
                                    <path d="M4.43057 16.199C4.93751 15.0047 6.12109 14.167 7.50033 14.167H12.5003C13.8796 14.167 15.0631 15.0047 15.5701 16.199M13.3337 7.91699C13.3337 9.75794 11.8413 11.2503 10.0003 11.2503C8.15938 11.2503 6.66699 9.75794 6.66699 7.91699C6.66699 6.07604 8.15938 4.58366 10.0003 4.58366C11.8413 4.58366 13.3337 6.07604 13.3337 7.91699ZM18.3337 10.0003C18.3337 14.6027 14.6027 18.3337 10.0003 18.3337C5.39795 18.3337 1.66699 14.6027 1.66699 10.0003C1.66699 5.39795 5.39795 1.66699 10.0003 1.66699C14.6027 1.66699 18.3337 5.39795 18.3337 10.0003Z" stroke="#19191a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_3659_23016">
                                        <rect width="20" height="20" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </ListItemIcon>
                        {!collapsed && <ListItemText primary="Patient Profile" />}
                    </StyledListItemButton>
                </List>
            </SidebarPatientContainer>
        </>
    );
};
