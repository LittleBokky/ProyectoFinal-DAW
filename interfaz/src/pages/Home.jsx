// home.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import OptionsButtom from '../components/OptionsButtom';
import { editZapatilla, deleteZapatilla, reportZapatilla } from '../utils/zapatillaUtils';

const Home = () => {
    const [zapatillas, setZapatillas] = useState([]);

    useEffect(() => {
        const fetchZapatillas = async () => {
            try {
                const response = await fetch('http://localhost:8000/zapatillas');
                const data = await response.json();
                // Suponiendo que los datos incluyen ahora el nombre del usuario
                setZapatillas(data);
            } catch (error) {
                console.error('Error fetching zapatillas:', error);
            }
        };

        fetchZapatillas();
    }, []);

    const handleEdit = (zapatilla) => {
        editZapatilla(zapatilla);
    };

    const handleDelete = (zapatillaId) => {
        deleteZapatilla(zapatillaId);
    };

    const handleReport = (zapatilla) => {
        reportZapatilla(zapatilla.id);
    };

    return (
        <Container className="mt-5">
            <Row>
                {zapatillas.map((zapatilla) => (
                    <Col key={zapatilla.id} md={4} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{zapatilla.name}</Card.Title>
                                <Card.Text>
                                    Price: ${zapatilla.price}
                                </Card.Text>
                                <Card.Text>
                                    Sold by: {zapatilla.user_name} {/* Mostrar el nombre del usuario */}
                                </Card.Text>
                                <div>                        
                                    <img
                                        src={zapatilla.image}
                                        alt={`Zapatilla ${zapatilla.name}`}
                                        className="img-fluid mb-2"
                                    />
                                </div>
                                <OptionsButtom 
                                    target={zapatilla} 
                                    onEdit={handleEdit} 
                                    onDelete={handleDelete} 
                                    onReport={handleReport} 
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Home;
