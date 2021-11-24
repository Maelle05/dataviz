import { webgl } from './three'
import data from './data/data.json';
import { initSlider } from './slider';


const three = new webgl()
const colorV = ["#D3AA6B", "#25A0A0", "#F2C94C", "#6B99D3", "#D36B6B", "#BED36B"]

//INIT
three.loader()
initSlider()
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
  const slider1Title = document.querySelector('.slide-1 > h2')
  const slider2Title = document.querySelector('.slide-2 > h2')
  const slider3Title = document.querySelector('.slide-3 > h2')
  const data1 = document.querySelector('.slide-1 > ul > li:nth-child(1) > p')
  const data2 = document.querySelector('.slide-1 > ul > li:nth-child(2) > p')
  const data3 = document.querySelector('.slide-1 > ul > li:nth-child(3) > p')
  const data4 = document.querySelector('.slide-1 > ul > li:nth-child(4) > p')
  const data5 = document.querySelector('.slide-1 > ul > li:nth-child(5) > p')
  const data6 = document.querySelector('.slide-1 > ul > li:nth-child(6) > p')
  const data7 = document.querySelector('.slide-1 > ul > li:nth-child(7) > p')
  const data8 = document.querySelector('.slide-1 > ul > li:nth-child(8) > p')

  title.innerHTML = data.vehicules[i].name
  slider1Title.innerHTML = `CARACTERISTIQUES DE ${data.vehicules[i].name}`
  slider2Title.innerHTML = `COMPARAISON DE DISTANCE PARCOURU EN KM/H`
  slider3Title.innerHTML = `COMPARAISON DES PRIX MOYENS EN FONCTION DU TEMPS`
  data1.innerHTML = data.vehicules[i].epoque.name
  data2.innerHTML = data.vehicules[i].epoque.date
  data3.innerHTML = data.vehicules[i].price
  data4.innerHTML = data.vehicules[i].number_of_sales
  data5.innerHTML = data.vehicules[i].top_speed
  data6.innerHTML = data.vehicules[i].dimensions
  data7.innerHTML = data.vehicules[i].capacity
  data8.innerHTML = data.vehicules[i].energy_consumption
  
}
  
setColor(0)
function setColor(step) {
  three.setColor(colorV[step])
  for (let i = 0; i < allNavItem.length; i++) {
    allNavItem[i].style.backgroundColor = `${colorV[step]}`
    if (i === step) {
      allNavItem[i].classList.add("active")
      allNavItem[i].style.color = colorV[step]
      allNavItem[i].querySelector("span").style.borderColor = colorV[step]
    } else {
      allNavItem[i].classList.remove("active")
      allNavItem[i].style.color = '#FFF'
    }
  }
}
