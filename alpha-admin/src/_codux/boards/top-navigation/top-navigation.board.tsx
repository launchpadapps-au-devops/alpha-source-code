import { createBoard } from '@wixc3/react-board';
import { TopNavigation } from '../../../components/top-navigation/top-navigation';

export default createBoard({
    name: 'TopNavigation',
    Board: () => <TopNavigation />,
    isSnippet: true,
});