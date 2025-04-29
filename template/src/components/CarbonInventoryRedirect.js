import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import BaselineService from '../services/baselineService';

// Component to handle redirection based on baseline completion status
const CarbonInventoryRedirect = () => {
  const [loading, setLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState(null);
  
  useEffect(() => {
    const fetchBaselineStatus = async () => {
      try {
        // Use our baseline service to get the status
        const response = await BaselineService.getLatestBaseline();
        
        if (response && response.baseline) {
          // If is_completed is true, redirect to system, otherwise to 基準年設定
          if (response.baseline.is_completed) {
            setRedirectPath('/碳盤查系統/system');
          } else {
            setRedirectPath('/碳盤查系統/system/基準年設定');
          }
        } else {
          // If no baseline exists, redirect to setup page
          setRedirectPath('/碳盤查系統/system/基準年設定');
        }
      } catch (error) {
        console.error('Error fetching baseline status:', error);
        // Default to baseline setup page on error
        setRedirectPath('/碳盤查系統/system/基準年設定');
      } finally {
        setLoading(false);
      }
    };

    fetchBaselineStatus();
  }, []);

  // Show loading indicator while fetching status
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to the appropriate path
  return <Navigate to={redirectPath} replace />;
};

export default CarbonInventoryRedirect;