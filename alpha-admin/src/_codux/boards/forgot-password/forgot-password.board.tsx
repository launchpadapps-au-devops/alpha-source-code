import { createBoard } from '@wixc3/react-board';
import { ForgotPassword } from '../../../components/pages/forgot-password/forgot-password';

export default createBoard({
    name: 'ForgotPassword',
    Board: () => <ForgotPassword />,
    isSnippet: true,
});