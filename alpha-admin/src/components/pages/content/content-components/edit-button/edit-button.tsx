import classNames from 'classnames';
import styles from './edit-button.module.scss';
import { Glyph, Icon } from '../../../../icon/icon';
import React from 'react';

export interface EditButtonProps {
    className?: string;
    buttonText?: string;
    onButtonClick?: (e: any) => void;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
    iconType?: Glyph; // New prop to determine icon type
}

export const EditButton =  React.forwardRef<HTMLButtonElement, EditButtonProps>(({
    className,
    buttonText,
    onButtonClick,
    showLeftIcon,
    showRightIcon,
    iconType='edit', // Default icon type is 'edit'
    ...props
}, ref) => {
    return (
        <button
            {...props}
            ref={ref}
            className={classNames(styles['button-primary'], className)}
            onClick={onButtonClick}
        >
            {showLeftIcon && (
                <Icon
                    glyph={iconType} // Use iconType to determine the icon
                    currentColor="blue"
                    width={20}
                    height={20}
                />
            )}
            {buttonText}
            {showRightIcon && (
                <Icon
                    glyph={iconType} // Use iconType to determine the icon
                    currentColor="blue"
                    width={20}
                    height={20}
                />
            )}
        </button>
    );
}

);
