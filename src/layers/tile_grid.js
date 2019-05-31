import CONSTANTS from '../constants'
import MathUtils from '../math_4490'
import MathUtils4490 from '../math_4490'
import MathUtils3857 from '../math_3857'

export default class World {
  constructor(level, projection) {
    this.level = level
    this.projection = projection
  }
  
  // 创建格网的顶点数组及其索引、颜色、法线
  //  v0------v1------v2------v3------v4
  //  |       |       |       |       |
  //  |       |       |       |       |
  //  |       |       |       |       |
  //  v5------v6------v7------v8------v9
  //  |       |       |       |       |
  //  |       |       |       |       |
  //  |       |       |       |       |
  // v10-----v11-----v12-----v13-----v14
  getVertexInfo() {
    var points = []
    let vertexs = []
    let colors = []
    let normals = []
    let indices = []
    let MathUtils = this.projection === 'epsg3857' ? MathUtils3857 : MathUtils4490
    let N = Math.pow(2, this.level)  // 瓦片个数
    let M = this.level > CONSTANTS.BASE_LEVEL ? 1 : Math.pow(2, CONSTANTS.BASE_LEVEL - this.level) // 瓦片分割数量
    let delta = 1 / M
    let row = this.projection === 'epsg3857' ? N : N / 2 // 瓦片的行数和列数
    let col = N
    for(let i = 0;i <= row;i++) {
      for(let j = 0;j <= col * M;j++) {
        let coord = [i, j * delta, this.level]
        let lngLat = MathUtils.tileCoordToLngLat(coord)
        let xyz = MathUtils.lngLatToXYZ(lngLat)
        let gl_xyz = MathUtils.XYZToWebgl(xyz)
        points.push(gl_xyz)
        vertexs = vertexs.concat(gl_xyz)
        normals = normals.concat(gl_xyz)
        colors = colors.concat([1.0, 0.0, 0.0])
        if (j !== col * M) {
          indices = indices.concat([points.length-1, points.length])
        }
      }
    }
    for(let i = 0;i <= col;i++) {
      for(let j = 0;j <= row * M;j++) {
        let coord = [j * delta, i, this.level]
        let lngLat = MathUtils.tileCoordToLngLat(coord)
        let xyz = MathUtils.lngLatToXYZ(lngLat)
        let gl_xyz = MathUtils.XYZToWebgl(xyz)
        points.push(gl_xyz)
        vertexs = vertexs.concat(gl_xyz)
        normals = normals.concat(gl_xyz)
        colors = colors.concat([1.0, 0.0, 0.0])
        if (j !== row * M) {
          indices = indices.concat([points.length-1, points.length])
        }
      }
    }
    return {vertexs, normals, colors, indices}
  }
}