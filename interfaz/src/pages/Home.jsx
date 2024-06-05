import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import OptionsButtom from '../components/OptionsButtom';
import '../styles/Home.css';
import { editZapatilla, deleteZapatilla, reportZapatilla } from '../utils/zapatillaUtils';

const Home = () => {
    const [zapatillas, setZapatillas] = useState([]);

    useEffect(() => {
        const fetchZapatillas = async () => {
            try {
                const response = await fetch('http://localhost:8000/zapatillas');
                const data = await response.json();
                setZapatillas(data);
            } catch (error) {
                console.error('Error fetching zapatillas:', error);
            }
        };

        fetchZapatillas();
    }, []);

    // Filtrar las zapatillas por marca
    const marcaZapatillas = zapatillas.filter(zapatilla => zapatilla.marca === 'Nike');

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
            <Row xs={2} sm={2} md={3} lg={3}>
                {zapatillas.map((zapatilla) => (
                    <Col key={zapatilla.id} className="mb-4">
                        <div className="m-2">
                            <Card className="card" style={{ width: '12rem' }}>
                                <Card.Img variant="top" src={zapatilla.image} />
                                <Card.Body>
                                <Card.Title>{zapatilla.marca} {/* Mostrar la marca */} </Card.Title>
                                    <Card.Title>{zapatilla.name}</Card.Title>
                                    <Card.Text>
                                        Size: {zapatilla.size}
                                    </Card.Text>
                                    <Card.Text>
                                        Price: ${zapatilla.price}
                                    </Card.Text>            
                                    <Card.Text>
                                        Sold by: {zapatilla.username}
                                    </Card.Text>
                                    <OptionsButtom 
                                        target={zapatilla} 
                                        onEdit={handleEdit} 
                                        onDelete={handleDelete} 
                                        onReport={handleReport} 
                                    />
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Home;
