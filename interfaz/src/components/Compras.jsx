import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { getCompras } from '../utils/comprasUtils';

const Compras = () => {
    const [compras, setCompras] = useState([]);

    useEffect(() => {
        const fetchCompras = async () => {
            const data = await getCompras();
            if (data) {
                setCompras(data);
            }
        };

        fetchCompras();
    }, []);

    return (
        <Container>
            <h2>Mis Compras</h2>
            <Row>
                {compras.map((compra) => (
                    <Col xs={4} key={compra.id} md={4} className="mb-4">
                        <Card>
                            <Card.Img variant="top" src={compra.zapatilla_image} />
                            <Card.Body>
                                <Card.Title>{compra.zapatilla_marca}</Card.Title>
                                <Card.Title>{compra.zapatilla_name}</Card.Title>
                                <Card.Text>
                                    Precio: €{compra.zapatilla_price}<br />
                                    Talla: {compra.zapatilla_size}<br />
                                    Vendido por: {compra.zapatilla_user}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Compras;
