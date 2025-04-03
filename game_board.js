const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Classe pour gérer les constructions
class Construction {
    constructor(x, y, width, height, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    draw(ctx, offsetX, offsetY) {
        ctx.drawImage(this.image, this.x + offsetX, this.y + offsetY, this.width, this.height);
    }
}

class Immeuble extends Construction {
    constructor(x, y) {
        super(x, y, 100, 100, 'assets/kenney_RPGurbanPack/ICP - No Outline/ICP - No Outline/Buildings/building_medium_blue_b.png');
    }
}

class Usine extends Construction {
    constructor(x, y) {
        super(x, y, 100, 100, 'assets/kenney_RPGurbanPack/ICP - No Outline/ICP - No Outline/Buildings/building_small_brown_b.png');
    }
}

class Chateau extends Construction {
    constructor(x, y) {
        super(x, y, 100, 100, 'assets/kenney_RPGurbanPack/ICP - No Outline/ICP - No Outline/Buildings/water_tower_b.png');
    }
}

class Cafe extends Construction {
    constructor(x, y) {
        super(x, y, 100, 100, 'assets/kenney_RPGurbanPack/ICP - No Outline/ICP - No Outline/Buildings/cafe_b.png');
    }
}

class Player {
    constructor(x, y, width, height, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}

class Maire extends Player {
    constructor(x, y) {
        super(x, y, 100, 125, 'assets/kenney_RPGurbanPack/ICP - No Outline/ICP - No Outline/craftpix-net-516149-city-man-pixel-art-character-sprite-sheets/City_men_2/Walk.png');
    }

    draw(ctx, offsetX, offsetY) {
        const spriteX = 0; // Position X de la première frame
        const spriteY = 0; // Position Y de la première ligne
        const spriteWidth = 100; 
        const spriteHeight = 125;

        ctx.drawImage(this.image, spriteX, spriteY, spriteWidth, spriteHeight, this.x + offsetX, this.y + offsetY, spriteWidth, spriteHeight);
    }

    move(dx, dy, mapStartX, mapStartY, mapWidth, mapHeight) {
        this.x += dx;
        this.y += dy;

        // Limiter le mouvement à l'intérieur de la carte dessinée
        if (this.x < mapStartX) this.x = mapStartX;
        if (this.y < mapStartY) this.y = mapStartY;
        if (this.x + this.width > mapStartX + mapWidth) this.x = mapStartX + mapWidth - this.width;
        if (this.y + this.height > mapStartY + mapHeight) this.y = mapStartY + mapHeight - this.height;
    }
}

// Classe pour gérer la carte
class GameMap {
    constructor(ctx, tilesetSrc, tileWidth, tileHeight) {
        this.ctx = ctx;
        this.tileset = new Image();
        this.tileset.src = tilesetSrc;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.startX = 0; // Position de départ X de la carte
        this.startY = 0; // Position de départ Y de la carte
        this.width = 50 * tileWidth; // Largeur de la carte
        this.height = 25 * tileHeight; // Hauteur de la carte
        this.groundTile = { sx: 16, sy: 16, sWidth: 16, sHeight: 16 };
        this.roadTile = { sx: 135, sy: 260, sWidth: 16, sHeight: 16 };
        this.roadPositions = new Set([
            '6,0', '6,1', '6,2', '6,3', '6,4', '7,4', '8,4', '9,4', '10,4', '11,4', '12,4', '13,4', '14,4', '15,4', '16,4',
            '16,5', '16,6', '16,7', '16,8', '16,9', '16,10', '16,11', '16,12', '16,13', '16,14', '16,15', '16,16', '17,16',
            '18,16', '19,16', '20,16', '21,16', '22,16', '23,16', '24,16', '25,16', '26,16', '27,16', '28,16', '29,16', '30,16',
            '31,16', '32,16', '33,16', '34,16', '35,16', '36,16', '37,16', '38,16', '39,16', '40,16', '16,17', '16,18', '16,19',
            '16,20', '16,21', '16,22', '16,23', '16,24', '16,25', '16,26', '17,8', '18,8', '19,8', '20,8', '21,8', '22,8',
            '23,8', '24,8', '25,8', '26,8', '27,8', '27,9', '27,10', '27,11', '27,12', '27,13', '27,14', '27,15', '27,16',
            '17,4', '18,4', '19,4', '20,4', '21,4', '22,4', '23,4', '24,4', '25,4', '26,4', '27,4', '27,5', '27,6', '27,7',
            '21,5', '21,6', '21,7', '21,8', '21,9', '21,10', '21,11', '21,12', '21,13', '21,14', '21,15', '21,16', '17,14',
            '18,14', '19,14', '20,14', '21,14', '22,14', '23,14', '24,14', '25,14', '26,14', '27,14', '0,20', '1,20', '2,20',
            '3,20', '4,20', '5,20', '6,20', '7,20', '8,20', '9,20', '10,20', '11,20', '12,20', '13,20', '14,20', '15,20', '16,20',
            '17,20', '18,20', '19,20', '20,20', '21,20', '22,20', '23,20', '24,20', '25,20', '26,20', '27,20', '28,20', '29,20','30,20', '31,20', '32,20', '33,20', '34,20', '35,20', '36,20', '37,20', '38,20', '39,20', '38,19', '38,18', '38,17', '38,16', '27,1', '27,0', '27,2', '27,3', '28,10', '29,10', '30,10', '31,10', '32,10', '33,10','34,10','35,10','36,10','37,10','38,10', '39,10','40,10', '32,11', '32,12','32,13','32,14', '32,15', '32,16', '32,17','32,18', '32,19', '32,20', '32,21', '32,22', '32,23', '32,24', '24,24', '24,23', '24,22', '24,21', '24,20', '24,19', '24,18', '24,17', '24,16'
        ]);
    }

    draw(offsetX, offsetY) {
        for (let row = 0; row < 25; row++) {
            for (let col = 0; col < 50; col++) {
                const dx = this.startX + col * this.tileWidth + offsetX;
                const dy = this.startY + row * this.tileHeight + offsetY;
                const isRoad = this.roadPositions.has(`${col},${row}`);

                const tile = isRoad ? this.roadTile : this.groundTile;
                this.ctx.drawImage(this.tileset, tile.sx, tile.sy, tile.sWidth, tile.sHeight, dx, dy, this.tileWidth, this.tileHeight);
            }
        }
    }
}

// Classe pour gérer les points d'action
class ActionPoint {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 11;
    }

    draw(ctx, offsetX, offsetY) {
        ctx.beginPath();
        ctx.arc(this.x + offsetX, this.y + offsetY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 255, 0, 0.7)";
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

// Classe pour gérer les arbres et les usines ajoutés sur la carte
class DynamicObject {
    constructor(x, y, width, height, imageSrc) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    draw(ctx, offsetX, offsetY) {
        ctx.drawImage(this.image, this.x + offsetX, this.y + offsetY, this.width, this.height);
    }
}


let budget = 800;
let pollution = 50; 
let satisfaction = 30;
let greenEnergy = 30;

let currentTurn = 1;
let actionsThisTurn = 0;
const maxActionsPerTurn = 5;
const maxTurns = 5;

// Liste des objets dynamiques (arbres, usines, etc.)
const dynamicObjects = [];

// Fonction pour mettre à jour les indicateurs dans la barre d'outils
function updateIndicators() {
    document.getElementById('budget-indicator').textContent = `💰 Budget: ${budget}€`;
    document.getElementById('pollution-indicator').textContent = `🌫 Pollution: ${pollution}%`;
    document.getElementById('satisfaction-indicator').textContent = `😊 Satisfaction: ${satisfaction}%`;
    document.getElementById('green-energy-indicator').textContent = `⚡ Énergie verte: ${greenEnergy}%`;
}

// Fonction pour afficher une fenêtre d'événement
function showEventWindow(eventName, eventDescription, callback) {
    const eventWindow = document.createElement('div');
    eventWindow.style.position = 'absolute';
    eventWindow.style.top = '50%';
    eventWindow.style.left = '50%';
    eventWindow.style.transform = 'translate(-50%, -50%)';
    eventWindow.style.backgroundColor = 'rgba(0, 172, 112, 0.9)';
    eventWindow.style.border = '2px solid white';
    eventWindow.style.borderRadius = '10px';
    eventWindow.style.padding = '20px';
    eventWindow.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    eventWindow.style.textAlign = 'center';
    eventWindow.style.zIndex = '1000';

    // Ajouter un titre pour l'événement
    const title = document.createElement('h3');
    title.textContent = eventName;
    title.style.color = 'white';
    title.style.marginBottom = '10px';
    eventWindow.appendChild(title);

    // Ajouter une description pour l'événement
    const description = document.createElement('p');
    description.textContent = eventDescription;
    description.style.color = 'white';
    description.style.fontSize = '16px';
    description.style.marginBottom = '20px';
    eventWindow.appendChild(description);

    // Bouton "OK"
    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.margin = '0 10px';
    okButton.style.padding = '10px 20px';
    okButton.style.border = 'none';
    okButton.style.borderRadius = '5px';
    okButton.style.backgroundColor = 'white';
    okButton.style.color = 'rgba(0, 172, 112, 1)';
    okButton.style.cursor = 'pointer';
    okButton.onclick = () => {
        document.body.removeChild(eventWindow);
        if (callback) callback(); // Exécuter le callback après avoir fermé la fenêtre
    };
    eventWindow.appendChild(okButton);

    // Ajouter la fenêtre au document
    document.body.appendChild(eventWindow);
}

// Fonction pour déclencher un événement aléatoire
function triggerRandomEvent() {
    const events = [
        { 
            name: "🌪 Tempête", 
            description: "Une tempête a frappé la ville ! +5% Pollution, -5% Satisfaction.", 
            effect: () => { pollution = Math.min(100, pollution + 5); satisfaction = Math.max(0, satisfaction - 5); } 
        },
        { 
            name: "💡 Innovation verte", 
            description: "Une innovation verte réduit le coût des panneaux solaires de 10% !", 
            effect: () => { /* Effet informatif uniquement */ } 
        },
        { 
            name: "🤝 Mouvement citoyen", 
            description: "Un mouvement citoyen améliore la satisfaction des habitants ! +10% Satisfaction.", 
            effect: () => { satisfaction = Math.min(100, satisfaction + 10); } 
        },
        { 
            name: "📉 Crise économique", 
            description: "Une crise économique réduit votre budget de 200€ !", 
            effect: () => { budget = Math.max(0, budget - 200); } 
        },
        { 
            name: "🔬 Nouvelle technologie", 
            description: "Une nouvelle technologie améliore l'énergie verte ! +5% Énergie verte.", 
            effect: () => { greenEnergy = Math.min(100, greenEnergy + 5); } 
        }
    ];

    const randomEvent = events[Math.floor(Math.random() * events.length)];
    showEventWindow(randomEvent.name, randomEvent.description, randomEvent.effect);
}

// Fonction pour passer au tour suivant
function nextTurn() {
    if (currentTurn >= maxTurns) {
        checkGameEnd();
        return;
    }

    currentTurn++;
    actionsThisTurn = 0;
    budget += 200; 
    triggerRandomEvent();
    updateIndicators();
    alert(`Tour ${currentTurn} commence ! Vous avez gagné 200€.`);
}

// Fonction pour sauvegarder l'état du jeu
function saveGameState() {
    const gameState = {
        budget,
        pollution,
        satisfaction,
        greenEnergy,
        currentTurn,
        actionsThisTurn,
    };
    localStorage.setItem('ecoVilleGameState', JSON.stringify(gameState));
}

// Fonction pour restaurer l'état du jeu
function loadGameState() {
    const savedState = localStorage.getItem('ecoVilleGameState');
    if (savedState) {
        const gameState = JSON.parse(savedState);
        budget = gameState.budget;
        pollution = gameState.pollution;
        satisfaction = gameState.satisfaction;
        greenEnergy = gameState.greenEnergy;
        currentTurn = gameState.currentTurn;
        actionsThisTurn = gameState.actionsThisTurn;
    }
}

// Fonction pour enregistrer le score
function saveScore() {
    const playerName = localStorage.getItem('ecoVillePlayerName') || "Joueur Inconnu";
    const score = Math.max(0, budget + satisfaction * 2 + greenEnergy * 3 - pollution * 2);
    const scores = JSON.parse(localStorage.getItem('ecoVilleScores')) || [];
    scores.push({ name: playerName, score });
    localStorage.setItem('ecoVilleScores', JSON.stringify(scores));
    alert(`Score enregistré : ${playerName} - ${score}`);
}

// Fonction pour vérifier la fin du jeu
function checkGameEnd() {
    if (pollution < 20 && greenEnergy > 60) {
        saveScore();
        alert("Félicitations ! Vous avez gagné en transformant la ville !");
    } else if (satisfaction < 10) {
        saveScore();
        alert("Défaite ! La satisfaction des habitants est trop basse.");
    } else if (currentTurn >= maxTurns) {
        saveScore();
        alert("Défaite ! Vous avez dépassé le nombre maximum de tours.");
    }
    location.reload();
}

// Fonction pour effectuer une action
function performAction(action, x, y) {
    if (actionsThisTurn >= maxActionsPerTurn) {
        alert("Vous avez atteint le nombre maximum d'actions pour ce tour !");
        return;
    }

    switch (action) {
        case 'Planter un arbre':
            if (budget >= 100) {
                budget -= 100;
                pollution = Math.max(0, pollution - 5);
                satisfaction = Math.min(100, satisfaction + 2);
                dynamicObjects.push(new DynamicObject(x - 45, y - 50, 80, 80, 'assets/tree.png')); // Ajuster légèrement la position
                removeActionPoint(x, y); // Supprimer le point d'action
                console.log('Action: Planter un arbre effectuée.');
            } else {
                alert('Pas assez de budget pour planter un arbre.');
            }
            break;

        case 'Construire une usine':
            if (budget >= 500) {
                budget -= 500;
                pollution = Math.min(100, pollution + 20);
                satisfaction = Math.max(0, satisfaction - 5);
                dynamicObjects.push(new DynamicObject(x - 45, y - 50, 80, 80, 'assets/kenney_RPGurbanPack/ICP - No Outline/ICP - No Outline/Buildings/building_medium_blue_a_damaged.png'));
                removeActionPoint(x, y);
                console.log('Action: Usine construite !');
                alert("Jackpot industriel ! (budget: +1000) La planète vous envoie un emoji tiste")
                budget += 1000;
            } else {
                alert('Pas assez de budget pour installer des panneaux solaires.');
            }
            break;

        case 'Créer des espaces verts':
            if (budget >= 200) {
                budget -= 200;
                satisfaction = Math.min(100, satisfaction + 8);
                dynamicObjects.push(new DynamicObject(x - 45, y - 50, 120, 120, 'assets/green_space.png'));
                removeActionPoint(x, y); // Supprimer le point d'action
                console.log('Action: Créer des espaces verts effectuée.');
            } else {
                alert('Pas assez de budget pour créer des espaces verts.');
            }
            break;
        
        case 'Installer des Panneaux Solaires':
            if (budget >= 500) {
                budget -= 500;
                satisfaction = Math.max(0, satisfaction + 3);
                greenEnergy = Math.min(100, greenEnergy + 15);
                dynamicObjects.push(new DynamicObject(x - 45, y - 50, 120, 120, 'assets/panneaux.png'));
                removeActionPoint(x, y);
                console.log('Action: Créer Panneaux effectuée');
            } else {
                alert('Pas assez de budget pour installer des panneaux solaires.')
            }

        default:
            console.log('Action inconnue.');
            break;
    }

    actionsThisTurn++;
    updateIndicators();

    if (actionsThisTurn >= maxActionsPerTurn) {
        alert("Vous avez atteint le nombre maximum d'actions pour ce tour. Passez au tour suivant !");
    }
}

// Fonction pour supprimer un point d'action
function removeActionPoint(x, y) {
    const index = actionPoints.findIndex(point => point.x === x && point.y === y);
    if (index !== -1) {
        actionPoints.splice(index, 1);
    }
}

// Initialisation des objets
const gameMap = new GameMap(ctx, 'assets/kenney_RPGurbanPack/Tilemap/tilemap_packed.png', 25, 25);
const maire = new Maire(20 * 25, 20 * 25);
const constructions = [
    new Usine(440, 230),
    new Chateau(430, 410),
    new Immeuble(560, 240),
    new Immeuble(430, 90),
    new Immeuble(180, 160),
    new Immeuble(180, 360),
    new Immeuble(180, 510),
];
const actionPoints = [
    new ActionPoint(450, 390),
    new ActionPoint(500, 390),
    new ActionPoint(600, 390),
    new ActionPoint(650, 390),
    new ActionPoint(560, 390),
    new ActionPoint(610, 170),
    new ActionPoint(250, 50),
    new ActionPoint(350, 50),
    new ActionPoint(450, 50),
    new ActionPoint(550, 50),
    new ActionPoint(650, 50),
    new ActionPoint(750, 50),
    new ActionPoint(750, 50),


];

// Fonction pour dessiner le jeu
function drawGame() {
    const offsetX = 200;
    const offsetY = 140;
    gameMap.draw(offsetX, offsetY);
    constructions.forEach(construction => construction.draw(ctx, offsetX, offsetY));
    actionPoints.forEach(point => point.draw(ctx, offsetX, offsetY));
    dynamicObjects.forEach(object => object.draw(ctx, offsetX, offsetY)); // Dessiner les objets dynamiques
    maire.draw(ctx, offsetX, offsetY);
}

// Charger les images et dessiner la carte
gameMap.tileset.onload = () => {
    drawGame();
};

// Gérer les déplacements du joueur
document.addEventListener('keydown', function (event) {
    const moveDistance = 10;

    switch (event.key) {
        case 'ArrowUp':
            maire.move(0, -moveDistance, gameMap.startX, gameMap.startY, gameMap.width, gameMap.height);
            break;
        case 'ArrowDown':
            maire.move(0, moveDistance, gameMap.startX, gameMap.startY, gameMap.width, gameMap.height);
            break;
        case 'ArrowLeft':
            maire.move(-moveDistance, 0, gameMap.startX, gameMap.startY, gameMap.width, gameMap.height);
            break;
        case 'ArrowRight':
            maire.move(moveDistance, 0, gameMap.startX, gameMap.startY, gameMap.width, gameMap.height);
            break;
    }

    // Redessiner le jeu après le déplacement
    drawGame();
});

// Gérer l'entrée du joueur dans une zone avec un point d'action à proximité
document.addEventListener('keypress', function (event) {
    if (event.key.toLowerCase() === 'p') {
        const offsetX = 200; // Décalage X pour aligner la carte
        const offsetY = 140; // Décalage Y pour aligner la carte

        let interacted = false;

        actionPoints.forEach(point => {
            const dx = (maire.x + maire.width / 2) - (point.x); 
            const dy = (maire.y + maire.height / 2) - (point.y); 
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < point.radius + 20) {
                if (point.x === 610 && point.y === 170) {
                    showInteractionWindow('Construire une usine', point.x, point.y);
                } else if (point.x === 500 && point.y === 390) {
                    showInteractionWindow('Installer des panneaux solaires', point.x, point.y);
                } else if (point.x === 650 && point.y === 390) {
                    showInteractionWindow('Créer des espaces verts', point.x, point.y);
                } else {
                    showInteractionWindow('Planter un arbre', point.x, point.y);
                }
                interacted = true;
            }
        });

        if (!interacted) {
            alert("Aucun point d'action à proximité !");
        }
    }
});

// Fonction pour afficher une fenêtre d'interaction
function showInteractionWindow(action, x, y) {
    const interactionWindow = document.createElement('div');
    interactionWindow.style.position = 'absolute';
    interactionWindow.style.top = '50%';
    interactionWindow.style.left = '50%';
    interactionWindow.style.transform = 'translate(-50%, -50%)';
    interactionWindow.style.backgroundColor = 'rgba(0, 172, 112, 0.9)';
    interactionWindow.style.border = '2px solid white';
    interactionWindow.style.borderRadius = '10px';
    interactionWindow.style.padding = '20px';
    interactionWindow.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    interactionWindow.style.textAlign = 'center';
    interactionWindow.style.zIndex = '1000';

    // Ajouter un texte descriptif
    const description = document.createElement('p');
    description.textContent = `Voulez-vous effectuer l'action : ${action} ?`;
    description.style.color = 'white';
    description.style.fontSize = '18px';
    description.style.marginBottom = '20px';
    interactionWindow.appendChild(description);

    const yesButton = document.createElement('button');
    yesButton.textContent = 'Oui';
    yesButton.style.margin = '0 10px';
    yesButton.style.padding = '10px 20px';
    yesButton.style.border = 'none';
    yesButton.style.borderRadius = '5px';
    yesButton.style.backgroundColor = 'white';
    yesButton.style.color = 'rgba(0, 172, 112, 1)';
    yesButton.style.cursor = 'pointer';
    yesButton.onclick = () => {
        document.body.removeChild(interactionWindow);
        performAction(action, x, y); // Effectuer l'action et ajouter l'objet dynamique
    };
    interactionWindow.appendChild(yesButton);

    const noButton = document.createElement('button');
    noButton.textContent = 'Non';
    noButton.style.margin = '0 10px';
    noButton.style.padding = '10px 20px';
    noButton.style.border = 'none';
    noButton.style.borderRadius = '5px';
    noButton.style.backgroundColor = 'white';
    noButton.style.color = 'rgba(172, 0, 0, 1)';
    noButton.style.cursor = 'pointer';
    noButton.onclick = () => {
        document.body.removeChild(interactionWindow);
        console.log(`Action "${action}" annulée.`);
    };
    interactionWindow.appendChild(noButton);

    // Ajouter la fenêtre au document
    document.body.appendChild(interactionWindow);
}

// Ajout d'un bouton pour passer au tour suivant
document.addEventListener('DOMContentLoaded', () => {
    const nextTurnButton = document.createElement('button');
    nextTurnButton.textContent = "Passer au tour suivant";
    nextTurnButton.style.position = "absolute";
    nextTurnButton.style.bottom = "-50px";
    nextTurnButton.style.right = "20px";
    nextTurnButton.style.padding = "10px 20px";
    nextTurnButton.style.fontSize = "16px";
    nextTurnButton.style.cursor = "pointer";
    nextTurnButton.onclick = nextTurn;
    document.body.appendChild(nextTurnButton);

    // Initialisation des indicateurs au chargement
    updateIndicators();
});
