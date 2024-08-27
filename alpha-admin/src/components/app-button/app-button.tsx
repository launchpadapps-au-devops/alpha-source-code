import classNames from 'classnames';
import styles from './app-button.module.scss';
import { Glyph, Icon } from '../icon/icon';
import React from 'react';

export interface AppButtonProps {
    className?: string;
    buttonText?: string;
    onButtonClick?: (e: any) => void;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
    icon?: Glyph;
    isDeleteButton?: boolean;
    [x: string]: any;
}

export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
    (
        {
            className,
            buttonText,
            onButtonClick,
            showLeftIcon,
            showRightIcon,
            icon,
            isDeleteButton,
            ...props
        },
        ref
    ) => {
        return (
            <button
                {...props}
                ref={ref}
                className={classNames(
                    styles['button-primary'],
                    {
                        [styles['button-delete']]: isDeleteButton, // Apply delete button styles if true
                    },
                    className
                )}
                onClick={onButtonClick}
            >
                {showLeftIcon && (
                    <Icon glyph={icon || 'add'} currentColor="transparent" width={20} height={20} />
                )}
                {buttonText}
                {showRightIcon && (
                    <Icon glyph={icon || 'add'} currentColor="transparent" width={20} height={20} />
                )}
            </button>
        );
    }
);

AppButton.displayName = 'AppButton';
