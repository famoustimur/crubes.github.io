class LanguageJS {
    constructor(language = 'en-EN') {
        this.language = language;
        this.locale = {};
    }
    init() {
        $.ajax({
            'url': `locale/${this.language}.json`,
            'dataType': `json`,
            'async': true,
            'method': `GET`,
            'success': (res) => {
                this.locale = res;
            },
        }).done((res) => {
            for (var i = 0; i < $('[locale]').length; i++) {
                $($('[locale]')[i]).text(this.locale[$($('[locale]')[i]).attr('locale')]);
            }
        });
    }
    change_language(language = 'en-EN') {
        this.language = language;
        this.init();
    }
    get(locale_name = null) {
        this.locale_name = locale_name;
        if(locale_name == null){
            return this.locale;
        }
        return this.locale[this.locale_name];
    }
}