import { createBoard } from '@wixc3/react-board';
import { OnboardingSlides } from '../../../components/pages/onboarding/onboarding-components/onboarding-slides/onboarding-slides';

export default createBoard({
    name: 'OnboardingSlides',
    Board: () => <OnboardingSlides />,
    isSnippet: true,
});