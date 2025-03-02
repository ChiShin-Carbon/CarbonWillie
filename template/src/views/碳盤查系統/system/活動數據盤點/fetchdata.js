// fetchdata.js
export const getExtinguisherData = async () => {
    try {
      const response = await fetch('http://localhost:8000/extinguisher', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData?.detail}`);
      }
  
      const data = await response.json();
      // Assuming backend returns JSON with a key called "extinguishers"
      return data.extinguishers || data; // Fallback to full data if "extinguishers" key doesn't exist
    } catch (error) {
      console.error('Error fetching extinguisher data:', error);
      throw error;
    }
  };