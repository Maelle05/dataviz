import { webgl } from './three'
import data from './data/data.json';


const three = new webgl()
const colorV = ["#D3AA6B", "#25A0A0", "#F2C94C", "#6B99D3", "#D36B6B", "#BED36B"]

//INIT
three.loader()
setData(0)

//Var
let allNavItem = []
const navDiv = document.getElementById('Nav')

//Function
export function initNav() {
  const numVehicules = three.getSteps()
  
  for (let i = 0; i < numVehicules; i++) {
    const newPoint = document.createElement("div")
    const span = document.createElement("span")
    newPoint.className = 'navItem'
    if (i === 0 ) {
      newPoint.className = 'active navItem'
    }
    const date = document.createElement("p")
    date.innerHTML = data.vehicules[i].epoque.date
    newPoint.appendChild(date)
    newPoint.appendChild(span)
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
    if (i === step) {
      allNavItem[i].classList.add("active")
      allNavItem[i].style.color = colorV[step]
      allNavItem[i].querySelector("span").style.color = colorV[step]
    } else {
      allNavItem[i].classList.remove("active")
      allNavItem[i].style.color = '#FFF'
    }
  }
}
