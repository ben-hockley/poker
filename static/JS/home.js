document.getElementById("play-link").addEventListener("click", loadGame);
document.getElementById("leaderboard-link").addEventListener("click", loadLeaderboard);
document.getElementById("instructions-link").addEventListener("click", loadInstructions);

function loadGame(){
    window.location.href = "/play-poker"
};
function loadLeaderboard(){
    window.location.href = "/leaderboard"
};
function loadInstructions(){
    window.location.href = "/instructions"
};