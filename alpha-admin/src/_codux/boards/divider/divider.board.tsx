import { createBoard } from '@wixc3/react-board';
import { Divider } from '../../../components/top-navigation/navigation-component/divider/divider';

export default createBoard({
    name: 'Divider',
    Board: () => <Divider />,
    isSnippet: true,
});