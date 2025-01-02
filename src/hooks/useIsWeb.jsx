import { useEffect, useState } from "react";

export function useIsWeb(){
    const [isWeb, setIsWeb] = useState(null);

    useEffect(() => {
      // Detectamos si el usuario está en un dispositivo móvil
      const userAgent = window.navigator.userAgent;
      const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
  
      // Actualizamos el estado de isWeb
      setIsWeb(!isMobile);
    }, []);
    //console.log(isWeb,'isWeb desde isWeb');
  return isWeb
}