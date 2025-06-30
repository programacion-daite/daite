import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useGlobalConfig, useTableConfig, useUIConfig, useDatabaseConfig } from '@/hooks/use-global-config';

// Ejemplo de uso en un componente de tabla
export const TableWithDynamicConfig = () => {
  const { defaultPageSize, updateTableConfig, visiblePageSize } = useTableConfig();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Tabla con Configuraciones Dinámicas</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Registros a mostrar en búsqueda</Label>
          <Select 
            value={defaultPageSize.toString()} 
            onValueChange={(value) => updateTableConfig('cantidad_registros_mostrar_busqueda_selector', value)}
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
          <Label>Registros visibles en selector</Label>
          <Select 
            value={visiblePageSize.toString()} 
            onValueChange={(value) => updateTableConfig('cantidad_registros_visible_selector', value)}
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
      </div>
      
      <p className="text-sm text-muted-foreground">
        Configuración actual: {defaultPageSize} registros en búsqueda, {visiblePageSize} registros visibles
      </p>
    </div>
  );
};

// Ejemplo de uso en un componente de UI
export const UIWithDynamicConfig = () => {
  const { 
    buttonColor, 
    buttonHeight, 
    buttonTextColor, 
    buttonWidth,
    isDaiteClient,
    openCashBreakdown,
    saveMessage,
    updateUIConfig 
  } = useUIConfig();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">UI con Configuraciones Dinámicas</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Ancho del botón (px)</Label>
          <Input 
            type="number" 
            value={buttonWidth}
            onChange={(e) => updateUIConfig('ancho_boton', e.target.value)}
            min="50"
            max="300"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Alto del botón (px)</Label>
          <Input 
            type="number" 
            value={buttonHeight}
            onChange={(e) => updateUIConfig('altura_boton', e.target.value)}
            min="30"
            max="100"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Color del botón</Label>
          <Input 
            type="color" 
            value={buttonColor}
            onChange={(e) => updateUIConfig('color_boton', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Color del texto</Label>
          <Input 
            type="color" 
            value={buttonTextColor}
            onChange={(e) => updateUIConfig('color_texto_boton', e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            checked={openCashBreakdown}
            onCheckedChange={(checked) => updateUIConfig('abrir_desglose_efectivo', checked ? '1' : '0')}
          />
          <Label>Abrir desglose de efectivo</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            checked={isDaiteClient}
            onCheckedChange={(checked) => updateUIConfig('cliente_daite', checked ? 'si' : 'no')}
          />
          <Label>Cliente Daite</Label>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Mensaje de guardado</Label>
        <Input 
          value={saveMessage}
          onChange={(e) => updateUIConfig('mensaje_guardar', e.target.value)}
          placeholder="Mensaje que se muestra al guardar"
        />
      </div>
      
      {/* Botón de ejemplo con las configuraciones */}
      <div className="mt-4">
        <Button 
          style={{
            backgroundColor: buttonColor,
            color: buttonTextColor,
            height: `${buttonHeight}px`,
            width: `${buttonWidth}px`,
          }}
          onClick={() => alert(saveMessage)}
        >
          Botón de Ejemplo
        </Button>
      </div>
    </div>
  );
};

// Ejemplo de configuración de base de datos
export const DatabaseConfigPanel = () => {
  const { 
    databaseDNS, 
    databaseMode, 
    databaseName, 
    dataStartDate, 
    defaultCalculationType,
    updateDatabaseConfig 
  } = useDatabaseConfig();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Configuración de Base de Datos</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Modalidad DB</Label>
          <Select 
            value={databaseMode} 
            onValueChange={(value) => updateDatabaseConfig('modalidad_db', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a">Modalidad A</SelectItem>
              <SelectItem value="b">Modalidad B</SelectItem>
              <SelectItem value="c">Modalidad C</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Nombre de la DB</Label>
          <Input 
            value={databaseName}
            onChange={(e) => updateDatabaseConfig('nombre_db', e.target.value)}
            placeholder="Nombre de la base de datos"
          />
        </div>
        
        <div className="space-y-2">
          <Label>DNS de la DB</Label>
          <Input 
            value={databaseDNS}
            onChange={(e) => updateDatabaseConfig('dns_db', e.target.value)}
            placeholder="servidor,puerto"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Fecha de inicio de datos</Label>
          <Input 
            type="date"
            value={dataStartDate}
            onChange={(e) => updateDatabaseConfig('fecha_inicio_datos', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Tipo de cálculo por defecto</Label>
          <Select 
            value={defaultCalculationType} 
            onValueChange={(value) => updateDatabaseConfig('tipo_calculo_defecto', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Tipo 1</SelectItem>
              <SelectItem value="2">Tipo 2</SelectItem>
              <SelectItem value="3">Tipo 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">Configuración Actual:</h4>
        <div className="text-sm space-y-1">
          <p><strong>Modalidad:</strong> {databaseMode}</p>
          <p><strong>Base de datos:</strong> {databaseName}</p>
          <p><strong>DNS:</strong> {databaseDNS}</p>
          <p><strong>Fecha inicio:</strong> {dataStartDate}</p>
          <p><strong>Tipo cálculo:</strong> {defaultCalculationType}</p>
        </div>
      </div>
    </div>
  );
};

// Ejemplo completo con todas las configuraciones
export const CompleteDynamicConfigExample = () => {
  const { getConfigValue, updateConfigItem } = useGlobalConfig();

  return (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold">Configuraciones Dinámicas del Usuario</h2>

      <TableWithDynamicConfig />
      <UIWithDynamicConfig />
      <DatabaseConfigPanel />
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Acceso Directo a Configuraciones</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Correos de seguimiento</Label>
            <Input 
              value={getConfigValue('correos_enviar_copias_seguimientos')}
              onChange={(e) => updateConfigItem('correos_enviar_copias_seguimientos', e.target.value)}
              placeholder="correo1@ejemplo.com, correo2@ejemplo.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 