import { createBoard } from '@wixc3/react-board';
import { PrivacyPolicy } from '../../../components/pages/privacy-policy/privacy-policy';

export default createBoard({
    name: 'PrivacyPolicy',
    Board: () => <PrivacyPolicy />,
    isSnippet: true,
});