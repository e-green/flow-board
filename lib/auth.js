export const handleLogout = (userId) => {
    // Clear user-specific calendar notes
    localStorage.removeItem(`calendarNotes_${userId}`);
    // Clear userId
    localStorage.removeItem('userId');
    // Add any other cleanup needed
  };
  
  export const handleLogin = (userId) => {
    // Save userId to localStorage
    localStorage.setItem('userId', userId);
    // Add any other login-related logic
  };