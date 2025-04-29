// Simple rate limiter for admin login attempts
const loginAttempts = {
  count: 0,
  lastReset: Date.now(),
  locked: false
};

export const checkRateLimit = () => {
  // Reset counter after 1 hour
  if (Date.now() - loginAttempts.lastReset > 3600000) {
    loginAttempts.count = 0;
    loginAttempts.lastReset = Date.now();
    loginAttempts.locked = false;
  }
  
  // Check if locked out
  if (loginAttempts.locked) {
    return false;
  }
  
  // Increment counter
  loginAttempts.count++;
  
  // Lock after 5 attempts
  if (loginAttempts.count >= 5) {
    loginAttempts.locked = true;
    
    // Auto unlock after 1 hour
    setTimeout(() => {
      loginAttempts.locked = false;
      loginAttempts.count = 0;
    }, 3600000);
    
    return false;
  }
  
  return true;
}; 