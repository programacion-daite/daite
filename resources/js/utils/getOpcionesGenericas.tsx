// utils/getOpcionesGenericas.ts

interface BaseItem {
    [key: string]: string | number;
}

/**
 * Función genérica para obtener opciones de un select en formato `{ value, label }`.
 *
 * @param endpoint - Ruta de la API (ej: "/api/sucursales")
 * @param labelKey - Clave que representa el texto visible (ej: "nombre")
 * @param valueKey - Clave que representa el valor (ej: "id")
 * @param params - Parámetros opcionales para query string
 * @returns Lista de objetos `{ value, label }`
 */
export async function getOpcionesGenericas<T extends BaseItem = BaseItem>(
    endpoint: string,
    labelKey: keyof T,
    valueKey: keyof T,
    params: Record<string, string | number> = {}
): Promise<{ value: string; label: string }[]> {
    try {
        const query = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => ({
                ...acc,
                [key]: String(value)
            }), {})
        ).toString();

        const url = `${endpoint}${query ? `?${query}` : ""}`;

        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Error al obtener datos de ${endpoint}`);
        }

        const data: T[] = await res.json();

        return data.map((item) => ({
            value: String(item[valueKey]),
            label: String(item[labelKey]),
        }));
    } catch (error) {
        console.error("getOpcionesGenericas error:", error);
        return [];
    }
}
