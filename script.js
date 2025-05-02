$(document).ready(function() {
    game.params.walls = $('.game__wall');
    setTimeout(() => {
        console.log(`Loading...`);
        $(`section`).removeClass(`shown`);
        $(`section#mainmenu`).addClass(`shown`);
    }, 1000);
});
$(`.button#playgame, .button#playagain`).on(`click`, function() {
    startGame(0);
    $(`section`).removeClass(`shown`);
    $(`section#game`).addClass(`shown`);
});
$('.game__block-cube').on(`click`, function() {
    $('.game__block-cube').removeClass('active');
    $(this).addClass('active');
});
$('.button#openmenu').on(`click`, function() {
    $(`section`).removeClass(`shown`);
    $(`section#mainmenu`).addClass(`shown`);
})
$('.button#opensettings').on(`click`, function() {
    dialog(`Error`, `Settings are not available yet!`);
});
$('.button#openleaderboards').on(`click`, function() {
    dialog(`Error`, `Leaderboards are not available yet!`);
});
$('.button#share').on(`click`, function() {
    dialog(`Error`, `Share is not available yet!`);
});

var game = {};
game.level = 1;
game.score = 0;
game.usage = {};
game.params = {
    wallsLeft : 4,
    walls : null,
    actions : {
        destruct : {},
        refuge : {},
        motion : {}
    },
    motionAllowed : true
};

function dialog(title = null, text = null) {
    if(title == null || text == null) return;
    $('.dialog__title').text(title);
    $('.dialog__text').text(text);
    $('.dialog').addClass('active');
    setTimeout(() => {
        $('.dialog').removeClass('active');
    }, 3000);
}

function startGame(seconds = 0) {
    $('.game__wall').remove();
    game.params.walls.appendTo($('#game'));
    $('.game__block-cube').removeClass('active');
    $('.game__block-line').removeClass('active destruct refuge motion');
    $('.game__block-cube').on(`click`, function() {
        $('.game__block-cube').removeClass('active');
        $(this).addClass('active');
    });
    clearInterval(levelInterval);
    game.level = 1;
    game.score = 0;
    game.params.wallsLeft = 4;
    // game.params.destruct.speed = 5000;
    // game.params.refuge.speed = 5000;
    // game.params.motion.speed = 5000;
    game.params.speed = 1500;
    $('.game__overlay').removeClass('active');
    if(seconds > 0) {
        var countdown = seconds;
        $('.game__overlay').addClass('shown');
        $('.game__overlay-text span').text(countdown);
        var countdownInterval = setInterval(function() {
            if (countdown > 0) {
                countdown--;
                $('.game__overlay-text span').text(countdown);
            } else {
                clearInterval(countdownInterval);
                $('.game__overlay').removeClass('shown active');
                start_level(game.level);
            }
        }, 1000);
    }else{
        start_level(game.level);
    }
}
var levelInterval = 0;
function start_level (level) {
    game.usage.current_line = null;
    var current_action = null;
    // var current_line = typeof game.usage.current_line == 'undefined' ? null : game.usage.current_line;
    game.level = level;
    $('.game__stat-level').text('Level ' + game.level);
    $('head').append(`<style>.game__block-line.active::before{transition:width ${game.params.speed}ms, height ${game.params.speed}ms !important;}</style>`);
    var level_action_played = 0;
    if(typeof level !== `number`) {
        console.log(`Invalid level`);
        return;
    }
    clearInterval(levelInterval);
    levelInterval = setInterval(() => {
        if(level_action_played >= 10) {
            level++;
            level_action_played = 0;
            game.params.speed = game.params.speed <= 500 ? 500 : game.params.speed - 100;
            start_level(level);
            $('.game__block-line').removeClass('active destruct refuge motion');
            return;
        }
        if(game.usage.current_line != null || current_action != null) {
            switch (Object.keys(game.params.actions)[current_action]) {
                case `destruct`:
                    if($($(`.game__block-cube`)[game.usage.current_line]).hasClass('active')) {
                        endGame();
                        console.log(`Game Over`);
                    }
                    break;
                case `refuge`:
                    if(!$($(`.game__block-cube`)[game.usage.current_line]).hasClass('active')) {
                        endGame();
                        console.log(`Game Over`);
                    }
                    break;
                case `motion`:
                    if(!$($(`.game__block-cube`)[game.usage.current_line]).hasClass('active')) {
                        $('.game__wall')[game.usage.current_line].remove();
                        game.params.wallsLeft--;
                        if(game.params.wallsLeft <= 0) endGame();
                        console.log(`Game Over`);
                    }
                    break;
                default:
                    console.log(`Invalid action`);
            }
        }
        game.usage.current_action = Math.floor(Math.random() * (game.params.wallsLeft-1));
        if(game.params.wallsLeft <= 2) game.params.motionAllowed = false;
        current_action = Math.floor(Math.random() * (game.params.motionAllowed ? 3 : 2));
        console.log(`Current action: ${current_action}`);
        start_action(Object.keys(game.params.actions)[current_action]);
        level_action_played++;
        
    }, game.params.speed);

}

function start_action (action) {
    console.log('dadad')
    var line_order = Math.floor(Math.random() * game.params.wallsLeft);
    if($($(`.game__block-line`)[line_order]).hasClass('active')) line_order = (line_order+1+Math.floor(Math.random() * (game.params.wallsLeft-1))) % game.params.wallsLeft;
    game.usage.current_line = line_order;
    $('.game__block-line').removeClass('active destruct refuge motion');
    $($(`.game__block-line`)[line_order]).addClass('active');
    $()
    switch (action) {
        case `destruct`:
            $($(`.game__block-line`)[line_order]).addClass('destruct');
            break;
        case `refuge`:
            $($(`.game__block-line`)[line_order]).addClass('refuge');
            console.log(`Refuge action`);
            break;
        case `motion`:
            $($(`.game__block-line`)[line_order]).addClass('motion');
            console.log(`Motion action`);
            break;
        default:
            console.log(`Invalid action`);
    }
}
function start_overlay_countdown(seconds) {
    

}

function endGame() {
    $('.game__wall').remove();
    clearInterval(levelInterval);
    $('section').removeClass('shown');
    $('section#gameover').addClass('shown');
}