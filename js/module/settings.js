class SettingsJS {
    constructor() {
        if(!localStorage.getItem('settings')) localStorage.setItem('settings', JSON.stringify({}));
        this.settings = JSON.parse(localStorage.getItem('settings'));
        this.is_saved = true;
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
            this_settings.is_saved = false;
            $(this).parent().children('[settings-key]').removeClass('active');
            $(this).addClass('active');
            $('#settings_save').addClass('shown');
        });
        $('.button#settings_save').on(`click`, function () {
            this_settings.save(
                {
                    speed: Number($('.settings__card-button.active[settings-key="speed"]').attr('settings-value')),
                    lang : $('.settings__card-button.active[settings-key="lang"]').attr('settings-value')
                }
            );
            $('#settings_save').removeClass('shown');

        });
    }
    save(items) {
        if(typeof items != 'object') return;
        for (var i = 0; i < Object.keys(items).length; i++) {
            this.settings[Object.keys(items)[i]] = Object.values(items)[i];
        }
        console.log(items)
        this.is_saved = true;
        // this.temp_settings = {
        //     speed : Number($('.settings__card-button.active[settings-key="speed"]').attr('settings-value')),
        //     lang : $('.settings__card-button.active[settings-key="lang"]').attr('settings-value'),
        // };
        // this.settings = this.temp_settings;
        localStorage.setItem('settings', JSON.stringify(this.settings));
        if(items.speed) gameJS.settings(this.settings);
        if(items.lang) langJS.change_language(this.settings.lang);
    }
    isSaved() {
        return this.is_saved;
    }
    load(settings) {
        console.log(123)
        this.settings = settings;
        localStorage.setItem('settings', JSON.stringify(this.settings));
    }
    get() {
        return this.settings;
    }
}