/* Clase Jugador */

export default class Jugador {
    constructor(mail,password, avatar = '', puntuacion = 0) {
        this._mail = mail
        this._password = password
        this._avatar = avatar
        this._puntuacion = puntuacion
    }

    get mail() {
        return this._mail;
    }
    
    set mail(newMail) {
        this._mail = newMail;
    }
}
