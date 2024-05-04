import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * INSTRUCCIONES:
 * 1. Cambia el color de la nave espacial a uno de tu preferencia, y verifica los cambios.
 * 2. Cambia el texto de los obstáculos a tu nombre, ejemplo: "Daniel", y verifica los cambios.
 * 3. Cambia el texto de "disparos:" por "Total:"
 * 4. Cambia el color de fondo de los obtáculos a blanco.
 * 5. Cambia el color de la letra de los obstáculos a rojo.
 * 6. Cambia el color de la "bala" a amarillo.
 * 7. Haz la "bala" un poco más grande, cámbiale el "width" a 12px.
 * 8. Identica en el código cuándo hay una colisión (cuando la bala choca con algún obstáculo) e imprime en la consola usando "console.log" un mensaje. Verifica que el mensaje se imprima cada vez que ocurra una colisión
 * 9. Identifica en el código cuando el jugador ha anotado 20 puntos y notifica al jugador usando "window.alert" con el mensaje: "Usted ha anotado 20 puntos!!"
 * 10. Reto: Crees que puedas cambiar la apariencia de la nave spacial? Inténtalo. Hint: En internet puedes buscar SVGs gratis que puedes usar aquí.
 */

const initObstacleStr = 'gamedechuchu';

function obtenercolorbasadoenlaposicion(posicion) {
if (posicion <= 0){
  return "#ff0000"
}  else if (posicion<= 0) {
  return "#00ff3c"
} else if (posicion <=200) {
  return " #002efd"
} else if (posicion <=400){
  return "#f10505"
} else {
  return "#0011ff"

  
} 
}

const getRandomNumber = () => {
  return parseInt(Math.random().toString().slice(2, Math.min(length + 2, 18)), 10);
}

const Game = () => {
  const [shipPosition, setShipPosition] = useState(0);
  const [bullets, setBullets] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const [shipColor, setShipColor] = useState('#268313');

  useEffect(() => {
    // initiaze obstacles
    // Initialize obstacles' positions
    const initialObstacles = Array.from(initObstacleStr, (char, index) => ({
      char: char?.toUpperCase(),
      left: (index * window.innerWidth) / initObstacleStr.length,
      top: 0,
      count: 0,
      id: `obstacle_${char}_${index}`
    }));
    setObstacles(initialObstacles);
  }, [])

      useEffect(() => {

    const gameFrameCheckIntervalId = setInterval(() => {
      // Each 60ms, do certain checks on the game app

      // Verfiy obstacle collapse, increment obstacle count
      let currObstacles = obstacles || [];
      let currBullets = bullets || []
      for (let currBullet of currBullets) {
        const htmlBulletElement = document.getElementById(currBullet.id);

        const bulletCalcs = htmlBulletElement.getBoundingClientRect();

        if (bulletCalcs.top <= 10) {
          // is in collapsion region

          for (let currObstacle of currObstacles) {
            const htmlObstacleElement = document.getElementById(currObstacle.id);
            const obstacleCalcs = htmlObstacleElement.getBoundingClientRect();

            if (bulletCalcs.x >= obstacleCalcs.left && bulletCalcs.x <= (obstacleCalcs.left + obstacleCalcs.width)) {
              // collapse
              currObstacle.count+= 10000;
              currBullet.expTime = new Date().getTime() - 100
            }
          }

        }
      }

      // latests verifications
      currBullets = bullets.filter((bullet) => bullet.expTime >= new Date().getTime());
      const totalPoints = (obstacles || []).reduce((acc, curr) => acc + curr.count, 0)
      console.log('total points', totalPoints)

      // setters
      setBullets(currBullets);
      setObstacles(currObstacles);
    }, 60)

    return () => {
      clearInterval(gameFrameCheckIntervalId)
    };
  }, [bullets, obstacles]);

  useEffect(() => {
    // Handle key down listener
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setShipPosition((prevPosition) => Math.max(prevPosition - 10, 0));
      } else if (e.key === 'ArrowRight') {
        setShipPosition((prevPosition) =>
          Math.min(prevPosition + 10, window.innerWidth - 50)
        );
      } else if (e.key === ' ') {
        // Fire bullet from ship's position
        setBullets((prevBullets) => [...prevBullets, { id: `bullet_${getRandomNumber()}`, x: shipPosition + 20, y: window.innerHeight, expTime: new Date().getTime() + 5000 }]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    setShipColor(obtenercolorbasadoenlaposicion(shipPosition)) 

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shipPosition]);

  const obstacleElements = obstacles.map((obstacle, index) => {
    return (
      <div
        key={index}
        id={obstacle.id}
        className="obstacle"
        style={{ left: obstacle.left, top: obstacle.top }}
      >
        <div>{obstacle.char}  {
          obstacle.count > 0 && <div className='hits'> Hits: {obstacle.count} </div>
        }</div>

      </div>
    );
  });

  const bulletElements = bullets.map((bullet, index) => {
    return (
      <div
        key={index}
        id={bullet.id}
        className="bullet"
        style={{ left: bullet.x }}
      ></div>
    );
  });

  return (
    <div className="game-container">
      <svg
        className="ship"
        style={{ left: shipPosition }}
        width="50"
        height="20"
        viewBox="0 0 50 20"
        fill={shipColor}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M1 10L10 1L40 1L49 10L40 19L10 19L1 10Z" />
      </svg>
      {bulletElements}
      <div className="obstacles">{obstacleElements}</div>
    </div>
  );
};

export default Game;
