class DialogJS {
    constructor() {
        this.dialog = null;
    }

    show (title = null, text = null, locale = false) {
        if(title == null || text == null) return;
        this.locale = locale;
        this.dialogTitle = title;
        this.dialogContent = text;
        if(this.locale){
            $('.dialog__title').text(langJS.get(this.dialogTitle));
            $('.dialog__text').text(langJS.get(this.dialogContent));
        }else{
            $('.dialog__title').text(this.dialogTitle);
            $('.dialog__text').text(this.dialogContent);
        }
        $('.dialog').addClass('active');
        setTimeout(() => {
            $('.dialog').removeClass('active');
        }, 3000);
    }

}