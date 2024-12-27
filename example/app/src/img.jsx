import { useEffect, useRef, useState } from "react";
import "./img.css"; // Import the CSS file

const MathUtils = {
  lerp: (a, b, n) => (1 - n) * a + n * b,
  distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
};

const ImageTrail = () => {
  const [images, setImages] = useState([]);
  const [imgPosition, setImgPosition] = useState(0);
  const [zIndexVal, setZIndexVal] = useState(1);
  const [cacheMousePos, setCacheMousePos] = useState({ x: 0, y: 0 });
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [threshold] = useState(100); // Mouse distance required to show the next image

  const body = document.body;
  const contentRef = useRef(null);

  // Get mouse position relative to the document
  const getMousePos = (ev) => {
    let posx = 0;
    let posy = 0;
    if (!ev) ev = window.event;
    if (ev.pageX || ev.pageY) {
      posx = ev.pageX;
      posy = ev.pageY;
    } else if (ev.clientX || ev.clientY) {
      posx = ev.clientX + body.scrollLeft + document.documentElement.scrollLeft;
      posy = ev.clientY + body.scrollTop + document.documentElement.scrollTop;
    }
    return { x: posx, y: posy };
  };

  // Update mouse position
  useEffect(() => {
    const handleMouseMove = (ev) => {
      setLastMousePos(getMousePos(ev));
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const getMouseDistance = () => {
    return MathUtils.distance(
      lastMousePos.x,
      lastMousePos.y,
      cacheMousePos.x,
      cacheMousePos.y
    );
  };

  // Function to handle showing the next image
  const showNextImage = () => {
    const img = images[imgPosition];

    // Animate the image's position and opacity
    const imageElement = document.querySelector(`#image-${imgPosition}`);

    if (imageElement) {
      imageElement.style.transition =
        "transform 0.9s ease-out, opacity 1s ease-out, scale 1s ease-out";
      imageElement.style.opacity = "1";
      imageElement.style.transform = `translate(${
        cacheMousePos.x - img.width / 2
      }px, ${cacheMousePos.y - img.height / 2}px)`;

      // After animation, hide and scale down the image
      setTimeout(() => {
        imageElement.style.opacity = "0";
        imageElement.style.transform = `scale(0.2)`;
      }, 400);
    }

    // Update the z-index for the next image
    setZIndexVal(zIndexVal + 1);
    setImgPosition(imgPosition < images.length - 1 ? imgPosition + 1 : 0);
  };

  // Render loop for the image trail effect
  useEffect(() => {
    const render = () => {
      const distance = getMouseDistance();
      if (distance > threshold) {
        showNextImage();
        setCacheMousePos({
          x: MathUtils.lerp(cacheMousePos.x, lastMousePos.x, 0.1),
          y: MathUtils.lerp(cacheMousePos.y, lastMousePos.y, 0.1),
        });
      }
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }, [lastMousePos, cacheMousePos, imgPosition, zIndexVal, threshold]);

  // Preload images
  useEffect(() => {
    const imagesArray = [...contentRef.current.querySelectorAll("img")].map(
      (img) => ({
        el: img,
        width: img.width,
        height: img.height,
      })
    );
    setImages(imagesArray);
  }, []);

  return (
    <div className="image-trail-container">
      <div className="image-trail-text">BEAUTY OF LIFE CAPTURED</div>
      <div className="content" ref={contentRef}>
        {images.map((img, index) => (
          <img
            key={index}
            id={`image-${index}`}
            src={`img/${index + 1}.jpg`} // Assume you have images like img/1.jpg, img/2.jpg
            alt={`Image ${index + 1}`}
            className="trail-image"
            style={{
              zIndex: index === imgPosition ? zIndexVal : 1,
              opacity: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageTrail;
