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