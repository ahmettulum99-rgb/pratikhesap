export type UnitDefinition = { value: string; label: string; factor: number };
export type UnitGroup = { value: string; label: string; units: UnitDefinition[] };

export const unitGroups: UnitGroup[] = [
  {
    value: "length",
    label: "Uzunluk",
    units: [
      { value: "mm", label: "Milimetre (mm)", factor: 0.001 },
      { value: "cm", label: "Santimetre (cm)", factor: 0.01 },
      { value: "m", label: "Metre (m)", factor: 1 },
      { value: "km", label: "Kilometre (km)", factor: 1000 },
      { value: "in", label: "İnç (in)", factor: 0.0254 },
      { value: "ft", label: "Fit (ft)", factor: 0.3048 }
    ]
  },
  {
    value: "weight",
    label: "Ağırlık",
    units: [
      { value: "mg", label: "Miligram (mg)", factor: 0.000001 },
      { value: "g", label: "Gram (g)", factor: 0.001 },
      { value: "kg", label: "Kilogram (kg)", factor: 1 },
      { value: "ton", label: "Metrik ton (t)", factor: 1000 },
      { value: "lb", label: "Pound (lb)", factor: 0.45359237 }
    ]
  },
  {
    value: "volume",
    label: "Hacim",
    units: [
      { value: "ml", label: "Mililitre (ml)", factor: 0.001 },
      { value: "l", label: "Litre (L)", factor: 1 },
      { value: "m3", label: "Metreküp (m³)", factor: 1000 }
    ]
  },
  {
    value: "area",
    label: "Alan",
    units: [
      { value: "cm2", label: "Santimetrekare (cm²)", factor: 0.0001 },
      { value: "m2", label: "Metrekare (m²)", factor: 1 },
      { value: "ha", label: "Hektar (ha)", factor: 10000 },
      { value: "km2", label: "Kilometrekare (km²)", factor: 1000000 }
    ]
  },
  {
    value: "temperature",
    label: "Sıcaklık",
    units: [
      { value: "c", label: "Santigrat (°C)", factor: 1 },
      { value: "f", label: "Fahrenheit (°F)", factor: 1 },
      { value: "k", label: "Kelvin (K)", factor: 1 }
    ]
  },
  {
    value: "time",
    label: "Süre",
    units: [
      { value: "sec", label: "Saniye", factor: 1 },
      { value: "min", label: "Dakika", factor: 60 },
      { value: "hour", label: "Saat", factor: 3600 },
      { value: "day", label: "Gün", factor: 86400 }
    ]
  }
];
