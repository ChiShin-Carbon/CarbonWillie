import { useState, useCallback } from 'react';
import { 
    getVehicleData,
    getExtinguisherData, 
    getEmployeeData, 
    getNonEmployeeData, 
    getRefrigerantData, 
    getMachineryData, 
    getEmergency_GeneratorData,
    getElectricityData,
    getCommuteData,
    getBusiness_TripData,
    getOperationalWasteData,
    getSellingWasteData
} from './fetchdata.js';

export const useRefreshData = () => {
    const [vehicle, setVehicle] = useState([]);
    const [extinguishers, setExtinguishers] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [nonemployees, setNonEmployees] = useState([]);
    const [refrigerants, setRefrigerants] = useState([]);
    const [machinery, setMachinery] = useState([]);
    const [Emergency_Generator, setEmergency_Generator] = useState([]);
    const [electricity, setElectricity] = useState([]);
    const [commute, setCommute] = useState([]);
    const [business_trip, setbusiness_trip] = useState([]);
    const [operationalwaste, setOperationalwaste] = useState([]);
    const [sellingwaste, setSellingwaste] = useState([]);

    const refreshVehicleData = useCallback(async () => {
        console.log("🔄 Refreshing vehicles data...");
        try {
            const data = await getVehicleData();
            console.log("✅ Retrieved data:", data);
            setVehicle(Array.isArray(data) ? data : data.vehicles || []);
        } catch (error) {
            console.error("Error refreshing vehicles data:", error);
        }
    }, []);

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


    const refreshMachineryData = useCallback(async () => {
        console.log("🔄 Refreshing Emergency_Generator data...");
        try {
            const data = await getMachineryData();
            console.log("✅ Retrieved data:", data);
            setMachinery(Array.isArray(data) ? data : data.machinery || []);
        } catch (error) {
            console.error("Error refreshing Emergency_Generator data:", error);
        }
    }, []);

    const refreshEmergency_GeneratorData = useCallback(async () => {
        console.log("🔄 Refreshing Emergency_Generator data...");
        try {
            const data = await getEmergency_GeneratorData();
            console.log("✅ Retrieved data:", data);
            setEmergency_Generator(Array.isArray(data) ? data : data.extinguishers || []);
        } catch (error) {
            console.error("Error refreshing Emergency_Generator data:", error);
        }
    }, []);

    const refreshElectricityData = useCallback(async () => {
        console.log("🔄 Refreshing Electricity data...");
        try {
            const data = await getElectricityData();
            console.log("✅ Retrieved data:", data);
            setElectricity(Array.isArray(data) ? data : data.extinguishers || []);
        } catch (error) {
            console.error("Error refreshing Electricity data:", error);
        }
    }, []);

    const refreshCommuteData = useCallback(async () => {
        console.log("🔄 Refreshing Emergency_Generator data...");
        try {
            const data = await getCommuteData();
            console.log("✅ Retrieved data:", data);
            setCommute(Array.isArray(data) ? data : data.commute || []);
        } catch (error) {
            console.error("Error refreshing Emergency_Generator data:", error);
        }
    }, []);

    const refreshBusinessTripData = useCallback(async () => {
        console.log("🔄 Refreshing Emergency_Generator data...");
        try {
            const data = await getBusiness_TripData();
            console.log("✅ Retrieved data:", data);
            setbusiness_trip(Array.isArray(data) ? data : data.commute || []);
        } catch (error) {
            console.error("Error refreshing Emergency_Generator data:", error);
        }
    }, []);

    const refreshWasteData = useCallback(async () => {
        console.log("🔄 Refreshing Emergency_Generator data...");
        try {
            const data = await getOperationalWasteData();
            console.log("✅ Retrieved data:", data);
            setOperationalwaste(Array.isArray(data) ? data : data.Operational_Waste || []);
        } catch (error) {
            console.error("Error refreshing Emergency_Generator data:", error);
        }
    }, []);

    const refreshSellingWasteData = useCallback(async () => {
        console.log("🔄 Refreshing Emergency_Generator data...");
        try {
            const data = await getSellingWasteData();
            console.log("✅ Retrieved data:", data);
            setSellingwaste(Array.isArray(data) ? data : data.Selling_Waste || []);
        } catch (error) {
            console.error("Error refreshing Emergency_Generator data:", error);
        }
    }, []);

    

    return {
        vehicle,
        extinguishers,
        employees,
        nonemployees,
        refrigerants,
        machinery,
        Emergency_Generator,
        electricity,
        commute,
        business_trip,
        operationalwaste,
        sellingwaste,
        refreshVehicleData,
        refreshFireExtinguisherData,
        refreshEmployeeData,
        refreshNonEmployeeData,
        refreshRefrigerantData,
        refreshMachineryData,
        refreshEmergency_GeneratorData,
        refreshElectricityData,
        refreshCommuteData,
        refreshBusinessTripData,
        refreshWasteData,
        refreshSellingWasteData
    };
};