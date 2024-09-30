import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './navigation-link.module.scss';
import { useNavigate } from 'react-router-dom'; // Use useNavigate for manual navigation control
import { Glyph, Icon } from '../../../icon/icon';
import { useUnsavedChanges } from '../../../pages/content/lessons/lesson-components/unchanged-warning-hook-context';
import { UnsavedChangesModal } from '../../../pages/content/content-components/unsaved-changes-alert/unsavedChanges';

export interface NavigationLinkProps {
    className?: string;
    icon?: Glyph;
    navText?: string;
    linkTo?: string;
}

export const NavigationLink = ({ className, icon, navText, linkTo }: NavigationLinkProps) => {
    const navigate = useNavigate();
    const { dirty, discardChanges, cancelNavigation } = useUnsavedChanges();
    
    const [showPrompt, setShowPrompt] = useState(false);  // Local state to control modal visibility

    const handleNavigation = () => {
        if (dirty) {
            setShowPrompt(true);  // Show the unsaved changes modal
        } else {
            navigate(linkTo || '/');  // No unsaved changes, proceed with navigation
        }
    };

    // Handle modal actions
    const handleSaveAsDraft = () => {
        discardChanges();  // Discard unsaved changes
        setShowPrompt(false);  // Close the modal
        navigate(linkTo || '/');  // Navigate after saving or discarding
    };

    const handleDiscardChanges = () => {
        discardChanges();  // Reset unsaved changes
        setShowPrompt(false);  // Close the modal
        navigate(linkTo || '/');  // Proceed with navigation
    };

    const handleCancelNavigation = () => {
        setShowPrompt(false);  // Close the modal, stay on the current page
    };

    return (
        <>
            <div onClick={handleNavigation} className={classNames(styles["nav-link-wrapper"], className)}>
                <div className={styles['icon-wrapper']}>
                    <Icon glyph={icon || 'add'} width={18} height={18} />
                </div>
                {navText}
            </div>

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
