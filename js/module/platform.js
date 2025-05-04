class PlatformJS {
  constructor() {
    this.platform = {
        version : '0.02.2b',
        name : 'Crubes'
    };
  }

  init() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) return 'windows';
    if (userAgent.includes('mac')) return 'mac';
    if (userAgent.includes('linux')) return 'linux';
    if (userAgent.includes('android')) return 'android';
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios';
    return 'unknown';
  }
  get() {
    return this.platform;
  }
}