// import { useCallback, useEffect, ReactNode } from 'react';

// // Define the type for the navigation listener function
// type Listener = () => boolean | Promise<boolean>;

// // Helper function to block navigation
// function blockNavigation(fn: Listener) {
//   if (listeners.length === 0) {
//     addEventListener('beforeunload', beforeUnload, { capture: true });
//   }

//   listeners.push(fn);

//   return () => {
//     const index = listeners.indexOf(fn);
//     listeners.splice(index, 1);
//     if (listeners.length === 0) {
//       removeEventListener('beforeunload', beforeUnload, { capture: true });
//     }
//   };
// }

// // Hook to set the blocker based on a dirty flag (unsaved changes)
// export function useBlocker(dirty: boolean, blocker: Listener) {
//   useEffect(() => {
//     console.log(dirty, 'dirty');
//     if (!dirty) return;
//     return blockNavigation(blocker);
//   }, [blocker, dirty]);
// }

// // Hook to prompt the user when unsaved changes exist
// export function usePrompt(message: ReactNode, dirty = true) {
//   useBlocker(
//     dirty,
//     useCallback(async () => await confirmUnsavedChanges(message), [message])
//   );
// }

// // Async function to handle the confirmation dialog
// async function confirmUnsavedChanges(message: ReactNode): Promise<boolean> {
//     // Ensure the message is a string, defaulting to an empty string if it's not
//     const confirmationMessage = typeof message === 'string' ? message : 'You have unsaved changes. Do you want to leave without saving?';
    
//     return new Promise((resolve) => {
//       const userAction = window.confirm(confirmationMessage);
//       resolve(userAction); // Resolve with true (OK) or false (Cancel)
//     });
//   }
  

// // Dummy listener array and event handler to simulate the block logic
// const listeners: Listener[] = [];

// const beforeUnload = (e: BeforeUnloadEvent) => {
//   e.preventDefault();
//   e.returnValue = '';
// };

// // Add this to your existing `useUnsavedChanges` hook or your component

// export const useBeforeUnload = (dirty: boolean) => {
//     useEffect(() => {
//         const handleBeforeUnload = (event: BeforeUnloadEvent) => {
//             if (dirty) {
//                 event.preventDefault();
//                 // This is required for Chrome and Firefox to show the confirmation dialog.
//                 event.returnValue = '';
//             }
//         };

//         // Add the event listener when the component mounts
//         window.addEventListener('beforeunload', handleBeforeUnload);

//         // Clean up the event listener when the component unmounts
//         return () => {
//             window.removeEventListener('beforeunload', handleBeforeUnload);
//         };
//     }, [dirty]);
// };


// src/hooks/useNavigationBlock.ts (or .js)

// Define the type for the navigation listener function
import { useCallback, useEffect, ReactNode } from 'react';

type Listener = () => boolean | Promise<boolean>;

// Helper function to block navigation
function blockNavigation(fn: Listener) {
  if (listeners.length === 0) {
    addEventListener('beforeunload', beforeUnload, { capture: true });
  }

  listeners.push(fn);

  return () => {
    const index = listeners.indexOf(fn);
    listeners.splice(index, 1);
    if (listeners.length === 0) {
      removeEventListener('beforeunload', beforeUnload, { capture: true });
    }
  };
}

// Hook to set the blocker based on a dirty flag (unsaved changes)
export function useBlocker(dirty: boolean, blocker: Listener) {
  useEffect(() => {
    if (!dirty) return;
    return blockNavigation(blocker);
  }, [blocker, dirty]);
}

// Hook to prompt the user when unsaved changes exist
export function usePrompt(message: ReactNode, dirty = true) {
  useBlocker(
    dirty,
    useCallback(async () => await confirmUnsavedChanges(message), [message])
  );
}

// Async function to handle the confirmation dialog
async function confirmUnsavedChanges(message: ReactNode): Promise<boolean> {
    const confirmationMessage = typeof message === 'string' ? message : 'You have unsaved changes. Do you want to leave without saving?';
    return new Promise((resolve) => {
      const userAction = window.confirm(confirmationMessage);
      resolve(userAction);
    });
}

// Dummy listener array and event handler to simulate the block logic
const listeners: Listener[] = [];

const beforeUnload = (e: BeforeUnloadEvent) => {
  e.preventDefault();
  e.returnValue = '';
};

// Add this to your existing `useUnsavedChanges` hook or your component
export const useBeforeUnload = (dirty: boolean) => {
  useEffect(() => {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
          if (dirty) {
              event.preventDefault();
              // Show the confirmation dialog (standard for modern browsers)
              event.returnValue = ''; // Some browsers still require setting this property
          }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
      };
  }, [dirty]);
};

export const useBlockBackButton = (dirty: boolean) => {
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // If the form has unsaved changes, show the modal and prevent navigation
      if (dirty) {
        event.preventDefault();
        window.history.pushState(null, '', window.location.href); // Push the state again to prevent the back navigation
      }
    };

    // Add the event listener for detecting back/forward navigation
    window.addEventListener('popstate', handlePopState);

    // Push a new state when the component mounts
    if (dirty) {
      window.history.pushState(null, '', window.location.href); // Push initial state so that the user is blocked on back navigation
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [dirty, window.location.href]);

  useEffect(() => {
    // Reset the history state to clean it when the component mounts
    window.history.replaceState(null, '', window.location.href);
  }, []);
};
