import { createBoard } from '@wixc3/react-board';
import { SaveResetPassword } from '../../../components/pages/forgot-password/forgot-password-components/save-reset-password/save-reset-password';

export default createBoard({
    name: 'SaveResetPassword',
    Board: () => <SaveResetPassword />,
    isSnippet: true,
});