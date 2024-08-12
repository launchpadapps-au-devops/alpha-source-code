import { createBoard } from '@wixc3/react-board';
import { FormSucessModal } from '../../../components/form-sucess-modal/form-sucess-modal';

export default createBoard({
    name: 'FormSucessModal',
    Board: () => <FormSucessModal open />,
    isSnippet: true,
});
