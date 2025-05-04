class GameJS {
    constructor(speed = 3000) {
        this.game = {
            level : 1,
            score : 0,
            usage : {
                crube_clicked: false,
                score: {}
            },
            params : {
                crubes : [],
                wallsLeft : 4,
                walls : null,
                actions : {
                    destruct : {},
                    refuge : {}
                },
                speed : speed,
                xp_multiplier : 1,
                motionAllowed : true,
                walls : $('.game_wall')
            }
        };
        this.live_game = {
            levelInterval : 0,
            level : 1,
            score : 0,
            speed : 3000,
            xp_multiplier : 1,
            transition_css : null,
            clicks: [],
            conditions: {
                crube_clicked: false,
                current_line: null,
                current_action: null,
            },
            actions: {
                click_date: null,
                action_date: null
            }
        }
    }
    get() {
        return this.game;
    }
    init() {
        this.game.params.crubes = [];
        this.game.params.crubes.push($('.game__crube')[0]);
        this.game.params.crubes.push($('.game__crube')[2]);
        this.game.params.crubes.push($('.game__crube')[1]);
        this.game.params.crubes.push($('.game__crube')[3]);
        // $('.game__crube').off(`click`);
        // $('.game__crube').on(`click`, function() {
        //     $('.game__crube').removeClass('active');
        //     $(this).addClass('active');
        // });
        var temp_livegame = this.live_game;
        $('.game__crube').on(`click`, function() {
            temp_livegame.conditions.crube_clicked = true;
            temp_livegame.actions.click_date = new Date().getTime();
            $('.game__crube').removeClass('active');
            $(this).addClass('active');
        });
    }
    reset() {
        this.live_game.level = 1;
        this.live_game.score = 0;
        this.live_game.clicks = [];
        $('.game__crube').removeClass('active');
        $('.game__led').removeClass('destruct refuge');
        this.live_game.transition_css = null;
        $('.game__timer-left').removeClass('active');
    }
    settings(settings) {
        if(typeof settings !== 'object') return;
        if(settings.speed && typeof settings.speed == 'number') this.game.params.speed = settings.speed;

    }
    startGame(seconds = 0) {
        this.reset();
        $('.game__stat-level').text(`Score: ${this.live_game.level}`);
        $('.game__stat-score').text(`Score: ${this.live_game.score}`);
        clearInterval(this.live_game.levelInterval);
        this.live_game.speed = this.game.params.speed;
        this.live_game.xp_multiplier = this.game.params.xp_multiplier;
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
                    this.start_level(game.level);
                }
            }, 1000);
        }else{
            this.start_level(this.game.level);
        }
    }
    start_level (level) {
        if(typeof this.live_game.level !== `number`) {
            console.log(`Invalid level`);
            return;
        }
        this.live_game.conditions.current_line = null;
        this.live_game.conditions.current_action = null;
        this.live_game.level = level;
        $('.game__stat-level').text('Level ' + this.live_game.level);
        if (this.live_game.transition_css != null) this.live_game.transition_css.remove();
        this.live_game.transition_css = $(`<style>.game__timer-total,.game__timer-left.active{animation-duration:${this.live_game.speed}ms !important;}</style>`);
        $('head').append(this.live_game.transition_css);
        this.live_game.level_actions_played = 0;
        clearInterval(this.live_game.levelInterval);
        this.live_game.levelInterval = setInterval(() => {
            if(this.live_game.level_actions_played >= 10) {
                game.params.xp_multiplier += 0.1;
                this.live_game.level++;
                this.live_game.level_actions_played = 0;
                this.live_game.speed = this.live_game.speed <= 500 ? 500 : this.live_game.speed - 100;
                this.start_level(this.live_game.level);
                $('.game__led').removeClass('destruct refuge');
                $('.game__timer-left').removeClass('active');
                return;
            }else if(this.live_game.level_actions_played != 0 && this.live_game.conditions.crube_clicked) {
                $('.game__timer-left').addClass('active');
                var temp_add_score = this.live_game.speed - (this.live_game.actions.click_date - this.live_game.actions.action_date);
                this.live_game.clicks.push(temp_add_score);
                this.live_game.score += (Math.floor((temp_add_score / 100) * this.live_game.xp_multiplier));
                $('.game__stat-score').text('Score: ' + this.live_game.score);
            }else {
                $('.game__timer-left').addClass('active');
            }
            this.live_game.conditions.crube_clicked = false;
            if(this.live_game.conditions.current_line != null && this.live_game.conditions.current_action != null) {
                this.init();
                console.log(this.game.params.crubes)
                switch (Object.keys(this.game.params.actions)[this.live_game.conditions.current_action]) {
                    case `destruct`:
                        if($(this.game.params.crubes[this.live_game.conditions.current_line]).hasClass('active')) {
                            this.endGame();
                            console.log(`Game Over`);
                        }
                        break;
                    case `refuge`:
                        if(!$(this.game.params.crubes[this.live_game.conditions.current_line]).hasClass('active')) {
                            this.endGame();
                            console.log(`Game Over`);
                        }
                        break;
                    default:
                        console.log(`Invalid action`);
                }
            }
            // this.live_game.conditions.current_action = Math.floor(Math.random() * (game.params.wallsLeft-1));
            // if(game.params.wallsLeft <= 2) game.params.motionAllowed = false;
            this.live_game.conditions.current_action = Math.floor(Math.random() * (2));
            // console.log(`Current action: ${current_action}`);
            this.start_action(Object.keys(this.game.params.actions)[this.live_game.conditions.current_action]);
            this.live_game.level_actions_played++;
            
        }, this.live_game.speed);
    }
    start_action (action) {
        this.live_game.actions.action_date = new Date().getTime();
        this.line_order = Math.floor(Math.random() * 4);
        if(this.live_game.conditions.current_line == this.line_order) this.line_order = (this.line_order+1) % 4;

        // if($($(`.game__led`)[this.line_order]).hasClass('active')) this.line_order = (this.line_order+1) % 4;
        this.live_game.conditions.current_line = this.line_order;
        $('.game__led').removeClass('destruct refuge');
        $($(`.game__led`)[this.line_order]).addClass('active');
        // $('.game__timer-left').addClass('active');
        // $()
        switch (action) {
            case `destruct`:
                $($(`.game__led`)[this.line_order]).addClass('destruct');
                console.log(`Destruct action`);
                break;
            case `refuge`:
                $($(`.game__led`)[this.line_order]).addClass('refuge');
                console.log(`Refuge action`);
                break;
            case `motion`:
                $($(`.game__led`)[this.line_order]).addClass('motion');
                console.log(`Motion action`);
                break;
            default:
                console.log(`Invalid action`);
        }
    }
    endGame() {
        console.log(`Average reaction time: ${Math.floor(this.live_game.clicks.reduce((a, b) => a + b, 0) / this.live_game.clicks.length)}ms`);
        $('#gameover_text_level').text(`${this.live_game.level}`);
        $('#gameover_text_score').text(`${this.live_game.score}`);
        // $('.game__wall').remove();
        clearInterval(this.live_game.levelInterval);
        $('section').removeClass('shown');
        $('section#gameover').addClass('shown');

    }
}