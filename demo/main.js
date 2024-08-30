import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { Tree } from '@dkostenevich/tree-js';
import { setupUI } from './ui';
import { NeutralToneMapping } from 'three/src/constants.js';
import { Environment } from './environment';

const stats = new Stats();
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = NeutralToneMapping;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x9dccff, 150, 200);

const environment = new Environment();
scene.add(environment);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1200,
);
const controls = new OrbitControls(camera, renderer.domElement);

controls.minDistance = 1;
controls.maxDistance = 100;
controls.target.set(0, 15, 0);
controls.update();

camera.position.set(80, 15, 0);

const tree = new Tree();
tree.generate();
tree.castShadow = true;
tree.receiveShadow = true;
scene.add(tree);

// Display vertex and triangle count on UI
const vertexCount = (tree.branches.verts.length + tree.leaves.verts.length) / 3;
const triangleCount =
  (tree.branches.indices.length + tree.leaves.indices.length) / 3;
document.getElementById('model-info').innerText =
  `Vertex Count: ${vertexCount} | Triangle Count: ${triangleCount}`;

// Read tree parameters from JSON
document
  .getElementById('fileInput')
  .addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          tree.options = JSON.parse(e.target.result);
          tree.generate();
          setupUI(tree, renderer, scene, camera);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.onerror = function (e) {
        console.error('Error reading file:', e);
      };
      reader.readAsText(file);
    }
  });

// Resize camera aspect ratio and renderer size to the new window size
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Post-processing setup
const composer = new EffectComposer(renderer);

// Render pass: Renders the scene normally as the first pass
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// SMAA pass: Anti-aliasing
const smaaPass = new SMAAPass(window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio());
composer.addPass(smaaPass);

// Bloom pass: Adds bloom effect
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1, 0.4, 0.85);
composer.addPass(bloomPass);

// God rays pass: (Optional, requires additional setup for light shafts if needed)
// Add your custom god rays pass here if you have implemented it

const outputPass = new OutputPass();
composer.addPass(outputPass);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  stats.update();
  composer.render();
}

setupUI(tree, environment, renderer, scene, camera, bloomPass);
animate();
