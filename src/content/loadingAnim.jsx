import { useEffect, useState, useRef } from 'react';
import { removeReact } from './ext-qol.jsx';
import './LoadingAnim.css'; // Add this file for custom CSS styling
import * as THREE from 'three';

export default function LoadingAnim() {
    const [progress, setProgress] = useState(0);
    const progressRef = useRef(null);
    const hourglassRef = useRef(null);

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

    useEffect(() => {
        // Initialize Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(200, 300);
        hourglassRef.current.appendChild(renderer.domElement);

        // Create hourglass geometry
        const geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
        const hourglass = new THREE.Mesh(geometry, material);
        scene.add(hourglass);

        camera.position.z = 30;

        // Animation loop for spinning hourglass
        const animate = function () {
            requestAnimationFrame(animate);
            hourglass.rotation.x += 0.01; // Rotate on x-axis
            hourglass.rotation.y += 0.01; // Rotate on y-axis
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            // Cleanup Three.js resources
            hourglassRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div className="loading-overlay">
            <div className="loading-content">
                {/* Spinning Hourglass */}
                <div className="hourglass-container" ref={hourglassRef}></div>
                
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
