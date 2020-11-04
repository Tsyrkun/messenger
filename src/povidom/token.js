export default class Token {
  static decode (encodedToken) {
    const base64Url = encodedToken.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }

  static get () {
    return localStorage.getItem('access_token')
  }

  static set (encodedToken) {
    localStorage.setItem('access_token', encodedToken)
  }

  static remove () {
    localStorage.removeItem('access_token')
  }

  static isValid () {
    const token = this.get();
    return !!token // && !this.isExpired(token);
  }

  static getExpirationDate (encodedToken) {
    const token = this.decode(encodedToken);
    const date = new Date(0);

    if (!token.exp) { return null; }

    date.setUTCSeconds(token.exp);

    return date
  }

  static isExpired (encodedToken) {
    const expirationDate = this.getExpirationDate(encodedToken);
    return expirationDate < new Date();
  }

  static getAuthHeaders () {
    return {
      'Authorization': 'Bearer ' + this.get()
    }
  }
}
