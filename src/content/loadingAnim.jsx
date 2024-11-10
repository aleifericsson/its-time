import { useEffect, useState, useRef } from 'react';
import { removeReact } from './ext-qol.jsx';
import './LoadingAnim.css'; // Add this file for custom CSS styling
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function LoadingAnim() {
    const [progress, setProgress] = useState(0);
    const progressRef = useRef(null);
    const globeRef = useRef(null);
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
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    //create stars
    useEffect(async () => {
        // Initialize Three.js scene
        const scene = new THREE.Scene();
        const dimensions = window.innerWidth / window.innerHeight;
        const camera = new THREE.PerspectiveCamera(75, dimensions, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        starsRef.current.appendChild(renderer.domElement);

        camera.position.z = 30;   
        
        const earthTexture = new THREE.TextureLoader().load(await chrome.runtime.getURL('images/earth.jpg'))
        console.log(chrome.runtime.getURL('images/earth.jpg'))
        const earth = new THREE.Mesh(
            new THREE.SphereGeometry(3,70,70),
            new THREE.MeshBasicMaterial({map:earthTexture})
        )
        scene.add(earth)
        const cubeTexture = new THREE.TextureLoader().load(await chrome.runtime.getURL('/images/cube.jpg'))
        const cube = new THREE.Mesh(//shortand wow
            new THREE.BoxGeometry(10,10,10),
            new THREE.MeshBasicMaterial({map:cubeTexture})
        )
        scene.add(cube)
        let loadedObject1 = null;
        let loadedObject2 = null;
        let loadedObject3 = null;

        const objects = [
            ["Coliseum", [0.5, 0.5, 0.5]],
            ["Pyramid", [7, 7, 7]],
            ["FlyingSaucer", [7, 7, 7]],
            ["Hourglass", [2, 2, 2]],
            ["SpaceShuttle", [0.5, 0.5, 0.5]],
            ["Diplodocus", [0.015, 0.015, 0.015]],
        ];

        const randObject1 = objects[Math.floor(Math.random() * objects.length)];
        //different random object
        let randObject2 = objects[Math.floor(Math.random() * objects.length)];
        while (randObject2[0] === randObject1[0]) {
            randObject2 = objects[Math.floor(Math.random() * objects.length)];
        }
        //different random object
        let randObject3 = objects[Math.floor(Math.random() * objects.length)];
        while (randObject3[0] === randObject1[0] || randObject3[0] === randObject2[0]) {
            randObject3 = objects[Math.floor(Math.random() * objects.length)];
        }

        // Load GLB models using chrome.runtime.getURL
        const loader = new GLTFLoader();

        const loadModel = (object, callback) => {
            loader.load(
                chrome.runtime.getURL('models/' + object[0] + '.glb'),
                (gltf) => {
                    // Set the scale based on the selected object
                    gltf.scene.scale.set(object[1][0], object[1][1], object[1][2]);
                    
                    // Add the loaded model to the scene
                    scene.add(gltf.scene);
                    
                    // Execute the callback with the loaded model
                    callback(gltf.scene);
                },
                undefined,
                (error) => {
                    console.error('An error happened while loading the model:', error);
                }
            );
        };

        // Load the first object
        loadModel(randObject1, (model) => {
            loadedObject1 = model;
            loadedObject1.position.z = -700;
            loadedObject1.position.x = -20;
        });

        // Load the second object
        loadModel(randObject2, (model) => {
            loadedObject2 = model;
            loadedObject2.position.z = -550;
            loadedObject2.position.x = 0;
        });

        // Load the third object
        loadModel(randObject3, (model) => {
            loadedObject3 = model;
            loadedObject3.position.z = -400;
            loadedObject3.position.x = 20;
        });


        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 10); // Soft white light
        scene.add(ambientLight);
        
        cube.position.z = -700
        cube.position.x = 10
        earth.position.z = -400
        earth.position.x = -10

        function addStar() {
            const geometry = new THREE.SphereGeometry(0.25, 24, 24);
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
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
            earth.position.z -= 0.4
            cube.rotation.x += 0.005
            cube.rotation.y += 0.005
            cube.position.z -= 0.8

            if (loadedObject1) {
                loadedObject1.rotation.y += 0.01;
                loadedObject1.position.z += 4;
            }

            if (loadedObject2) {
                loadedObject2.rotation.y += 0.01;
                loadedObject2.position.z += 4;
            }

            if (loadedObject3) {
                loadedObject3.rotation.y += 0.01;
                loadedObject3.position.z += 4;
            }

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            /*
            if (starsRef.current && renderer.domElement) {
                starsRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            */
        };
    }, []);

    //Load GLB model
    useEffect(() => {
        // Initialize Three.js scene
        const scene = new THREE.Scene();
        const dimensions = 1000 / 1500;
        const camera = new THREE.PerspectiveCamera(70, dimensions, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(500, 700);

        

        
        if (globeRef.current) {
            globeRef.current.appendChild(renderer.domElement);
        }
        // Declare a variable to store the loaded object
        
    
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
            /*
            if (globeRef.current && globeRef.current.contains(renderer.domElement)) {
                globeRef.current.removeChild(renderer.domElement);
            }
                
            renderer.dispose();
            */
        };
    }, []);
    

    return (
        <div className="loading-overlay">
            <div className="loading-content">
                {/* STARS */}
                <div className="stars-container" ref={starsRef}></div>
                {/* Spinning Globe */}
                <div className="globe-container" ref={globeRef}></div>
                {/* GRADIENT */}
                <div className="gradient-container" ref={gradientRef}></div>
                <div className="glow-container" ref={gradientRef}></div>
                {/* Spinning Hourglass
                <div className="hourglass-container" ref={hourglassRef}></div> */}
                
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