import { find } from '../content/qol';
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { isDevMode } from '../content/ext-qol';
//import space from 'images/space.jpg'

export default function fireship3d(){
    //components of all 3js: scene (container), camera, renderer
    console.log(window.innerHeight, window.innerWidth)
    const scene = new THREE.Scene();
    const dimensions = isDevMode() ? 300/200:window.innerWidth / window.innerHeight
    const camera = new THREE.PerspectiveCamera(75, dimensions, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
        canvas: find("#bg")
    })
    renderer.setPixelRatio (window.devicePixelRatio)
    isDevMode ? renderer.setSize( 300,200) :renderer.setSize( window.innerWidth, window.innerHeight);
    camera.position.setZ(30)
    
    renderer.render(scene,camera)

    //components of objects: geometry (has points), material (wrapping paper), mesh
    const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
    const material = new THREE.MeshStandardMaterial({color: 0xFFFFFF, wireframe:true})//basic: no light, standard: light bounces
    const torus = new THREE.Mesh(geometry, material);

    scene.add(torus)

    const pointLight = new THREE.PointLight(0xFFFFFF,50, 50)
    pointLight.position.set(10,10,10)
    scene.add(pointLight)
    
    const ambientLight = new THREE.AmbientLight(0xFFFFFF)
    scene.add(ambientLight)

    //shows all point lights
    const lightHelper = new THREE.PointLightHelper(pointLight)
    scene.add(lightHelper)

    const gridHelper = new THREE.GridHelper(200,50)
    //scene.add(gridHelper)

    const controls = new OrbitControls(camera, renderer.domElement)

    function addStar(){
        const geometry = new THREE.SphereGeometry(0.25,24,24)
        const material = new THREE.MeshBasicMaterial({color:0xffffff})
        const star = new THREE.Mesh(geometry, material);

        const [x, y, z] = Array(3).fill(0).map(()=> THREE.MathUtils.randFloatSpread(200))
        
        star.position.set(x,y,z);
        scene.add(star)
    }

    Array(200).fill(0).forEach(()=>addStar())

    const spaceTexture = new THREE.TextureLoader().load('/images/space.jpg')
    scene.background = spaceTexture

    const cubeTexture = new THREE.TextureLoader().load('/images/cube.jpg')

    const cube = new THREE.Mesh(//shortand wow
        new THREE.BoxGeometry(3,3,3),
        new THREE.MeshStandardMaterial({map:cubeTexture})
    )
    scene.add(cube)

    const earthTexture = new THREE.TextureLoader().load('/images/earth.jpg')
    const earthNormal = new THREE.TextureLoader().load('/image/earth-normalmap.jpg')

    const earth = new THREE.Mesh(
        new THREE.SphereGeometry(3,32,32),
        new THREE.MeshStandardMaterial({map:earthTexture, normalMap: earthNormal})
    )
    scene.add(earth)

    earth.position.z = 24;
    earth.position.x = -7;

    
    function animate(){
        requestAnimationFrame(animate); //recursive function
        
        torus.rotation.y += 0.005;
        torus.rotation.z += 0.005;

        cube.rotation.x += 0.005;
        cube.rotation.y += 0.005;

        earth.rotation.y += 0.005
        
        renderer.render( scene, camera);
    }

    animate()
}