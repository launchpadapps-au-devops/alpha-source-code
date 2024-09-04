import React from 'react';
import classNames from 'classnames';
import styles from './publishButton.module.scss';
import { Glyph, Icon } from '../../../../icon/icon';

export interface PublishButtonProps {
    className?: string;
    buttonText?: string;
    onButtonClick?: (e: any) => void;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
    iconType?: Glyph; // New prop to determine icon type
    isUnpublished?: boolean;
}

export const PublishButton = React.forwardRef<HTMLButtonElement, PublishButtonProps>(({
    className,
    buttonText,
    onButtonClick,
    showLeftIcon,
    showRightIcon,
    iconType = 'edit', // Default icon type is 'edit'
    isUnpublished = false,
    ...props
}, ref) => {
    return (
        <button
            {...props}
            ref={ref}
            className={classNames(styles['button-primary'], { [styles.unpublished]: isUnpublished }, className)}
            onClick={onButtonClick}
        >
            {showLeftIcon && (
                <Icon
                    glyph={iconType} // Use iconType to determine the icon
                    currentColor={isUnpublished ? "black" : "blue"} // Change icon color based on isUnpublished
                    width={20}
                    height={20}
                />
            )}
            {buttonText}
            {showRightIcon && (
                <Icon
                    glyph={iconType} // Use iconType to determine the icon
                    currentColor={isUnpublished ? "black" : "blue"} // Change icon color based on isUnpublished
                    width={20}
                    height={20}
                />
            )}
        </button>
    );
});
