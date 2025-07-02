// Constants
export const ERROR_MESSAGES = {
    DEFAULT_ERROR: 'Ha ocurrido un error',
    FIELD_REQUIRED: 'Este campo es requerido',
    MODAL_NOT_CLOSED: 'Modal not closed because result is open'
} as const;

export const SUCCESS_TITLES = {
    INCOMPLETE_INFO: 'Información incompleta',
    SUCCESS: 'Éxito'
} as const;


export const FIELDS = [
    [
        {
            "campo": "id_especialidad",
            "tipo": "int",
            "longitud": "4",
            "visible": "0",
            "deshabilitado": "0",
            "titulo": " Especialidad",
            "valor": "",
            "ancho": "",
            "selector": "NO",
            "json": "",
            "color": "",
            "alineacion": "left",
            "requerido": "1",
            "comentario": ""
        },
        {
            "campo": "especialidad",
            "tipo": "varchar",
            "longitud": "200",
            "visible": "1",
            "deshabilitado": "0",
            "titulo": " Especialidad",
            "valor": "",
            "ancho": "",
            "selector": "NO",
            "json": "",
            "color": "",
            "alineacion": "left",
            "requerido": "1",
            "comentario": ""
        },
        {
            "campo": "referencia",
            "tipo": "varchar",
            "longitud": "30",
            "visible": "1",
            "deshabilitado": "0",
            "titulo": " Referencia",
            "valor": "",
            "ancho": "",
            "selector": "NO",
            "json": "",
            "color": "",
            "alineacion": "left",
            "requerido": "0",
            "comentario": ""
        }
    ]
]

export const ENCABEZADO = [
      {
        "titulo": " Id_especialidad",
        "columna": "id_especialidad",
        "tipo": "int",
        "columna_primaria": 1,
        "visible": 1,
        "ancho": "",
        "alineacion": "izquierda",
        "negrita": 0,
        "ordenable": 1,
        "buscable": 1,
        "sumar": "filas",
        "agrupar": 0,
        "campo_atributos": ""
      },
      {
        "titulo": " Especialidad",
        "columna": "especialidad",
        "tipo": "varchar",
        "columna_primaria": 0,
        "visible": 1,
        "ancho": "",
        "alineacion": "izquierda",
        "negrita": 0,
        "ordenable": 1,
        "buscable": 1,
        "sumar": "0",
        "agrupar": 0,
        "campo_atributos": ""
      },
      {
        "titulo": " Referencia",
        "columna": "referencia",
        "tipo": "varchar",
        "columna_primaria": 0,
        "visible": 1,
        "ancho": "",
        "alineacion": "izquierda",
        "negrita": 0,
        "ordenable": 1,
        "buscable": 1,
        "sumar": "0",
        "agrupar": 0,
        "campo_atributos": ""
      }
]

export const DATOS = [
      {
        "id_especialidad": 4,
        "especialidad": "cirujano",
        "referencia": "0"
      },
      {
        "id_especialidad": 3,
        "especialidad": "ENFERMERA",
        "referencia": "ENF"
      },
      {
        "id_especialidad": 2,
        "especialidad": "DOCTOR",
        "referencia": "DOC"
      },
      {
        "id_especialidad": 1,
        "especialidad": "MEDICO",
        "referencia": "MED"
      }
]
