import React, { useState } from 'react';
import './dashBoardCardDetails.scss';
import { UploadButton } from '../../../../../content-components/upload-button/uploadButton';
import { Vector } from '../../../../../../../icon/glyps/vector';
import { uploadFile } from '../../../../../../../fileUpload/fileUploadSlice';
import { useAppDispatch } from '../../../../../../../../app/hooks';

export interface DashboardCardDetailsProps {
    dashboardCardDetails: any;
    setDashboardCardDetails: (dashboardCardDetails: Object) => void;
    data: any;
    setData: any;
    errors: any;
    setErrors: (errors: any) => void;
}

export const DashboardCardDetails = ({
    dashboardCardDetails,
    setDashboardCardDetails,
    data,
    setData,
    errors,
    setErrors,
}: DashboardCardDetailsProps) => {
    const dispatch = useAppDispatch();
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(data.coverImage || null); // Start with coverImage if exists
    const [isUploading, setIsUploading] = useState(false); // Track if the file is being uploaded

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create a local preview URL before uploading
            const filePreviewUrl = URL.createObjectURL(file);
            setImagePreviewUrl(filePreviewUrl); // Set the preview URL

            // Start the upload process
            setIsUploading(true); // Mark as uploading
            dispatch(uploadFile(file))
                .then((response: any) => {
                    const uploadedImageUrl = response.payload.data.data.url;
                    setData({ ...data, coverImage: uploadedImageUrl });
                    setIsFileUploaded(true); // Mark upload as complete
                })
                .finally(() => {
                    setIsUploading(false); // Mark upload as done
                });
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setData((prevState: any) => ({
            ...prevState,
            [field]: value,
        }));

        if (errors[field]) {
            setErrors((prevErrors: any) => ({
                ...prevErrors,
                [field]: '',
            }));
        }
    };

    return (
        <div className="dashboard-card-details-container">
            <div className="dashboard-card-header">
                Dashboard card details <Vector />
            </div>

            <div className="cover-image-section">
                <label htmlFor="cover-image" className="cover-image-label">
                    Cover image <span style={{ color: 'red' }}>*</span>
                </label>
                <div className="cover-image-hint">
                    Image: JPG, PNG, max 2MB; Video: MP4, max 100MB
                </div>

                {/* Show the preview immediately after selecting a file */}
                {(imagePreviewUrl || data.coverImage) && (
                    <div className="uploaded-image-preview">
                        <img
                            src={imagePreviewUrl || data.coverImage} // Show the preview or uploaded image
                            alt="Image preview"
                            className="uploaded-image"
                        />
                        {isUploading && <div>Uploading...</div>}
                        {!isUploading && isFileUploaded && (
                            <div className="edit-image-section">
                                <button
                                    onClick={() => {
                                        setIsFileUploaded(false); // Allow user to upload again
                                        setImagePreviewUrl(null); // Clear the local preview
                                        setData({ ...data, coverImage: '' }); // Clear the uploaded image URL
                                    }}
                                    className="remove-uploaded-image-button"
                                >
                                    Edit image
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {!isFileUploaded && !isUploading && (
                    <UploadButton
                        showLeftIcon
                        buttonText="Upload media"
                        data={data}
                        setData={setData}
                        handleFileChange={handleFileChange}
                    />
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
                    className={`lesson-name-input ${errors.name ? 'error-border' : ''}`}
                    placeholder="Enter the lesson name"
                    value={data.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    maxLength={50}
                    required
                />
                {errors.name && <div className="error-message">{errors.name}</div>}
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
                    className={`lesson-description-input ${errors.description ? 'error-border' : ''}`}
                    placeholder="Enter the lesson description"
                    value={data.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    maxLength={200}
                    required
                />
                {errors.description && (
                    <div className="error-message">{errors.description}</div>
                )}
                <div className="lesson-description-footer">200 characters</div>
            </div>
        </div>
    );
};
