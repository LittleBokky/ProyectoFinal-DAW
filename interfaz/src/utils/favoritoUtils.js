
export const newFavorito = async (zapatilla_id) => {

    const userData = JSON.parse(localStorage.getItem("userData"));
    try {
        const response = await fetch('http://localhost:8000/favorito/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ zapatilla_id: zapatilla_id, user_id: userData.id }), // Enviar el ID de la zapatilla en un objeto
        });

        if (!response.ok) {
            throw new Error('Failed to create favorito');
        }
    } catch (error) {
        console.error('Error creating favorito:', error);
    }
}