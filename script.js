// Définir le nombre de tables
let numberOfTables = 0;
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

// Variable pour stocker l'état du fichier de configuration
let configFileLoaded = false;

// Fonction pour vérifier si un fichier de configuration est chargé
function checkConfigFile() {
    // Logique pour vérifier l'existence d'un fichier de configuration
    if (!configFileLoaded) {
        document.getElementById('config-modal').style.display = 'block';
    }
}

// // Fonction pour ouvrir un fichier de configuration
// function openConfig() {
//     // Logique pour ouvrir un fichier de configuration
//     console.log("Ouverture du fichier de configuration...");
//     configFileLoaded = true; // Mettre à jour l'état
//     document.getElementById('config-modal').style.display = 'none';
//     numberOfTables = parseInt(document.getElementById('table-count').value) || 4; // Utiliser la valeur saisie
//     initializeTables(); // Afficher les tables après ouverture
// }

// Fonction pour préparer la création d'un nouveau fichier de configuration
function prepareCreateConfig() {
    document.getElementById('table-count-container').style.display = 'block';
    // document.getElementById('open-config-button').style.display = 'none';
    document.getElementById('create-config-file').style.display = 'none'; // Masquer le bouton après le clic
}

// Fonction pour créer un nouveau fichier de configuration
function createConfig() {
    console.log("Création d'un nouveau fichier de configuration...");
    configFileLoaded = true; // Mettre à jour l'état
    document.getElementById('config-modal').style.display = 'none';
    document.getElementById('create-config-file').style.display = 'none'; // Masquer le bouton
    numberOfTables = parseInt(document.getElementById('table-count').value) || 0; // Utiliser la valeur saisie
    initializeTables(); // Afficher les tables après création
}

function renderTables() {
    const container = document.getElementById('tables-container');
    container.innerHTML = ''; // Clear existing tables

    tables.forEach(table => {
        const matchCard = document.createElement('div');
        matchCard.className = 'match-card';
        matchCard.id = `table-${table.id}`;

        const tableInfo = document.createElement('div');
        tableInfo.className = 'table-info';
        tableInfo.innerHTML = `
            <span class="table-badge ">Table #${table.id}</span>
            <span class="category">Tableau: ${table.category || 'N/A'}</span>
            <span class="pool">Poule: ${table.pool || 'N/A'}</span>
        `;
        matchCard.appendChild(tableInfo);

        const playersSection = document.createElement('div');
        playersSection.className = 'players';
        playersSection.innerHTML = `
            <h2>Joueurs</h2>
            <div class="elapsed-time" id="timer-${table.id}">Temps: 0 sec</div>
            <ul id="players-${table.id}">
                ${table.players.map(player => `<li>${player}</li>`).join('')}
            </ul>
        `;
        matchCard.appendChild(playersSection);

        const announcementTime = document.createElement('div');
        announcementTime.className = 'announcement-time';
        announcementTime.textContent = `Annoncé à: ${table.startTime ? new Date(table.startTime).toLocaleTimeString() : 'N/A'}`;
        matchCard.appendChild(announcementTime);

        // Boutons de contrôle du timer
        const controls = document.createElement('div');
        controls.className = 'controls';
        controls.innerHTML = `
            <button onclick="showPlayerModal(${table.id})" id="start-${table.id}" style="display:${table.timer ? 'none' : 'inline-block'};">Démarrer le Timer</button>
            <button id="play-pause-${table.id}" onclick="toggleTimer(${table.id})" style="display:${table.timer ? 'inline-block' : 'none'};">Pause</button>
            <button id="stop-${table.id}" onclick="stopTimer(${table.id})" style="display:${table.timer ? 'inline-block' : 'none'};">Arrêter</button>
        `;
        matchCard.appendChild(controls);

        container.appendChild(matchCard);
    });
}

// Fonction pour afficher la fenêtre modale de saisie des joueurs
function showPlayerModal(tableId) {
    const modal = document.getElementById('player-modal');
    modal.style.display = 'block';
    modal.dataset.tableId = tableId;

    // Masquer la carte de la table en ajoutant une classe
    const tableElement = document.getElementById(`table-${tableId}`);
    if (tableElement) {
        tableElement.classList.add('hidden');
    }

    // Créer dynamiquement des champs de saisie avec des `id` uniques
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h3>Configurer le Match pour la Table ${tableId}</h3>
            <input type="text" id="table-name-${tableId}" placeholder="Tableau (Facultatif)">
            <input type="text" id="pool-name-${tableId}" placeholder="Poule (Facultatif)">
            <div class="switch">
                <input type="checkbox" id="match-type-${tableId}" class="switch-input">
                <label for="match-type-${tableId}" class="switch-label">
                    <span class="switch-slider"></span>
                </label>
            </div>
            <input type="text" id="player1-${tableId}" placeholder="Joueur 1">
            <input type="text" id="player2-${tableId}" placeholder="Joueur 2">
            <button onclick="startTimerWithPlayers()">Commencer</button>
        </div>
    `;
}

// Fonction pour fermer le modal
function closeModal() {
    const modal = document.getElementById('player-modal');
    modal.style.display = 'none'; // Masquer le modal
    modal.innerHTML = ''; // Vider le contenu du modal pour éviter la duplication des `id`

    // Réafficher la carte de la table en retirant la classe
    const tableId = parseInt(modal.dataset.tableId);
    const tableElement = document.getElementById(`table-${tableId}`);
    if (tableElement) {
        tableElement.classList.remove('hidden');
    }
}

// Fonction pour réinitialiser le modal
function resetModal() {
    const modal = document.getElementById('player-modal');
    const tableId = parseInt(modal.dataset.tableId);

    const player1Input = document.getElementById(`player1-${tableId}`);
    if (player1Input) {
        player1Input.value = '';
    }

    const player2Input = document.getElementById(`player2-${tableId}`);
    if (player2Input) {
        player2Input.value = '';
    }

    const tableNameInput = document.getElementById(`table-name-${tableId}`);
    if (tableNameInput) {
        tableNameInput.value = '';
    }

    const poolNameInput = document.getElementById(`pool-name-${tableId}`);
    if (poolNameInput) {
        poolNameInput.value = '';
    }

    const matchTypeCheckbox = document.getElementById(`match-type-${tableId}`);
    if (matchTypeCheckbox) {
        matchTypeCheckbox.checked = false;
    }
}

// Fonction pour démarrer le timer avec les nouvelles options
function startTimerWithPlayers() {
    const modal = document.getElementById('player-modal');
    const tableId = parseInt(modal.dataset.tableId);
    const player1 = document.getElementById(`player1-${tableId}`).value.trim();
    const player2 = document.getElementById(`player2-${tableId}`).value.trim();
    const matchType = document.getElementById(`match-type-${tableId}`).checked ? 'double' : 'simple';
    const tableName = document.getElementById(`table-name-${tableId}`).value.trim();
    const poolName = document.getElementById(`pool-name-${tableId}`).value.trim();

    if (!player1 || !player2) {
        alert("Veuillez entrer les noms des joueurs.");
        return;
    }

    const players = matchType === 'double' ? [player1, player2, 'Joueur 3', 'Joueur 4'] : [player1, player2];
    updatePlayers(tableId, players);

    const table = tables.find(t => t.id === tableId);
    if (table) {
        table.category = tableName;
        table.pool = poolName;
    }

    // Mettre à jour l'affichage des informations du tableau et de la poule
    const tableInfoElement = document.querySelector(`#table-${tableId} .table-info`);
    if (tableInfoElement) {
        tableInfoElement.innerHTML = `
            <span class="table-badge ">Table #${table.id}</span>
            <span class="category">Tableau: ${table.category || 'N/A'}</span>
            <span class="pool">Poule: ${table.pool || 'N/A'}</span>
        `;
    }

    const playersElement = document.getElementById(`players-${tableId}`);
    if (playersElement) {
        playersElement.innerHTML = players.map(player => `<li>${player}</li>`).join('');
    }

    startTimer(tableId);
    closeModal();

    const startButton = document.querySelector(`#table-${tableId} button`);
    if (startButton) {
        startButton.style.display = 'none';
    }

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

    const announcementTimeElement = document.querySelector(`#table-${tableId} .announcement-time`);
    if (announcementTimeElement) {
        announcementTimeElement.textContent = `Annoncé à: ${startTimeFormatted}`;
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


// Fonction pour arrêter le timer
function stopTimer(tableId) {
    const table = tables.find(t => t.id === tableId);
    if (table.timer) {
        clearInterval(table.timer);
        table.timer = null;
    }
    
    // Réinitialiser les informations de la table
    table.players = [];
    table.startTime = null;
    
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
        playersElement.textContent = `Joueurs: Aucun`;
    }
    
    const startTimeElement = document.getElementById(`start-time-${tableId}`);
    if (startTimeElement) {
        startTimeElement.textContent = `Début: N/A`;
    }
    
    const startButton = document.getElementById(`start-${table.id}`);
    if (startButton) {
        startButton.style.display = 'inline-block';
    }

    // Réinitialiser le modal après l'arrêt du timer
    resetModal();
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
checkConfigFile();

