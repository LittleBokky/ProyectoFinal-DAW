import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchUserDataUsingToken } from "../utils/userUtils";

const SellProduct = ({ showModal, handleClose, updateProducts }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [size, setSize] = useState('');
  const [marca, setMarca] = useState('');
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [marcas, setMarcas] = useState([]); 

  const fetchData = async () => {
    try {
      const userData = await fetchUserDataUsingToken();
      setUserData(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Error fetching user data. Please try again.');
    }
  };

  useEffect(() => {
    

    const fetchMarcas = async () => {
      try {
          const response = await fetch('http://localhost:8000/marcas');
          if (response.ok) {
              const data = await response.json();
              setMarcas(data);
          } else {
              console.error('Error fetching marcas:', response.statusText);
          }
      } catch (error) {
          console.error('Error fetching marcas:', error);
      }
    };

    fetchData();
    fetchMarcas();
  }, []); 

  const handleImageChange = (e) => {
    if (e.target.files.length > 1) {
      alert('You can only upload one image.');
      return;
    }
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData) {
      console.error('User data not available');
      setError('User data not available. Please try again.');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('size', size);
    formData.append('marca_id', marca); // Cambiado a 'marca_id'
    if (image) {
      formData.append('image', image);
    }
    formData.append('user_id', userData.id);

    console.log("Submitting form with data:", { name, price, size, marca_id: marca, user_id: userData.id }); // Cambiado a 'marca_id'

    try {
      const response = await fetch('http://localhost:8000/sell', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Product listed successfully');
        handleClose(); 
        fetchData();
      } else {
        const errorData = await response.json();
        console.error('Error listing product:', errorData);
        setError(`Error listing product: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error listing product. Please try again.');
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Sell Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter product price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formSize">
            <Form.Label>Size</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter product size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formMarca">
            <Form.Label>Marca</Form.Label>
            <Form.Control as="select" value={marca} onChange={(e) => setMarca(e.target.value)}>
              <option value="">Selecciona una marca</option>
              {marcas.map(marca => (
                <option key={marca.id} value={marca.id}>{marca.name}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="formImage">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={handleClose} className="mr-2">
              Close
            </Button>
            <Button variant="primary" type="submit" disabled={!userData}>
              List Product
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SellProduct;
