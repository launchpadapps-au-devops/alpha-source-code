import React, { useState } from 'react';
import './dashBoardCardDetails.scss';
import { UploadButton } from '../../../../../content-components/upload-button/uploadButton';
import { Vector } from '../../../../../../../icon/glyps/vector';
import { useAppDispatch } from '../../../../../../../../app/hooks';
import { uploadFile } from '../../../../../../../fileUpload/fileUploadSlice';

export interface DashboardCardDetailsProps {
    dashboardCardDetails: any;
    setDashboardCardDetails: (dashboardCardDetails: Object) => void;
    data: any;
    setData: any;
    errors: any; // Accept errors prop for validation
    setErrors: (errors: any) => void; // Add setter for errors to clear errors
}

export const DashboardCardDetails = ({
    dashboardCardDetails,
    setDashboardCardDetails,
    data,
    setData,
    errors,
    setErrors, // Add setter to clear errors
}: DashboardCardDetailsProps) => {
    const dispatch = useAppDispatch();
    const [isFileUploaded, setIsFileUploaded] = useState(false); // State to track file upload

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            dispatch(uploadFile(file)).then((response: any) => {
                const uploadedImageUrl = response.payload.data.data.url;
                setData({ ...data, coverImage: uploadedImageUrl });
                setIsFileUploaded(true); // Set to true once the file is uploaded
            });
        }
    };

    // Handles input changes and clears the specific error
    const handleInputChange = (field: string, value: any) => {
        setData((prevState: any) => ({
            ...prevState,
            [field]: value,
        }));

        // Clear the error for the field being edited
        if (errors[field]) {
            setErrors((prevErrors: any) => ({
                ...prevErrors,
                [field]: '', // Clear the error for the current field
            }));
        }
    };

    return (
        <div className="dashboard-card-details-container">
            <div className="dashboard-card-header">
                Dashboard card details <Vector />
            </div>

            {/* Cover Image Section */}
            <div className="cover-image-section">
                <label htmlFor="cover-image" className="cover-image-label">
                    Cover image <span style={{ color: 'red' }}>*</span> {/* Indicate it's required */}
                </label>
                <div className="cover-image-hint">
                    Image: JPG, PNG, max 2MB; Video: MP4, max 100MB
                </div>

                {!isFileUploaded ? (
                    <UploadButton
                        showLeftIcon
                        buttonText="Upload media"
                        data={data}
                        setData={setData}
                        handleFileChange={handleFileChange}
                    />
                ) : (
                    <div className="uploaded-image-preview">
                        <img
                            src={data.coverImage}
                            alt="Uploaded cover"
                            className="uploaded-image"
                        />
                        <div className="edit-image-section">
                            <button
                                onClick={() => {
                                    setIsFileUploaded(false); // Allow user to upload again
                                    setData({ ...data, coverImage: '' }); // Clear the image URL
                                }}
                                className="remove-uploaded-image-button"
                            >
                                Edit image
                            </button>
                        </div>
                    </div>
                )}

                {!isFileUploaded && errors.coverImage && (
                    <div className="error-message" style={{ color: 'red', marginTop: '5px' }}>
                        {errors.coverImage}
                    </div>
                )}
            </div>

            {/* Lesson Name Section */}
            <div className="lesson-name-section">
                <label htmlFor="lesson-name" className="lesson-name-label">
                    Lesson name <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    id="lesson-name"
                    className={`lesson-name-input ${errors.name ? 'error-border' : ''}`} // Apply error border
                    placeholder="Enter the lesson name"
                    value={data.name}
                    onChange={(e) => handleInputChange('name', e.target.value)} // Clear error on input change
                    maxLength={50}
                    required
                />
                {errors.name && <div className="error-message">{errors.name}</div>} {/* Error message */}
                <div className="lesson-name-footer">50 characters</div>
            </div>

            {/* Lesson Description Section */}
            <div className="lesson-description-section">
                <label htmlFor="lesson-description" className="lesson-description-label">
                    Lesson description <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    id="lesson-description"
                    className={`lesson-description-input ${errors.description ? 'error-border' : ''}`} // Apply error border
                    placeholder="Enter the lesson description"
                    value={data.description}
                    onChange={(e) => handleInputChange('description', e.target.value)} // Clear error on input change
                    maxLength={200}
                    required
                />
                {errors.description && (
                    <div className="error-message">{errors.description}</div> /* Error message */
                )}
                <div className="lesson-description-footer">200 characters</div>
            </div>
        </div>
    );
};
