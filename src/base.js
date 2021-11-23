import { webgl } from './three'
import data from './data/data.json';


const three = new webgl()
const colorV = ["#D3AA6B", "#25A0A0", "#F2C94C", "#6B99D3", "#D36B6B", "#BED36B"]

//INIT
three.init()
setData(0)

const numVehicules = three.getSteps()
const navDiv = document.getElementById('Nav')
let allNavItem = []

for (let i = 0; i < numVehicules; i++) {
  const newPoint = document.createElement("div")
  newPoint.className = 'navItem'
  if (i === 0 ) {
    newPoint.className = 'active navItem'
  }
  const date = document.createElement("p")
  date.innerHTML = data.vehicules[i].epoque.date
  newPoint.appendChild(date)
  navDiv.appendChild(newPoint)
  allNavItem.push(newPoint)
  newPoint.addEventListener(
    'click',
    () => {
      three.mouveTo(i)
      setData(i)
      setColor(i)
    }
  )
}
  
const left = document.getElementById('rotLeft')
const right = document.getElementById('rotRight')

left.addEventListener('click', ()=>{
  // console.log('left');
  three.rotateLeft(three.getCurrentStep())
})

right.addEventListener('click', ()=>{
  // console.log('right');
  three.rotateRight(three.getCurrentStep())
})
  
function setData(i) {
  const title = document.querySelector('#vehicule > p')
  title.innerHTML = data.vehicules[i].name
}
  
setColor(0)
function setColor(step) {
  three.setColor(colorV[step])
  for (let i = 0; i < allNavItem.length; i++) {
    allNavItem[i].style.backgroundColor = `${colorV[step]}`
    
  }
}