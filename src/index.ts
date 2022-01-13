// https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_additive_blending.html
import * as THREE from 'three'
import Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import options from './utils';

const { Scene, PerspectiveCamera, PlaneGeometry, MeshPhongMaterial, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, AxesHelper, Color, Fog } = THREE

// scene
const scene = new Scene();
scene.background = new Color(0xa0a0a0)
scene.fog = new Fog( 0xa0a0a0, 10, 50 )

// 环境光↓↓↓
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );
// 环境光↑↑↑

// 方向光↓↓↓
const dirLight = new THREE.DirectionalLight( 0xffffff );
dirLight.position.set( 3, 10, 10 );
dirLight.castShadow = true;
dirLight.shadow.camera.top = 2;
dirLight.shadow.camera.bottom = - 2;
dirLight.shadow.camera.left = - 2;
dirLight.shadow.camera.right = 2;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add( dirLight );
// 方向光↑↑↑

// ground↓↓↓
const mesh = new THREE.Mesh( new PlaneGeometry( 100, 100 ), new MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
mesh.rotation.x = - Math.PI / 2;
mesh.receiveShadow = true;
scene.add( mesh );
// ground↑↑↑

const loader = new GLTFLoader();
// loader.load( 'models/gltf/Xbot.glb', function ( gltf ) {
//   const model = gltf.scene;
//   console.log(model)
//   scene.add( model );
//   model.traverse( function ( object: any  ) {
//     if ( object.isMesh ) object.castShadow = true;
//   });
// } );

let carmodel:any = null

var newMaterial = new THREE.MeshStandardMaterial({color: 0xff0000});
loader.load( 'models/gltf/spy-hypersport/scene.gltf', function ( gltf ) {
  carmodel = gltf.scene;
  console.log(carmodel)
  scene.add( carmodel );
  carmodel.traverse( function ( object: any ) {
    console.log(object.name)
    if ( object.isMesh ) object.castShadow = true;
    
  });
  // https://threejs.org/examples/#webgl_loader_gltf_variants 动态切换已加载材质的示例
  // 自定义模型材质 https://threejs.org/examples/#webgl_custom_attributes   https://threejs.org/examples/#webgl_buffergeometry_custom_attributes_particles
  setTimeout(() => {
    carmodel.traverse( function ( object: any ) {
      // object_2 后轮
      // object_25 前轮
      // object_15 前轮毂
      // Object_22 座位
      console.log(object.name)
      if (object.isMesh && object.name === 'Object_22') object.material = newMaterial; // 覆盖默认材质
    });
  }, 5000)
} );


// renderer
const renderer = new WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.shadowMap.enabled = true;
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// camera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 100 );
camera.position.set( - 1, 2, 3 );

// 鼠标控制器
const controls = new OrbitControls( camera, renderer.domElement );
controls.enablePan = false;
controls.enableZoom = false;
controls.target.set( 0, 1, 0 );
controls.update();

// 性能分析
const stats = new Stats();
document.body.appendChild( stats.dom );

// 参数gui控制器
console.log(options) // 在这里引用了options才会在页面显示右上角的那个框框

const getBox = (x = 1,y = 1,z = 1) => {
    const cube = new BoxGeometry( 1, 1, 1 );
    const material = new MeshBasicMaterial( { color: 0x00ff00 } );
    return new Mesh( cube, material )
}

const box = getBox()
// scene.add( box );

const animate = function () {
    stats.begin();
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
    renderer.render( scene, camera );
    requestAnimationFrame( animate );
    stats.end();
};

animate()