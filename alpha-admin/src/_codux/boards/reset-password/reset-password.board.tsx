import { createBoard } from '@wixc3/react-board';
import { ResetPassword } from '../../../components/pages/forgot-password/forgot-password-components/reset-password/reset-password';

export default createBoard({
    name: 'ResetPassword',
    Board: () => <ResetPassword />,
    isSnippet: true,
});