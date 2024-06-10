import React from 'react';
import { Carousel, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/News.css';

const News = () => {
  return (
    <Container>
         <nav>
        <ul>
          <li><a href="#nike">Nike</a></li>
          <li><a href="#adidas">Adidas</a></li>
          <li><a href="#converse">Converse</a></li>
          <li><a href="#jordan">Jordan</a></li>
        </ul>
      </nav>
      <h1>¡Nuevos lanzamientos de zapatillas!</h1>
      <p className="welcome-paragraph">¡Bienvenido! Aquí encontrarás los últimos lanzamientos de zapatillas de las marcas más populares. Explora nuestras secciones para conocer más sobre cada modelo.</p>
    <section id="nike">
    <h2>Nike: Air Max Dn</h2>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../../public/nike_dn1.png"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../../public/nike_dn2.png"
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../../public/nike_dn3.png"
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>
      <p>
      Nike presenta el Air Max Dn, una nueva generación de tecnología Air con Dynamic Air. Esta innovación está diseñada para crear una
       transición más suave del talón a la punta del pie, proporcionando una experiencia de comodidad interactiva con una unidad de aire que
     responde en tiempo real a tus movimientos.
      </p>

    </section>
    
    <section id="adidas">
    <h2>Adidas: Ultraboost 24</h2>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../../public/adidas3.avif"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../../public/adidas2.avif"
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../../public/adidas4.avif"
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>
      <p>
        Adidas lanza el Ultraboost 24, mejorando aún más su famosa tecnología Boost. Este modelo incluye una malla más ligera y transpirable, además de una suela 
        que ofrece mayor tracción y durabilidad. Ideal para corredores y para uso diario.
      </p>
    </section>
      
     <section id="converse">
     <h2>Converse: Chuck Taylor All Star CX</h2>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../../public/converse1.jpg"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../../public/converse2.jpg"
            alt="Second slide"
          />
        </Carousel.Item>
      </Carousel>
      <p>
        Converse reinventa su clásico Chuck Taylor con la serie All Star CX. Estas zapatillas combinan el estilo icónico de las Chuck Taylor
         con materiales modernos y una plantilla de espuma CX para mayor comodidad y soporte durante todo el día.
      </p>
     </section>

     <section id="jordan">
     <h2>Jordan: Air Jordan 38</h2>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../../public/jordan1.png"
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../../public/jordan2.jpeg"
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="../../public/jordan3.jpeg"
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>
      <p>
        La nueva Air Jordan 38 se presenta con mejoras significativas en amortiguación y soporte. Este modelo está diseñado
         para ofrecer un rendimiento óptimo en la cancha de baloncesto, incorporando tecnologías avanzadas
          que proporcionan mayor estabilidad y comodidad.
      </p>
     </section>

    </Container>
  );
};

export default News;
