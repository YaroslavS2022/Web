// import objectsData from './data.js';
// Hand 
const languages = ['English', 'French', 'Spanish', 'German']; // Add more languages as needed

const objectsData = {
    "brain": {
        "polygons": []
    },
    "hand": {
      "polygons": [
        {
          "name": "Phalangues distales",
          "coordinates": [
            { "x": 86, "y": 16 },
            { "x": 92, "y": 16 },
            { "x": 101, "y": 30 },
            { "x": 111, "y": 44 },
            { "x": 96, "y": 40 },
            { "x": 90, "y": 30 }
          ],
          "labels": {
            "English": "Distal phalanges",
            "French": "Phalanges distales",
            "Spanish": "Falanges distales"
          }
        },
        {
          "name": "Os carpales",
          "coordinates": [
            { "x": 120, "y": 250 },
            { "x": 200, "y": 250 },
            { "x": 300, "y": 300 },
            { "x": 120, "y": 300 }
          ],
          "labels": {
            "English": "Carpal bones",
            "French": "Os carpals",
            "Spanish": "Huesos carpianos"
          }
        }
      ]
    }
  };


new Vue({
    el: '#app',
    data() {
      return {
        selectedCategory: null,
        selectedElement: null,
        // loadedImage: null,
        tooltipVisible: false,
        tooltipX: 0,
        tooltipY: 0,
        loadedImage: '',
        shouldShowImage: false,
        dataLoaded: false,
        clickedCoordinates: [],
        isRecordingCoordinates: false,
        categories: [
          { id: 1, name: 'Biology' },
          { id: 2, name: 'Mechanisms' },
          // Add more categories as needed
        ],
        elements: [
          { id: 1, categoryId: 1, name: 'Hand', image: 'hand.png' }, // Updated image path
          { id: 2, categoryId: 1, name: 'Element 2 - Biology', image: 'biology_element_2.png' },
          { id: 3, categoryId: 2, name: 'Element 1 - Mechanisms', image: 'mechanisms_element_1.png' },
          { id: 4, categoryId: 2, name: 'Element 2 - Mechanisms', image: 'mechanisms_element_2.png' },
          // Add more elements with their corresponding category IDs and image paths
        ],
        filteredElements: [],
        polygons: [],
        hoveredLabel: '',
      };
    },
    mounted() {
        // Simulate data fetching delay
        setTimeout(() => {
          // Simulate successful data fetching after a delay (replace this with your actual data fetching logic)
          this.dataLoaded = true;
        }, 1000); // Simulating a 1-second delay, change as needed
      },
      
    created() {
        if (objectsData) {
          for (const objKey in objectsData) {
            if (objectsData[objKey].hasOwnProperty('polygons') && Array.isArray(objectsData[objKey].polygons)) {
              this.polygons = this.polygons.concat(objectsData[objKey].polygons);
            }
            console.log("Polygons TESTESTEST: ", this.polygons)
          }
        }
      },
    methods: {
        toggleRecording() {
            this.isRecordingCoordinates = !this.isRecordingCoordinates;
            if (!this.isRecordingCoordinates) {
              this.drawFinalLine();
            }
          },
        startRecording() {
            this.isRecordingCoordinates = true;
            this.clickedCoordinates = []; // Clear previously recorded coordinates
          },
          stopRecording() {
            this.isRecordingCoordinates = false;
          },
          handleClick(event) {
            if (this.isRecordingCoordinates) {
              const canvas = this.$refs.drawingCanvas;
              const rect = canvas.getBoundingClientRect();
              const x = event.clientX - rect.left;
              const y = event.clientY - rect.top;
              this.clickedCoordinates.push({ x, y });
              this.drawLines();
            }
          },
          
          drawLines() {
            const canvas = this.$refs.drawingCanvas;
            if (canvas) {
              const ctx = canvas.getContext('2d');
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.beginPath();
              ctx.moveTo(this.clickedCoordinates[0].x, this.clickedCoordinates[0].y);
              for (let i = 1; i < this.clickedCoordinates.length; i++) {
                ctx.lineTo(this.clickedCoordinates[i].x, this.clickedCoordinates[i].y);
              }
              ctx.stroke();
            }
          },
          drawFinalLine() {
            if (this.clickedCoordinates.length > 1) {
              const canvas = this.$refs.drawingCanvas;
              const ctx = canvas.getContext('2d');
              ctx.beginPath();
              ctx.moveTo(this.clickedCoordinates[this.clickedCoordinates.length - 1].x, this.clickedCoordinates[this.clickedCoordinates.length - 1].y);
              ctx.lineTo(this.clickedCoordinates[0].x, this.clickedCoordinates[0].y);
              ctx.stroke();
            }
          },
          saveCoordinates() {
            // Use this.clickedCoordinates for further processing or updating your polygons
            console.log("Clicked Coordinates:", this.clickedCoordinates);
          },
        handleHover(event) {
            const mouseX = event.offsetX;
            const mouseY = event.offsetY;
            // Loop through polygons and check if mouse coordinates are within each polygon
            for (const polygon of this.polygons) {
                if (this.isInsidePolygon(mouseX, mouseY, polygon.coordinates)) {
                    this.hoveredLabel = polygon.labels.English; // Store the label to display
                    console.log("Hovered Label:", this.hoveredLabel); // Log the value of hoveredLabel
   
                this.showTooltip(event); // Display the tooltip
                break;
              } else {
                this.hideTooltip(); // Hide the tooltip if not hovering over a polygon
              }
            }
          },
          showTooltip(event) {
            this.tooltipVisible = true;
            this.tooltipX = event.pageX; // Set tooltip X position
            this.tooltipY = event.pageY - 30; // Set tooltip Y position
          },
          hideTooltip() {
            this.tooltipVisible = false; // Hide tooltip when not hovering over a polygon
          },
          isInsidePolygon(x, y, poly) {
            let inside = false;
            const polyPoints = poly.length;
            
            for (let i = 0, j = polyPoints - 1; i < polyPoints; j = i++) {
              const xi = poly[i].x;
              const yi = poly[i].y;
              const xj = poly[j].x;
              const yj = poly[j].y;
              
              const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
              
              if (intersect) {
                inside = !inside;
              }
            }
            
            return inside;
          },
    updateElements() {
        this.filteredElements = this.elements.filter(element => element.categoryId === parseInt(this.selectedCategory));
    },
    loadImage() {
        this.loadedImage = this.selectedElement;
        console.log("TEST" + this.selectedElement);
        this.shouldShowImage = true;
    },
    
    }
});


