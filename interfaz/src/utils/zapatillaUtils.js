// zapatillaUtils.js

// Función para reportar una zapatilla
export const reportZapatilla = async (zapatillaId) => {
    try {
      const response = await fetch(`http://localhost:8000/zapatillas/${zapatillaId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason: 'Inappropriate content' }) // Aquí puedes ajustar la razón del reporte según tu aplicación
      });
  
      if (!response.ok) {
        throw new Error('Failed to report zapatilla');
      }
  
      console.log('Zapatilla reported successfully');
    } catch (error) {
      console.error('Error reporting zapatilla:', error);
    }
  };
  
  // Función para editar una zapatilla
  export const editZapatilla = async (zapatilla) => {
    try {
      const response = await fetch(`http://localhost:8000/zapatilla/${zapatilla.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(zapatilla)
      });
  
      if (!response.ok) {
        throw new Error('Failed to edit zapatilla');
      }
  
      console.log('Zapatilla edited successfully');
    } catch (error) {
      console.error('Error editing zapatilla:', error);
    }
  };
  
  // Función para eliminar una zapatilla
  export const deleteZapatilla = async (zapatillaId) => {
    try {
      const response = await fetch(`http://localhost:8000/zapatilla/${zapatillaId}/delete`, {
        method: 'DELETE'
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete zapatilla');
      }
  
      console.log('Zapatilla deleted successfully');
    } catch (error) {
      console.error('Error deleting zapatilla:', error);
    }
  };
  