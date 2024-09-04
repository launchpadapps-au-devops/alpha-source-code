import classNames from 'classnames';
import styles from './input-field.module.scss';
import React, { useState } from 'react';
import { Icon } from '../icon/icon';

export interface InputFieldProps {
    className?: string;
    placeholder?: string;
    id?: string;
    type?: string;
    name?: string;
    isTypePassword?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Added onChange prop
    [x: string]: any;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const InputField = ({ className, id,
    placeholder,
    type,
    name,
    isTypePassword,
    onChange,
    ...rest }: InputFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    return (
        <div className={classNames(styles['input-box'])}>
            <input
                id={id}
                name={name}
                placeholder={placeholder}
                type={isTypePassword ? (showPassword ? 'text' : 'password') : type}
                className={classNames(styles['input-field'], className)}
                onChange={onChange}
                {...rest}
            />
            {isTypePassword && (
                <div onClick={togglePasswordVisibility} className={styles['icon-wrapper']}>
                    <Icon
                        glyph={showPassword ? 'eyeOpen' : 'eyeClose'}
                        width={20}
                        height={20}
                        currentColor="transparent"
                    />
                </div>
            )}
        </div>
    );
};
