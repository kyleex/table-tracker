// Définir le nombre de tables
let numberOfTables = 4;
let tables = [];

// Initialiser les tables
function initializeTables() {
    tables = [];
    for (let i = 1; i <= numberOfTables; i++) {
        tables.push({
            id: i,
            players: [],
            timer: null,
            startTime: null
        });
    }
    renderTables();
}

// Générer dynamiquement les éléments HTML pour chaque table
function renderTables() {
    const container = document.getElementById('tables-container');
    container.innerHTML = ''; // Clear existing tables

    // Création des sections pour les tables
    const prioritySection = document.createElement('div');
    prioritySection.classList.add('priority-section');

    const priorityTitle = document.createElement('h2');
    priorityTitle.textContent = "Tables Inactives depuis plus de 30 minutes";
    prioritySection.appendChild(priorityTitle);

    const priorityGrid = document.createElement('div');
    priorityGrid.classList.add('table-grid');
    prioritySection.appendChild(priorityGrid);

    const normalGrid = document.createElement('div');
    normalGrid.classList.add('table-grid');

    // Génération des tables
    tables.forEach(table => {
        const tableDiv = document.createElement('div');
        tableDiv.className = 'table';

        // Calcul du temps écoulé en minutes si le timer est arrêté
        const elapsedTime = table.startTime ? Math.floor((Date.now() - table.startTime) / 60000) : 0;

        // Si plus de 30 minutes d'inactivité, la table est marquée comme inactive
        if (!table.timer && elapsedTime > 30) {
            tableDiv.classList.add('inactive');
            tableDiv.innerHTML = `
                <h2>Table ${table.id}</h2>
                <div id="players-${table.id}">Joueurs: ${table.players.length ? table.players.join(', ') : 'Aucun'}</div>
                <div id="start-time-${table.id}">Début: ${table.startTime ? new Date(table.startTime).toLocaleTimeString() : 'N/A'}</div>
                <div id="timer-${table.id}" class="timer">Inactif depuis ${elapsedTime} min</div>
                <button onclick="showPlayerModal(${table.id})" id="start-${table.id}" style="display:${table.timer ? 'inline-block' : 'none'};">Démarrer le Timer</button>
            `;
            priorityGrid.appendChild(tableDiv);
        } else {
            // Pour les tables actives ou inactives depuis moins de 30 minutes
            tableDiv.classList.add(table.timer ? 'active' : 'inactive');
            tableDiv.id = `table-${table.id}`;
            tableDiv.innerHTML = `
                <h2>Table ${table.id}</h2>
                <div id="players-${table.id}">Joueurs: ${table.players.length ? table.players.join(', ') : 'Aucun'}</div>
                <div id="start-time-${table.id}">Début: ${table.startTime ? new Date(table.startTime).toLocaleTimeString() : 'N/A'}</div>
                <div id="timer-${table.id}" class="timer">Temps: ${elapsedTime} min</div>
                <button onclick="showPlayerModal(${table.id})" id="start-${table.id}" style="display:${table.timer ? 'none' : 'inline-block'};">Démarrer le Timer</button>
                <button id="play-pause-${table.id}" onclick="toggleTimer(${table.id})" style="display:${table.timer ? 'inline-block' : 'none'};">Pause</button>
                <button id="stop-${table.id}" onclick="stopTimer(${table.id})" style="display:${table.timer ? 'inline-block' : 'none'};">Arrêter</button>
            `;
            normalGrid.appendChild(tableDiv);
        }
    });

    // Ajout des sections au container principal
    if (priorityGrid.children.length > 0) {
        container.appendChild(prioritySection);
    }
    container.appendChild(normalGrid);
}

// Fonction pour afficher la fenêtre modale de saisie des joueurs
function showPlayerModal(tableId) {
    const modal = document.getElementById('player-modal');
    modal.style.display = 'block'; // Afficher le modal
    modal.dataset.tableId = tableId; // Stocker l'ID de la table dans le modal
}

// Fonction pour fermer le modal
function closeModal() {
    const modal = document.getElementById('player-modal');
    modal.style.display = 'none'; // Masquer le modal
}

// Fonction pour démarrer le timer avec les nouvelles options
function startTimerWithPlayers() {
    const modal = document.getElementById('player-modal');
    const tableId = parseInt(modal.dataset.tableId);
    const player1 = document.getElementById('player1').value.trim();
    const player2 = document.getElementById('player2').value.trim();
    const matchType = document.getElementById('match-type').checked ? 'double' : 'simple';
    const tableName = document.getElementById('table-name').value.trim();
    const poolName = document.getElementById('pool-name').value.trim();

    if (!player1 || !player2) {
        alert("Veuillez entrer les noms des joueurs.");
        return;
    }

    const players = matchType === 'double' ? [player1, player2, 'Joueur 3', 'Joueur 4'] : [player1, player2];
    updatePlayers(tableId, players);

    // Vérifiez que l'élément existe avant de le manipuler
    const playersElement = document.getElementById(`players-${tableId}`);
    if (playersElement) {
        playersElement.textContent = `Joueurs: ${players.join(', ')}`;
    }

    startTimer(tableId);
    closeModal();

    // Masquer le bouton "Démarrer le Timer" après le démarrage
    const startButton = document.querySelector(`#table-${tableId} button`);
    if (startButton) {
        startButton.style.display = 'none';
    }

    // Afficher les boutons de contrôle après le démarrage
    const playPauseButton = document.getElementById(`play-pause-${tableId}`);
    if (playPauseButton) {
        playPauseButton.style.display = 'inline-block';
    }
    const stopButton = document.getElementById(`stop-${tableId}`);
    if (stopButton) {
        stopButton.style.display = 'inline-block';
    }
}

// Fonction pour démarrer le timer
function startTimer(tableId) {
    const table = tables.find(t => t.id === tableId);
    if (table.timer) {
        clearInterval(table.timer);
    }
    table.startTime = table.startTime || Date.now();
    const startTimeFormatted = new Date(table.startTime).toLocaleTimeString();
    table.timer = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - table.startTime) / 1000);
        const timerElement = document.getElementById(`timer-${tableId}`);
        if (timerElement) {
            timerElement.textContent = `Temps: ${elapsedTime} sec`;
        }
    }, 1000);
    const tableElement = document.getElementById(`table-${tableId}`);
    if (tableElement) {
        tableElement.classList.add('active');
        tableElement.classList.remove('inactive');
    }
    const startTimeElement = document.getElementById(`start-time-${tableId}`);
    if (startTimeElement) {
        startTimeElement.textContent = `Début: ${startTimeFormatted}`;
    }
}

// Fonction pour démarrer ou mettre en pause le timer
function toggleTimer(tableId) {
    const table = tables.find(t => t.id === tableId);
    if (table.timer) {
        // Si le timer est actif, le mettre en pause
        clearInterval(table.timer);
        table.timer = null;
        table.pausedTime = Date.now();
        document.getElementById(`play-pause-${tableId}`).textContent = 'Lecture';
    } else {
        // Si le timer est en pause, le redémarrer
        const pausedDuration = Date.now() - table.pausedTime;
        table.startTime += pausedDuration; // Ajuster le temps de début pour compenser la pause
        startTimer(tableId);
        document.getElementById(`play-pause-${tableId}`).textContent = 'Pause';
    }
}

function stopTimer(tableId) {
    const table = tables.find(t => t.id === tableId);
    if (table.timer) {
        clearInterval(table.timer);
        table.timer = null;
    }
    
    const timerElement = document.getElementById(`timer-${tableId}`);
    if (timerElement) {
        timerElement.textContent = `Temps: 0 sec`;
    }
    
    const tableElement = document.getElementById(`table-${tableId}`);
    if (tableElement) {
        tableElement.classList.remove('active');
        tableElement.classList.add('inactive');
    }
    
    const playPauseButton = document.getElementById(`play-pause-${tableId}`);
    if (playPauseButton) {
        playPauseButton.style.display = 'none';
    }
    
    const stopButton = document.getElementById(`stop-${tableId}`);
    if (stopButton) {
        stopButton.style.display = 'none';
    }
    
    const playersElement = document.getElementById(`players-${tableId}`);
    if (playersElement) {
        playersElement.textContent = `Joueurs: ${table.players.length ? table.players.join(', ') : 'Aucun'}`;
    }
    
    const startTimeElement = document.getElementById(`start-time-${tableId}`);
    if (startTimeElement) {
        startTimeElement.textContent = `Début: ${table.startTime ? new Date(table.startTime).toLocaleTimeString() : 'N/A'}`;
    }
    
    const startButton = document.getElementById(`start-${table.id}`);
    if (startButton) {
        startButton.style.display = 'inline-block';
    }
}

// Fonction pour mettre à jour les joueurs d'une table
function updatePlayers(tableId, players) {
    const table = tables.find(t => t.id === tableId);
    if (table) {
        table.players = players;
    }
}

// Fonction pour réinitialiser toutes les tables
function resetAllTables() {
    tables.forEach(table => stopTimer(table.id));
    initializeTables();
}

// Ajouter la fenêtre modale au HTML avec les nouvelles options
document.body.innerHTML += `
    <div id="player-modal" class="modal">
        <span class="close" onclick="closeModal()">&times;</span>
        <h3>Configurer le Match</h3>
        <input type="text" id="table-name" placeholder="Tableau (Facultatif)">
        <input type="text" id="pool-name" placeholder="Poule (Facultatif)">
        <div class="switch">
            <input type="checkbox" id="match-type">
            <span class="slider"></span>
            <span class="switch-label">Double</span>
        </div>
        <input type="text" id="player1" placeholder="Joueur 1">
        <input type="text" id="player2" placeholder="Joueur 2">
        <button onclick="startTimerWithPlayers()">Commencer</button>
    </div>
`;

// Ajouter les contrôles pour le nombre de tables et le reset
document.body.innerHTML += `
    <div class="control-buttons">
        <button onclick="changeNumberOfTables()">Changer le nombre de tables</button>
        <button onclick="resetAllTables()">Réinitialiser toutes les tables</button>
    </div>
`;

// Fonction pour changer le nombre de tables
function changeNumberOfTables() {
    const newNumber = prompt("Entrez le nombre de tables à surveiller:", numberOfTables);
    if (newNumber !== null && !isNaN(newNumber) && newNumber > 0) {
        numberOfTables = parseInt(newNumber);
        initializeTables();
    }
}

// Initialiser l'application
initializeTables();