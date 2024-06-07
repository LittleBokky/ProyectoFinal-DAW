export const newCompras = async (zapatilla_id) => {
    const userData = JSON.parse(localStorage.getItem("userData"))
    try {
        const response = await fetch('http://localhost:8000/compra/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ zapatilla_id: zapatilla_id, user_id: userData.id }), // Enviar el ID de la zapatilla en un objeto
        });
        if (!response.ok) {
            throw new Error('Failed to create compra');
        }
    } catch (error) {
        console.error('Error creating compra:', error);
    }
};


export const getCompras = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    try {
        const response = await fetch('http://localhost:8000/compras/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ user_id: userData.id }),
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching compras:', error);
        return null;
    }
};

