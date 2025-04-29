// Simple performance monitoring

export const initPerformanceMonitoring = () => {
  // Record page load time
  window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    
    // Store in localStorage for tracking
    const performanceData = JSON.parse(localStorage.getItem('performanceData') || '[]');
    performanceData.push({
      type: 'pageLoad',
      time: loadTime,
      timestamp: Date.now(),
      url: window.location.pathname
    });
    
    // Keep only the last 50 entries
    if (performanceData.length > 50) {
      performanceData.shift();
    }
    
    localStorage.setItem('performanceData', JSON.stringify(performanceData));
  });
  
  // Track route changes
  const originalPushState = window.history.pushState;
  window.history.pushState = function() {
    const result = originalPushState.apply(this, arguments);
    
    // Record navigation time
    const navTime = performance.now();
    console.log(`Navigation to ${window.location.pathname} in ${navTime.toFixed(2)}ms`);
    
    // Store in localStorage
    const performanceData = JSON.parse(localStorage.getItem('performanceData') || '[]');
    performanceData.push({
      type: 'navigation',
      time: navTime,
      timestamp: Date.now(),
      url: window.location.pathname
    });
    
    // Keep only the last 50 entries
    if (performanceData.length > 50) {
      performanceData.shift();
    }
    
    localStorage.setItem('performanceData', JSON.stringify(performanceData));
    
    return result;
  };
}; 