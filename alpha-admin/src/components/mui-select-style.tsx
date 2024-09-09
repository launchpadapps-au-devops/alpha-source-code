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

    '.MuiOutlinedInput-notchedOutline': {
        border: '1px solid #22272B',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: '1px solid #095BA8',
    },

    '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#22272B !important',
    },

    '.MuiSelect-select': {
        padding: '12px !important',
        // border: '1px solid #e0e0e0',
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

// export const CoustomMenuCheckMark = styled(MenuItem)(({ theme }) => ({
//     fontSize: '14px',
//     lineHeight: '20px',
//     fontFamily: 'inter',
//     color: '#333',
//     padding: '10px 12px !important',
//     textTransform: 'capitalize',
//     borderBottom: '1px solid #e0e0e0',
//     '&:last-child': {
//         borderBottom: 'none',
//     },
//     '&:first-child': {
//         borderBottom: 'none',
//         opacity: '0',
//         height: '0px',
//         padding: '0px 0px !important',
//     },
//     '&.Mui-selected::after': {
//         content: '""',
//         width: '20px',
//         height: '20px',
//         position: 'absolute',
//         right: '40px',
//         backgroundImage: `url(${CheckMarkIcon})`, // Correct way to reference the image
//         backgroundRepeat: 'no-repeat',
//         backgroundPosition: 'center', // Adjust the position as needed
//         backgroundSize: 'contain',
//         // backgroundSize: '16px 16px',
//         // background: 'red !important'
//     },
// }));

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
