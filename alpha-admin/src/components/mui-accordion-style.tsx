import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { styled } from '@mui/system';
import { Icon } from './icon/icon';
import styles from './accordion/accordion.module.scss';
import accordionStyles from './mui-accordion-style.module.scss';

export const CustomAccordion = styled(Accordion)`
    background-color: transparent;
    box-shadow: none;
    margin: none;
    padding: none;
    display: flex;
     border: none;
    flex-direction: column;
    gap: 20px;
    &.Mui-expanded {
        min-height: auto;
        margin: 0;
        background-color: transparent;
    }

    &.MuiPaper-root {
        box-shadow: none;
        padding: 0px !important;
        margin: 0px !important;
        border: none;
      
        ::before {
            height: 0px;
        } 
    }
`;
export const CustomAccordionSummary = styled(AccordionSummary)`
    display: flex;
    flex-direction: row;
    margin: 0px !important;
    background-color: transparent;
    color: black;
    min-height: auto;
    padding: 0px !important;
    &.Mui-expanded {
        min-height: 0;
        margin: 0px !important;
        padding: 0px !important;
        background-color: transparent;
         border: none;
    }
     &.Mui-expanded .{
        background-color: #146CFD;
        color: white;
         border: none;
    }

     &.Mui-expanded .${styles['number-wrapper']} {
        background-color: #146CFD;
        color: white;
         border: none;
    }
    .MuiSvgIcon-root {
        fill: #333;
    }
    .MuiAccordionSummary-content {
        margin: 0px !important;
         border: none;
         
    }

`;
export const CustomAccordionDetails = styled(AccordionDetails)`
    padding: 0px 0px;
    color: black;
    font-size: 16px;
    font-weight: 400;
    color: #495054;
`;