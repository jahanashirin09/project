


import { useState, useRef } from "react";
import "./page.css"; 

const displayDistance = 80; 
const nDisplay = 7;

const App = () => {
  const [images, setImages] = useState([
    { src: "img/1.jpg", index: 0, status: "inactive" },
    { src: "img/2.jpg", index: 1, status: "inactive" },
    { src: "img/3.jpg", index: 2, status: "inactive" },
    { src: "img/4.jpg", index: 3, status: "inactive" },
  ]);

  const [globalIndex, setGlobalIndex] = useState(0);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  const activatePic = (img, x, y) => {
    setImages((prevImages) =>
      prevImages.map((item) =>
        item.index === img.index
          ? {
              ...item,
              status: "active",
              left: `${x}px`,
              top: `${y}px`,
              zIndex: globalIndex,
           
            }
          : item
      )
    );
    lastMousePosition.current = { x, y };
  };

  const mouseDistance = (x, y) => {
    return Math.hypot(
      x - lastMousePosition.current.x,
      y - lastMousePosition.current.y
    );
  };

  const handleMouseMove = (e) => {
    if (mouseDistance(e.clientX, e.clientY) > displayDistance) {
      const activePicIndex = globalIndex % images.length;
      const inactivePicIndex = (globalIndex - nDisplay) % images.length;

      activatePic(images[activePicIndex], e.clientX, e.clientY);
      if (inactivePicIndex >= 0) {
        setImages((prevImages) =>
          prevImages.map((item, index) =>
            index === inactivePicIndex ? { ...item, status: "inactive" } : item
          )
        );
      }

      setGlobalIndex((prevIndex) => prevIndex + 1);
    }
  };

    return (
      <>
        <div className="image_trail_text_container">
          <span className="image_trail_text" >
            BEAUTY OF LIFE CAPTURED
          </span>
        </div>
        <div className="App" onMouseMove={handleMouseMove}>
          {images.map((image) => (
            <img
              key={image.index}
              src={image.src}
              alt={`Image ${image.index + 1}`}
              className={`image ${image.status}`}
              style={{
                left: image.left,
                top: image.top,
                zIndex: image.zIndex,
              }}
            />
          ))}
        </div>
      </>
    );
};

export default App;
