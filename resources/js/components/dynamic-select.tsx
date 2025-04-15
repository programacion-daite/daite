import { useEffect, useState } from "react";
import DOMPurify from "dompurify";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import axios from "axios";

interface DynamicSelectProps {
  id: string;
  label: string;
  name: string;
  defaultValue?: string;
  parametros?: Record<string, string>;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  withRefresh?: boolean;
  error?: string;
  required?: boolean;
}

export const DynamicSelect = ({
  id,
  label,
  defaultValue = "",
  parametros = {},
  disabled = false,
  onValueChange,
  placeholder = "",
  withRefresh = true,
}: DynamicSelectProps) => {
  const [options, setOptions] = useState<{ valor: string; descripcion: string }[]>([]);
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOptions = async () => {
    setLoading(true);
    setError("");

    try {
      const body = {
        ...parametros
      };

      const response = await axios.post(route('traerFiltros'), body, {
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true,
      });

      if (response.status !== 200) throw new Error("Error al cargar los datos");

      const data = await response.data[0].original

      if (!Array.isArray(data)) {
        throw new Error("La respuesta no es válida");
      }

      // Sanitize and set options
      const sanitized = data.map((registro) => ({
        valor: DOMPurify.sanitize(registro.valor?.toString() || "_empty"),
        descripcion: DOMPurify.sanitize(registro.descripcion?.toString() || ""),
      }));

      setOptions(sanitized);

      // Si hay valor predeterminado
      const predeterminado = sanitized.find((opt) => opt.valor === defaultValue);
      if (predeterminado) {
        setValue(predeterminado.valor);
      }

    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las opciones");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <div className="w-full">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <Select value={value} onValueChange={handleChange} disabled={disabled || loading}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {options.map((opt) => (
                <SelectItem key={opt.valor} value={opt.valor} className="min-h-[2rem] focus:text-white">
                  {opt.descripcion}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {withRefresh && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="bg-primary"
            onClick={fetchOptions}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <RefreshCw className="h-4 w-4 text-white" />}
          </Button>
        )}
      </div>

      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};
