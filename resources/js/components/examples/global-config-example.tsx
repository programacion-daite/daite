import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGlobalConfig, useTableConfig, useSearchConfig, useUserConfig } from '@/hooks/use-global-config';

// Ejemplo de uso en un componente de tabla
export const TableWithGlobalConfig = () => {
  const { defaultPageSize, maxPageSize, updateTableConfig } = useTableConfig();
  const { debounceMs, resultsLimit, updateSearchConfig } = useSearchConfig();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tabla con Configuraciones Globales</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Elementos por página</Label>
          <Select 
            value={defaultPageSize.toString()} 
            onValueChange={(value) => updateTableConfig({ defaultTablePageSize: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label>Límite de búsqueda</Label>
          <Input 
            type="number" 
            value={resultsLimit}
            onChange={(e) => updateSearchConfig({ searchResultsLimit: parseInt(e.target.value) })}
            min="5"
            max="100"
          />
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Configuración actual: {defaultPageSize} elementos por página, 
        máximo {maxPageSize} elementos, búsqueda con {debounceMs}ms de debounce
      </p>
    </div>
  );
};

// Ejemplo de uso en un componente de búsqueda
export const SearchWithGlobalConfig = () => {
  const { debounceMs, resultsLimit, updateSearchConfig } = useSearchConfig();
  const { defaultCobrador, updateUserConfig } = useUserConfig();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Búsqueda con Configuraciones</h3>
      
      <div className="space-y-2">
        <Label>Debounce de búsqueda (ms)</Label>
        <Input 
          type="number" 
          value={debounceMs}
          onChange={(e) => updateSearchConfig({ searchDebounceMs: parseInt(e.target.value) })}
          min="100"
          max="1000"
          step="100"
        />
      </div>
      
      <div className="space-y-2">
        <Label>Cobrador por defecto</Label>
        <Input 
          type="number" 
          value={defaultCobrador || ''}
          onChange={(e) => updateUserConfig({ defaultCobrador: parseInt(e.target.value) || undefined })}
          placeholder="ID del cobrador"
        />
      </div>
      
      <p className="text-sm text-muted-foreground">
        Búsqueda configurada con {debounceMs}ms de debounce y {resultsLimit} resultados máximo
      </p>
    </div>
  );
};

// Ejemplo de configuración completa
export const GlobalConfigPanel = () => {
  const { updateConfig, ...config } = useGlobalConfig();

  return (
    <div className="space-y-6 p-6 border rounded-lg">
      <h2 className="text-xl font-bold">Configuraciones Globales</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Configuraciones de Tabla</h3>
          <div className="space-y-2">
            <Label>Elementos por página por defecto</Label>
            <Input 
              type="number" 
              value={config.defaultTablePageSize}
              onChange={(e) => updateConfig({ defaultTablePageSize: parseInt(e.target.value) })}
              min="5"
              max="100"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Máximo elementos por página</Label>
            <Input 
              type="number" 
              value={config.maxTablePageSize}
              onChange={(e) => updateConfig({ maxTablePageSize: parseInt(e.target.value) })}
              min="10"
              max="500"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold">Configuraciones de Búsqueda</h3>
          <div className="space-y-2">
            <Label>Límite de resultados</Label>
            <Input 
              type="number" 
              value={config.searchResultsLimit}
              onChange={(e) => updateConfig({ searchResultsLimit: parseInt(e.target.value) })}
              min="5"
              max="100"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Debounce (ms)</Label>
            <Input 
              type="number" 
              value={config.searchDebounceMs}
              onChange={(e) => updateConfig({ searchDebounceMs: parseInt(e.target.value) })}
              min="100"
              max="1000"
              step="100"
            />
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={() => updateConfig({ defaultTheme: 'light' })}
          variant={config.defaultTheme === 'light' ? 'default' : 'outline'}
        >
          Tema Claro
        </Button>
        <Button 
          onClick={() => updateConfig({ defaultTheme: 'dark' })}
          variant={config.defaultTheme === 'dark' ? 'default' : 'outline'}
        >
          Tema Oscuro
        </Button>
        <Button 
          onClick={() => updateConfig({ defaultTheme: 'system' })}
          variant={config.defaultTheme === 'system' ? 'default' : 'outline'}
        >
          Sistema
        </Button>
      </div>
    </div>
  );
}; 