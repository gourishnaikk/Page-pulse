import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import Footer from './components/Footer.jsx';
import Hero from './components/Hero.jsx';
import Navbar from './components/Navbar.jsx';
import ResultsDashboard from './components/ResultsDashboard.jsx';
import { analyzeUrl } from './services/auditService.js';

function BackgroundAnimation() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        const updateSize = () => {
             camera.aspect = window.innerWidth / window.innerHeight;
             camera.updateProjectionMatrix();
             renderer.setSize(window.innerWidth, window.innerHeight);
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        container.appendChild(renderer.domElement);
        
        const mainGroup = new THREE.Group();
        scene.add(mainGroup);
        const geometries = [new THREE.IcosahedronGeometry(0.2, 0), new THREE.TorusGeometry(0.15, 0.02, 16, 32)];
        const material = new THREE.MeshPhongMaterial({ color: 0x9bcbff, transparent: true, opacity: 0.4, shininess: 100 });
        const objects = [];
        for(let i = 0; i < 40; i++) {
            const mesh = new THREE.Mesh(geometries[Math.floor(Math.random() * geometries.length)], material);
            mesh.position.set((Math.random()-0.5)*15, (Math.random()-0.5)*15, (Math.random()-0.5)*10-5);
            mainGroup.add(mesh);
            objects.push({ mesh, rotationSpeed: (Math.random()-0.5)*0.01, floatSpeed: Math.random()*0.005, offset: Math.random()*Math.PI*2 });
        }
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        const pl = new THREE.PointLight(0x4facfe, 1, 20);
        pl.position.set(5, 5, 5);
        scene.add(pl);
        camera.position.z = 5;
        let mX = 0, mY = 0;
        const onMouseMove = (e) => { mX = (e.clientX/window.innerWidth-0.5)*2; mY = (e.clientY/window.innerHeight-0.5)*2; };
        window.addEventListener('mousemove', onMouseMove);
        
        let reqId;
        const anim = (t) => {
            reqId = requestAnimationFrame(anim);
            objects.forEach(o => { o.mesh.rotation.x += o.rotationSpeed; o.mesh.rotation.y += o.rotationSpeed; o.mesh.position.y += Math.sin(t*0.001 + o.offset)*0.002; });
            mainGroup.position.x += (mX*0.5 - mainGroup.position.x)*0.05;
            mainGroup.position.y += (-mY*0.5 - mainGroup.position.y)*0.05;
            renderer.render(scene, camera);
        };
        anim(0);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', updateSize);
            cancelAnimationFrame(reqId);
            container.removeChild(renderer.domElement);
            renderer.dispose();
        }
    }, [])
    
    return <div ref={containerRef} className="absolute inset-0 z-10" />
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [auditError, setAuditError] = useState('');

  async function handleAnalyze(url) {
    if (isLoading) return;
    setIsLoading(true);
    setAuditError('');
    setAuditResult(null);

    try {
      const response = await analyzeUrl(url);
      setAuditResult(response.data);
    } catch (error) {
      setAuditError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body-md text-on-surface selection:bg-primary/30">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
           <BackgroundAnimation />
      </div>
      <Navbar />
      <main id="main-content" className="relative z-10 w-full pt-20" tabIndex={-1}>
          <div className="flex flex-col w-full overflow-hidden">
               <Hero errorMessage={auditError} isLoading={isLoading} onAnalyze={handleAnalyze} />
               <ResultsDashboard result={auditResult} isLoading={isLoading} />
          </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
