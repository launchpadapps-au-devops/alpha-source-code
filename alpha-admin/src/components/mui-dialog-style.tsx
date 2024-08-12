import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export const CustomDialog = styled(Dialog)(({ theme }) => ({
    margin: 'auto',
    '& .MuiPaper-root ': {
        padding: '24px',
        margin: '0',
        width: '100%',
    },
    '& .MuiDialogActions-root': {
        display: 'flex',
        flexDirection: 'row',
        gap: '14px',
        marginTop: '40px',
    },
    [theme.breakpoints.up('sm')]: {
        maxWidth: '400px',
    },
    [theme.breakpoints.up('md')]: {
        maxWidth: '500px',
    },
    [theme.breakpoints.up('lg')]: {
        maxWidth: '688px',
    },
}));

export const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
    padding: '0px',
    fontSize: '21px',
    lineHeight: '24px',
    fontWeight: '500',
    fontFamily: 'yantramanav',
    color: '#101828',
    marginBottom: '24px',
}));
export const CustomDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: '0px',
}));
