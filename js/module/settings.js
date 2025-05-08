class SettingsJS {
    constructor() {
        if(!localStorage.getItem('settings')) localStorage.setItem('settings', JSON.stringify({}));
        this.settings = JSON.parse(localStorage.getItem('settings'));
    }
    init () {
        if(this.settings.speed) {
            gameJS.settings({speed : this.settings.speed});
            $(`[settings-key="speed"]`).removeClass('active');
            $(`[settings-key="speed"][settings-value="${this.settings.speed}"]`).addClass('active');
        };
        if(this.settings.lang) {
            langJS.change_language(this.settings.lang);
            $(`[settings-key="lang"]`).removeClass('active');
            $(`[settings-key="lang"][settings-value="${this.settings.lang}"]`).addClass('active');
        }
        var this_settings = this;
        $('[settings-key]').on(`click`, function() {
            $(this).parent().children('[settings-key]').removeClass('active');
            $(this).addClass('active');
            $('#settings_back').removeClass('shown');
            $('#settings_save').addClass('shown');
        });
        $('.button#settings_save').on(`click`, function() {
            var temp_settings = {
                speed : Number($('.settings__card-button.active[settings-key="speed"]').attr('settings-value')),
                lang : $('.settings__card-button.active[settings-key="lang"]').attr('settings-value'),
            };
            this_settings.load(temp_settings);
            $(`section`).removeClass(`shown`);
            $(`section#mainmenu`).addClass(`shown`);
            $('#settings_save').removeClass('shown');
            $('#settings_back').addClass('shown');
            gameJS.settings({speed : Number($('.settings__card-button.active[settings-key="speed"]').attr('settings-value'))});
            langJS.change_language($('.settings__card-button.active[settings-key="lang"]').attr('settings-value'));
        });
    }
    load(settings) {
        this.settings = settings;
        localStorage.setItem('settings', JSON.stringify(this.settings));
    }
}