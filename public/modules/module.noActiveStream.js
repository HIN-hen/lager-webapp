import * as THREE from "../../node_modules/three/build/three.module";

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// renderer
const renderer = new THREE.WebGLRenderer({ 
	canvas: document.querySelector('#no-active-stream'),
	alpha: true 
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight );
//document.querySelector('#bg').append(renderer.domElement);

renderer.render( scene, camera );

// create geometry
const geometry = new THREE.BoxGeometry( 3, 3, 3 );
const texture = new THREE.TextureLoader().load('./public/logos/1.jpg');
const material = new THREE.MeshBasicMaterial( { map: texture } );
const cube = new THREE.Mesh( geometry, material );

scene.add( cube );

camera.position.z = 5;

// animate
const animate = () => {
  requestAnimationFrame(animate);

	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;

	renderer.render( scene, camera );
};

animate();