import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UnsavedChangesModal } from "./unsavedChanges";

const RouteChangeAlert = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const prevPath = useRef(location.pathname);
  const [showModal, setShowModal] = useState(false);
  const [nextPath, setNextPath] = useState(""); // Store the path where the user wants to navigate

  // useEffect(() => {
    // Check if we are leaving "/content/lessons/createlesson" and going somewhere else
    // if (
    //   prevPath.current === "/content/lessons/createlesson" && 
    //   location.pathname !== "/content/lessons/createlesson"
    // ) {
    //   // Store the next path and show the modal
    //   setNextPath(location.pathname);
    //   setShowModal(true); 

    //   // Reset back to "/content/lessons/createlesson" because navigation is blocked until user decides
    //   navigate(prevPath.current, { replace: true }); 
    // } else {
    //   // Update previous path only if it's not related to createlesson modal navigation
    //   prevPath.current = location.pathname;
    // }
  // }, [location, navigate]);



  const handleDiscardChanges = () => {
    setShowModal(false); // Hide modal
    navigate(nextPath); // Proceed to the new path
  };

  const handleSaveChanges = () => {
    // Simulate saving changes (could be a real API call)
    console.log("Changes saved as draft");
    setShowModal(false); // Hide modal
    navigate(nextPath); // Proceed to the new path
  };

  const handleCancelNavigation = () => {
    // Close the modal, keep the user on the same page
    setShowModal(false); // Close modal, no navigation
  };

  return (
    <div>
      <UnsavedChangesModal
        title="Unsaved changes detected"
        open={showModal}
        descriptionText="You have unsaved changes. Do you want to save them before leaving?"
        closeModal={handleCancelNavigation} // Close modal, stay on the current page
        handleSaveAsDraft={handleSaveChanges} // Save as draft and navigate
        handleDontSave={handleDiscardChanges} // Discard changes and navigate
        handleCancel={handleCancelNavigation} // Stay on the current page
      />
    </div>
  );
};

export default RouteChangeAlert;

