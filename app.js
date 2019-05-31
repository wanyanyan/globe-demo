import Globe from './src/draw'

window.onload = () => {
  let eye = [0, 0, 203]
  let options = {
    container: 'globe',
    center: [0,0],
    zoom: 2,
    layers: ['tile','grid'],
    projection: 'epsg4490'
  }
  let globe = new Globe(options)
  updateInfo()
  document.onkeydown = ev => {
    let step = 5
    let center = globe.getCenter()
    let zoom = globe.getZoom()
    if(ev.keyCode === 39) { // 右
      globe.setCenter([center[0]+step, center[1]])
    } else if (ev.keyCode === 37) {// 左
      globe.setCenter([center[0]-step, center[1]])
    } else if (ev.keyCode === 38) {// 上
      globe.setCenter([center[0], center[1]+step])
    } else if (ev.keyCode === 40) {// 下
      globe.setCenter([center[0], center[1]-step])
    } else if (ev.keyCode === 187) { // 加号
      if (zoom >= 6) {
        return
      }
      globe.setZoom(zoom + 1)
    } else if (ev.keyCode === 189) { // 减号
      if (zoom <=2 ) {
        return
      }
      globe.setZoom(zoom - 1)
    } else {
      return
    }
    updateInfo()
  }

  function updateInfo() {
    let zoomBox = document.querySelector('.info .zoom')
    let centerBox = document.querySelector('.info .center')
    zoomBox.innerText = globe.getZoom()
    centerBox.innerText = globe.getCenter().toString()
  }
}
