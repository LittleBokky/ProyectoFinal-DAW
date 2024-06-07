import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Modal, Button, Form } from 'react-bootstrap';
import OptionsButtom from '../components/OptionsButtom';
import { editZapatilla, deleteZapatilla, reportZapatilla } from '../utils/zapatillaUtils';
import { Heart } from 'react-bootstrap-icons';
import { newCompras } from '../utils/comprasUtils';
import { newFavorito } from '../utils/favoritoUtils'; // Importar la función newFavorito
import '../styles/Home.css';

const Home = () => {
    const [zapatillas, setZapatillas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTalla, setFilterTalla] = useState('');
    const [filterPrecioMin, setFilterPrecioMin] = useState('');
    const [filterPrecioMax, setFilterPrecioMax] = useState('');
    const [filterMarca, setFilterMarca] = useState('');
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [selectedZapatilla, setSelectedZapatilla] = useState(null);
    const userData = JSON.parse(localStorage.getItem("userData"));

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

    const handleEdit = (zapatilla) => {
        editZapatilla(zapatilla);
    };

    const handleDelete = (zapatillaId) => {
        deleteZapatilla(zapatillaId);
    };

    const handleReport = (zapatilla) => {
        reportZapatilla(zapatilla.id);
    };

    const handleBuy = (zapatilla) => {
        setSelectedZapatilla(zapatilla);
        setShowBuyModal(true);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleAcceptBuy = async () => {
        if (selectedZapatilla) {
            await newCompras(selectedZapatilla.id);
            setShowBuyModal(false);
        }
    };

    const handleLike = async (zapatilla_id) => {
        await newFavorito(zapatilla_id);
    };

    const filteredZapatillas = zapatillas.filter((zapatilla) => {
        const nameMatch = zapatilla.name.toLowerCase().includes(searchTerm.toLowerCase());
        const marcaMatch = zapatilla.marca.toLowerCase().includes(searchTerm.toLowerCase());
        const tallaMatch = filterTalla ? zapatilla.size === parseInt(filterTalla) : true;
        const precioMinMatch = filterPrecioMin ? zapatilla.price >= parseFloat(filterPrecioMin) : true;
        const precioMaxMatch = filterPrecioMax ? zapatilla.price <= parseFloat(filterPrecioMax) : true;
        const marcaFilterMatch = filterMarca ? zapatilla.marca === filterMarca : true;
        return (nameMatch || marcaMatch) && tallaMatch && precioMinMatch && precioMaxMatch && marcaFilterMatch;
    });

    return (
        <Container>
            <Row>
                <Col>
                    <Form.Control
                        type="text"
                        placeholder="Buscar zapatillas por nombre o marca"
                        onChange={handleSearch}
                        value={searchTerm}
                        className="mb-3 search-bar"
                    />
                </Col>
            </Row>
            <Row className="search-filters">
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Filtrar por <br />talla:</Form.Label>
                        <Form.Control as="select" onChange={(e) => setFilterTalla(e.target.value)} value={filterTalla}>
                            <option value="">Todas</option>
                            <option value="36">36</option>
                            <option value="37">37</option>
                            <option value="38">38</option>
                            <option value="39">39</option>
                            <option value="41">41</option>
                            <option value="42">42</option>
                            <option value="43">43</option>
                            <option value="44">44</option>
                            <option value="45">45</option>
                            <option value="46">46</option>
                            <option value="47">47</option>
                            <option value="48">48</option>
                            <option value="49">49</option>
                            <option value="50">50</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group>
                        <Form.Label>Precio mínimo:</Form.Label>
                        <Form.Control type="number" min="0" onChange={(e) => setFilterPrecioMin(e.target.value)} value={filterPrecioMin} />
                    </Form.Group>
                </Col>
                <Col md={2}>
                    <Form.Group>
                        <Form.Label>Precio máximo:</Form.Label>
                        <Form.Control type="number" min="0" onChange={(e) => setFilterPrecioMax(e.target.value)} value={filterPrecioMax} />
                    </Form.Group>
                </Col>
                <Col md={3}>
                    <Form.Group>
                        <Form.Label>Filtrar por <br />marca:</Form.Label>
                        <Form.Control as="select" onChange={(e) => setFilterMarca(e.target.value)} value={filterMarca}>
                            <option value="">Todas</option>
                            <option value="Nike">Nike</option>
                            <option value="Adidas">Adidas</option>
                            <option value="Reebok">Reebok</option>
                            <option value="Puma">Puma</option>
                            <option value="Converse">Converse</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
            </Row>
            <Row xs={2} sm={2} md={3} lg={4} className="justify-content-center">
                {filteredZapatillas.map((zapatilla) => (
                    <Col key={zapatilla.id} className="mb-4">
                        <div className="m-2">
                            <Card className="card" style={{ width: '12rem' }}>
                                <Card.Img
                                    variant="top"
                                    src={zapatilla.image}
                                    onClick={() => {
                                        setSelectedImage(zapatilla.image);
                                        setShowModal(true);
                                    }}
                                />
                                <Card.Body>
                                    <Card.Title>{zapatilla.marca}</Card.Title>
                                    <Card.Title>{zapatilla.name}</Card.Title>
                                    <Card.Text>Talla: {zapatilla.size}</Card.Text>
                                    <Card.Text>Precio: {zapatilla.price}€</Card.Text>
                                    <Card.Text>Vendido por: {zapatilla.username}</Card.Text>
                                    <OptionsButtom
                                        target={zapatilla}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                        onReport={handleReport}
                                    />
                                    {userData.user !== zapatilla.username && (
                                        <Button variant="primary" onClick={() => handleBuy(zapatilla)}>Comprar</Button>
                                    )}
                                </Card.Body>
                                <Card.Footer>
                                    <Heart onClick={() => handleLike(zapatilla.id)} style={{ cursor: 'pointer' }} /> like
                                </Card.Footer>
                            </Card>
                        </div>
                    </Col>
                ))}
            </Row>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body style={{ textAlign: 'center' }}>
                    <img src={selectedImage} alt="Zapato" style={{ maxWidth: '100%', maxHeight: '70vh', margin: 'auto', display: 'block' }} />
                </Modal.Body>
            </Modal>
            {selectedZapatilla && (
                <Modal show={showBuyModal} onHide={() => setShowBuyModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmar Compra</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Marca: {selectedZapatilla.marca}</p>
                        <p>Nombre: {selectedZapatilla.name}</p>
                        <p>Talla: {selectedZapatilla.size}</p>
                        <p>Precio: {selectedZapatilla.price}€</p>
                        <p>Vendido por: {selectedZapatilla.username}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowBuyModal(false)}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleAcceptBuy}>
                            Aceptar Compra
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default Home;
