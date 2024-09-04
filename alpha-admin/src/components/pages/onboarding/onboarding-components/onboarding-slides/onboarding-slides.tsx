import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './onboarding-slides.module.scss';
import onboardingFirstSlide from '../../../../../assets/onboarding-first-slide.svg';
import onboardingSecondSlide from '../../../../../assets/onboarding-second-slide.svg';
import onboardingThirdSlide from '../../../../../assets/onboarding-third-slide.svg';

export interface OnboardingSlidesProps {
    className?: string;
}

export const OnboardingSlides = ({ className }: OnboardingSlidesProps) => {
    const slides = [
        { image: onboardingFirstSlide, heading: 'Feature 1', detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.' },
        { image: onboardingSecondSlide, heading: 'Feature 2', detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.' },
        { image: onboardingThirdSlide, heading: 'Feature 3', detail: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do.' }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 3000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const handleDotClick = (index: number) => {
        setCurrentSlide(index);
    };

    return (
        <div className={styles['carousel-main-wrapper']}>
            <div>
                <img className={styles['onboarding-image']} src={slides[currentSlide].image} alt={`onboarding-slide-${currentSlide}`} />
            </div>
            <div className={styles['carousel-header']}>
                <h5 className={styles['carousel-heading']}>{slides[currentSlide].heading}</h5>
                <p className={styles['carousel-detail']}>{slides[currentSlide].detail}</p>
            </div>
            <div className={styles['carousel-dots-wrapper']}>
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={classNames(styles['carousel-dot'], { [styles.active]: index === currentSlide })}
                        onClick={() => handleDotClick(index)}
                    />
                ))}
            </div>
        </div>
    );
};
