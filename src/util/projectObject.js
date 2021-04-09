const THREE = require("three");

class ProjectObject{
  constructor( project, index, parent ){
    this.project = project;
    this.parent = parent;
    this.index = index;
    let geometry = new THREE.SphereGeometry( 400, 32, 32 );
    let material = new THREE.MeshBasicMaterial({ color: "rgb(235,235,255)" });
    this.mesh = new THREE.Mesh( geometry, material );
    this.mesh.position.set( index * 1600, 0, -1400 )
    // this.parent.add( this.mesh )
  }

  animate(){

  }
}

export default ProjectObject
