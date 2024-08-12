import { createBoard } from '@wixc3/react-board';
import { Icon } from '../../../components/icon/icon';

export default createBoard({
    name: 'Icon',
    Board: () => <Icon glyph={'add'} />,
    isSnippet: true,
});