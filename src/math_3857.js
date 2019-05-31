import CONSTANTS from './constants'

export default {
  tileCoordToLngLat(tileCoord) { // 瓦片坐标转经纬度
    return(this.mercatorToLngLat(this.tileCoordToMercator(tileCoord)))
  },
  tileCoordToMercator(tileCoord) {  // 瓦片坐标转墨卡托
    let row = tileCoord[0]
    let col = tileCoord[1]
    let level = tileCoord[2]
    let wordSize = Math.pow(2, level)
    let size = 2 * CONSTANTS.MAX_PROJECTED_COORD / wordSize
    let x = -CONSTANTS.MAX_PROJECTED_COORD + size * col
    let y = CONSTANTS.MAX_PROJECTED_COORD - size * row
    return [x, y]
  },
  mercatorToLngLat(coord) {  // 墨卡托转经纬度
    let lng = coord[0] / CONSTANTS.RADIUS
    let lat = 2 * (Math.atan(Math.pow(Math.E, coord[1] / CONSTANTS.RADIUS))) - Math.PI / 2
    return [this.radianToDegree(lng), this.radianToDegree(lat)]
  },
  lngLatToXYZ(lngLat) {  // 经纬度转大地
    let lngRadian = this.degreeToRadian(lngLat[0])
    let latRadian = this.degreeToRadian(lngLat[1])
    return {
      X: CONSTANTS.RADIUS * Math.cos(latRadian) * Math.cos(lngRadian),
      Y: CONSTANTS.RADIUS * Math.cos(latRadian) * Math.sin(lngRadian),
      Z: CONSTANTS.RADIUS * Math.sin(latRadian)
    }
  },
  XYZToWebgl(point) { // 大地转webgl
    return [+point.Y.toFixed(6), +point.Z.toFixed(6), +point.X.toFixed(6)]
  },
  degreeToRadian(degree) {
    return degree * Math.PI / 180
  },
  radianToDegree(r) {
    return r * 180 / Math.PI
  }
}