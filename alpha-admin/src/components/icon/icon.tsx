import classNames from 'classnames';
import { ComponentProps } from 'react';
import styles from './icon.module.scss';
import { Add } from './glyps/add';
import { EyeOpen } from './glyps/eye-open';
import { EyeClose } from './glyps/eye-close';
import { Like } from './glyps/like';
import { File } from './glyps/file';
import { NotePad } from './glyps/notepad';
import { Graph } from './glyps/graph';
import { Dashboard } from './glyps/dashboard';
import { User } from './glyps/user';
import { KeyboardArrowDown } from './glyps/keyBoardArrowDown';
import { Settings } from './glyps/settings';
import { Logout } from './glyps/logout';
import { Alert } from './glyps/alert';
import { Check } from './glyps/check';
import { Edit } from './glyps/edit';
import { Key } from './glyps/key';
import { Article } from './glyps/article';
import { Shield } from './glyps/shield';
import { Delete } from './glyps/delete';
import { ExclamationMark } from './glyps/warning';
import { Upload } from './glyps/upload';
import { Search } from './glyps/search';
import { Vector } from './glyps/vector';
import { DeleteWhite } from './glyps/delete-white';

const glyphs = {
    add: <Add />,
    eyeOpen: <EyeOpen />,
    eyeClose: <EyeClose />,
    like: <Like />,
    file: <File />,
    notePad: <NotePad />,
    graph: <Graph />,
    dashboard: <Dashboard />,
    deleteWhite: <DeleteWhite />,
    user: <User />,
    keyboardArrowDown: <KeyboardArrowDown />,
    settings: <Settings />,
    logout: <Logout />,
    alert: <Alert />,
    check: <Check />,
    edit: <Edit />,
    key: <Key />,
    article: <Article />,
    shield: <Shield />,
    delete: <Delete />,
    warning: <ExclamationMark />,
    upload: <Upload />,
    search: <Search />,
    vector: <Vector />,
};

export type Glyph = keyof typeof glyphs;
export interface IconProps {
    className?: string;
    size?: 'small' | 'medium' | 'large' | 'huge' | 'custom';
    glyph: Glyph;
    width?: number;
    height?: number;
    currentColor?: string;
}

/**
 * This component was created using Codux's Default new component template.
 * To create custom component templates, see https://help.codux.com/kb/en/article/kb16522
 */
export const Icon = ({
    className,
    size = 'medium',
    glyph,
    width,
    height,
    currentColor,
    ...props
}: IconProps) => {
    const glyphPlaceholder = glyphs[glyph];
    return (
        <svg
            className={classNames(styles.root, { [styles[size]]: size !== 'custom' }, className)}
            xmlns="http://www.w3.org/2000/svg"
            height={height}
            width={width}
            viewBox={`0 0 ${width} ${height}`}
            fill={currentColor}
            {...props}
        >
            {glyphPlaceholder}
        </svg>
    );
};
