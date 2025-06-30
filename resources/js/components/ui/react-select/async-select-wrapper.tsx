import DOMPurify from "dompurify";
import { useState, useEffect } from "react";

import { Label } from "@/components/ui/label";
// components/ui/react-select/AsyncSelectWrapper.tsx
import SelectComponent from "@/components/ui/react-select/select";
import { useUIConfig } from "@/hooks/use-global-config";
import { ApiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { SelectOption } from "@/types/select.d";


type ProcedureParams = Record<string, string | number | ((value: string) => string)>;

type AsyncSelectWrapperProps = {
  procedure: {
    name: string;
    params?: ProcedureParams;
  };
  dependentValue?: string;
  transformResponse?: (item: Record<string, unknown>) => SelectOption;
  label: string;
  id: string;
  required: boolean;
  defaultOptions?: SelectOption[];
} & Omit<React.ComponentProps<typeof SelectComponent>, "options">;

export default function AsyncSelectWrapper({
  defaultOptions = [],
  dependentValue,
  id,
  label,
  procedure,
  required,
  transformResponse,
  ...restProps
}: AsyncSelectWrapperProps) {

const api = ApiClient.getInstance();

  const { defaultSearchResultsMinimum } = useUIConfig();
  const [isSearchable, setIsSearchable] = useState(true);
  const [options, setOptions] = useState<SelectOption[]>(defaultOptions);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar opciones
  const loadOptions = async () => {
    setIsLoading(true);
    try {
      const resolvedParams: Record<string, string> = {};

      if (procedure.params) {
        for (const key in procedure.params) {
          const val = procedure.params[key];
          resolvedParams[key] =
            typeof val === "function" ? val(dependentValue || "") : val.toString();
        }
      }

      const res = await api.post(route('filters.json'), {
        ...resolvedParams,
      });

      const responseData = res.data as Array<{ json: string }>;
      const data = JSON.parse(responseData[0].json) as Array<Record<string, string>>;

      if (data.length < defaultSearchResultsMinimum) {
        setIsSearchable(false);
      }

      const transformedOptions = (data || []).map((item) =>
        transformResponse
          ? transformResponse(item)
          : {
              label: DOMPurify.sanitize(item.descripcion),
              value: item.valor,
            }
      );

      setOptions(transformedOptions);
    } catch (error) {
      console.error(error);
      setOptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar opciones cuando cambie dependentValue
  useEffect(() => {
    loadOptions();
  }, [dependentValue]);

  return (
    <div className="flex flex-col gap-2">

        <Label
        htmlFor={id}
        className={cn(
            "text-sm font-medium",
            required && "after:content-['*'] after:ml-0.5 after:text-red-500"
        )}
        >
            {label}
        </Label>

        <SelectComponent
            isSearchable={isSearchable}
            options={options}
            isLoading={isLoading}
            {...restProps}
        />
    </div>
  );
}
