import React from 'react';
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

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            console.log('File', file);

            dispatch(uploadFile(file)).then((response: any) => {
                setData({ ...data, coverImage: response.payload.data.data.url });
                console.log('File uploaded', response.payload.data.data.url);
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
                    Cover image
                </label>
                <div className="cover-image-hint">File must be less than 5MB / KB</div>
                <UploadButton
                    showLeftIcon
                    buttonText="Upload media"
                    data={data}
                    setData={setData}
                    handleFileChange={handleFileChange}
                />
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
                />
                <div className="lesson-description-footer">200 characters</div>
            </div>
        </div>
    );
};
