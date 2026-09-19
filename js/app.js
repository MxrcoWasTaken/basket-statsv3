const STORAGE_KEY = "basketStatsGameV2";

let game = {
    quarter: 1,

    homeTeam: {
        name: "CASA",
        players: []
    },

    awayTeam: {
        name: "TRASFERTA",
        players: []
    },

    history: []
};


let selectedPlayerId = null;
let selectedTeamKey = null;

let scoringChoiceType = null;
let specialPointsType = null;

let addPlayerTeamKey = null;

let confirmationAction = null;



/* =========================================================
   PLAYER
   ========================================================= */

function createPlayer(number, name) {

    return {

        id: Date.now() + Math.random(),

        number,
        name,

        onCourt: false,

        stats: {

            minutes: 0,

            points: 0,

            twoPM: 0,
            twoPA: 0,

            threePM: 0,
            threePA: 0,

            ftm: 0,
            fta: 0,

            rebounds: 0,
            assists: 0,
            steals: 0,
            blocks: 0,

            turnovers: 0,
            fouls: 0,

            fastBreakPoints: 0,
            pointsOffTurnover: 0
        }
    };
}



/* =========================================================
   DEFAULT GAME
   ========================================================= */

function createDefaultGame() {

    return {

        quarter: 1,

        homeTeam: {

            name: "CASA",

            players: [
                createPlayer(4, "Rossi"),
                createPlayer(7, "Bianchi"),
                createPlayer(9, "Serra"),
                createPlayer(10, "Conti"),
                createPlayer(12, "Manca")
            ]
        },

        awayTeam: {

            name: "TRASFERTA",

            players: [
                createPlayer(5, "Smith"),
                createPlayer(8, "Brown"),
                createPlayer(11, "Davis"),
                createPlayer(14, "Johnson"),
                createPlayer(23, "Williams")
            ]
        },

        history: []
    };
}



/* =========================================================
   SAVE / LOAD
   ========================================================= */

function saveGame() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(game)
    );

}


function loadGame() {

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if (!saved) {

        game = createDefaultGame();

        saveGame();

        return;
    }


    try {

        game = JSON.parse(saved);

    } catch {

        game = createDefaultGame();

        saveGame();
    }
}



/* =========================================================
   HELPERS
   ========================================================= */

function getTeam(teamKey) {

    return game[teamKey];
}


function getSelectedPlayer() {

    if (
        !selectedPlayerId ||
        !selectedTeamKey
    ) {
        return null;
    }

    return getTeam(
        selectedTeamKey
    ).players.find(
        player =>
            player.id === selectedPlayerId
    );
}


function getTeamScore(teamKey) {

    return getTeam(teamKey)
        .players
        .reduce(
            (sum, player) =>
                sum + player.stats.points,
            0
        );
}



/* =========================================================
   RENDER
   ========================================================= */

function render() {

    document.getElementById(
        "homeTeamName"
    ).value =
        game.homeTeam.name;


    document.getElementById(
        "awayTeamName"
    ).value =
        game.awayTeam.name;


    document.getElementById(
        "quarterDisplay"
    ).textContent =
        game.quarter <= 4
            ? `${game.quarter}°`
            : `OT${game.quarter - 4}`;


    renderTeam(
        "homeTeam",
        "homePlayersBody"
    );


    renderTeam(
        "awayTeam",
        "awayPlayersBody"
    );


    updateScores();
}


function updateScores() {

    const homeScore =
        getTeamScore("homeTeam");

    const awayScore =
        getTeamScore("awayTeam");


    document.getElementById(
        "homeScore"
    ).textContent =
        homeScore;


    document.getElementById(
        "awayScore"
    ).textContent =
        awayScore;


    document.getElementById(
        "scoreHome"
    ).textContent =
        homeScore;


    document.getElementById(
        "scoreAway"
    ).textContent =
        awayScore;


    document.getElementById(
        "scoreHomeName"
    ).textContent =
        game.homeTeam.name;


    document.getElementById(
        "scoreAwayName"
    ).textContent =
        game.awayTeam.name;
}



/* =========================================================
   TABLE
   ========================================================= */

function statCell(value) {

    const td =
        document.createElement("td");

    td.textContent = value;

    return td;
}


function renderTeam(teamKey, bodyId) {
    const team = getTeam(teamKey);
    const body = document.getElementById(bodyId);
    body.innerHTML = "";

    team.players.forEach(player => {
        const tr = document.createElement("tr");

        tr.addEventListener("click", () => selectPlayer(teamKey, player.id));

        const playerCell = document.createElement("td");
        playerCell.className = "player-name-cell";

        const dot = document.createElement("span");
        dot.className = "status-dot";

        if (player.onCourt) {
            dot.classList.add("on-court");
        }

        const number = document.createElement("span");
        number.className = "player-number";
        number.textContent = player.number;

        playerCell.appendChild(dot);
        playerCell.appendChild(number);
        playerCell.append(document.createTextNode(player.name));

        tr.appendChild(playerCell);

        // MIN
        tr.appendChild(statCell(player.stats.minutes));

        // PTS
        tr.appendChild(statCell(player.stats.points));

        // 2P - SOLO CANESTRI REALIZZATI
        tr.appendChild(statCell(player.stats.twoPM));

        // 2PA - TIRI DA 2 TENTATI
        tr.appendChild(statCell(player.stats.twoPA));

        // 3P - SOLO TRIPLE REALIZZATE
        tr.appendChild(statCell(player.stats.threePM));

        // 3PA - TRIPLE TENTATE
        tr.appendChild(statCell(player.stats.threePA));

        // TL - TIRI LIBERI REALIZZATI
        tr.appendChild(statCell(player.stats.ftm));

        // TLA - TIRI LIBERI TENTATI
        tr.appendChild(statCell(player.stats.fta));

        // REB
        tr.appendChild(statCell(player.stats.rebounds));

        // AST
        tr.appendChild(statCell(player.stats.assists));

        // STL
        tr.appendChild(statCell(player.stats.steals));

        // BLK
        tr.appendChild(statCell(player.stats.blocks));

        // TO
        tr.appendChild(statCell(player.stats.turnovers));

        // PF
        tr.appendChild(statCell(player.stats.fouls));

        // CP - PUNTI IN CONTROPIEDE
        tr.appendChild(statCell(player.stats.fastBreakPoints));

        // PPR - PUNTI DA PALLA RECUPERATA
        tr.appendChild(statCell(player.stats.pointsOffTurnover));

        body.appendChild(tr);
    });
}



/* =========================================================
   PLAYER PANEL
   ========================================================= */

function selectPlayer(teamKey, playerId) {

    selectedTeamKey = teamKey;
    selectedPlayerId = playerId;


    const player =
        getSelectedPlayer();

    if (!player) return;


    document.getElementById(
        "selectedPlayerName"
    ).textContent =
        `#${player.number} ${player.name}`;


    document.getElementById(
        "selectedPlayerTeam"
    ).textContent =
        getTeam(teamKey).name;


    document.getElementById(
        "minutesInput"
    ).value =
        player.stats.minutes;


    updatePlayerStatus();


    document.getElementById(
        "playerPanel"
    ).classList.remove("hidden");
}


function updatePlayerStatus() {

    const player =
        getSelectedPlayer();

    if (!player) return;


    const text =
        document.getElementById(
            "playerStatusText"
        );


    const button =
        document.getElementById(
            "togglePlayerStatus"
        );


    const dot =
        document.getElementById(
            "statusDot"
        );


    if (player.onCourt) {

        text.textContent =
            "IN CAMPO";

        button.textContent =
            "ESCI DAL CAMPO";

        dot.classList.add(
            "on-court"
        );

    } else {

        text.textContent =
            "PANCHINA";

        button.textContent =
            "ENTRA IN CAMPO";

        dot.classList.remove(
            "on-court"
        );
    }
}


function toggleStatus() {

    const player =
        getSelectedPlayer();

    if (!player) return;


    saveHistory();

    player.onCourt =
        !player.onCourt;


    saveGame();

    render();

    updatePlayerStatus();
}



/* =========================================================
   MINUTES
   ========================================================= */

function saveMinutes() {

    const player =
        getSelectedPlayer();

    if (!player) return;


    let value =
        parseFloat(
            document.getElementById(
                "minutesInput"
            ).value
        );


    if (Number.isNaN(value)) {
        value = 0;
    }


    value =
        Math.max(
            0,
            Math.min(60, value)
        );


    saveHistory();


    player.stats.minutes =
        value;


    saveGame();

    render();

    updatePlayerStatus();
}



/* =========================================================
   HISTORY
   ========================================================= */

function saveHistory() {

    game.history.push(
        JSON.stringify({
            quarter: game.quarter,

            homeTeam: game.homeTeam,
            awayTeam: game.awayTeam,

            history: []
        })
    );


    if (game.history.length > 100) {
        game.history.shift();
    }
}


function undoAction() {

    if (!game.history.length) {
        return;
    }


    const previous =
        game.history.pop();


    const parsed =
        JSON.parse(previous);


    game.quarter =
        parsed.quarter;

    game.homeTeam =
        parsed.homeTeam;

    game.awayTeam =
        parsed.awayTeam;


    saveGame();

    render();
}



/* =========================================================
   STANDARD ACTIONS
   ========================================================= */

function performAction(stat) {

    const player =
        getSelectedPlayer();

    if (!player) return;


    saveHistory();


    switch (stat) {

        case "onePoint":

            player.stats.points += 1;
            player.stats.ftm += 1;
            player.stats.fta += 1;

            break;


        case "missTwo":

            player.stats.twoPA += 1;

            break;


        case "missThree":

            player.stats.threePA += 1;

            break;


        case "missFT":

            player.stats.fta += 1;

            break;


        case "rebounds":

            player.stats.rebounds += 1;

            break;


        case "assists":

            player.stats.assists += 1;

            break;


        case "steals":

            player.stats.steals += 1;

            break;


        case "blocks":

            player.stats.blocks += 1;

            break;


        case "turnovers":

            player.stats.turnovers += 1;

            break;


        case "fouls":

            player.stats.fouls += 1;

            break;
    }


    saveGame();

    render();
}



/* =========================================================
   +2 / +3
   ========================================================= */

function registerTwoPoint() {

    scoringChoiceType = "two";

    openScoringChoice("+2");
}


function registerThreePoint() {

    scoringChoiceType = "three";

    openScoringChoice("+3");
}


function openScoringChoice(title) {

    document.getElementById(
        "scoringChoiceTitle"
    ).textContent = title;


    document.getElementById(
        "scoringChoiceOverlay"
    ).classList.remove("hidden");
}


function closeScoringChoice() {

    scoringChoiceType = null;

    document.getElementById(
        "scoringChoiceOverlay"
    ).classList.add("hidden");
}


function confirmScoring(type) {

    const player =
        getSelectedPlayer();

    if (!player) {

        closeScoringChoice();

        return;
    }


    const points =
        scoringChoiceType === "two"
            ? 2
            : 3;


    saveHistory();


    if (scoringChoiceType === "two") {

        player.stats.twoPM++;
        player.stats.twoPA++;

    } else {

        player.stats.threePM++;
        player.stats.threePA++;
    }


    player.stats.points += points;


    if (type === "fastBreak") {

        player.stats.fastBreakPoints +=
            points;
    }


    if (type === "turnover") {

        player.stats.pointsOffTurnover +=
            points;
    }


    saveGame();

    render();

    closeScoringChoice();
}



/* =========================================================
   SPECIAL POINTS
   ========================================================= */

function openSpecialPoints(type) {

    specialPointsType = type;


    document.getElementById(
        "specialPointsTitle"
    ).textContent =
        type === "fastBreak"
            ? "CONTROPIEDE"
            : "PALLA RECUPERATA";


    document.getElementById(
        "specialPointsOverlay"
    ).classList.remove("hidden");
}


function closeSpecialPoints() {

    specialPointsType = null;

    document.getElementById(
        "specialPointsOverlay"
    ).classList.add("hidden");
}


function confirmSpecialPoints(points) {

    const player =
        getSelectedPlayer();

    if (!player) {

        closeSpecialPoints();

        return;
    }


    saveHistory();


    if (
        specialPointsType ===
        "fastBreak"
    ) {

        player.stats.fastBreakPoints +=
            points;

    }


    if (
        specialPointsType ===
        "turnover"
    ) {

        player.stats.pointsOffTurnover +=
            points;

    }


    saveGame();

    render();

    closeSpecialPoints();
}



/* =========================================================
   ADD PLAYER
   ========================================================= */

function openAddPlayerModal(teamKey) {

    addPlayerTeamKey =
        teamKey;


    document.getElementById(
        "modalTeamName"
    ).textContent =
        getTeam(teamKey).name;


    document.getElementById(
        "newPlayerNumber"
    ).value = "";


    document.getElementById(
        "newPlayerName"
    ).value = "";


    document.getElementById(
        "addPlayerModal"
    ).classList.remove("hidden");
}


function closeAddPlayerModal() {

    addPlayerTeamKey = null;

    document.getElementById(
        "addPlayerModal"
    ).classList.add("hidden");
}


function confirmAddPlayer() {

    if (!addPlayerTeamKey) return;


    const number =
        parseInt(
            document.getElementById(
                "newPlayerNumber"
            ).value
        );


    const name =
        document.getElementById(
            "newPlayerName"
        ).value.trim();


    if (
        Number.isNaN(number) ||
        number < 0 ||
        number > 99
    ) {

        return;
    }


    if (!name) {
        return;
    }


    saveHistory();


    getTeam(
        addPlayerTeamKey
    ).players.push(
        createPlayer(
            number,
            name
        )
    );


    saveGame();

    render();

    closeAddPlayerModal();
}



/* =========================================================
   CONFIRMATION MODAL
   ========================================================= */

function openConfirmation(
    title,
    text,
    action
) {

    confirmationAction =
        action;


    document.getElementById(
        "confirmationTitle"
    ).textContent =
        title;


    document.getElementById(
        "confirmationText"
    ).textContent =
        text;


    document.getElementById(
        "confirmationOverlay"
    ).classList.remove("hidden");
}


function closeConfirmation() {

    confirmationAction = null;

    document.getElementById(
        "confirmationOverlay"
    ).classList.add("hidden");
}


function executeConfirmation() {

    if (
        typeof confirmationAction ===
        "function"
    ) {

        const action =
            confirmationAction;

        confirmationAction = null;

        document.getElementById(
            "confirmationOverlay"
        ).classList.add("hidden");


        action();

    } else {

        closeConfirmation();

    }
}



/* =========================================================
   REMOVE PLAYER
   ========================================================= */

function removeSelectedPlayer() {

    const player =
        getSelectedPlayer();

    if (!player) return;


    openConfirmation(

        "ELIMINARE GIOCATORE?",

        `Vuoi eliminare #${player.number} ${player.name} dalla squadra?`,

        () => {

            saveHistory();


            const team =
                getTeam(
                    selectedTeamKey
                );


            team.players =
                team.players.filter(
                    p =>
                        p.id !==
                        selectedPlayerId
                );


            saveGame();

            closePlayerPanel();

            render();
        }
    );
}



/* =========================================================
   CLOSE PLAYER
   ========================================================= */

function closePlayerPanel() {

    selectedPlayerId = null;
    selectedTeamKey = null;


    document.getElementById(
        "playerPanel"
    ).classList.add("hidden");
}



/* =========================================================
   TEAM NAMES
   ========================================================= */

function updateTeamName(
    teamKey,
    value
) {

    const name =
        value.trim();


    if (!name) return;


    game[teamKey].name =
        name.toUpperCase();


    saveGame();

    render();
}



/* =========================================================
   QUARTERS
   ========================================================= */

function nextQuarter() {

    if (game.quarter < 4) {

        game.quarter++;

        saveGame();

        render();

        return;
    }


    openConfirmation(

        "TEMPO SUPPLEMENTARE?",

        "Vuoi iniziare un nuovo periodo supplementare?",

        () => {

            game.quarter++;

            saveGame();

            render();

        }
    );
}


function previousQuarter() {

    if (game.quarter <= 1) {
        return;
    }


    game.quarter--;

    saveGame();

    render();
}



/* =========================================================
   NEW GAME
   ========================================================= */

function newGame() {

    openConfirmation(

        "NUOVA PARTITA?",

        "Tutte le statistiche della partita verranno azzerate.",

        () => {

            game.homeTeam.players
                .forEach(resetPlayer);


            game.awayTeam.players
                .forEach(resetPlayer);


            game.quarter = 1;

            game.history = [];


            closePlayerPanel();

            saveGame();

            render();

        }
    );
}


function resetPlayer(player) {

    player.onCourt = false;


    Object.keys(
        player.stats
    ).forEach(key => {

        player.stats[key] = 0;

    });
}



/* =========================================================
   EVENT LISTENERS
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initialize
);


function initialize() {

    loadGame();

    render();


    /* STATISTICHE */

    document
        .querySelectorAll(".stat-action")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const stat =
                        button.dataset.stat;


                    if (
                        stat ===
                        "twoPoint"
                    ) {

                        registerTwoPoint();

                        return;
                    }


                    if (
                        stat ===
                        "threePoint"
                    ) {

                        registerThreePoint();

                        return;
                    }


                    performAction(stat);
                }
            );

        });


    /* STATUS */

    document.getElementById(
        "togglePlayerStatus"
    ).addEventListener(
        "click",
        toggleStatus
    );


    /* MINUTES */

    document.getElementById(
        "saveMinutes"
    ).addEventListener(
        "click",
        saveMinutes
    );


    /* CLOSE PLAYER */

    document.getElementById(
        "closePlayerPanel"
    ).addEventListener(
        "click",
        closePlayerPanel
    );


    /* CONTROPIEDE */

    document.getElementById(
        "fastBreakButton"
    ).addEventListener(
        "click",
        () =>
            openSpecialPoints(
                "fastBreak"
            )
    );


    /* PALLA RECUPERATA */

    document.getElementById(
        "pointsOffTurnoverButton"
    ).addEventListener(
        "click",
        () =>
            openSpecialPoints(
                "turnover"
            )
    );


    /* ELIMINA */

    document.getElementById(
        "removePlayer"
    ).addEventListener(
        "click",
        removeSelectedPlayer
    );


    /* AGGIUNGI */

    document.getElementById(
        "addHomePlayer"
    ).addEventListener(
        "click",
        () =>
            openAddPlayerModal(
                "homeTeam"
            )
    );


    document.getElementById(
        "addAwayPlayer"
    ).addEventListener(
        "click",
        () =>
            openAddPlayerModal(
                "awayTeam"
            )
    );


    /* ADD MODAL */

    document.getElementById(
        "cancelAddPlayer"
    ).addEventListener(
        "click",
        closeAddPlayerModal
    );


    document.getElementById(
        "confirmAddPlayer"
    ).addEventListener(
        "click",
        confirmAddPlayer
    );


    /* SCORING */

    document.getElementById(
        "normalScoreButton"
    ).addEventListener(
        "click",
        () =>
            confirmScoring("normal")
    );


    document.getElementById(
        "fastBreakScoreButton"
    ).addEventListener(
        "click",
        () =>
            confirmScoring("fastBreak")
    );


    document.getElementById(
        "turnoverScoreButton"
    ).addEventListener(
        "click",
        () =>
            confirmScoring("turnover")
    );


    document.getElementById(
        "cancelScoringChoice"
    ).addEventListener(
        "click",
        closeScoringChoice
    );


    /* SPECIAL POINTS */

    document
        .querySelectorAll(
            "[data-special-points]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const points =
                        parseInt(
                            button.dataset
                                .specialPoints
                        );


                    confirmSpecialPoints(
                        points
                    );

                }
            );

        });


    document.getElementById(
        "cancelSpecialPoints"
    ).addEventListener(
        "click",
        closeSpecialPoints
    );


    /* CONFIRMATION */

    document.getElementById(
        "confirmationCancel"
    ).addEventListener(
        "click",
        closeConfirmation
    );


    document.getElementById(
        "confirmationConfirm"
    ).addEventListener(
        "click",
        executeConfirmation
    );


    /* QUARTERS */

    document.getElementById(
        "nextQuarter"
    ).addEventListener(
        "click",
        nextQuarter
    );


    document.getElementById(
        "previousQuarter"
    ).addEventListener(
        "click",
        previousQuarter
    );


    /* NEW GAME */

    document.getElementById(
        "newGame"
    ).addEventListener(
        "click",
        newGame
    );

    document.getElementById("exportPdf").addEventListener("click", exportPDF);

    /* TEAM NAMES */

    document.getElementById(
        "homeTeamName"
    ).addEventListener(
        "change",
        event =>
            updateTeamName(
                "homeTeam",
                event.target.value
            )
    );


    document.getElementById(
        "awayTeamName"
    ).addEventListener(
        "change",
        event =>
            updateTeamName(
                "awayTeam",
                event.target.value
            )
    );


    /* ESC */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !==
                "Escape"
            ) {
                return;
            }


            closeScoringChoice();
            closeSpecialPoints();
            closeAddPlayerModal();
            closeConfirmation();
            closePlayerPanel();

        }
    );

}

function exportPDF() {
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4"
    });

    const pageWidth = doc.internal.pageSize.getWidth();

    const homeScore = getTeamScore("homeTeam");
    const awayScore = getTeamScore("awayTeam");

    // ================================
    // TITOLO
    // ================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);

    doc.text("BASKET STATS", 14, 15);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    doc.text(
        `Periodo: ${game.quarter <= 4 ? game.quarter + "°" : "OT" + (game.quarter - 4)}`,
        14,
        22
    );

    // ================================
    // PUNTEGGIO
    // ================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);

    const scoreText =
        `${game.homeTeam.name}  ${homeScore}  -  ${awayScore}  ${game.awayTeam.name}`;

    doc.text(scoreText, pageWidth / 2, 15, {
        align: "center"
    });

    // ================================
    // TABELLA
    // ================================

    const headers = [
        "GIOCATORE",
        "MIN",
        "PTS",
        "2P",
        "2PA",
        "3P",
        "3PA",
        "TL",
        "TLA",
        "REB",
        "AST",
        "STL",
        "BLK",
        "TO",
        "PF",
        "CP",
        "PPR"
    ];

    function createRows(teamKey) {
        return getTeam(teamKey).players.map(player => [
            `#${player.number} ${player.name}`,
            player.stats.minutes,
            player.stats.points,
            player.stats.twoPM,
            player.stats.twoPA,
            player.stats.threePM,
            player.stats.threePA,
            player.stats.ftm,
            player.stats.fta,
            player.stats.rebounds,
            player.stats.assists,
            player.stats.steals,
            player.stats.blocks,
            player.stats.turnovers,
            player.stats.fouls,
            player.stats.fastBreakPoints,
            player.stats.pointsOffTurnover
        ]);
    }

    let currentY = 30;

    // ================================
    // CASA
    // ================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    doc.text(
        `${game.homeTeam.name} — ${homeScore} PUNTI`,
        14,
        currentY
    );

    currentY += 4;

    doc.autoTable({
        startY: currentY,
        head: [headers],
        body: createRows("homeTeam"),

        theme: "grid",

        styles: {
            font: "helvetica",
            fontSize: 7,
            cellPadding: 2,
            halign: "center",
            valign: "middle"
        },

        headStyles: {
            fontStyle: "bold",
            halign: "center"
        },

        columnStyles: {
            0: {
                halign: "left",
                cellWidth: 38
            }
        },

        margin: {
            left: 10,
            right: 10
        }
    });

    currentY = doc.lastAutoTable.finalY + 12;

    // ================================
    // TRASFERTA
    // ================================

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);

    doc.text(
        `${game.awayTeam.name} — ${awayScore} PUNTI`,
        14,
        currentY
    );

    currentY += 4;

    doc.autoTable({
        startY: currentY,
        head: [headers],
        body: createRows("awayTeam"),

        theme: "grid",

        styles: {
            font: "helvetica",
            fontSize: 7,
            cellPadding: 2,
            halign: "center",
            valign: "middle"
        },

        headStyles: {
            fontStyle: "bold",
            halign: "center"
        },

        columnStyles: {
            0: {
                halign: "left",
                cellWidth: 38
            }
        },

        margin: {
            left: 10,
            right: 10
        }
    });

    // ================================
    // PIÈ DI PAGINA
    // ================================

    const totalPages = doc.internal.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);

        doc.text(
            `Basket Stats • Pagina ${i} di ${totalPages}`,
            pageWidth / 2,
            202,
            { align: "center" }
        );
    }

    // ================================
    // DOWNLOAD
    // ================================

    const fileName =
        `basket-stats-${game.homeTeam.name}-${game.awayTeam.name}.pdf`
            .replace(/[^a-z0-9\-_. ]/gi, "")
            .replace(/\s+/g, "-");

    doc.save(fileName);
}