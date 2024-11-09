import { useEffect, useState, useRef } from 'react';
import { removeReact } from './ext-qol.jsx';
import './LoadingAnim.css'; // Add this file for custom CSS styling
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { all } from 'three/webgpu';

export default function LoadingAnim() {
    const [progress, setProgress] = useState(0);
    const progressRef = useRef(null);
    const globeRef = useRef(null);
    const starsRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(interval);
                    return 100;
                }
                return Math.min(oldProgress + 1, 100);
            });
        }, 50); // Update progress every 50ms

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, []);

    // Remove loading overlay after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            removeReact();
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    // Create stars
    useEffect(() => {
        // Initialize Three.js scene
        const scene = new THREE.Scene();
        const dimensions = window.innerWidth / window.innerHeight;
        const camera = new THREE.PerspectiveCamera(75, dimensions, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        starsRef.current.appendChild(renderer.domElement);

        camera.position.z = 30;

        function addStar() {
            const geometry = new THREE.SphereGeometry(0.25, 24, 24);
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const star = new THREE.Mesh(geometry, material);

            let [x, y, z] = Array(3).fill(0).map(() => THREE.MathUtils.randFloatSpread(50));
            z = THREE.MathUtils.randFloatSpread(400) - 200;

            star.position.set(x, y, z);
            scene.add(star);
        }

        Array(200).fill(0).forEach(() => addStar());
        let speed = 0.01;

        // Animation loop for stars
        const animate = function () {
            requestAnimationFrame(animate);
            camera.position.z -= speed;
            speed += 0.01;
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            // Cleanup Three.js resources
            if (starsRef.current && renderer.domElement) {
                starsRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);

    // Load GLB model
    useEffect(() => {
        // Initialize Three.js scene
        const scene = new THREE.Scene();
        const dimensions = 1000 / 1500;
        const camera = new THREE.PerspectiveCamera(70, dimensions, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(500, 7g00);

        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft white light
        scene.add(ambientLight);

        // Optionally add a directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
        directionalLight.position.set(10, 10, 10).normalize();
        scene.add(directionalLight);

        
        if (globeRef.current) {
            globeRef.current.appendChild(renderer.domElement);
        }
        const objects = [
            ["Coliseum", [0.5, 0.5, 0.5]],
            ["Pyramid", [7, 7, 7]],
            ["FlyingSaucer", [7, 7, 7]],
            ["Hourglass", [2, 2, 2]],
            ["SpaceShuttle", [0.5, 0.5, 0.5]],
        ];
        randObject = objects[Math.floor(Math.random() * objects.length)];
        // Load GLB model using chrome.runtime.getURL
        const loader = new GLTFLoader();
        loader.load(
            chrome.runtime.getURL('models/' + randObject[0] + '.glb'),
            (gltf) => {
                gltf.scene.scale.set(randObject[1][0], randObject[1][1], randObject[1][2]);
                scene.add(gltf.scene);
            },
            undefined,
            (error) => {
                console.error('An error happened while loading the model:', error);
            }
        );
    
        camera.position.z = 30;
        scene.rotation.z += 0.1; // Rotate on x-axis
    
        // Animation loop for the model
        const animate = function () {
            requestAnimationFrame(animate);
            scene.rotation.y += 0.01; // Rotate on y-axis
            renderer.render(scene, camera);
        };
    
        animate();
    
        // Cleanup function
        return () => {
            if (globeRef.current && globeRef.current.contains(renderer.domElement)) {
                globeRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []);
    

    return (
        <div className="loading-overlay">
            <div className="loading-content">
                {/* STARS */}
                <div className="stars-container" ref={starsRef}></div>
                {/* Spinning Globe */}
                <div className="globe-container" ref={globeRef}></div>
                
                {/* 3D Progress Bar */}
                <div className="progress-bar-container">
                    <div
                        className="progress-bar"
                        ref={progressRef}
                        style={{ width: `${progress}%` }}
                    />
                    <div className="progress-text">{progress}%</div>
                </div>
            </div>
        </div>
    );
}