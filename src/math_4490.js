import CONSTANTS from './constants'

export default {
  tileCoordToLngLat(tileCoord) { // 瓦片坐标转经纬度
    let row = tileCoord[0]
    let col = tileCoord[1]
    let level = tileCoord[2]
    let wordSize = Math.pow(2, level)
    let degreePerTileCoord = 360 / wordSize
    let lat = 90 - row * degreePerTileCoord
    let lng = col * degreePerTileCoord - 180
    return [lng, lat]
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