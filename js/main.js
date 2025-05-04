$(document).ready(function() {
    setTimeout(() => {
        console.log(`Loading...`);
        $(`section`).removeClass(`shown`);
        $(`section#mainmenu`).addClass(`shown`);
        // $(`section#game`).addClass(`shown`);
        // $('.game__overlay').removeClass('active');
    }, 1000);
});
$(`.button#playgame, .button#playagain`).on(`click`, function() {
    gameJS.startGame(0);
    $(`section`).removeClass(`shown`);
    $(`section#game`).addClass(`shown`);
});
$('.button#openmenu').on(`click`, function() {
    $(`section`).removeClass(`shown`);
    $(`section#mainmenu`).addClass(`shown`);
})
$('.button#opensettings').on(`click`, function() {
    dialogJS.show(`Error`, `Settings are not available yet!`);
});
$('.button#openleaderboards').on(`click`, function() {
    dialogJS.show(`Error`, `Leaderboards are not available yet!`);
});
$('.button#share').on(`click`, function() {
    dialogJS.show(`Error`, `Share is not available yet!`);
});

const platformJS = new PlatformJS();
const gameJS = new GameJS();
const dialogJS = new DialogJS();

var platform = platformJS.get();
var game = gameJS.get();
gameJS.init();
// gameJS.startGame(0);
$('.mainmenu_version').text(`Version: ${platform.version}`);




function start_overlay_countdown(seconds) {
    

}

