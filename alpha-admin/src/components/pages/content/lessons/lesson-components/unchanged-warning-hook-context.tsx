import React, { createContext, useContext, useState } from 'react';

interface UnsavedChangesContextType {
    dirty: boolean;
    setDirty: (value: boolean) => void;
    saveAsDraft: () => void;  // Add the saveAsDraft function here
    discardChanges: () => void;
    cancelNavigation: () => void;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType | undefined>(undefined);

export const UnsavedChangesProvider = ({ children }: { children: React.ReactNode }) => {
    const [dirty, setDirty] = useState<any>(false);

    const saveAsDraft = () => {
        // Implement your logic to call the save draft API
        console.log('Save draft API called');
        setDirty(false);
        // Add your API call here if needed
    };

    const discardChanges = () => {
        setDirty(false);
        // Logic to discard changes
    };

    const cancelNavigation = () => {
        // Logic to cancel navigation
        setDirty(false);
    };

    return (
        <UnsavedChangesContext.Provider
            value={{ dirty, setDirty, saveAsDraft, discardChanges, cancelNavigation }}
        >
            {children}
        </UnsavedChangesContext.Provider>
    );
};

export const useUnsavedChanges = () => {
    const context = useContext(UnsavedChangesContext);
    if (!context) {
        throw new Error('useUnsavedChanges must be used within an UnsavedChangesProvider');
    }
    return context;
};
