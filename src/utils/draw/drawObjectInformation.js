import * as d3 from 'd3';
import importanceData from '../../constants/importance';
import positionXData from '../../constants/position_x';
import positionYData from '../../constants/position_y';
import headingData from '../../constants/heading';
import DataProvider from "../../providers/DataProvider";
import * as THREE from "three";

const margin = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 40,
};
const innerWidth = 0.22 * window.innerWidth;
const innerHeight = 450;

class ObjectChartDrawer {
    static instance = null;

    constructor() {
        if (ObjectChartDrawer.instance) {
            return ObjectChartDrawer.instance;
        }
        ObjectChartDrawer.instance = this;
    }

    renderShape = (clickID) => {
        d3.selectAll('#object-chart > canvas:nth-child(1)').remove();
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xFFFFFF);
        // Define the z axis
        const dir = new THREE.Vector3(0, 0, 1);
        const origin = new THREE.Vector3(0, 0, 0);
        const length = 10000;
        const hex = 0x0000ff;
        const arrowHelper = new THREE.ArrowHelper(dir, origin, length, hex);
        scene.add(arrowHelper);
        // Define the floor
        const groundGeometry = new THREE.PlaneGeometry(200, 200);
        const groundMaterial = new THREE.MeshBasicMaterial({color: 0xAAAAAA});
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.rotation.z = -Math.PI / 2;
        scene.add(groundMesh);
        // Define the camera
        const camera = new THREE.PerspectiveCamera(
            75,
            innerWidth / innerHeight,
            0.1,
            100000
        );
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(innerWidth, innerHeight);
        renderer.setClearColor(0xFFFFFF);
        document.querySelector("#object-chart").appendChild(renderer.domElement);
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableZoom = true;
        const polygons = (new DataProvider()).shapeOf(clickID);
        console.log(polygons);
        const extrudeSettings = {
            steps: 1,
            depth: 1,
            bevelEnabled: false
        };
        polygons.forEach((polygon, index) => {
            const shape = new THREE.Shape(
                polygon.map((pt) => new THREE.Vector2(pt.x, pt.y))
            );
            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            const material = new THREE.MeshBasicMaterial({
                color: "#448EF7",
                transparent: true,
                opacity: 0.5
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.z = index * 200;
            scene.add(mesh);
            const edgesGeometry = new THREE.EdgesGeometry(mesh.geometry);
            const edgesMaterial = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 2});  // Choose a contrasting color
            const edgesMesh = new THREE.LineSegments(edgesGeometry, edgesMaterial);
            mesh.add(edgesMesh);

        });
        camera.position.x = -20;
        camera.position.y = 20;
        camera.position.z = 20;
        function animate() {
            requestAnimationFrame(animate);
            controls.update(); // Add this to update the controls every frame
            renderer.render(scene, camera);
        }
        animate();
    }

    draw = (attribute, svgElement, selectedID, index) => {
        if (selectedID === -1) {
            return;
        }

        let data = this._loadData(attribute, selectedID);

        let indicator = [];
        indicator.push({'x': index, 'y': 0});
        indicator.push({'x': index, 'y': attribute === "importance" ? 1 : d3.max(data, d => d.y)});

        let xScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.x)])
            .range([0, innerWidth]);
        let yScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.y), attribute === "importance" ? 1 : d3.max(data, d => d.y)])
            .range([innerHeight, 0]);

        let xAxis = d3.axisBottom(xScale);
        let yAxis = d3.axisLeft(yScale);

        let g = svgElement.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
        g.append('g').attr('transform', `translate(0 ,${innerHeight})`).call(xAxis);
        g.append("g")
            .attr("transform", `translate($0 ,0)`)
            .call(yAxis) // Use the yAxis variable
            .call(g => g.select(".domain").remove()) // Remove the domain line
            .call(g => g.selectAll(".tick line").clone() // Create and extend tick lines as grid lines
                .attr("x2", innerWidth)
                .attr("stroke-opacity", 0.1));

        let lineGenerator = d3.line().x(d => xScale(d.x)).y(d => yScale(d.y)).curve(d3.curveMonotoneX);

        g.append('path').datum(data).attr('d', lineGenerator).attr('stroke', '#448EF7').attr('fill', 'none');

        g.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .attr("r", 1)
            .attr("fill", "white")
            .attr("stroke", "#448EF7");

        g.append('path').datum(indicator).attr('d', lineGenerator).attr('stroke', 'blue').attr('fill', 'blue').attr('stroke-dasharray', '10,10');
    }

    _loadData = (attribute, selectedID) => {
        let data = [];
        let indexOfObject = 0;
        let length = (new DataProvider()).length;
        let targetData;
        switch (attribute) {
            case 'importance':
                targetData = importanceData;
                break;
            case 'positionX':
                targetData = positionXData;
                break;
            case 'positionY':
                targetData = positionYData;
                break;
            case 'heading':
                targetData = headingData;
                break;
            default:
                targetData = importanceData;
        }
        indexOfObject = targetData.findIndex((d) => parseInt(d['id']) === parseInt(selectedID));
        for (let i = 0; i < length; i++) {
            data.push({'x': i, 'y': targetData[indexOfObject][attribute][i]});
        }
        return data;
    }
}

export default ObjectChartDrawer;