import { useState, useCallback } from 'react';
import { getExtinguisherData, getEmployeeData, getNonEmployeeData, getRefrigerantData } from './fetchdata.js';

export const useRefreshData = () => {
    const [extinguishers, setExtinguishers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [nonemployees, setNonEmployees] = useState([]);
    const [refrigerants, setRefrigerants] = useState([]);



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

    const refreshNonEmployeeData = useCallback(async () => {
        console.log("🔄 Refreshing NonEmployee data...");
        try {
            const data = await getNonEmployeeData();
            console.log("✅ Retrieved data:", data);
            setNonEmployees(Array.isArray(data) ? data : data.Nonemployees || []);
        } catch (error) {
            console.error("Error refreshing NonEmployee data:", error);
        }
    }, []);

    const refreshRefrigerantData = useCallback(async () => {
        console.log("🔄 Refreshing Refrigenrant data...");
        try {
            const data = await getRefrigerantData();
            console.log("✅ Retrieved data:", data);
            setRefrigerants(Array.isArray(data) ? data : data.refrigerants || []);
        } catch (error) {
            console.error("Error refreshing Refrigenrant data:", error);
        }
    }, []);

    return { extinguishers, employees,nonemployees, refrigerants,refreshFireExtinguisherData, refreshEmployeeData,refreshNonEmployeeData, refreshRefrigerantData };
};