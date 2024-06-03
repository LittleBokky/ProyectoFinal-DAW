import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchUserDataUsingToken } from "../utils/userUtils";

const SellProduct = ({ showModal, handleClose, updateProducts }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUserDataUsingToken();
        setUserData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Error fetching user data. Please try again.');
      }
    };

    fetchData();
  }, []); // Ejecutar solo una vez al montar el componente

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
    if (image) {
      formData.append('image', image);
    }
    formData.append('user_id', userData.id);

    console.log("Submitting form with data:", { name, price, user_id: userData.id });

    try {
      const response = await fetch('http://localhost:8000/sell', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Product listed successfully');
        updateProducts(); // Call the function to update products list
        handleClose(); // Close the modal on success
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

          <Form.Group controlId="formImage">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={!userData}>
            List Product
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SellProduct;
