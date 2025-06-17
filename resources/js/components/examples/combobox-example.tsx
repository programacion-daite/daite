import { useState } from 'react';
import { CustomCombobox } from '../custom-combobox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ComboboxExample = () => {
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [dependentValue, setDependentValue] = useState<string>('');

    // Ejemplo de procedimiento simple
    const simpleProcedure = {
        name: 'get_paises',
        params: {}
    };

    // Ejemplo de procedimiento con dependencia
    const dependentProcedure = {
        name: 'get_ciudades',
        params: {
            pais_id: dependentValue
        }
    };

    // Ejemplo de procedimiento con parámetros fijos
    const fixedParamsProcedure = {
        name: 'get_estados',
        params: {
            activo: '1',
            tipo: 'general'
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-6">Ejemplos de CustomCombobox</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Ejemplo básico */}
                <Card>
                    <CardHeader>
                        <CardTitle>ComboBox Básico</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CustomCombobox
                            id="paises"
                            name="paises"
                            placeholder="Seleccione un país"
                            searchable={true}
                            procedure={simpleProcedure}
                            onValueChange={(value) => {
                                setSelectedValue(value);
                                console.log('País seleccionado:', value);
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Ejemplo con dependencia */}
                <Card>
                    <CardHeader>
                        <CardTitle>ComboBox con Dependencia</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <CustomCombobox
                                id="paises-dependent"
                                name="paises-dependent"
                                placeholder="Seleccione un país"
                                searchable={true}
                                procedure={simpleProcedure}
                                onValueChange={(value) => {
                                    setDependentValue(value);
                                    console.log('País seleccionado:', value);
                                }}
                            />
                            <CustomCombobox
                                id="ciudades"
                                name="ciudades"
                                placeholder="Seleccione una ciudad"
                                searchable={true}
                                procedure={dependentProcedure}
                                onValueChange={(value) => {
                                    console.log('Ciudad seleccionada:', value);
                                }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Ejemplo con parámetros fijos */}
                <Card>
                    <CardHeader>
                        <CardTitle>ComboBox con Parámetros Fijos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CustomCombobox
                            id="estados"
                            name="estados"
                            placeholder="Seleccione un estado"
                            searchable={true}
                            procedure={fixedParamsProcedure}
                            onValueChange={(value) => {
                                console.log('Estado seleccionado:', value);
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Ejemplo sin búsqueda */}
                <Card>
                    <CardHeader>
                        <CardTitle>ComboBox sin Búsqueda</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CustomCombobox
                            id="estados-no-search"
                            name="estados-no-search"
                            placeholder="Seleccione un estado"
                            searchable={false}
                            procedure={fixedParamsProcedure}
                            onValueChange={(value) => {
                                console.log('Estado seleccionado:', value);
                            }}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Botón para limpiar selecciones */}
            <div className="flex justify-center mt-6">
                <Button
                    onClick={() => {
                        setSelectedValue('');
                        setDependentValue('');
                    }}
                    variant="outline"
                >
                    Limpiar Selecciones
                </Button>
            </div>
        </div>
    );
};
