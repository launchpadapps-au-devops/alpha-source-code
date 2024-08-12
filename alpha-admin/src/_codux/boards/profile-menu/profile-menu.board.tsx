import { createBoard } from '@wixc3/react-board';
import { ProfileMenu } from '../../../components/top-navigation/navigation-component/profile-menu/profile-menu';

export default createBoard({
    name: 'ProfileMenu',
    Board: () => <ProfileMenu />,
    isSnippet: true,
});