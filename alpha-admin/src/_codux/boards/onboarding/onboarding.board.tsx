import { createBoard } from '@wixc3/react-board';
import { Onboarding } from '../../../components/pages/onboarding/onboarding';

export default createBoard({
    name: 'Onboarding',
    Board: () => <Onboarding />,
    isSnippet: true,
});