import React from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';  

const customCarousel = ({ images }) => {
  return (
    <Carousel>
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100 carousel-image" // Agregamos la clase carousel-image
            src={image.src}
            alt={image.alt}
          />
          <Carousel.Caption>
            <h3>{image.captionTitle}</h3>
            <p>{image.captionText}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default customCarousel;
