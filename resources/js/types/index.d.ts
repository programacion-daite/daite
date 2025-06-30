import type { Config } from 'ziggy-js';

import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    programa?: string;
    
    userModules: Modulo[];
    userPrograms: {
        registros: { [key: string]: Programa[] };
        procesos: { [key: string]: Programa[] };
        reportes: { [key: string]: Programa[] };
        favoritos: Programa[];
        genericos: string[];
    };
    companyData: {
        compania: string;
        pagina: string;
        correo: string;
        rnc: string;
        logo: string;
        tiempo_sesion: string;
        id_sucursal: string;
        usuario: string;
        direccion: string;
        telefono: string;
        telefono_secundario: string;
        visualizar_sucursales: string;
        tipo_calculo_predeterminado: string;
    };
    applicationRoutes: string[];
    userGlobalConfig: UserConfigItem[];
    
    [key: string]: unknown;
}

export interface User {
    id_usuario: number;
    usuario: string;
    email: string;
    pin: string;
    [key: string]: unknown;
}

// Configuraciones dinámicas del usuario (formato del servidor)
export interface UserConfigItem {
    campo: string;
    valor: string;
}

// Configuraciones globales del usuario
export interface UserGlobalConfig extends Record<string, string | number | boolean | undefined> {
    modalidad_db?: string;
    mensaje_guardar?: string;
    fecha_inicio_datos?: string;
    tipo_calculo_defecto?: string;
    cliente_daite?: string;
    correos_enviar_copias_seguimientos?: string;
    abrir_desglose_efectivo?: string;
    ancho_boton?: string;
    altura_boton?: string;
    color_boton?: string;
    color_texto_boton?: string;
    cantidad_registros_mostrar_busqueda_selector?: string;
    cantidad_registros_visible_selector?: string;
    nombre_db?: string;
    dns_db?: string;
}

export interface sidebarItem {
    id_programa: number
    referencia: string
    id_modulo: number
    modulo: string
    tipo_programa: string
    programa: string
    descripcion: string
    icono: string
    orden_menu: number
    generico: boolean
    exclusivo: boolean
    administracion: boolean
    visible: boolean
    aplicacion_movil: boolean
    favorito: number
}

export interface Modulo {
    id_modulo: string;
    modulo: string;
    referencia: string;
}

export interface SessionData {
    usuario: User;
    modulos: Modulo[];
    programas: {
        registros: { [key: string]: Programa[] };
        procesos: {  [key: string]: Programa[] };
        reportes: {  [key: string]: Programa[] };
        favoritos: { [key: string]: Programa[] };
        genericos: { [key: string]: Programa[] };
    };
}

export interface Programa {
    id_programa: string;
    programa: string;
    descripcion: string;
    visible: boolean;
    favorito: boolean;
}

export interface ApiErrorData {
    campo_enfocar: string;
    mensaje: string;
}

export interface ApiErrorResponse {
    success: false;
    errorData: ApiErrorData[];
}

export interface ApiSuccessResponse<T> {
    success: true;
    data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
