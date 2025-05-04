class DialogJS {
    constructor() {
        this.dialog = null;
    }

    show (title = null, text = null) {
        if(title == null || text == null) return;
        this.dialogTitle = title;
        this.dialogContent = text;
        $('.dialog__title').text(this.dialogTitle);
        $('.dialog__text').text(this.dialogContent);
        $('.dialog').addClass('active');
        setTimeout(() => {
            $('.dialog').removeClass('active');
        }, 3000);
    }

}