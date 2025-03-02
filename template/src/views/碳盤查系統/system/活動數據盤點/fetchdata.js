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
      else if (response.status === 404) {
        console.warn('No extinguisher data found.');
        return [];
      }
      const data = await response.json();
      // Assuming backend returns JSON with a key called "extinguishers"
      return data.extinguishers
    } catch (error) {
      console.error('Error fetching extinguisher data:', error);
      throw error;
    }
  };

export const getEmployeeData = async () => {
    try {
        const response = await fetch('http://localhost:8000/employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (response.ok) {
            return data.employees; 
        } else if (response.status === 404) {
            console.warn('No employee data found.');
            return [];  
        } else {
            console.error(`Error ${response.status}: ${data.detail}`);
        }
    } catch (error) {
        console.error('Error fetching employee data:', error);
    }
};

export const getNonEmployeeData = async () => {
    try {
        const response = await fetch('http://localhost:8000/NonEmployee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (response.ok) {
            return data.Nonemployees;
        } 
        else if (response.status === 404) {
            console.warn('No employee data found.');
            return [];  
        }else {
            console.error(`Error ${response.status}: ${data.detail}`);
        }
    } catch (error) {
        console.error('Error fetching employee data:', error);
    }
};