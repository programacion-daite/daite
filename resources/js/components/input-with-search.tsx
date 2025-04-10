// components/InputWithSearch.tsx
import { InputLabel } from '@/components/ui/input-label';
import { ModalBusqueda } from '@/components/search-modal';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from '@headlessui/react';

interface InputWithSearchProps {
    label: string;
    id: string;
    value: string | number;
    displayValue?: string;
    table: string;
    field: string;
    onChange: (value: string | number, item?: any) => void;
    error?: string;
    className?: string;
}

export function InputWithSearch({
    label,
    id,
    value,
    displayValue,
    table,
    field,
    onChange,
    error,
    className
}: InputWithSearchProps) {
    const [description, setDescription] = useState(displayValue || '');

    const handleIdChange = async (newValue: string) => {
        onChange(newValue);

        if (newValue) {
            try {
                const response = await axios.post(
                    route('traerEntidades'),
                    { renglon: table, filtro: 'id', valor: newValue },
                    { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
                );

                if (response.data[0]?.original?.[0]) {
                    const item = response.data[0].original[0];
                    setDescription(item.nombre || item.descripcion);
                    onChange(newValue, item);
                } else {
                    setDescription('');
                }
            } catch (error) {
                console.error('Error:', error);
                setDescription('');
            }
        } else {
            setDescription('');
        }
    };

    const handleSelection = (item: any) => {
        onChange(item.id, item);
        setDescription(item.nombre || item.descripcion);
    };

    return (
        <div className={className}>
            <div className="flex">
                <div className="w-[50px]">
                    <InputLabel
                        label={label}
                        id={id}
                        value={value}
                        onChange={(e) => handleIdChange(e.target.value)}
                        error={error}
                        className="rounded-r-none border-r-0 w-full "
                    />
                </div>
                <div className="flex flex-1">
                    <div className="flex-1">
                        <InputLabel
                        label="&nbsp;" // Para mantener la alineación con el otro input
                        value={description}
                        readOnly
                        className="w-full rounded-l-none bg-gray-50 pointer-events-none"
                    />
                    </div>
                <ModalBusqueda
                    title={label}
                    table={table}
                    field={field}
                    onSelect={handleSelection}
                />
                </div>
            </div>
        </div>
    );
}