class PlatformJS {
  constructor() {
    this.platform = {
      version : '0.03b',
      name : 'Crubes'
    };
  }

  init() {
    $('#mainmenu_vers').text(`: ${this.platform.version}`);
  }
  get() {
    return this.platform;
  }
  recieve_update_early () {
    
  }
}