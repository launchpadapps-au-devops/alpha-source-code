import { createBoard } from '@wixc3/react-board';
import { CheckYourEmail } from '../../../components/pages/forgot-password/forgot-password-components/check-your-email/check-your-email';

export default createBoard({
    name: 'CheckYourEmail',
    Board: () => <CheckYourEmail />,
    isSnippet: true,
});