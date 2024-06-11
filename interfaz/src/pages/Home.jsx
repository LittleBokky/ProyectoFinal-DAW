import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Modal,
  Button,
  Form,
  ListGroup,
} from "react-bootstrap";
import OptionsButtom from "../components/OptionsButtom";
import {
  editZapatilla,
  deleteZapatilla,
  reportZapatilla,
} from "../utils/zapatillaUtils";
import { Heart, HeartFill } from "react-bootstrap-icons";
import { newCompras } from "../utils/comprasUtils";
import { newFavorito } from "../utils/favoritoUtils"; // Importar la función newFavorito
import "../styles/Home.css";

const Home = () => {
  const [zapatillas, setZapatillas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTalla, setFilterTalla] = useState("");
  const [filterPrecioMin, setFilterPrecioMin] = useState("");
  const [filterPrecioMax, setFilterPrecioMax] = useState("");
  const [filterMarca, setFilterMarca] = useState("");
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [selectedZapatilla, setSelectedZapatilla] = useState(null);
  const userData = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    const fetchZapatillas = async () => {
      const formData = new FormData;
      formData.append("user_id", userData.id)
      try {
        const response = await fetch(
          "http://localhost:8000/zapatillas/not-bought", {
            method: "POST",
            body: formData,
          });
        const data = await response.json();
        setZapatillas(data);
      } catch (error) {
        console.error("Error fetching zapatillas:", error);
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
      setZapatillas(
        zapatillas.filter((zapatilla) => zapatilla.id !== selectedZapatilla.id)
      );
      setShowBuyModal(false);
    }
  };

  const handleLike = async (zapatilla_id, currentLikedStatus) => {
    try {
      const liked = !currentLikedStatus;
      await newFavorito(zapatilla_id, liked);

      const updatedZapatillas = zapatillas.map((zapatilla) =>
        zapatilla.id === zapatilla_id ? { ...zapatilla, liked } : zapatilla
      );

      setZapatillas(updatedZapatillas);
    } catch (error) {
      console.error("Error handling like:", error);
    }
  };

  const filteredZapatillas = zapatillas.filter((zapatilla) => {
    const nameMatch = zapatilla.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const marcaMatch = zapatilla.marca
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const tallaMatch = filterTalla
      ? zapatilla.size === parseInt(filterTalla)
      : true;
    const precioMinMatch = filterPrecioMin
      ? zapatilla.price >= parseFloat(filterPrecioMin)
      : true;
    const precioMaxMatch = filterPrecioMax
      ? zapatilla.price <= parseFloat(filterPrecioMax)
      : true;
    const marcaFilterMatch = filterMarca
      ? zapatilla.marca === filterMarca
      : true;
    return (
      (nameMatch || marcaMatch) &&
      tallaMatch &&
      precioMinMatch &&
      precioMaxMatch &&
      marcaFilterMatch
    );
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
            <Form.Label>
              Filtrar por <br />
              talla:
            </Form.Label>
            <Form.Control
              type="number"
              min="0"
              onChange={(e) => setFilterTalla(e.target.value)}
              value={filterTalla}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Precio mínimo:</Form.Label>
            <Form.Control
              type="number"
              min="0"
              onChange={(e) => setFilterPrecioMin(e.target.value)}
              value={filterPrecioMin}
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Precio máximo:</Form.Label>
            <Form.Control
              type="number"
              min="0"
              onChange={(e) => setFilterPrecioMax(e.target.value)}
              value={filterPrecioMax}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>
              Filtrar por <br />
              marca:
            </Form.Label>
            <Form.Control
              as="select"
              onChange={(e) => setFilterMarca(e.target.value)}
              value={filterMarca}
            >
              <option value="">Todas</option>
              <option value="Nike">Nike</option>
              <option value="Adidas">Adidas</option>
              <option value="Reebok">Reebok</option>
              <option value="Puma">Puma</option>
              <option value="Converse">Converse</option>
              <option value="New Balance">New Balance</option>
              <option value="OffWhite">OffWhite</option>
              <option value="Jordan">Jordan</option>
              <option value="Vans">Vans</option>
              <option value="Joma">Joma</option>
              <option value="Skechers">Skechers</option>
              <option value="Fila">Fila</option>
              <option value="Asics">Asics</option>
              <option value="Artengo">Artengo</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Row className="justify-content-center">
        {filteredZapatillas.map((zapatilla) => (
          <Col xs={4} lg={3} key={zapatilla.id} className="mb-4">
            <Card className="card" style={{ width: "11rem" }}>
              <Card.Img
                variant="top"
                src={zapatilla.image}
                onClick={() => {
                  setSelectedImage(zapatilla.image);
                  setShowModal(true);
                }}
              />
              <Card.Body>
                <Row>
                  <Col xs={9}>
                    <Card.Title>{zapatilla.marca}</Card.Title>
                  </Col>
                  <Col xs={3}>
                   {userData.user === zapatilla.username && (
                     <OptionsButtom
                     target={zapatilla}
                     onDelete={handleDelete}
                   />
                   )}
                  </Col>
                </Row>
                <Card.Title>{zapatilla.name}</Card.Title>
                <ListGroup className="list-group-flush">
                  <ListGroup.Item>Precio: {zapatilla.price}€</ListGroup.Item>
                  <ListGroup.Item>Talla: {zapatilla.size}</ListGroup.Item>
                  <ListGroup.Item>
                    Vendido por: {zapatilla.username}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
              <Card.Footer>
                <Row className="align-items-center">
                  <Col xs={4} className="mb-3">
                {
                  userData.user !== zapatilla.username && (
                    <Button
                    variant="outline-primary"
                    onClick={() => handleLike(zapatilla.id)}
                  >
                    {zapatilla.liked ? (
                      <>
                        <HeartFill style={{ cursor: "pointer" }} /> Like!
                      </>
                    ) : (
                      <Heart style={{ cursor: "pointer" }} />
                    )}
                  </Button>
                  )
                }
                  </Col>
                  <Col xs={4} className="mb-0">
                    {userData.user !== zapatilla.username && (
                      <Button
                        variant="primary"
                        onClick={() => handleBuy(zapatilla)}
                      >
                        Comprar
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body style={{ textAlign: "center" }}>
          <img
            src={selectedImage}
            alt="Zapato"
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              margin: "auto",
              display: "block",
            }}
          />
        </Modal.Body>
      </Modal>
      {selectedZapatilla && (
        <Modal
          show={showBuyModal}
          onHide={() => setShowBuyModal(false)}
          centered
        >
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
