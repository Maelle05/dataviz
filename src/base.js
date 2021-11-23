import { webgl } from './three'


const three = new webgl()
three.init()

const numVehicules = three.getSteps()
const navDiv = document.getElementById('Nav')
let allNavItem = []

for (let i = 0; i < numVehicules; i++) {
  const newPoint = document.createElement("div")
  newPoint.className = 'navItem'
  navDiv.appendChild(newPoint)
  allNavItem.push(newPoint)
  newPoint.addEventListener(
    'click',
    () => {
      three.mouveTo(i)
    }
  )
}
