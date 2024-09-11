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
}

export const DashboardCardDetails = ({
    dashboardCardDetails,
    setDashboardCardDetails,
    data,
    setData,
}: DashboardCardDetailsProps) => {
    const dispatch = useAppDispatch();
    const [isFileUploaded, setIsFileUploaded] = useState(false); // State to track file upload

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log('File', file);

            dispatch(uploadFile(file)).then((response: any) => {
                const uploadedImageUrl = response.payload.data.data.url;
                setData({ ...data, coverImage: uploadedImageUrl });
                setIsFileUploaded(true); // Set to true once the file is uploaded
                console.log('File uploaded', uploadedImageUrl);
            });
        }
    };

    return (
        <div className="dashboard-card-details-container">
            <div className="dashboard-card-header">
                Dashboard card details <Vector />
            </div>

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

                {!isFileUploaded && (
                    <div className="error-message" style={{ color: 'red', marginTop: '5px' }}>
                        Please upload a file.
                    </div>
                )}
            </div>

            <div className="lesson-name-section">
                <label htmlFor="lesson-name" className="lesson-name-label">
                    Lesson name
                </label>
                <input
                    type="text"
                    id="lesson-name"
                    className="lesson-name-input"
                    placeholder="Enter the lesson name"
                    value={data.name}
                    onChange={(e) =>
                        setData({
                            ...data,
                            name: e.target.value,
                        })
                    }
                    maxLength={50}
                    required
                />
                <div className="lesson-name-footer">50 characters</div>
            </div>

            <div className="lesson-description-section">
                <label htmlFor="lesson-description" className="lesson-description-label">
                    Lesson description
                </label>
                <input
                    type="text"
                    id="lesson-description"
                    className="lesson-description-input"
                    placeholder="Enter the lesson description"
                    value={data.description}
                    onChange={(e) =>
                        setData({
                            ...data,
                            description: e.target.value,
                        })
                    }
                    maxLength={200}
                    required
                />
                <div className="lesson-description-footer">200 characters</div>
            </div>
        </div>
    );
};
