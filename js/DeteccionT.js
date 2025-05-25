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