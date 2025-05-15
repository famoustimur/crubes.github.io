const TGMA = window.Telegram.WebApp;
TGMA.requestFullscreen();
TGMA.lockOrientation();
TGMA.disableVerticalSwipes();
$(".safe_area").css("padding-top", `${TGMA.safeAreaInset.top+16}px`)
$(document).ready(function() {
    setTimeout(() => {
        $(`section`).removeClass(`shown`);
        $(`section#mainmenu`).addClass(`shown`);
        // $(`section#gameover`).addClass(`shown`);
        // $('.game__overlay').removeClass('active');
    }, 1000);
});
$(`.button#playgame, .button#playagain`).on(`click`, function() {
    gameJS.startGame(0);
    $(`section`).removeClass(`shown`);
    $(`section#game`).addClass(`shown`);
    $('main.device').removeClass('dark');
});
$('.button#openmenu, .button#settings_back').on(`click`, function() {
    $('main.device').removeClass('dark');
    $(`section`).removeClass(`shown`);
    $(`section#mainmenu`).addClass(`shown`);
})
$('.button#opensettings').on(`click`, function() {
    TGMA.BackButton.show();
    TGMA.BackButton.onClick(() => {
        $(`section`).removeClass(`shown`);
        $(`section#mainmenu`).addClass(`shown`);
        TGMA.BackButton.hide();
        TGMA.BackButton.offClick();
    });
    $(`section`).removeClass(`shown`);
    $(`section#settings`).addClass(`shown`);
});
$('.button#openleaderboards').on(`click`, function() {
    dialogJS.show(`Error`, `LeaderboardsAreNotAvailableYet`, true);
});
$('.button#share').on(`click`, function() {
    dialogJS.show(`Error`, `Share is not available yet!`);
});


const platformJS = new PlatformJS();
const gameJS = new GameJS(1500);
const dialogJS = new DialogJS();
const langJS = new LanguageJS("en-EN");
const settingsJS = new SettingsJS();

settingsJS.init();
langJS.init();
platformJS.init();
gameJS.init();

// gameJS.startGame(0);