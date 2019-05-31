export default {
  caculateVertex(geometryLayers) {
    if (geometryLayers.length <=1 ) {
      return geometryLayers[0]
    }
    let result = geometryLayers[0]
    geometryLayers.forEach((l, index) => {
      if(index === 0) {
        return
      }
      let count = geometryLayers[index-1].vertexs.length / 3
      let newIndices = []
      for(let i = 0;i < l.indices.length;i++) {
        newIndices[i] = l.indices[i] + count
      }
      result.vertexs = result.vertexs.concat(l.vertexs)
      result.normals = result.normals.concat(l.normals)
      result.colors = result.colors.concat(l.colors)
      result.indices = result.indices.concat(newIndices)
    })
    return result
  }
}