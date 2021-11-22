import { webgl } from './three'


const three = new webgl()
three.init()


const button = document.querySelector('#next')
// console.log(button.dataset.date);
button.addEventListener(
  'click',
  () => {
    console.log(three.getSteps());
  }
)