const TGMA = window.Telegram.WebApp;
if(TGMA.platform != "tdekstop") {
    TGMA.requestFullscreen();
    TGMA.lockOrientation();
    TGMA.disableVerticalSwipes();
}
TGMA.enableClosingConfirmation();

const alreadyLoaded = sessionStorage.getItem('reloaded');
if (!alreadyLoaded) {
  sessionStorage.setItem('reloaded', '1');
  location.reload(true);
}

$(document).ready(function() {
    setTimeout(() => {
        $("section.safe_area").css("padding-top", `${TGMA.safeAreaInset.top+16}px`);
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
        if (!settingsJS.isSaved()) settingsJS.save();
        $(`section`).removeClass(`shown`);
        $(`section#mainmenu`).addClass(`shown`);
        TGMA.BackButton.hide();
        TGMA.BackButton.offClick();
    });
    $(`section`).removeClass(`shown`);
    $(`section#settings`).addClass(`shown`);
});
$('.button#openskins').on(`click`, function() {
    TGMA.BackButton.show();
    TGMA.BackButton.onClick(() => {
        if (!$("#skins_save").hasClass("hiden")) {
            gameJS.settings({skin : $(".skins__card.active").attr('crube-skin')});
            $("#skins_save").addClass("hiden");
        }
        $(`section`).removeClass(`shown`);
        $(`section#mainmenu`).addClass(`shown`);
        TGMA.BackButton.hide();
        TGMA.BackButton.offClick();
    });
    $(`section`).removeClass(`shown`);
    $(`section#skins`).addClass(`shown`);
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