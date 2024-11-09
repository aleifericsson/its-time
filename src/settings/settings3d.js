import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { render, addClass } from '../content/qol';

let rendele
let scene
let camera
let renderer

export default function settings3d(){
    console.log("3d yeah")

    create_3d()
    const cube = make_cube()
    handleLighting()
    const coin = make_coin()

    renderer.setAnimationLoop( all_animations );
    function all_animations(){
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render( scene, camera );
    }
}

function create_3d(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( 300, 200);
    rendele = renderer.domElement
    render(document.body, rendele);
    addClass(rendele, "3d")
    camera.position.z = 5;
    const controls = new OrbitControls( camera, renderer.domElement );
}

function make_cube(){
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshStandardMaterial( { color: 0x24394D } );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.x = 2
    scene.add( cube );
    return cube
}

async function make_coin(){
    const loader = new GLTFLoader();
    const times = [0, 1, 2]; // times for keyframes in seconds
    const values = [0, Math.PI, Math.PI * 2]; // x-axis rotation values

    const track = new THREE.KeyframeTrack('.rotation[x]', times, values);

    // Create an AnimationClip with loop enabled
    const clip = new THREE.AnimationClip('spinX', 100000, [track]);
    let coin
    await loader.load('./models/coin.glb', function(gltf) {
        coin = gltf.scene
        scene.add( coin );
        gltf.animations = [clip]
    }, undefined, function(error) {
        console.error( error );
    });
    return coin
}

function handleLighting(){
    const light = new THREE.AmbientLight( 0xffffff ); // soft white light
    light.intensity = (Math.PI / 2)
    scene.add( light );
    const spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 10, 10, 10);
    spotLight.decay = (0)
    spotLight.penumbra = (1)
    spotLight.angle = (0.15)
    spotLight.intensity = (Math.PI / 2)

    scene.add( spotLight );
    const pointLight = new THREE.PointLight ( 0xffffff )
    pointLight.position.set( -10, -10, -10);
    pointLight.decay = (0)
    pointLight.intensity = (Math.PI / 2)
    
    scene.add( pointLight );
}