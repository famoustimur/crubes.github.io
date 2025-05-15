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
                current_skin: "default",
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
            current_skin: "default",
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
        this.skins = ["default", "modern", "old", "lunary"];
        this.quotes = ["WellDone","GoodJob","DoNotTouchRed","GreebIsSafe","OnceUponATime","NeedToEndBetaTest","ImagineMuchAnimations","HaveYouLearnedTheGame","AreYouPro","DontYouGetBored","DoYouLikeTheGame","WhatCanBeHereElse","JustAQuote"];
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
        if(settingsJS.get().skin) {
            $(".game__crube").removeClass(this.skins.join(' '));
            $(".game__crube").addClass("crube-"+settingsJS.get().skin);
            $(".skins__card").removeClass('active');
            $(`[crube-skin="${settingsJS.get().skin}"]`).addClass("active");
        }
        $(".skins__card").on(`click`, function() {
            $(".skins__card").removeClass('active');
            $(this).addClass('active');
            $("#skins_save").removeClass('hiden');
        });
        $("#skins_save").on(`click`, function() {
            gameJS.settings({skin : $(".skins__card.active").attr('crube-skin')});
            settingsJS.save({skin: $(".skins__card.active").attr('crube-skin')});
            $(this).addClass('hiden');
        });
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
        if(settings.skin && typeof settings.skin == 'string' && this.skins.includes(settings.skin)) {
            $(".game__crube").removeClass(this.skins.join(' '));
            $(".game__crube").addClass("crube-"+settings.skin);
            this.game.params.current_skin = settings.skin;
            this.live_game.current_skin = settings.skin;
            // var temp_settings = settingsJS.get();
            // temp_settings.skin = $(".skins__card.active").attr('crube-skin');
        }

    }
    show_quote(quote = null) {
        $('.game__timer').addClass('hiden');
        if(quote == null) {
            $('.game__quote').text(langJS.get(this.quotes[(Math.floor(Math.random() * this.quotes.length))]));
        }else{
            $('.game__quote').text(langJS.get(quote));
        }
        $('.game__quote').addClass('shown');
        setTimeout(() => {
            $('.game__timer').removeClass('hiden');
            $('.game__quote').removeClass('shown');
        }, this.live_game.speed);
    }
    startGame(seconds = 0) {
        this.reset();
        $('[game-stat="level"]').text(this.live_game.level);
        $('[game-stat="score"]').text(this.live_game.score);
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
        $('[game-stat="level"]').text(this.live_game.level);
        if (this.live_game.transition_css != null) this.live_game.transition_css.remove();
        this.live_game.transition_css = $(`<style>.game__timer-total,.game__timer-left.active{animation-duration:${this.live_game.speed}ms !important;}</style>`);
        $('head').append(this.live_game.transition_css);
        this.live_game.level_actions_played = 0;
        clearInterval(this.live_game.levelInterval);
        this.live_game.levelInterval = setInterval(() => {
            if(this.live_game.level_actions_played >= 10) {
                this.game.params.xp_multiplier += 0.1;
                this.live_game.level++;
                this.live_game.level_actions_played = 0;
                this.live_game.speed = this.live_game.speed <= 500 ? 500 : this.live_game.speed - 100;
                this.show_quote();
                $('.game__stat-level').addClass('levelup');
                this.start_level(this.live_game.level);
                $('.game__led').removeClass('destruct refuge');
                $('.game__timer-left').removeClass('active');
                return;
            }else if(this.live_game.level_actions_played != 0 && this.live_game.conditions.crube_clicked) {
                $('.game__timer-left').addClass('active');
                var temp_add_score = this.live_game.actions.click_date - this.live_game.actions.action_date;
                this.live_game.clicks.push(temp_add_score);
                this.live_game.score += (Math.floor(((this.live_game.speed - temp_add_score) / 100) * this.live_game.xp_multiplier));
                $('[game-stat="score"]').text(this.live_game.score);
            }else if(this.live_game.level_actions_played == 0) {
                $('.game__stat-level').removeClass('levelup');
                $('.game__timer-left').addClass('active');
            }
            console.log(Math.floor(Math.random() * this.quotes.length))
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
        $('main.device').addClass('dark');
        var temp_average_reaction = Math.floor(this.live_game.clicks.reduce((a, b) => a + b, 0) / this.live_game.clicks.length);
        console.log(`Average reaction time: ${Math.floor(this.live_game.clicks.reduce((a, b) => a + b, 0) / this.live_game.clicks.length)}ms`);
        $('[game-key="level"]').text(`${this.live_game.level}`);
        $('[game-key="score"]').text(`${this.live_game.score}`);
        $('.gameover__card-slider-min, .gameover__card-slider-max').removeClass('hiden');
        if(Math.floor(temp_average_reaction / (this.game.params.speed / 100)) < 10) {
            $('.gameover__card-slider-min').addClass('hiden');
        }
        $('.gameover__card-slider-max').text(`${this.game.params.speed}ms`);
        $('.gameover__card-slider').css('width', `${Math.floor(temp_average_reaction / (this.game.params.speed / 100))}%`);
        if(isNaN(temp_average_reaction)) {
            $('.gameover__card-slider-text').text(`-`);
            $('.gameover__card-slider-min').addClass('hiden');
        }else if(Math.floor(temp_average_reaction / (this.game.params.speed / 100)) < 10) {
            $('.gameover__card-slider-min').addClass('hiden');
        }else if(Math.floor(temp_average_reaction / (this.game.params.speed / 100)) > 80) {
            $('.gameover__card-slider-max').addClass('hiden');
        }
        if(!isNaN(temp_average_reaction)) {
            $('.gameover__card-slider-text').text(`${temp_average_reaction}ms`);
        }
        // $('.game__wall').remove();
        clearInterval(this.live_game.levelInterval);
        $('section').removeClass('shown');
        $('section#gameover').addClass('shown');

    }
}