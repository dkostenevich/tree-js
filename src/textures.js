import * as THREE from 'three';

import oakAo from './assets/bark/oak_ao_1k.jpg';
import oakColor from './assets/bark/oak_color_1k.jpg';
import oakNormal from './assets/bark/oak_normal_1k.jpg';
import oakRoughness from './assets/bark/oak_roughness_1k.jpg';

import ashLeaves from './assets/leaves/ash_color.png';

const textureLoader = new THREE.TextureLoader();

/**
 * Gets a bark texture for the specified bark type
 * @param {string} barkType 
 * @param {'ao' | 'color' | 'normal' | 'roughness'} fileType 
 * @param {THREE.Vector2} scale 
 * @returns 
 */
export function getBarkTexture(barkType, fileType, scale = { x: 1, y: 1 }) {
  const texture = textures.bark[barkType][fileType];
  texture.repeat.x = scale.x;
  texture.repeat.y = 1 / scale.y;
  return texture;
}

/**
 * Gets the leaf texture for the specified leaf type
 * @param {string} leafType 
 * @returns 
 */
export function getLeafTexture(leafType) {
  return textures.leaves[leafType];
}

/**
 * 
 * @param {string} url Path to texture
 * @param {THREE.Vector2} scale Scale of the texture repeat
 * @param {boolean} srgb Set to true to set texture color space to SRGB
 * @returns {THREE.Texture}
 */
const loadTexture = (url, srgb = true) => {
  const texture = textureLoader.load(url);
  texture.wrapS = THREE.MirroredRepeatWrapping;
  texture.wrapT = THREE.MirroredRepeatWrapping;

  if (srgb) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }

  return texture;
};

const textures = {
  "bark": {
    "oak": {
      "ao": loadTexture(oakAo, false),
      "color": loadTexture(oakColor),
      "normal": loadTexture(oakNormal, false),
      "roughness": loadTexture(oakRoughness, false),
    }
  },
  "leaves": {
    "ash": loadTexture(ashLeaves)
  }
};