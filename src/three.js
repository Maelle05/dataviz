import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

export class webgl {
  constructor(){
    // Debug
    this.gui = new dat.GUI()
    this.guiCam = this.gui.addFolder('Camera position')
    this.guiVehicules = this.gui.addFolder('Vehicules')

    // Canvas
    this.canvas = document.querySelector('canvas.webgl')

    // Scene
    this.scene = new THREE.Scene()

    //Texture
    this.textureLoader = new THREE.TextureLoader()

    //Objects
    this.parametre = {
      initPos: -1.5,
      gap: 0,
      rotSpeed: .2
    }
    this.vehiculesGroup = new THREE.Object3D()
    this.cart = new THREE.Mesh( new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 'grey'}))
    this.boat = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({color: 'grey'}))


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
    let curentStep = 1
  }
  init(){
    this.parametre.gap = this.parametre.initPos + 8

    /**
     * Objects
     */
    this.cart.position.x = this.parametre.initPos
    this.boat.position.x = 1 * this.parametre.gap

    this.vehiculesGroup.add(this.cart, this.boat)
    this.scene.add(this.vehiculesGroup)

    /**
     * Debug
     */
    this.guiVehicules.add(this.vehiculesGroup.position, 'x', -10, 6, .1)
    this.guiVehicules.add(this.vehiculesGroup.position, 'y', -6, 6, .1)
    this.guiVehicules.add(this.vehiculesGroup.position, 'z', -6, 6, .1)
    this.guiVehicules.add(this.parametre, 'rotSpeed', 0, 1, .1)

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
    this.guiCam.add(this.camera.position, 'x', 0, 10, 1)
    this.guiCam.add(this.camera.position, 'y', 0, 10, 1)
    this.guiCam.add(this.camera.position, 'z', 0, 10, 1)

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
      this.vehiculesGroup.children.forEach(vehicule => {
        vehicule.rotation.y = this.elapsedTime * this.parametre.rotSpeed
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

}