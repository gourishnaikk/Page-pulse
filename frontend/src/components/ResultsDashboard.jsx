import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';

function getDisplayValue(value, fallback = 'Not found') {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }
    return value;
}

function ScannerCanvas() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const gl = canvas.getContext('webgl');
        if (!gl) return;

        const vs = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;
        const fs = `
            precision highp float;
            uniform float u_time;
            uniform vec2 u_resolution;
            float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                vec2 p = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
                float scanPos = sin(u_time * 1.5) * 0.8;
                float scanLine = smoothstep(0.02, 0.0, abs(p.y - scanPos));
                float scanGlow = smoothstep(0.4, 0.0, abs(p.y - scanPos));
                vec3 color = vec3(0.02, 0.04, 0.1) * (1.0 - length(p) * 0.5);
                color += vec3(0.3, 0.6, 1.0) * scanLine;
                color += vec3(0.1, 0.3, 0.6) * scanGlow * 0.5;
                float n = hash(uv + u_time * 0.1);
                if (n > 0.98) color += vec3(0.4, 0.7, 1.0) * scanGlow;
                vec2 grid = fract(uv * 20.0);
                float gridLines = smoothstep(0.05, 0.0, grid.x) + smoothstep(0.05, 0.0, grid.y);
                color += vec3(0.2, 0.4, 0.8) * gridLines * 0.1 * (scanGlow + 0.2);
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        function createShader(gl, type, source) {
            const s = gl.createShader(type); gl.shaderSource(s, source); gl.compileShader(s); return s;
        }
        const program = gl.createProgram();
        gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vs));
        gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fs));
        gl.linkProgram(program); gl.useProgram(program);

        const posBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
        const posLoc = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        const timeLoc = gl.getUniformLocation(program, "u_time");
        const resLoc = gl.getUniformLocation(program, "u_resolution");

        let reqId;
        function render(t) {
            if (!canvas) return;
            canvas.width = canvas.clientWidth; canvas.height = canvas.clientHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform1f(timeLoc, t * 0.001);
            gl.uniform2f(resLoc, canvas.width, canvas.height);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            reqId = requestAnimationFrame(render);
        }
        reqId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(reqId);
    }, []);

    return <canvas ref={canvasRef} id="scanner-canvas" className="absolute inset-0 w-full h-full rounded-3xl" />;
}

function DashboardBackground() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const width = container.clientWidth || 800;
        const height = container.clientHeight || 400;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        const group = new THREE.Group();
        scene.add(group);

        const geometries = [
            new THREE.IcosahedronGeometry(0.5, 0),
            new THREE.TorusGeometry(0.4, 0.05, 16, 32),
            new THREE.OctahedronGeometry(0.4, 0)
        ];
        
        const material = new THREE.MeshPhongMaterial({
            color: 0x4facfe,
            transparent: true,
            opacity: 0.15,
            shininess: 100
        });

        const objects = [];
        for(let i = 0; i < 12; i++) {
            const mesh = new THREE.Mesh(geometries[i % geometries.length], material);
            mesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 5);
            group.add(mesh);
            objects.push({ mesh, rotX: Math.random() * 0.02, rotY: Math.random() * 0.02, float: Math.random() * 0.01, offset: Math.random() * Math.PI * 2 });
        }

        scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const pl = new THREE.PointLight(0x4facfe, 1, 20);
        pl.position.set(5, 5, 5);
        scene.add(pl);
        camera.position.z = 8;

        let mX = 0, mY = 0;
        const onMouseMove = (e) => { mX = (e.clientX / window.innerWidth - 0.5) * 2; mY = (e.clientY / window.innerHeight - 0.5) * 2; };
        window.addEventListener('mousemove', onMouseMove);

        let reqId;
        const animate = (time) => {
            reqId = requestAnimationFrame(animate);
            objects.forEach(obj => {
                obj.mesh.rotation.x += obj.rotX;
                obj.mesh.rotation.y += obj.rotY;
                obj.mesh.position.y += Math.sin(time * 0.001 + obj.offset) * obj.float;
            });
            group.position.x += (mX - group.position.x) * 0.05;
            group.position.y += (-mY - group.position.y) * 0.05;
            renderer.render(scene, camera);
        };
        animate(0);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(reqId);
            container.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return <div ref={containerRef} className="absolute inset-0 pointer-events-none opacity-40 z-0" />;
}

function AnimatedNumber({ value }) {
    const [display, setDisplay] = useState(0);
    useEffect(() => {
        if (typeof value === 'number') {
            let startTimestamp = null;
            const duration = 1500;
            const end = value;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                setDisplay(Math.floor(progress * end));
                if (progress < 1) window.requestAnimationFrame(step);
            };
            window.requestAnimationFrame(step);
        } else {
            setDisplay(value);
        }
    }, [value]);
    return <>{typeof value === 'number' ? display.toLocaleString() : display}</>;
}


function ResultsDashboard({ result, isLoading }) {
    if (!result && !isLoading) {
        return (
            <section className="px-gutter pb-12 relative min-h-[500px]" id="results">
                <div className="max-w-container-max mx-auto">
                    <div className="glass-card w-full min-h-[400px] flex flex-col items-center justify-center p-12 transition-all duration-700">
                        <div className="w-20 h-20 mb-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner animate-pulse">
                            <span className="material-symbols-outlined text-primary text-4xl">radar</span>
                        </div>
                        <h3 className="font-headline-md text-headline-md text-on-surface mb-4">Awaiting Signal</h3>
                        <p className="font-body-md text-on-surface-variant max-w-sm text-center">Enter a URL above to initiate a deep-scan audit. Results will synchronize here in real-time.</p>
                    </div>
                </div>
            </section>
        );
    }

    if (isLoading) {
        return (
            <section className="px-gutter pb-12 relative min-h-[500px]" id="results">
                <div className="max-w-container-max mx-auto">
                    <div className="glass-card w-full min-h-[400px] flex flex-col items-center justify-center p-12 overflow-hidden relative">
                        <ScannerCanvas />
                        <div className="relative z-10 mt-8 text-center bg-black/40 backdrop-blur-md px-12 py-8 rounded-3xl border border-white/10">
                            <div className="w-16 h-16 mx-auto mb-6 border-t-2 border-primary rounded-full animate-spin" />
                            <p className="font-label-mono text-primary uppercase tracking-[0.4em] text-xl glow-text transition-all duration-300">Scanning...</p>
                            <div className="mt-4 w-64 h-1 bg-white/5 rounded-full overflow-hidden mx-auto">
                                <div className="h-full bg-primary shadow-[0_0_10px_rgba(155,203,255,1)] w-full overflow-hidden">
                                     <div className="w-1/2 h-full bg-white/50 relative -left-full animate-[borderMove_1.5s_linear_infinite]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Finished
    const { status, responseTime, title, metaDescription, h1Count, imagesWithoutAlt, wordCount } = result;

    return (
        <section className="px-gutter pb-12 relative min-h-[500px]" id="results">
            <div className="max-w-container-max mx-auto">
                <div className="flex flex-col gap-6 w-full relative">
                    <DashboardBackground />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div className="glass-card p-10 flex flex-col items-center justify-center text-center">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(155,203,255,0.2)]">
                                <span className="material-symbols-outlined text-primary text-4xl">check_circle</span>
                            </div>
                            <div className="text-on-surface-variant font-label-mono uppercase text-[10px] tracking-widest mb-1">Status Code</div>
                            <div className="text-6xl font-display-hero text-white glow-text"><AnimatedNumber value={status} /></div>
                            <div className="text-emerald-400 font-label-mono text-[9px] mt-2 uppercase tracking-widest">Request Successful</div>
                        </div>
                        <div className="glass-card p-10 flex flex-col items-center justify-center text-center">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(155,203,255,0.2)]">
                                <span className="material-symbols-outlined text-primary text-4xl">timer</span>
                            </div>
                            <div className="text-on-surface-variant font-label-mono uppercase text-[10px] tracking-widest mb-1">Response Time</div>
                            <div className="flex items-baseline gap-1">
                                <div className="text-6xl font-display-hero text-white glow-text">
                                     {typeof responseTime === 'string' ? responseTime.replace('ms', '') : responseTime}
                                </div>
                                <span className="text-2xl font-body-md text-primary/60">ms</span>
                            </div>
                            <div className="text-primary font-label-mono text-[9px] mt-2 uppercase tracking-widest">Latency Optimized</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div className="glass-card p-10">
                            <div className="text-on-surface-variant font-label-mono uppercase text-[10px] tracking-[0.3em] mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-sm">title</span>
                                Page Title
                            </div>
                            <h2 className="text-2xl font-headline-md text-white leading-tight tracking-tight glow-text">{getDisplayValue(title)}</h2>
                        </div>
                        <div className="glass-card p-10">
                            <div className="text-on-surface-variant font-label-mono uppercase text-[10px] tracking-[0.3em] mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary text-sm">description</span>
                                Meta Description
                            </div>
                            <p className="text-sm font-body-md text-on-surface-variant leading-relaxed opacity-90">{getDisplayValue(metaDescription)}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                        <div className="glass-card p-8 animated-border">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-xl">format_h1</span>
                                </div>
                                <span className="text-[9px] font-label-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded tracking-tighter">SEO TAGS</span>
                            </div>
                            <div className="text-on-surface-variant font-label-mono uppercase text-[10px] tracking-widest mb-1">H1 Count</div>
                            <div className="text-4xl font-display-hero text-white"><AnimatedNumber value={h1Count} /></div>
                        </div>
                        <div className="glass-card p-8 animated-border">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-xl">image</span>
                                </div>
                                <span className="text-[9px] font-label-mono text-error bg-error/10 px-2 py-1 rounded tracking-tighter">ALT CHECK</span>
                            </div>
                            <div className="text-on-surface-variant font-label-mono uppercase text-[10px] tracking-widest mb-1">Images Missing Alt</div>
                            <div className="text-4xl font-display-hero text-error"><AnimatedNumber value={imagesWithoutAlt} /></div>
                        </div>
                        <div className="glass-card p-8 animated-border">
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-xl">sticky_note_2</span>
                                </div>
                                <span className="text-[9px] font-label-mono text-primary bg-primary/10 px-2 py-1 rounded tracking-tighter">DENSITY</span>
                            </div>
                            <div className="text-on-surface-variant font-label-mono uppercase text-[10px] tracking-widest mb-1">Word Count</div>
                            <div className="text-4xl font-display-hero text-white"><AnimatedNumber value={wordCount} /></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ResultsDashboard;
