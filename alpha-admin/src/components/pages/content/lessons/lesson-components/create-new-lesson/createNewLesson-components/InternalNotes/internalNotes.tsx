import React from 'react';
import './internalNotes.scss';

export interface InternalNotesProps {
    notes: string;
    setNotes: (notes: string) => void;
    data: any;
    setData: any;
    errors: any; // Accept errors prop for validation
    setDirty?: any;
}

export const InternalNotes = ({ notes, setNotes, data, setData, errors , setDirty }: InternalNotesProps) => {
    return (
        <div className="internal-notes-container">
            <div className="internal-notes-header">Internal notes</div>
            <div className="internal-notes-body">
                <label htmlFor="internal-notes" className="internal-notes-label">
                    Internal notes (optional)
                </label>
                <input
                    type="text"
                    id="internal-notes"
                    className="internal-notes-input"
                    placeholder="Add internal notes (these won’t be seen by the patient)"
                    maxLength={150}
                    value={data.internalNotes}
                    onChange={(e) => {
                        setData({ ...data, internalNotes: e.target.value });
                        setDirty(true);
                      }}                      
                />
                <div className="internal-notes-footer">150 characters</div>
                {errors.internalNotes && (
                    <p className="error-text">{errors.internalNotes}</p> /* Display error */
                )}
            </div>
        </div>
    );
};
