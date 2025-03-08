// fetchdata.js
  // Function to fetch vehicle data
 export const getVehicleData = async () => {
    try {
      const response = await fetch('http://localhost:8000/vehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()

      if (response.ok) {
        return data.vehicles // Set vehicle data to state
      } else if (response.status === 404) {
        console.warn('No vehicle data found.');
        return [];
    }else {
        console.error(`Error ${response.status}: ${data.detail}`)
      }
    } catch (error) {
      console.error('Error fetching vehicle data:', error)
    }
  }

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
            console.warn('No nonemployee data found.');
            return [];
        } else {
            console.error(`Error ${response.status}: ${data.detail}`);
        }
    } catch (error) {
        console.error('Error fetching employee data:', error);
    }
};

// Function to fetch refrigerant data
export const getRefrigerantData = async () => {
    try {
        const response = await fetch('http://localhost:8000/refrigerant', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        const data = await response.json()

        if (response.ok) {
            return data.refrigerants;
        }
        else if (response.status === 404) {
            console.warn('No refrigerant data found.');
            return [];
        }
        else {
            console.error(`Error ${response.status}: ${data.detail}`)
        }
    } catch (error) {
        console.error('Error fetching refrigerant data:', error)
    }
};

// Function to fetch Machinery data
export const getMachineryData = async () => {
    try {
        const response = await fetch('http://localhost:8000/Machinery', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (response.ok) {
            return data.Machinery // Set data to state
        } else if (response.status === 404) {
            console.warn('No machinary data found.');
            return [];
        } else {
            console.error(`Error ${response.status}: ${data.detail}`);
        }
    } catch (error) {
        console.error('Error fetching Machinery data:', error);
    }
};

// Function to fetch generator data
export const getEmergency_GeneratorData = async () => {
    try {
        const response = await fetch('http://localhost:8000/Emergency_Generator', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (response.ok) {
            return data.Emergency_Generator;  // Ensure data is an array
        } else if (response.status === 404) {
            console.warn('No Emergency_Generator data found.');
            return [];
        } else {
            console.error(`Error ${response.status}: ${data.detail}`);
        }
    } catch (error) {
        console.error('Error fetching generator data:', error);
    }
};

export const getElectricityData = async () => {
    try {
      const response = await fetch('http://localhost:8000/Electricity', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
  
      if (response.ok) {
        return data.electricities;
      } else if (response.status === 404) {
        console.warn('No electricity data found.');
        return [];
      } else {
        console.error(`Error ${response.status}: ${data.detail}`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching electricity data:', error);
      return null;
    }
  };

// Function to fetch commute data
export const getCommuteData = async () => {
    try {
        const response = await fetch('http://localhost:8000/Commute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (response.ok) {
            return data.Commute;  // Set commute data to state
        } else if (response.status === 404) {
            console.warn('No commute data found.');
            return [];
        }
        else {
            console.error(`Error ${response.status}: ${data.detail}`);
        }
    } catch (error) {
        console.error('Error fetching commute data:', error);
    }
};

export const getBusiness_TripData = async () => {
    try {
        const response = await fetch('http://localhost:8000/Business_Trip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (response.ok) {
            return data.Business_Trip;  // Set vehicle data to state
        } else if (response.status === 404) {
            console.warn('No business_trip data found.');
            return [];
        } else {
            console.error(`Error ${response.status}: ${data.detail}`);
        }
    } catch (error) {
        console.error('Error fetching business Trip data:', error);
    }
};

// Function to fetch operational waste data
export const getOperationalWasteData = async () => {
    try {
        const response = await fetch('http://localhost:8000/Operational_Waste', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (response.ok) {
            return data.Operational_Waste;  // Set operational waste data to state
        } else if (response.status === 404) {
            console.warn('No Operational Waste data found.');
            return [];
        } else {
            console.error(`Error ${response.status}: ${data.detail}`);
        }
    } catch (error) {
        console.error('Error fetching operational waste data:', error);
    }
};

// Function to fetch selling waste data
export const getSellingWasteData = async () => {
    try {
        const response = await fetch('http://localhost:8000/Selling_waste', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (response.ok) {
            return data.Selling_Waste;  // Set selling waste data to state
        } else if (response.status === 404) {
            console.warn('No Selling Waste data found.');
            return [];
        } else {
            console.error(`Error ${response.status}: ${data.detail}`);
        }
    } catch (error) {
        console.error('Error fetching selling waste data:', error);
    }
};

// Function to fetch Fuel Factors data
export const getFuelFactorsData = async () => {
    try {
        const response = await fetch('http://localhost:8000/Fuel_Factors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (response.ok) {
            return data.Fuel_Factors;  // Set selling waste data to state
        } else {
            console.error(`Error ${response.status}: ${data.detail}`);
        }
    } catch (error) {
        console.error('Error fetching selling waste data:', error);
    }
};

export const getBaseline = async () => {
    try {
      const response = await fetch('http://localhost:8000/baseline')
      if (response.ok) {
        const data = await response.json()
        return (data.baseline.cfv_start_date, data.baseline.cfv_end_date)
      } else {
        console.log(response.status)
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }