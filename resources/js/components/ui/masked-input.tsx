import { useMaskito } from "@maskito/react";
import { MaskitoOptions } from "@maskito/core";
import { InputLabel, InputLabelProps } from "@/components/ui/input-label";

// Definimos las máscaras
const masks: Record<string, MaskitoOptions> = {
  cedula: {
    mask: [/\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/],
  },
  telefono: {
    mask: ["(", /\d/, /\d/, /\d/, ") ", /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/],
  },
  fecha: {
    mask: [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/],
  },
  numeros: {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
  },
  dinero: {
    mask: ["$", /\d/, /\d/, /\d/, ".", /\d/, /\d/],
  },
};

interface MaskedInputProps extends Omit<InputLabelProps, "ref" | "onInput"> {
  maskType: keyof typeof masks;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Aseguramos que onChange esté presente
  onInput?: (e: React.ChangeEvent<HTMLInputElement>) => void; // Manejamos el valor en onInput
}

const MaskedInput = ({ maskType, value, onChange, onInput, ...props }: MaskedInputProps) => {
  const inputRef = useMaskito({ options: masks[maskType] });

  return (
    <InputLabel
      {...props}
      ref={inputRef}
      value={value}
      onChange={onChange} // Aseguramos que onChange esté presente
      onInput={onInput}   // Usamos onInput para manejar el valor
    />
  );
};

export default MaskedInput;
