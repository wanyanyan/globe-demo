import Program from './program'
import World from './layers/world'
import TileGrid from './layers/tile_grid'
import util from './util'

class Globe {
  constructor(options) {
    this.options = options
    this.center = this.options.center || [0, 0]
    this.zoom = this.options.zoom || 2
    this.layers = this.options.layers || []
    this.projection = options.projection || 'epsg4490'
    this.draw()
  }
  
  draw() {
    let container = document.getElementById(this.options.container)
    if (!container) {
      throw new Error('未指定容器')
    }
    // 准备画布
    let canvas = document.createElement('canvas')
    canvas.width = container.clientWidth
    canvas.height = container.clientHeight
    this.aspect = canvas.width / canvas.height
    container.appendChild(canvas)
    // 获取webgl上下文
    this.gl = getWebGLContext(canvas)
    if (!this.gl) {
      throw new Error('获取webgl上下文失败')
    }
    // 初始化着色器
    if (!initShaders(this.gl, Program.VSHADER_SOURCE, Program.FSHADER_SOURCE)) {
      throw new Error('初始化着色器失败')
    }
    // 初始化缓冲区
    let vertexInfo = this.getLayerVertex()
    this.vertexCount = this.initVertexBuffers(vertexInfo)
    // Set clear color and enable hidden surface removal
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
    this.gl.enable(this.gl.DEPTH_TEST)

    this.setCamera()
    this.setLight()
    this.render()
  }

  getLayerVertex() {
    let geometryLayers = []
    this.layers.forEach(lyr => {
      switch(lyr) {
        case 'grid':
          let world = new World(this.zoom, this.projection)
          geometryLayers.push(world.getVertexInfo())
          break
        case 'tile':
          let tileGrid = new TileGrid(this.zoom, this.projection)
          geometryLayers.push(tileGrid.getVertexInfo())
          break
        default:
          break
      }
    })
    return util.caculateVertex(geometryLayers)
  }
  
  // 设置模型视图投影矩阵
  setCamera() {
    var u_MvpMatrix = this.gl.getUniformLocation(this.gl.program, 'u_MvpMatrix')
    if (!u_MvpMatrix) { 
      console.log('Failed to get the storage location of u_MvpMatrix')
      return
    }
    let eye = [0.0, 0.0, 372-36 * this.zoom] // 观察点位置
    var mvpMatrix = new Matrix4()
    mvpMatrix.setPerspective(45, this.aspect, 1, 400) 
    mvpMatrix.lookAt(...eye, 0, 0, 0, 0, 1, 0)
    mvpMatrix.rotate(this.center[1], 1.0, 0.0, 0.0)
    mvpMatrix.rotate(this.center[0], 0.0, 1.0, 0.0)
    this.gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements)
  }

  setCenter(center) {
    this.center = center
    this.setCamera()
    this.render()
  }

  setZoom(z) {
    this.zoom = +z
    let vertexInfo = this.getLayerVertex()
    this.vertexCount = this.initVertexBuffers(vertexInfo)
    this.setCamera()
    this.render()
  }

  setLayers(layers) {
    this.layers = layers
    let vertexInfo = this.getLayerVertex()
    this.vertexCount = this.initVertexBuffers(vertexInfo)
    this.render()
  }
  
  getCenter() {
    return [this.center[0], this.center[1]]
  }

  getZoom() {
    return this.zoom
  }
  // 设置光照
  setLight() {
    // 白光光照
    var u_LightColor = this.gl.getUniformLocation(this.gl.program, 'u_LightColor')
    this.gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0) //白光
    // 光照方向
    var u_LightDirection = this.gl.getUniformLocation(this.gl.program, 'u_LightDirection')
    var lightDirection = new Vector3([0.0, 0.0, 3.0])
    lightDirection.normalize()
    this.gl.uniform3fv(u_LightDirection, lightDirection.elements)
    // 环境光
    var u_AmbientLight = this.gl.getUniformLocation(this.gl.program, 'u_AmbientLight')
    this.gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2)
  }

  render() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    this.gl.drawElements(this.gl.LINE_STRIP, this.vertexCount, this.gl.UNSIGNED_SHORT, 0)
  }

  initVertexBuffers(data) {
    var vertices = new Float32Array(data.vertexs)
    var colors = new Float32Array(data.colors)
    var normals = new Float32Array(data.normals)
    // Indices of the vertices
    var indices = new Uint16Array(data.indices)


    // Write the vertex property to buffers (coordinates, colors and normals)
    if (!this.initArrayBuffer('a_Position', vertices, 3, this.gl.FLOAT)) return -1
    if (!this.initArrayBuffer('a_Color', colors, 3, this.gl.FLOAT)) return -1
    if (!this.initArrayBuffer('a_Normal', normals, 3, this.gl.FLOAT)) return -1

    // Write the indices to the buffer object
    var indexBuffer = this.gl.createBuffer()
    if (!indexBuffer) {
      console.log('Failed to create the buffer object')
      return false
    }

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW)
    return indices.length
  }

  initArrayBuffer (attribute, data, num, type) {
    // Create a buffer object
    var buffer = this.gl.createBuffer()
    if (!buffer) {
      console.log('Failed to create the buffer object')
      return false
    }
    // Write date into the buffer object
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW)
    // Assign the buffer object to the attribute variable
    var a_attribute = this.gl.getAttribLocation(this.gl.program, attribute)
    if (a_attribute < 0) {
      console.log('Failed to get the storage location of ' + attribute)
      return false
    }
    this.gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0)
    // Enable the assignment of the buffer object to the attribute variable
    this.gl.enableVertexAttribArray(a_attribute)

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)

    return true
  }
}
export default Globe