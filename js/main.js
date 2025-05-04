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
$('.button#openmenu, .button#settings_back').on(`click`, function() {
    $(`section`).removeClass(`shown`);
    $(`section#mainmenu`).addClass(`shown`);
})
$('.button#opensettings').on(`click`, function() {
    $(`section`).removeClass(`shown`);
    $(`section#settings`).addClass(`shown`);
});
$('.button#openleaderboards').on(`click`, function() {
    dialogJS.show(`Error`, `Leaderboards are not available yet!`);
});
$('.button#share').on(`click`, function() {
    dialogJS.show(`Error`, `Share is not available yet!`);
});
$('.button#settings_save').on(`click`, function() {
    $(`section`).removeClass(`shown`);
    $(`section#mainmenu`).addClass(`shown`);
    $('#settings_save').removeClass('shown');
    $('#settings_back').addClass('shown');
    gameJS.settings({speed : Number($('.settings__card-button.active').attr('settings-value'))})
});
$('[settings-key="speed"]').on(`click`, function() {
    $('[settings-key="speed"]').removeClass('active');
    $(this).addClass('active');
    $('#settings_back').removeClass('shown');
    $('#settings_save').addClass('shown');
});

const platformJS = new PlatformJS();
const gameJS = new GameJS(1500);
const dialogJS = new DialogJS();

var platform = platformJS.get();
var game = gameJS.get();
gameJS.init();
// gameJS.startGame(0);
$('.mainmenu_version').text(`Version: ${platform.version}`);




function start_overlay_countdown(seconds) {
    

}

