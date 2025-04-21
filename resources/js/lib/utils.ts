import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function numericFormat(value: any, decimals = 0) {

    const formatear = (formattedValue : any) => {

      if (!formattedValue)
        formattedValue = 0
      ;

      formattedValue = Number(
        String(formattedValue).replaceAll(',', '')
      );

      return formattedValue.toLocaleString('es-419', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })

    };

    return Array.isArray(value)
      ? value.map((formattedValue) => formatear(formattedValue))
      : formatear(value)

  }

export function pluralize(palabra: string): string {

    // ! Declaración de variables
    let
      palabraPluralizada = null,
      ultimaLetra = null,
      penultimaLetra = null,
      antepenultimaLetra = null,
      trasantepenultimaLetra = null,
      letraAntesY = null,
      letraAntesZ = null;

    // ! Asignando valores
    ultimaLetra = palabra.slice(-1);
    penultimaLetra = palabra.slice(-2);
    antepenultimaLetra = palabra.slice(-3);
    trasantepenultimaLetra = palabra.slice(-4);

    // !
    if (
      ultimaLetra === "a" ||
      ultimaLetra === "e" ||
      ultimaLetra === "i" ||
      ultimaLetra === "o" ||
      ultimaLetra === "u"
    ) {

      // + Asignando valor
      palabraPluralizada = palabra + "s"

    }
    // !
    else if (ultimaLetra === "y") {

      // +
      if (
        penultimaLetra === "ay" ||
        penultimaLetra === "ey" ||
        penultimaLetra === "oy" ||
        penultimaLetra === "uy"
      ) {

        // ? Asignando valor
        palabraPluralizada = palabra + "s"

      }
      // +
      else {

        // ? Asignando valor
        letraAntesY = palabra.slice(0, -1);

        // ? Asignando valor
        palabraPluralizada = letraAntesY + "ies"

      }

    }
    // !
    else if (ultimaLetra === "z") {

      // + Asignando valor
      letraAntesZ = palabra.slice(0, -1);

      // + Asignando valor
      palabraPluralizada = letraAntesZ + "ces"

    }
    // !
    else if (
        ultimaLetra === "n" && (
          antepenultimaLetra === "ión" ||
          trasantepenultimaLetra === "ción"
    )) {

      // + Asignando valor
      palabraPluralizada = palabra

    }
    // !
    else {

      // + Asignando valor
      palabraPluralizada = palabra + "es"

    }

    return palabraPluralizada

}

export function capitalize(texto: string, delimitador: string = ' '): string {
    const palabras = texto.split(delimitador);
    const resultado = palabras.map(palabra =>
      palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()
    );
    return resultado.join(delimitador);
}

