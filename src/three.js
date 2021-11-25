import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import gsap from 'gsap';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from 'meshoptimizer/meshopt_decoder.module';
import { endChargement, initNav } from './base';
import { Color, MeshBasicMaterial, MeshToonMaterial } from 'three';

export class webgl {
  constructor(){
    // Debug
    // this.gui = new dat.GUI()
    // this.guiCam = this.gui.addFolder('Camera position')
    // this.guiVehicules = this.gui.addFolder('Vehicules')
    this.gltfLoader = new GLTFLoader()

    // Canvas
    this.canvas = document.querySelector('canvas.webgl')

    // Scene
    this.scene = new THREE.Scene()

    //Texture
    this.textureLoader = new THREE.TextureLoader()

    //Objects
    this.parametre = {
      initPos: -1.8,
      gap: 0,
      rotSpeed: .2
    }
    
    this.bgCircle = new THREE.Mesh(new THREE.CircleGeometry( 5, 50 ), new THREE.MeshBasicMaterial({color: '#D3AA6B'}))
    this.vehiculesGroup = new THREE.Object3D()
    this.cartG = new THREE.Object3D()
    this.boatG = new THREE.Object3D()
    this.oldCarG = new THREE.Object3D()
    this.trainG = new THREE.Object3D()
    this.planeG = new THREE.Object3D()
    this.raceCarG = new THREE.Object3D()
    this.cart = new THREE.Object3D()
    this.boat = new THREE.Object3D()
    this.oldCar = new THREE.Object3D()
    this.train = new THREE.Object3D()
    this.plane = new THREE.Object3D()
    this.raceCar = new THREE.Object3D()

    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100)
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas
    })
    this.clock = new THREE.Clock()
    this.elapsedTime = this.clock.getElapsedTime()
    this.steps
    this.curentStep = 0
  }
  loader(){
    // const mat = new MeshToonMaterial({
    //   color: new Color('#9a9fa5'),
    // })
    const matcap = this.textureLoader.load('/matcap/12.jpeg')
    const mat = new THREE.MeshMatcapMaterial()
    mat.matcap = matcap
    this.gltfLoader.setMeshoptDecoder(MeshoptDecoder)
    const loaderText = document.querySelector('#loader > div > p')
    loaderText.innerHTML = 'Chargement de la charette ...'
    this.gltfLoader.load(
      '/models/charette/charette.gltf',
      (gltf) =>
      {
        console.log('success 1')
        loaderText.innerHTML = 'Chargement de la locomotive ...'
        gltf.scene.children[0].traverse( function (obj) {
          if (obj.isMesh){
            obj.material = mat
          }
        })
        this.cart.add( gltf.scene.children[0] )
        this.cart.scale.set(.1, .1, .1)
        this.gltfLoader.load(
          '/models/Locomotive.glb',
          (gltf) =>
          {
            console.log('success 2')
            loaderText.innerHTML = 'Chargement du bateau ...'
            gltf.scene.scale.set(.1, .1, .1)
            this.train.add( gltf.scene )
            gltf.scene.children.forEach(objct => {
              objct.traverse( function (obj) {
                if (obj.isMesh){
                  obj.material = mat
                }
              })
            });
            this.gltfLoader.load(
              '/models/boat.glb',
              (gltf) =>
              {
                console.log('success 3')
                loaderText.innerHTML = 'Chargement de l\' avion ...'
                gltf.scene.scale.set(.2, .2, .2)
                gltf.scene.children[0].traverse( function (obj) {
                  if (obj.isMesh){
                    obj.material = mat
                  }
                })
                this.boat.add( gltf.scene )
      
                this.gltfLoader.load(
                  '/models/plane.glb',
                  (gltf) =>
                  {
                    console.log('success 4')
                    loaderText.innerHTML = 'Chargement de la voiture à vapeur ...'
                    gltf.scene.scale.set(.8,.8,.8)
                    gltf.scene.children[0].traverse( function (obj) {
                      if (obj.isMesh){
                        obj.material = mat
                      }
                    })
                    this.plane.add( gltf.scene )

                    this.gltfLoader.load(
                      '/models/voiture_a_vapeur.glb',
                      (gltf) =>
                      {
                        console.log('success 5')
                        loaderText.innerHTML = 'Chargement de la voiture de course ...'
                        gltf.scene.scale.set(.1,.1,.1)
                        gltf.scene.children.forEach(children => {
                          children.traverse( function (obj) {
                            if (obj.isMesh){
                              obj.material = mat
                            }
                          })
                        });
                        this.oldCar.add( gltf.scene )
              
                        this.gltfLoader.load(
                          '/models/bugatti.glb',
                          (gltf) =>
                          {
                            console.log('success 6')
                            loaderText.innerHTML = 'Chargement terminé !'
                            gltf.scene.scale.set(.28,.28,.28)
                            gltf.scene.children.forEach(children => {
                              children.traverse( function (obj) {
                                if (obj.isMesh){
                                  obj.material = mat
                                }
                              })
                            });
                            this.raceCar.add( gltf.scene )
                  
                            this.init()
                            initNav()
                            endChargement()
                          }
                        )
                      }
                    )
                  }
                )
              }
            )
          }
        )
      }
    )
  }

  init(){
    this.parametre.gap = this.parametre.initPos + 14
    this.scene.background = new THREE.Color( 0x121212 );
    // this.scene.background = new THREE.Color( 0xFFFFFF );

    // const ambientLight = new THREE.AmbientLight(0xffffff, .4)
    // this.scene.add(ambientLight)

    // const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
    // directionalLight.castShadow = true
    // directionalLight.shadow.mapSize.set(1024, 1024)
    // directionalLight.shadow.camera.far = 15
    // directionalLight.shadow.camera.left = - 7
    // directionalLight.shadow.camera.top = 7
    // directionalLight.shadow.camera.right = 7
    // directionalLight.shadow.camera.bottom = - 7
    // directionalLight.position.set(- 5, 5, 0)
    // this.scene.add(directionalLight)

    /**
     * Objects
     */
    this.cartG.position.x = this.parametre.initPos
    this.boatG.position.x = 1 * this.parametre.gap + this.parametre.initPos
    this.oldCarG.position.x = 2 * this.parametre.gap + this.parametre.initPos
    this.trainG.position.x = 3 * this.parametre.gap + this.parametre.initPos
    this.planeG.position.x = 4 * this.parametre.gap + this.parametre.initPos
    this.raceCarG.position.x = 5 * this.parametre.gap + this.parametre.initPos

    this.bgCircle.position.x = -8.5
    this.bgCircle.position.z = -10
    this.bgCircle.position.y = -2.3
    this.bgCircle.rotation.x = 6

    this.cart.position.y = -0.5
    this.train.position.y = 0.7
    this.plane.position.y = -3
    this.boat.position.y = 0.1
    this.raceCar.position.y = 0.1
    

    this.vehiculesGroup.position.y = 0.2
    this.cartG.add(this.cart)
    this.boatG.add(this.boat)
    this.oldCarG.add(this.oldCar)
    this.trainG.add(this.train)
    this.planeG.add(this.plane)
    this.raceCarG.add(this.raceCar)
    
    this.vehiculesGroup.add(this.cartG, this.boatG, this.oldCarG, this.trainG, this.planeG, this.raceCarG)

    this.scene.add(this.vehiculesGroup, this.bgCircle)
    /**
     * Debug
     */
    // this.guiVehicules.add(this.vehiculesGroup.position, 'x', -10, 6, .1)
    // this.guiVehicules.add(this.vehiculesGroup.position, 'y', -6, 6, .1)
    // this.guiVehicules.add(this.vehiculesGroup.position, 'z', -6, 6, .1)
    // this.guiVehicules.add(this.parametre, 'rotSpeed', 0, 1, .1)
    // this.guiVehicules.add(this.bgCircle.position, 'x', -20, 6, .1)
    // this.guiVehicules.add(this.bgCircle.position, 'z', -30, 1, .1)
    // this.guiVehicules.add(this.bgCircle.position, 'y', -10, 10, .1)

    window.addEventListener('resize', () =>
    {
        // Update sizes
        this.sizes.width = window.innerWidth
        this.sizes.height = window.innerHeight

        // Update camera
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()

        // Update renderer
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    /**
     * Camera
     */
    this.camera.position.x = 0
    this.camera.position.y = 1
    this.camera.position.z = 3
    this.scene.add(this.camera)

    /**
     * Debug
     */
    // this.guiCam.add(this.camera.position, 'x', 0, 10, 1)
    // this.guiCam.add(this.camera.position, 'y', 0, 10, 1)
    // this.guiCam.add(this.camera.position, 'z', 0, 10, 1)

    /**
     * Controls
     */
    this.controls.enableDamping = true
    this.controls.enabled = false

    /**
     * Renderer
     */
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    this.update()

    this.steps = this.vehiculesGroup.children.length
  }

  update(){
    /**
     * Animate
     */
    const tick = () =>
    {
      this.elapsedTime = this.clock.getElapsedTime()
      // Update cube
      this.vehiculesGroup.children.forEach(vehiculeG => {
        vehiculeG.rotation.y = this.elapsedTime * this.parametre.rotSpeed
      });

      // Update controls
      this.controls.update()

      // Render
      this.renderer.render(this.scene, this.camera)

      // Call tick again on the next frame
      window.requestAnimationFrame(tick)
    }

    tick()
  }

  getSteps(){
    return this.steps
  }

  getCurrentStep(){
    return this.curentStep
  }

  mouveTo(numStep){
    if (this.curentStep != numStep) {
      const goTo = -numStep * this.parametre.gap
      gsap.to(this.vehiculesGroup.position, 1, {x: goTo});
      this.curentStep = numStep
    }
  }

  setColor(color){
    this.bgCircle.material.color = new THREE.Color(color)
  }

  rotateLeft(i){
    gsap.to(this.vehiculesGroup.children[i].children[0].rotation, 1, {y: this.vehiculesGroup.children[i].children[0].rotation.y - 2});
  }

  rotateRight(i){
    gsap.to(this.vehiculesGroup.children[i].children[0].rotation, 1, {y: this.vehiculesGroup.children[i].children[0].rotation.y + 2});
  }

}