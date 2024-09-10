import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import CheckMarkIcon from '../../assets/check-mark.png';

export const CustomizedSelects = styled(Select)(({ theme }) => ({
    fontSize: '14px',
    lineHeight: '20px',
    fontFamily: 'sans-serif',
    color: 'black',
    letterSpacing: 'normal',

    // Use only MUI's default border styles and avoid adding an extra border
    '.MuiOutlinedInput-notchedOutline': {
        borderColor: '#22272B', // Default border color
    },

    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: '#095BA8', // Focused state border
    },

    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#22272B !important', // Hover state border
    },

    '&.Mui-error .MuiOutlinedInput-notchedOutline': {
        borderColor: 'red', // Error state border color
    },

    '.MuiSelect-select': {
        padding: '12px !important',
        backgroundColor: 'transparent',
        borderRadius: '6px',
        em: {
            color: '#495054',
        },
    },
}));



export const CoustomMenuItem = styled(MenuItem)(({ theme }) => ({
    fontSize: '14px',
    lineHeight: '20px',
    fontFamily: 'sans-serif',
    color: '#333',
    // padding: '10px 16px !important',
}));


const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 10;
export const MenuProps = {
    PaperProps: {
        style: {
            padding: '10px 16px ',
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            background: 'white',
            borderRadius: '4px',
            border: '1px solid  #EBEBEB',
            boxShadow: 'none',
        },
    },
};

export const MenuCheckMark = {
    PaperProps: {
        style: {
            background: 'white',
            borderRadius: '0px 0px 2px 2px',
            border: '1px solid  #E0E0E0',
            boxShadow: 'none',
        },
    },
};
