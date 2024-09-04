import { createBoard } from '@wixc3/react-board';
import { NavigationLink } from '../../../components/top-navigation/navigation-component/navigation-link/navigation-link';

export default createBoard({
    name: 'NavigationLink',
    Board: () => <NavigationLink />,
    isSnippet: true,
});