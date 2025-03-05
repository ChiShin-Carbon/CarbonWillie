export const deleteVehicle = async (vehicle_id) => {
    try {
      const response = await fetch(`http://localhost:8000/delete_vehicle`, {
        method: 'DELETE',
        body: JSON.stringify({ vehicle_id: vehicle_id }),
      })

      if (response.ok) {
        getVehicleData() // Fetch vehicle data again to update the table
      } else {
        console.error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }

 export const deleteExtinguisher = async (vehicle_id) => {
    try {
      const response = await fetch(`http://localhost:8000/delete_Extinguisher`, {
        method: 'DELETE',
        body: JSON.stringify({ vehicle_id: vehicle_id }),
      })

      if (response.ok) {
        getVehicleData() // Fetch vehicle data again to update the table
      } else {
        console.error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }

  export const deleteExtinguisherFill = async (vehicle_id) => {
    try {
      const response = await fetch(`http://localhost:8000/delete_ExtinguisherFill`, {
        method: 'DELETE',
        body: JSON.stringify({ vehicle_id: vehicle_id }),
      })

      if (response.ok) {
        getVehicleData() // Fetch vehicle data again to update the table
      } else {
        console.error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }

  export const deleteEmployee = async (vehicle_id) => {
    try {
      const response = await fetch(`http://localhost:8000/delete_Employee`, {
        method: 'DELETE',
        body: JSON.stringify({ vehicle_id: vehicle_id }),
      })

      if (response.ok) {
        getVehicleData() // Fetch vehicle data again to update the table
      } else {
        console.error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }

  export const deleteNonEmployee = async (vehicle_id) => {
    try {
      const response = await fetch(`http://localhost:8000/delete_NonEmployee`, {
        method: 'DELETE',
        body: JSON.stringify({ vehicle_id: vehicle_id }),
      })

      if (response.ok) {
        getVehicleData() // Fetch vehicle data again to update the table
      } else {
        console.error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }

  export const deleteRefrigerant = async (vehicle_id) => {
    try {
      const response = await fetch(`http://localhost:8000/delete_Refrigerant`, {
        method: 'DELETE',
        body: JSON.stringify({ vehicle_id: vehicle_id }),
      })

      if (response.ok) {
        getVehicleData() // Fetch vehicle data again to update the table
      } else {
        console.error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }

  export const deleteRefrigerantFill = async (vehicle_id) => {
    try {
      const response = await fetch(`http://localhost:8000/delete_RefrigerantFill`, {
        method: 'DELETE',
        body: JSON.stringify({ vehicle_id: vehicle_id }),
      })

      if (response.ok) {
        getVehicleData() // Fetch vehicle data again to update the table
      } else {
        console.error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }

  export const deleteMachinery = async (vehicle_id) => {
    try {
      const response = await fetch(`http://localhost:8000/delete_Machinery`, {
        method: 'DELETE',
        body: JSON.stringify({ vehicle_id: vehicle_id }),
      })

      if (response.ok) {
        getVehicleData() // Fetch vehicle data again to update the table
      } else {
        console.error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }

  export const deleteEmergency_Generator = async (vehicle_id) => {
    try {
      const response = await fetch(`http://localhost:8000/delete_Emergency_Generator`, {
        method: 'DELETE',
        body: JSON.stringify({ vehicle_id: vehicle_id }),
      })

      if (response.ok) {
        getVehicleData() // Fetch vehicle data again to update the table
      } else {
        console.error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }

  export const deleteCommute = async (vehicle_id) => {
    try {
      const response = await fetch(`http://localhost:8000/delete_Commute`, {
        method: 'DELETE',
        body: JSON.stringify({ vehicle_id: vehicle_id }),
      })

      if (response.ok) {
        getVehicleData() // Fetch vehicle data again to update the table
      } else {
        console.error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }

  export const deleteBusinessTrip = async (vehicle_id) => {
    try {
      const response = await fetch(`http://localhost:8000/delete_BusinessTrip`, {
        method: 'DELETE',
        body: JSON.stringify({ vehicle_id: vehicle_id }),
      })

      if (response.ok) {
        getVehicleData() // Fetch vehicle data again to update the table
      } else {
        console.error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }


  export const deleteOperationalWaste = async (vehicle_id) => {
    try {
      const response = await fetch(`http://localhost:8000/delete_OperationalWaste`, {
        method: 'DELETE',
        body: JSON.stringify({ vehicle_id: vehicle_id }),
      })

      if (response.ok) {
        getVehicleData() // Fetch vehicle data again to update the table
      } else {
        console.error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }

  export const deleteSellingWaste = async (vehicle_id) => {
    try {
      const response = await fetch(`http://localhost:8000/delete_SellingWaste`, {
        method: 'DELETE',
        body: JSON.stringify({ vehicle_id: vehicle_id }),
      })

      if (response.ok) {
        getVehicleData() // Fetch vehicle data again to update the table
      } else {
        console.error(`Error ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error)
    }
  }





  

