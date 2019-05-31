import CONSTANTS from '../constants'
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
  // 以此循环每个顶点，并将其三角形索引写到索引数组，例如v0点对应的矩形[v0, v5, v6, v1]
  // 对应的三角形索引为[v0, v5, v1, v1, v5, v6]
  getVertexInfo() {
    let vertexs = []
    let colors = []
    let normals = []
    let indices = []
    let MathUtils = this.projection === 'epsg3857' ? MathUtils3857 : MathUtils4490
    let N = Math.pow(2, this.level)  // 瓦片个数
    let M = this.level > CONSTANTS.BASE_LEVEL ? 1 : Math.pow(2, CONSTANTS.BASE_LEVEL - this.level) // 瓦片分割数量
    let delta = 1 / M
    let count = N*M
    let row = this.projection === 'epsg3857' ? count : count / 2
    let col = count
    for(let i = 0;i <= row;i++) {
      for(let j = 0;j <= col;j++) {
        let coord = [i * delta, j * delta, this.level]
        let lngLat = MathUtils.tileCoordToLngLat(coord)
        let xyz = MathUtils.lngLatToXYZ(lngLat)
        let gl_xyz = MathUtils.XYZToWebgl(xyz)
        vertexs = vertexs.concat(gl_xyz)
        normals = normals.concat(gl_xyz)
        colors = colors.concat([1.0, 1.0, 0.0])
        if (i !== row && j !== col) {
          indices = indices.concat([i*(count+1)+j, (i+1)*(count+1)+j, i*(count+1)+j+1, i*(count+1)+j+1, (i+1)*(count+1)+j, (i+1)*(count+1)+j+1])
        }
      }
    }
    return {vertexs, normals, colors, indices}
  }
}