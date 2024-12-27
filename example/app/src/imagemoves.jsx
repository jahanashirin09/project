import  { useRef, useEffect } from "react";
import gsap from "gsap";
import "./ImageMove.css";

const MAX_ITEMS = 6; 

const ImageMove = () => {
  const containerRef = useRef(null); 
  const imageIndexRef = useRef(1); 
  const animationRef = useRef(null); 
  const isPlayingRef = useRef(false); 

  
  useEffect(() => {
    const container = containerRef.current;
    const addNewItem = (x, y) => {
      const newItem = document.createElement("div");
      newItem.className = "item";
      newItem.style.left = `${x - 75}px`;
      newItem.style.top = `${y - 100}px`;

      const img = document.createElement("img");
      img.src = `./img/${imageIndexRef.current}.jpg`;
      newItem.appendChild(img);
 
      imageIndexRef.current = (imageIndexRef.current % 15) + 1;
      container.appendChild(newItem);

     
      manageItemLimit();
    };

   
    const manageItemLimit = () => {
      while (container.children.length > MAX_ITEMS) {
        container.removeChild(container.firstChild);
      }
    };
    const startAnimation = () => {
      if (isPlayingRef.current || container.children.length === 0) return;
        isPlayingRef.current = true;
        
      animationRef.current = gsap.to(".item", {
        y: 100,
        scale: 0.5,
        opacity: 0,
        duration: 0.5,
        stagger: 0.025,
        onComplete: () => {
        
          container.querySelectorAll(".item").forEach((item) => {
            if (item.parentNode) {
              item.parentNode.removeChild(item);
            }
          });
          isPlayingRef.current = false;
          animationRef.current = null;
        },
      });
    };

   
    const handleMouseMove = (event) => {
      clearTimeout(animationRef.current); 
      addNewItem(event.pageX, event.pageY); 
      animationRef.current = setTimeout(startAnimation, 100); 
    };
   
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    
    };
  }, []);

    return (
      <>
        <div className="path">
          <h1 className="text">Move your mouse</h1>
          <div ref={containerRef} className="items"></div>
        </div>
      </>
    );
};

export default ImageMove;
