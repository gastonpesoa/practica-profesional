import { Juego } from '../modelos/juego'

export class JuegoKinetico extends Juego {

    constructor(nombre?: string, gano?: boolean, jugador?: string) {
        super("Juego Kinético", gano, jugador);
    }

    public verificar() {
        // if (this.numeroIngresado == this.numeroSecreto)
        //     this.gano = true;
        // if (this.gano) {
        //     return true
        // }
        // else {
        //     return false
        // };
        return false
    }

}
