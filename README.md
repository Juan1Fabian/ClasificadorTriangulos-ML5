# Clasificador de Triángulos con ML5.js y Processing

## Descripción

Este proyecto genera imágenes de triángulos variados y entrena un modelo de aprendizaje automático para clasificarlos. Se utiliza **Processing** para crear imágenes de triángulos con distintas formas y posiciones, y **ml5.js** para entrenar una red neuronal capaz de reconocer cada tipo de triángulo a partir de las imágenes.

---

## Características

- Generación automática de imágenes de triángulos rectángulos, equiláteros e isósceles.
- Variación aleatoria en posición y rotación para robustecer el entrenamiento.
- Entrenamiento de un modelo de clasificación de imágenes con ml5.js.
- Clasificación en tiempo real de triángulos dibujados por el usuario.

---

## Tecnologías usadas

- [Processing](https://processing.org/download) — Para la generación de imágenes.
- [ml5.js](https://ml5js.org/) — Biblioteca de aprendizaje automático en JavaScript, basada en TensorFlow.js.
- JavaScript — Para el código de clasificación y la interfaz.

---

## Estructura del proyecto

- `/data` — Carpeta donde se guardan las imágenes generadas con Processing.
- `/models` — Carpeta donde se almacenan los archivos del modelo entrenado.
- `Triangulos.pde` — Código en Processing para generar imágenes.
- `entrenamiento.js y DeteccionT.js` — Código JavaScript con ml5.js para entrenar y usar el modelo.
- `entrenamiento.html y DeteccionT.html` — Páginas web para entrenar el modelo y clasificar triángulos utilizando ml5.js.

---

## Instalación y uso

### Generar imágenes con Processing

1. Abre el archivo `Triangulos.pde` en Processing.
2. Ejecuta el programa para generar 100 imágenes por cada tipo de triángulo.
3. Las imágenes se guardarán automáticamente en la carpeta `data/`.

### Entrenar el modelo con ml5.js

1. Carga las imágenes en el script de entrenamiento (`entrenamiento.js`).
2. Ejecuta el entrenamiento, que correrá 50 épocas.
3. Guarda el modelo entrenado en la carpeta `/models`.

### Clasificación en tiempo real

- Usa el modelo guardado para clasificar triángulos dibujados o cargados.
- El programa mostrará la etiqueta y la confianza del resultado.

---

## Código destacado

### Generación de imágenes (Processing)

Ejecuta el sketch de Processing Triangulos.pde para generar 100 imágenes por cada tipo de triángulo con variaciones aleatorias.

```java
void setup() {
  size(64, 64);
}

void draw() {
  for (int i = 0; i < 6; i++) {
    background(255);
    strokeWeight(4);
    pushMatrix();

    float r = random(8, 24);
    float x = random(r, width - r);
    float y = random(r, height - r);

    translate(x, y);

    if (i == 0) {
      rotate(random(-0.1, 0.1));
      triangle(-r, -r, r, r, -r, r);
      saveFrame("data/TrianguloRecA###.png");
    } else if (i == 1) {
      rotate(random(-0.1, 0.1));
      triangle(-r, r, r, r, r, -r);
      saveFrame("data/TrianguloRecB###.png");
    }
    //De la misma manera los demas
    popMatrix();
  }
  if (frameCount == 100) {
    exit();
  }
}
```

---

## 2. Entrenar el modelo con ml5.js (entrenamiento.js)
El script carga las imágenes generadas, las etiqueta y entrena una red neuronal para clasificación de imágenes:
```java
//Triangulo Rectangulo
let trianguloRecA       = [];
let trianguloRecB       = [];
let trianguloRecC       = [];
let trianguloRecD       = [];

//T-equilatero
let trianguloEquilatero = [];
//T-isósceles
let trianguloIsósceles  = [];

let ShapeClassifier;

function preload() {
    for (let i = 0; i < 100; i++)
    {
        let index = nf((i + 1), 3, 0);
        trianguloRecA[i] = loadImage(`data/TrianguloRecA${index}.png`);
        trianguloRecB[i] = loadImage(`data/TrianguloRecB${index}.png`);
        trianguloRecC[i] = loadImage(`data/TrianguloRecC${index}.png`);
        trianguloRecD[i] = loadImage(`data/TrianguloRecD${index}.png`);

        trianguloEquilatero[i] = loadImage(`data/TrianguloEquilatero${index}.png`);
        trianguloIsósceles [i] = loadImage(`data/TrianguloIsósceles${index}.png`);
    }
}

function setup()
{
    let clasificadorT = 
    {
        inputs: [64,64, 4],
        task  : 'imageClassification',
        debug : true
    };

    ShapeClassifier = ml5.neuralNetwork(clasificadorT);

    for(let i = 0;i < 100; i++)
    {
        ShapeClassifier.addData({ image: trianguloRecA[i] },{ label: "trianguloRecA" });
        ShapeClassifier.addData({ image: trianguloRecB[i] },{ label: "trianguloRecB" });
        ShapeClassifier.addData({ image: trianguloRecC[i] },{ label: "trianguloRecC" });
        ShapeClassifier.addData({ image: trianguloRecD[i] },{ label: "trianguloRecD" });

        ShapeClassifier.addData({ image: trianguloEquilatero[i] }, { label: "trianguloEquilatero" });
        ShapeClassifier.addData({ image: trianguloIsósceles [i] }, { label: "trianguloIsósceles"  });
    }

    ShapeClassifier.normalizeData();
    ShapeClassifier.train({ epochs: 50 }, finishedTraining);
}

function finishedTraining()
{
    console.log("Entrenamiento finalizado.");
    ShapeClassifier.save();
}
```

---

## 3. Clasificación en tiempo real (DeteccionT.js)
Este script carga el modelo entrenado y permite dibujar triángulos en un canvas, luego clasifica lo dibujado y muestra el resultado y la confianza:
```java
let ShapeClassifier
let canvas
let resulDiv
let confDiv
let inputImage
let clearButton
let img
let color
let rutaImagen
let figuraDiv

function setup()
{
    

    canvas = createCanvas(400,400);
    background(255);

    let clasificadorT =
    {
        inputs:  [64, 64, 4],
        task: 'imageClassification'
    };

    ShapeClassifier = ml5.neuralNetwork(clasificadorT);

    const modelDetails =
    {
           model:  'models/model.json',
        metadata:  'models/model_meta.json',
         weights:  'models/model.weights.bin'
    }

    clearButton =  createButton("limpiar")
    clearButton.mousePressed(() =>
    {
        background(255)
    });

    resulDiv = select('#result');

    confDiv = createDiv("Confianza");

    inputImage = createGraphics(64, 64);

    ShapeClassifier.load(modelDetails, cargandoModels)

    
}

function cargandoModels()
{
    console.log("Modelo cargado");
    clasificandoImg();
}

function clasificandoImg(){
    inputImage.copy(canvas, 0, 0, 400, 400, 0, 0, 64, 64)
    ShapeClassifier.classify({ image: inputImage }, gotResults)
}

function gotResults(err, result)
{
    if (err){
        console.log(err)
        return;
    }

    let etiqueta  = result[0].label
    let confianza = result[0].confidence * 100;
    confianza = confianza.toFixed(2);

    resulDiv.html(etiqueta)
    
    if (confianza >= 80) {
        color = 'green';
    } else if (confianza >= 50) {
        color = 'orange';
    } else {
        color = 'red';
    }

    confDiv.html("<h1 style='color:" + color + "'>Confiable: " + confianza + "%<h1/>")
    confDiv.style('font-family','Courier New')
    

    if (etiqueta !== "") {
    figuraDiv = select('#figura');
    rutaImagen = 'img/' + etiqueta + '.png';

    figuraDiv.html(''); // limpio imagen anterior

    img = createImg(rutaImagen, etiqueta);
    img.size(100, 100);
    img.style('border', '2px solid ' + color);
    figuraDiv.child(img);
    }


    clasificandoImg();
}

function draw()
{
    if(mouseIsPressed)
    {
        strokeWeight(8);
        line(mouseX, mouseY, pmouseX, pmouseY)
    }
}
```

### Instrucciones para correr el proyecto

1. Genera las imágenes con Processing ejecutando el sketch; esto creará la carpeta data con las imágenes.
2. Ejecuta la página entrenamiento.html con el script entrenamiento.js para entrenar el modelo y guardarlo.
3. Crea una carpeta llamada models y guarda allí los archivos resultantes del entrenamiento.
4. Usa la página DeteccionT.html junto con DeteccionT.js para clasificar triángulos dibujados en tiempo real.
5. Asegúrate de mover o copiar la carpeta data generada por Processing al lugar adecuado dentro del proyecto para que el entrenamiento pueda acceder a las imágenes.

### Autor:
# Juan Fabian Trucios Quispe