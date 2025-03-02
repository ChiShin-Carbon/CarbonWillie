import { useState, useCallback } from 'react';
import { getExtinguisherData, getEmployeeData } from './fetchdata.js';

export const useRefreshData = () => {
    const [extinguishers, setExtinguishers] = useState([]);
    const [employees, setEmployees] = useState([]);

    const refreshFireExtinguisherData = useCallback(async () => {
        try {
            const data = await getExtinguisherData();
            setExtinguishers(Array.isArray(data) ? data : data.extinguishers || []);
        } catch (error) {
            console.error("Error refreshing Fire Extinguisher data:", error);
        }
    }, []);

    const refreshEmployeeData = useCallback(async () => {
        console.log("🔄 Refreshing Employee data...");
        try {
            const data = await getEmployeeData();
            console.log("✅ Retrieved data:", data);
            setEmployees(Array.isArray(data) ? data : data.employees || []);
        } catch (error) {
            console.error("Error refreshing Employee data:", error);
        }
    }, []);

    return { extinguishers, employees, refreshFireExtinguisherData, refreshEmployeeData };
};