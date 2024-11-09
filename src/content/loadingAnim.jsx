import { useEffect, useState, useRef } from 'react';
import { removeReact } from './ext-qol.jsx';
import './LoadingAnim.css'; // Add this file for custom CSS styling
import * as THREE from 'three';

export default function LoadingAnim() {
    const [progress, setProgress] = useState(0);
    const progressRef = useRef(null);
    const hourglassRef = useRef(null);
    const starsRef = useRef(null);
    const gradientRef = useRef(null);

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

    //create stars
    useEffect(async () => {
        // Initialize Three.js scene
        const scene = new THREE.Scene();
        const dimensions = window.innerWidth / window.innerHeight
        const camera = new THREE.PerspectiveCamera(75, dimensions, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize( window.innerWidth, window.innerHeight)
        starsRef.current.appendChild(renderer.domElement);

        camera.position.z = 30;   
        
        const earthTexture = new THREE.TextureLoader().load(await chrome.runtime.getURL('images/earth.jpg'))
        const earthNormal = new THREE.TextureLoader().load(await chrome.runtime.getURL('images/earth-normalmap.jpg'))
        console.log(chrome.runtime.getURL('images/earth.jpg'))

        const earth = new THREE.Mesh(
            new THREE.SphereGeometry(3,70,70),
            new THREE.MeshBasicMaterial({map:earthTexture, normalMap: earthNormal})
        )
        scene.add(earth)

        earth.position.z = -60;
        earth.position.x = -10;    

        function addStar(){
            const geometry = new THREE.SphereGeometry(0.25,24,24)
            const material = new THREE.MeshBasicMaterial({color:0xffffff})
            const star = new THREE.Mesh(geometry, material);
    
            let [x, y, z] = Array(3).fill(0).map(()=> THREE.MathUtils.randFloatSpread(100))
            z = THREE.MathUtils.randFloatSpread(500)-250
            
            star.position.set(x,y,z);
            scene.add(star)
        }
    
        Array(300).fill(0).forEach(()=>addStar())
        let speed = 0.02
        let rot_speed = 0.001

        // Animation loop for stars
        const animate = function () {
            requestAnimationFrame(animate);
            camera.position.z -= speed
            speed += 0.015
            camera.rotation.z += rot_speed
            rot_speed += 0.0001
            earth.rotation.y += 0.005
            earth.position.z += 0.4
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            // Cleanup Three.js resources
            starsRef.current.removeChild(renderer.domElement);
        };
    }, []);

    //Create hourglass
    useEffect(() => {
        // Initialize Three.js scene
        const scene = new THREE.Scene();
        const dimensions = 200 / 300
        const camera = new THREE.PerspectiveCamera(75, dimensions, 0.1, 1000)
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize( 200, 300)
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
                {/* STARS */}
                <div className="stars-container" ref={starsRef}></div>
                {/* GRADIENT */}
                <div className="gradient-container" ref={gradientRef}></div>
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
