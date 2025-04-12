"use client"

import { useState, useEffect } from "react"
import {
  Search,
  FileText,
  BarChart2,
  CreditCard,
  PieChart,
  File,
  Star,
  Clock,
  ChevronDown,
  HomeIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

// Datos de ejemplo basados en la imagen
const menuData = {
  financieros: [
    "Especialidades",
    "Cajeros",
    "Certificados",
    "Clientes",
    "Cobradores",
    "Colores",
    "Cuentas",
    "Formas de Pagos",
    "Garantías",
    "Gestores",
    "Notas",
    "Oficiales",
    "Tipos de Cálculos",
    "Tipos de Cargos",
    "Tipos de Créditos",
    "Tipos de Notas",
    "Tipos de Tasas",
  ],
  contabilidad: [
    "Activos",
    "Áreas",
    "Artículos",
    "Bancos",
    "Categorías",
    "Clasificaciones Contables",
    "Comprobantes",
    "Cuentas Contables",
    "Cuentas de Bancos",
    "Grupos",
    "Monedas",
    "Posiciones",
    "Renglones",
    "Seguros",
    "Subcategorías",
    "Supervisores",
    "Suplidores",
    "Tipos de Contribuyentes",
    "Tipos de Cuentas",
    "Tipos De Documentos",
    "Tipos de Relaciones",
    "Vehículos",
  ],
  nomina: [
    "AFP",
    "Conceptos",
    "Conceptos Fijos",
    "Departamentos",
    "Empleados",
    "Nóminas",
    "Permiso de Empleado",
    "Proyectos",
    "Tipos Permisos",
  ],
  administracion: [
    "prueba",
    "Actividades",
    "Comentarios",
    "Configuraciones",
    "Distritos",
    "Empresas",
    "Estados Civiles",
    "Géneros",
    "Instituciones Educativas",
    "Marcas",
    "Municipios",
    "Países",
    "Programas",
    "Provincias",
    "Rutas",
    "Sectores",
    "Seguimientos",
    "Sucursales",
    "Tipos de Contactos",
    "Tipos de Seguimientos",
    "Usuarios",
  ],
}

// Elementos recientes (simulados)
const recientes = ["Empleados", "Cuentas Contables", "Clientes", "Configuraciones", "Tipos de Documentos"]

// Elementos favoritos (simulados)
const favoritos = ["Clientes", "Empleados", "Nóminas", "Bancos"]

export default function Home() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<{ category: string; items: string[] }[]>([])
  const [activeTab, setActiveTab] = useState("recientes")

  // Función para buscar en todas las categorías
  useEffect(() => {
    if (searchTerm.length > 1) {
      const results = Object.entries(menuData)
        .map(([category, items]) => {
          const filteredItems = items.filter((item) => item.toLowerCase().includes(searchTerm.toLowerCase()))
          return {
            category: translateCategory(category),
            items: filteredItems,
          }
        })
        .filter((result) => result.items.length > 0)

      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }, [searchTerm])

  // Función para traducir nombres de categorías
  const translateCategory = (category: string) => {
    const translations: { [key: string]: string } = {
      financieros: "Financieros",
      contabilidad: "Contabilidad",
      nomina: "Nómina",
      administracion: "Administración",
    }
    return translations[category] || category
  }

  // Función para obtener el icono de cada categoría
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "financieros":
        return <CreditCard className="h-5 w-5" />
      case "contabilidad":
        return <FileText className="h-5 w-5" />
      case "nómina":
        return <BarChart2 className="h-5 w-5" />
      case "administración":
        return <PieChart className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-blue-50">

      <header className="bg-blue-700 text-white p-2 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:bg-blue-600">
              <HomeIcon className="h-5 w-5 mr-1" />
              Inicio
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                className={cn("text-white hover:bg-blue-600 flex items-center", isOpen && "bg-blue-600")}
                onClick={() => setIsOpen(!isOpen)}
              >
                <FileText className="h-5 w-5 mr-1" />
                Registros
                <ChevronDown className={cn("h-4 w-4 ml-1 transition-transform duration-200", isOpen && "rotate-180")} />
              </Button>

              {/* Menú desplegable mejorado */}
              {isOpen && (
                <div className="fixed left-0 right-0 mt-1 mx-auto max-w-[1000px] bg-white rounded-md shadow-lg z-50 border border-gray-200 overflow-hidden">
                  <div className="p-2 border-b">
                    <div className="relative">
                      <Search className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Buscar en registros..."
                        className="pl-8 h-8 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {searchTerm.length > 1 ? (
                    <div className="p-3 max-h-[500px] overflow-y-auto">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Resultados de búsqueda</h3>
                      {searchResults.length > 0 ? (
                        <div className="grid gap-4">
                          {searchResults.map((result, idx) => (
                            <div key={idx}>
                              <div className="flex items-center gap-2 mb-1">
                                {getCategoryIcon(result.category)}
                                <h4 className="font-medium text-gray-700">{result.category}</h4>
                              </div>
                              <div className="grid grid-cols-3 gap-1 pl-7">
                                {result.items.map((item, itemIdx) => (
                                  <Button
                                    key={itemIdx}
                                    variant="ghost"
                                    className="justify-start h-8 px-2 text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    {item}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-center py-4">
                          No se encontraron resultados para "{searchTerm}"
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex">
                      <div className="w-[180px] bg-gray-50 border-r flex-shrink-0">
                        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                          <TabsList className="w-full rounded-none bg-gray-50">
                            <TabsTrigger
                              value="recientes"
                              className="data-[state=active]:bg-white rounded-none w-full text-sm h-8"
                            >
                              <Clock className="h-3.5 w-3.5 mr-1" />
                              Recientes
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="recientes" className="m-0 p-0">
                            <div className="py-1">
                              {recientes.map((item, idx) => (
                                <Button
                                  key={idx}
                                  variant="ghost"
                                  className="w-full justify-start text-sm h-7 text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                                >
                                  <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                  {item}
                                </Button>
                              ))}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>

                      <div className="flex-1 overflow-x-auto">
                        <div className="min-w-[800px]">
                          <div className="grid grid-cols-4 gap-0">
                            {/* Update each category section */}
                            {/* Financieros */}
                            <div className="border-r border-b">
                              <div className="p-2 bg-blue-50 border-b flex items-center gap-1.5">
                                <CreditCard className="h-3.5 w-3.5 text-blue-700" />
                                <h3 className="text-sm font-medium text-blue-700">Financieros</h3>
                              </div>
                              <div className="p-1.5">
                                {menuData.financieros.map((item, idx) => (
                                  <Button
                                    key={idx}
                                    variant="ghost"
                                    className="w-full justify-start h-7 px-2 text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    {item}
                                    {favoritos.includes(item) && (
                                      <Star className="h-3 w-3 ml-1 text-yellow-400 fill-yellow-400" />
                                    )}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Contabilidad */}
                            <div className="border-r border-b">
                              <div className="p-2 bg-blue-50 border-b flex items-center gap-1.5">
                                <FileText className="h-3.5 w-3.5 text-blue-700" />
                                <h3 className="text-sm font-medium text-blue-700">Contabilidad</h3>
                              </div>
                              <div className="p-1.5">
                                {menuData.contabilidad.map((item, idx) => (
                                  <Button
                                    key={idx}
                                    variant="ghost"
                                    className="w-full justify-start h-7 px-2 text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    {item}
                                    {favoritos.includes(item) && (
                                      <Star className="h-3 w-3 ml-1 text-yellow-400 fill-yellow-400" />
                                    )}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Nómina */}
                            <div className="border-r border-b">
                              <div className="p-2 bg-blue-50 border-b flex items-center gap-1.5">
                                <BarChart2 className="h-3.5 w-3.5 text-blue-700" />
                                <h3 className="text-sm font-medium text-blue-700">Nómina</h3>
                              </div>
                              <div className="p-1.5">
                                {menuData.nomina.map((item, idx) => (
                                  <Button
                                    key={idx}
                                    variant="ghost"
                                    className="w-full justify-start h-7 px-2 text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    {item}
                                    {favoritos.includes(item) && (
                                      <Star className="h-3 w-3 ml-1 text-yellow-400 fill-yellow-400" />
                                    )}
                                    {item === "Empleados" && (
                                      <Badge variant="outline" className="ml-1 text-xs bg-blue-50 text-blue-700">
                                        Nuevo
                                      </Badge>
                                    )}
                                  </Button>
                                ))}
                              </div>
                            </div>

                            {/* Administración */}
                            <div className="border-b">
                              <div className="p-2 bg-blue-50 border-b flex items-center gap-1.5">
                                <PieChart className="h-3.5 w-3.5 text-blue-700" />
                                <h3 className="text-sm font-medium text-blue-700">Administración</h3>
                              </div>
                              <div className="p-1.5">
                                {menuData.administracion.map((item, idx) => (
                                  <Button
                                    key={idx}
                                    variant="ghost"
                                    className="w-full justify-start h-7 px-2 text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    {item}
                                    {favoritos.includes(item) && (
                                      <Star className="h-3 w-3 ml-1 text-yellow-400 fill-yellow-400" />
                                    )}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Button variant="ghost" className="text-white hover:bg-blue-600">
              <BarChart2 className="h-5 w-5 mr-1" />
              Procesos
            </Button>

            <Button variant="ghost" className="text-white hover:bg-blue-600">
              <PieChart className="h-5 w-5 mr-1" />
              Reportes
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="Buscar..." className="pl-8 bg-white text-gray-900" />
            </div>
            <Button variant="outline" className="text-white border-white hover:bg-blue-600">
              DAITE
            </Button>
          </div>
        </div>
      </header>

      {/* New Favorites Bar */}
      <div className="bg-yellow-50 border-b">
        <div className="container mx-auto">
          <div className="p-1.5 flex items-center gap-2">
            <Star className="h-3.5 w-3.5 text-yellow-600" />
            <h3 className="text-sm font-medium text-yellow-700">Favoritos</h3>
          </div>
          <div className="pb-1.5 px-2 flex flex-wrap gap-1.5">
            {favoritos.map((item, idx) => (
              <Button
                key={idx}
                variant="ghost"
                className="h-7 px-2.5 text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-50 bg-white"
              >
                <Star className="h-3 w-3 mr-1.5 text-yellow-400 fill-yellow-400" />
                {item}
              </Button>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

