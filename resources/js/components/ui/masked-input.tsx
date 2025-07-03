import { MaskitoOptions } from "@maskito/core";
import {maskitoNumberOptionsGenerator} from '@maskito/kit';
import { useMaskito } from "@maskito/react";

import { InputLabel, InputLabelProps } from "@/components/ui/input-label";

// Definimos las máscaras
const masks: Record<string, MaskitoOptions> = {
  cedula: {
    mask: [/\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/],
  },
  dinero: maskitoNumberOptionsGenerator({
    decimalSeparator: '.',
    precision: 2,
    prefix: '',
    thousandSeparator: ',',
  }),
  fecha: {
    mask: [/\d/, /\d/, "/", /\d/, /\d/, "/", /\d/, /\d/, /\d/, /\d/],
  },
  numeros: {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
  },
  telefono: {
    mask: ["(", /\d/, /\d/, /\d/, ") ", /\d/, /\d/, /\d/ , /\d/, "-", /\d/, /\d/, /\d/, /\d/],
  },
};

interface MaskedInputProps extends Omit<InputLabelProps, "ref"> {
  maskType: keyof typeof masks;
}

const MaskedInput = ({ maskType, ...props }: MaskedInputProps) => {
  const inputRef = useMaskito({ options: masks[maskType] });
  return (
    <InputLabel
      {...props}
      ref={inputRef}
    />
  );
};

export default MaskedInput;
