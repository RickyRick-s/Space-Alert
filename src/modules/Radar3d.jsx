import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


export default function Radar3D({ asteroids = [] }) {
  
  const mountRef = useRef(null);
  
  const requestRef = useRef();
  
  
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    
    if (!mountRef.current) return;

    // --- A. INICIALIZACIÓN DEL MUNDO ---
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x00010a); 
    
  
    scene.fog = new THREE.FogExp2(0x00010a, 0.015);

    // --- B. CÁMARA Y PERSPECTIVA ---
    
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 30, 50);

    // --- C. RENDERIZADOR ---
   
    const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        powerPreference: "high-performance" 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); 
    
   
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // --- D. CONTROLES ---
 
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // --- E. RAYCASTER (Detección de colisiones) ---
   
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // --- F. ILUMINACIÓN ---
    
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    
    const coreLight = new THREE.PointLight(0x00ccff, 200, 100);
    scene.add(coreLight);

    // --- G. ELEMENTOS CENTRALES (LA TIERRA) ---

    const earthGeo = new THREE.SphereGeometry(2, 32, 32);
    const earthMat = new THREE.MeshStandardMaterial({ 
      color: 0x0066ff,       
      emissive: 0x0033ff,     
      emissiveIntensity: 3,  
      wireframe: true        
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

   
    const grid = new THREE.GridHelper(100, 40, 0x4d2fb2, 0x050505);
    grid.position.y = -1;
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    // --- H. GENERACIÓN DE AMENAZAS (ASTEROIDES) ---
    const asteroidGeometry = new THREE.IcosahedronGeometry(0.3, 1);
    
    const asteroidMeshes = asteroids.slice(0, 200).map((a) => {
    
      const isHazard = a.is_potentially_hazardous_asteroid;
      
      const material = new THREE.MeshStandardMaterial({
        color: isHazard ? 0xff0000 : 0x00ccff, 
        emissive: isHazard ? 0xff0000 : 0x0066ff,
        emissiveIntensity: isHazard ? 2 : 0.4,
      });

      const mesh = new THREE.Mesh(asteroidGeometry, material);
      
  
      mesh.userData = {
        ...a, 
        angle: Math.random() * Math.PI * 2, // Posición inicial aleatoria en el círculo.
        radiusX: 15 + Math.random() * 40,   // Órbita horizontal.
        radiusZ: 12 + Math.random() * 35,   // Órbita de profundidad.
        speed: 0.0005 + Math.random() * 0.0015, // Velocidad orbital.
        incline: (Math.random() - 0.5) * 0.2    // Inclinación vertical 
      };

      scene.add(mesh);
      return mesh;
    });

    // --- I. CLICS ---
    const onMouseClick = (event) => {

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  
      raycaster.setFromCamera(mouse, camera);

     
      const intersects = raycaster.intersectObjects(asteroidMeshes);

      if (intersects.length > 0) {
     
        const clickedData = intersects[0].object.userData;
        setSelected(clickedData); 
      }
    };

    window.addEventListener("click", onMouseClick);

    // --- J. BUCLE DE ANIMACIÓN (60 FPS) ---
    const animate = () => {

      requestRef.current = requestAnimationFrame(animate);
      

      controls.update();

    
      asteroidMeshes.forEach(mesh => {
        const d = mesh.userData;
        d.angle += d.speed; 

     
        mesh.position.x = Math.cos(d.angle) * d.radiusX;
        mesh.position.z = Math.sin(d.angle) * d.radiusZ;
        mesh.position.y = Math.sin(d.angle) * d.incline * d.radiusX;
        
  
        mesh.rotation.y += 0.01;
        mesh.rotation.x += 0.005;
      });


      renderer.render(scene, camera);
    };

    animate();

    // --- K. EVENTOS DE VENTANA Y LIMPIEZA ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);


    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("click", onMouseClick);
      cancelAnimationFrame(requestRef.current);
      renderer.dispose();
      scene.clear();
    };
  }, [asteroids]);


  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#00010a] overflow-hidden">
   
      <div ref={mountRef} className="absolute inset-0 z-0 cursor-crosshair" />
      
     
      <div className="absolute inset-0 pointer-events-none p-10 flex flex-col justify-between [@media(max-width:768px)]:p-4 font-mono">
        <header className="flex justify-between items-start [@media(max-width:768px)]:flex-col [@media(max-width:768px)]:gap-4">
          <div className="border-l-4 border-[#00ccff] [@media(max-width:768px)]:pl-3 pl-6">
            <h1 className="text-[#00ccff] text-3xl [@media(max-width:768px)]:text-xl font-black tracking-tighter uppercase drop-shadow-[0_0_10px_rgba(0,204,255,0.5)]">
              Earth Radar
            </h1>
            <p className="text-white/40 text-xs">Near_Earth_Objects: {asteroids.length}</p>
          </div>
          
      
          {selected && (
            <div className="pointer-events-auto bg-black/90 backdrop-blur-md border-2 border-[#00ccff]/30 p-6 rounded-lg w-80 animate-in fade-in slide-in-from-top-4 duration-300 [@media(max-width:768px)]:p-4 [@media(max-width:768px)]:w-[90vw] ">
              <div className="flex justify-between items-center mb-4 [@media(max-width:768px)]:mb-2">
                <span className={`text-[10px] px-2 py-1 font-bold ${selected.is_potentially_hazardous_asteroid ? 'bg-red-600 animate-pulse' : 'bg-blue-600'} text-white`}>
                  {selected.is_potentially_hazardous_asteroid ? 'CRITICAL_THREAT' : 'STABLE_OBJECT'}
                </span>
                <button onClick={() => setSelected(null)} className="text-white/50 hover:text-white transition-colors text-lg">✕</button>
              </div>
              
              <h2 className={`text-2xl font-bold mb-4 uppercase ${selected.is_potentially_hazardous_asteroid ? "text-red-500":"text-[#00ccff]"} [@media(max-width:768px)]:mb-2 [@media(max-width:768px)]:text-lg`}>{selected.name}</h2>
              
              <div className="space-y-3 [@media(max-width:768px)]:space-y-1 text-xs border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span className="text-white/40">DIAMETER_MAX</span>
                  <span className="text-white">{selected.estimated_diameter?.kilometers?.estimated_diameter_max.toFixed(2)} KM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">RELATIVE_VELOCITY</span>
                  <span className="text-white">{Math.floor(selected.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour).toLocaleString()} KM/H</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">MISS_DISTANCE</span>
                  <span className={`${selected.is_potentially_hazardous_asteroid ? "text-red-500":"text-[#00ccff]"}`}>{Math.floor(selected.close_approach_data?.[0]?.miss_distance?.kilometers).toLocaleString()} KM</span>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Leyenda y Gráficos Inferiores */}
        <footer className="flex justify-between items-end [@media(max-width:768px)]:flex-col [@media(max-width:768px)]:items-center [@media(max-width:768px)]:gap-4">
          <div className="text-[10px] space-y-2 bg-black/40 p-4 rounded-md border border-white/5 [@media(max-width:768px)]:w-full">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-600 rounded-full shadow-[0_0_10px_red]"></div>
              <span className="text-red-500 font-bold uppercase">Hazardous_Object_(PHA)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-[#00ccff] rounded-full shadow-[0_0_10px_#00ccff]"></div>
              <span className="text-[#00ccff] font-bold uppercase">Safe_Trajectory</span>
            </div>
          </div>

          <div className="text-right [@media(max-width:768px)]:text-center [@media(max-width:768px)]:w-full">
             <div className="mb-2">
                <span className="text-[#00ccff] text-[10px] font-bold tracking-[0.5em]">LIVE_FROM_SPACE</span>
             </div>
             <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-linear-to-r from-[#00ccff] to-[#4d2fb2] w-2/3 animate-pulse"></div>
             </div>
          </div>
        </footer>
      </div>
    </div>
  );
}