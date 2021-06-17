import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../../css/CrossSectionGraph.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

const style = {
  marginTop: "15px",
};
class CrossSectionMap3D extends Component {
  constructor(props) {
    super(props);
    this.state = {
      crossSectionDepth: "",
      svgUpdate: "",
      colorArray: [
        "#b87333",
        "#000000",
        "#DE91A8",
        "#ca8196",
        "#BAAB68",
        "#E3C16F",
        "#FAFF70",
        "#ea62b1",
        "#ef83cd",
        "#FFB8DE",
      ],
    };
  }
  componentDidMount() {
    this.getData();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.crossSection3DSVG !== this.props.crossSection3DSVG) {
      this.setState({
        svgUpdate: this.props.crossSection3DSVG,
      });
      this.setState({
        crossSectionDepth: this.props.crossSection3DDepth,
      });
      document.getElementById("cross3DGraphMap").innerHTML = "";
      this.getData();
    }
  }
  getData = () => {
    var width = 530;
    var height = 470;
    this.scene = new THREE.Scene();
    this.scene.background = null;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
    this.camera.position.x = 100;
    this.camera.position.y = 80;
    this.camera.position.z = 310;
    this.controls = new OrbitControls(this.camera, this.mount);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0xffffff, 0.1);
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);
    const svgMarkup = this.props.crossSection3DSVG;
    const loader = new SVGLoader();
    const svgData = loader.parse(svgMarkup);
    const svgGroup = new THREE.Group();
    var material;
    svgData.paths.forEach((path, i) => {
      if (i == 0) {
        material = new THREE.MeshLambertMaterial({
          color: this.state.colorArray[0],
          side: THREE.DoubleSide,
        });
      } else if (i == svgData.paths.length - 1) {
        material = new THREE.MeshBasicMaterial({
          color: this.state.colorArray[1],
          side: THREE.DoubleSide,
        });
      } else if (i == svgData.paths.length - 2) {
        material = new THREE.MeshLambertMaterial({
          color: this.state.colorArray[1],
          side: THREE.DoubleSide,
        });
      } else {
        material = new THREE.MeshLambertMaterial({
          color: this.state.colorArray[12 - svgData.paths.length + i],
          side: THREE.DoubleSide,
        });
      }
      const shapes = path.toShapes(true);
      shapes.forEach((shape, j) => {
        if (i == svgData.paths.length - 2 || i == svgData.paths.length - 1) {
          var geometry = new THREE.ExtrudeGeometry(shape, {
            depth: this.props.crossSection3DDepth + 20,
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(-51, -44, -3);
          svgGroup.add(mesh);
        } else {
          var geometry = new THREE.ExtrudeGeometry(shape, {
            depth: this.props.crossSection3DDepth + (1 - i) * 15,
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(-51, -44, i);
          svgGroup.add(mesh);
        }
      });
    });
    var light = new THREE.HemisphereLight(0xf6e86d, 0x404040, 1.4);
    this.scene.add(light);
    this.scene.add(svgGroup);
    this.startAnimationLoop();
    window.addEventListener("resize", this.handleWindowResize);
  };

  startAnimationLoop = () => {
    this.renderer.render(this.scene, this.camera);
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  };

  handleWindowResize = () => {
    var width = 530;
    var height = 470;
    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };
  render() {
    return (
      <div
        id="cross3DGraphMap"
        className="crossSection3dGraphMargin"
        ref={(ref) => (this.mount = ref)}
      />
    );
  }
}
export default withRouter(CrossSectionMap3D);
