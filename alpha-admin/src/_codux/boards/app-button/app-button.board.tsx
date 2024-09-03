import { createBoard } from '@wixc3/react-board';
import { AppButton } from '../../../components/app-button/app-button';

export default createBoard({
    name: 'AppButton',
    Board: () => <AppButton buttonText='button'/>,
    isSnippet: true,
});