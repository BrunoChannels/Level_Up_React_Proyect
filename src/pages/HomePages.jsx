import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import GoogleMapComponent from '../components/GoogleMapsComponent';
import { Carousel } from 'react-bootstrap';

function HomePages() {
  return (
    <main>
      <div className="container">
        <Carousel>
          <Carousel.Item>
            <img src="/assets/img/signal-5153517_1280.jpg" className="d-block w-100" alt="Gamer Zone" />
            <Carousel.Caption>
              <h5>Gamer Zone</h5>
              <p>Level Up: La leyenda del gaming chileno. Desde 1980, hemos equipado a generaciones de jugadores. 
                Orgullosos de nuestro trabajo, forjamos el presente y el futuro de los eSports en Valparaíso. 
                ¡Nuestra historia es tu mejor upgrade!</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src="/assets/img/playstation-2617305_640.jpg" className="d-block w-100" alt="Joysticks" />
            <Carousel.Caption>
              <h5>Joysticks</h5>
              <p>No somos nuevos, somos Top 1. Level Up, tu tienda de Valparaiso, se ha ganado la cima del ranking siendo el Top 1 en ventas. 
                Esta calidad y servicio, nacidos en 1980, nos hacen merecedores de tu confianza. ¡Juega con los líderes!</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img src="/assets/img/gaming-computer-6903836_640.jpg" className="d-block w-100" alt="Pc gamers" />
            <Carousel.Caption>
              <h5>Pc gamers</h5>
              <p>¿Necesitas el mejor loot? En Level Up, desde 1980, nuestra pasión es brindarte el mejor soporte. 
                Estamos orgullosos de nuestro trabajo y del impacto que tiene en la comunidad, 
                desde aquí hasta Valparaíso. ¡Te esperamos en nuestra base!</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
      {/* Sección Quiénes Somos / Misión / Visión */}
      <section className="row mt-4">
        <div className="col-md-4">
          <h2>Quienes Somos 🎮</h2>
          <p>
            Level-Up Gamer es una tienda online dedicada a satisfacer las necesidades de los entusiastas de los videojuegos en Chile.
            Ofrece productos desde consolas y accesorios hasta computadores y sillas especializadas, con despachos a todo el país.
          </p>
        </div>
        <div className="col-md-4">
          <h2>Misión 🚀</h2>
          <p>
            Proporcionar productos de alta calidad para gamers en todo Chile, ofreciendo una experiencia de compra única y personalizada.
          </p>
        </div>
        <div className="col-md-4">
          <h2>Visión 🌟</h2>
          <p>
            Ser la tienda online líder en productos para gamers en Chile, reconocida por su innovación y servicio al cliente excepcional.
          </p>
        </div>
      </section>

      {/* Carrusel de Blogs */}
      <div className="row mt-4">
        <div className="col-md-8 mb-3">
          <h2 className="mb-3">Blogs Destacados 📰</h2>
          <Carousel>
            <Carousel.Item>
              <a href="https://as.com/meristation" target="_blank" rel="noreferrer">
                <img
                  className="d-block w-100"
                  src="/assets/img/099eb829-7eeb-4625-9ef8-d21636cb46a2-profile_banner-480.jpeg"
                  alt="Blog 1"
                />
              </a>
            </Carousel.Item>
            <Carousel.Item>
              <a href="https://www.3djuegos.com" target="_blank" rel="noreferrer">
                <img
                  className="d-block w-100"
                  src="/assets/img/1366_521.jpeg"
                  alt="Blog 2"
                />
              </a>
            </Carousel.Item>
            <Carousel.Item>
              <a href="https://www.tarreo.com" target="_blank" rel="noreferrer">
                <img
                  className="d-block w-100"
                  src="/assets/img/87842165034469.5ae6b780cc4bd.png"
                  alt="Blog 3"
                />
              </a>
            </Carousel.Item>
          </Carousel>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-8 mb-3">
          <h2 className="mb-3">Encuéntranos en el Mapa 📍</h2>
          {/* Componente de Google Maps */}
          <GoogleMapComponent />
        </div>
      </div>


    </main>
  );
}

export default HomePages;
