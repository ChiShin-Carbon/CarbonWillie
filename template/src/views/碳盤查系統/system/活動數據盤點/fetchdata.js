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
