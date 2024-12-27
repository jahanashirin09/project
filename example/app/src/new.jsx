import  { useState, useEffect } from "react";
import "./new.css";

const ImageTrail = () => {
  const [trail, setTrail] = useState([]);
  const imageSources = ["/img/1.jpg", "/img/2.jpg", "/img/3.jpg", "/img/4.jpg"];

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * imageSources.length);
    return imageSources[randomIndex];
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      const newImage = {
        x: event.clientX,
        y: event.clientY,
        id: Date.now(),
        src: getRandomImage(),
      };

      setTrail((prevTrail) => {

        if (prevTrail.length >= 10) {
          return [newImage, ...prevTrail.slice(0, 9)];
        }
        return [newImage, ...prevTrail];
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="trail-container">
      {trail.map((image, index) => (
        <div
          key={image.id}
          className="trail-image"
          style={{
            left: `${image.x}px`,
            top: `${image.y}px`,
            opacity: 1 - index * 0.6,
            transition: "opacity 0.8s ease-out",
            zIndex: trail.length - index,
          }}
        >
          <img
            src={image.src}
            alt="Trail"
            className="trail-image-img"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageTrail;
