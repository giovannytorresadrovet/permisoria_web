import { LocationOption } from '@/types/location';

/**
 * Complete list of Puerto Rico municipalities for use in dropdowns.
 * These represent the primary administrative divisions in Puerto Rico.
 */
export const PR_MUNICIPALITIES: LocationOption[] = [
  { value: "adjuntas", label: "Adjuntas" },
  { value: "aguada", label: "Aguada" },
  { value: "aguadilla", label: "Aguadilla" },
  { value: "aguas-buenas", label: "Aguas Buenas" },
  { value: "aibonito", label: "Aibonito" },
  { value: "anasco", label: "Añasco" },
  { value: "arecibo", label: "Arecibo" },
  { value: "arroyo", label: "Arroyo" },
  { value: "barceloneta", label: "Barceloneta" },
  { value: "barranquitas", label: "Barranquitas" },
  { value: "bayamon", label: "Bayamón" },
  { value: "cabo-rojo", label: "Cabo Rojo" },
  { value: "caguas", label: "Caguas" },
  { value: "camuy", label: "Camuy" },
  { value: "canovanas", label: "Canóvanas" },
  { value: "carolina", label: "Carolina" },
  { value: "catano", label: "Cataño" },
  { value: "cayey", label: "Cayey" },
  { value: "ceiba", label: "Ceiba" },
  { value: "ciales", label: "Ciales" },
  { value: "cidra", label: "Cidra" },
  { value: "coamo", label: "Coamo" },
  { value: "comerio", label: "Comerío" },
  { value: "corozal", label: "Corozal" },
  { value: "culebra", label: "Culebra" },
  { value: "dorado", label: "Dorado" },
  { value: "fajardo", label: "Fajardo" },
  { value: "florida", label: "Florida" },
  { value: "guanica", label: "Guánica" },
  { value: "guayama", label: "Guayama" },
  { value: "guayanilla", label: "Guayanilla" },
  { value: "guaynabo", label: "Guaynabo" },
  { value: "gurabo", label: "Gurabo" },
  { value: "hatillo", label: "Hatillo" },
  { value: "hormigueros", label: "Hormigueros" },
  { value: "humacao", label: "Humacao" },
  { value: "isabela", label: "Isabela" },
  { value: "jayuya", label: "Jayuya" },
  { value: "juana-diaz", label: "Juana Díaz" },
  { value: "juncos", label: "Juncos" },
  { value: "lajas", label: "Lajas" },
  { value: "lares", label: "Lares" },
  { value: "las-marias", label: "Las Marías" },
  { value: "las-piedras", label: "Las Piedras" },
  { value: "loiza", label: "Loíza" },
  { value: "luquillo", label: "Luquillo" },
  { value: "manati", label: "Manatí" },
  { value: "maricao", label: "Maricao" },
  { value: "maunabo", label: "Maunabo" },
  { value: "mayaguez", label: "Mayagüez" },
  { value: "moca", label: "Moca" },
  { value: "morovis", label: "Morovis" },
  { value: "naguabo", label: "Naguabo" },
  { value: "naranjito", label: "Naranjito" },
  { value: "orocovis", label: "Orocovis" },
  { value: "patillas", label: "Patillas" },
  { value: "penuelas", label: "Peñuelas" },
  { value: "ponce", label: "Ponce" },
  { value: "quebradillas", label: "Quebradillas" },
  { value: "rincon", label: "Rincón" },
  { value: "rio-grande", label: "Río Grande" },
  { value: "sabana-grande", label: "Sabana Grande" },
  { value: "salinas", label: "Salinas" },
  { value: "san-german", label: "San Germán" },
  { value: "san-juan", label: "San Juan" },
  { value: "san-lorenzo", label: "San Lorenzo" },
  { value: "san-sebastian", label: "San Sebastián" },
  { value: "santa-isabel", label: "Santa Isabel" },
  { value: "toa-alta", label: "Toa Alta" },
  { value: "toa-baja", label: "Toa Baja" },
  { value: "trujillo-alto", label: "Trujillo Alto" },
  { value: "utuado", label: "Utuado" },
  { value: "vega-alta", label: "Vega Alta" },
  { value: "vega-baja", label: "Vega Baja" },
  { value: "vieques", label: "Vieques" },
  { value: "villalba", label: "Villalba" },
  { value: "yabucoa", label: "Yabucoa" },
  { value: "yauco", label: "Yauco" }
];

/**
 * Retrieves all Puerto Rico municipalities.
 * @returns Array of municipality options
 */
export const getAllPRMunicipalities = (): LocationOption[] => {
  return PR_MUNICIPALITIES;
};

/**
 * Finds a specific municipality by its value code.
 * @param code - The municipality code to search for
 * @returns The municipality object or undefined if not found
 */
export const getMunicipalityByCode = (code: string): LocationOption | undefined => {
  return PR_MUNICIPALITIES.find(municipality => municipality.value === code);
};

/**
 * Default export for direct array access when needed
 */
export default PR_MUNICIPALITIES;