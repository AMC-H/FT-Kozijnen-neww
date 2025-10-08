import React from "react";
import Select, { components, OptionProps, GroupBase } from "react-select";

// RAL en houtkleur-data uit je eigen configurator.tsx:
const WOOD_NAMES = [
  'Stone Pine','Walnut','Wenge','Oak','Dark Chestnut','Cypress','Afromosia',
  'Cherry Tree','Forest Green','Framire','Light Green','Mahogany','Old Pine',
  'Sapelli','Golden Sun','Chestnut','Iroko','Acajou','Ash Gray','Brown Chocolate',
  'Beige','Tan','Calvados','Dark Brown','Milky White','Mocha','Frosty White','Kempas'
] as const

const RAL_CODES = [
  // ... jouw volledige RAL lijst hier ...
];

const KNOWN_RAL_HEX: Record<string, string> = {
  'RAL 9005': '#0A0A0A','RAL 9016': '#F2F2F2','RAL 9010': '#F5F1DF','RAL 9001': '#E6DCC7',
  'RAL 7016': '#373F43','RAL 7035': '#D7D7D7','RAL 7039': '#6D6F6A','RAL 8017': '#3B2B20',
  'RAL 8019': '#3E3B39','RAL 9006': '#A7A9AC','RAL 9007': '#8F8F8F'
}

const WOOD_COLORS: Record<string, string> = {
  'Stone Pine': '#d1b899', 'Walnut': '#705335', 'Wenge': '#44322d',
  'Oak': '#d2b48c', 'Dark Chestnut': '#4b3621', 'Cypress': '#b7a16a',
  'Afromosia': '#cbb67c', 'Cherry Tree': '#c27d56', 'Forest Green': '#228b22',
  'Framire': '#e3c296', 'Light Green': '#b4e197', 'Mahogany': '#7d4f3e',
  'Old Pine': '#d3c89f', 'Sapelli': '#965a38', 'Golden Sun': '#fbc531',
  'Chestnut': '#a17c6b', 'Iroko': '#c6a76d', 'Acajou': '#88421d',
  'Ash Gray': '#b2beb5', 'Brown Chocolate': '#381819', 'Beige': '#f5f5dc',
  'Tan': '#d2b48c', 'Calvados': '#b87333', 'Dark Brown': '#3c2415',
  'Milky White': '#e2dedb', 'Mocha': '#3c2f2f', 'Frosty White': '#f8f8ff', 'Kempas': '#a0522d'
};

const ralOptions = RAL_CODES.map(code => ({
  value: code,
  label: code,
  color: KNOWN_RAL_HEX[code] || "#ccc"
}));

const woodOptions = WOOD_NAMES.map(name => ({
  value: name,
  label: `${name} (houtkleur)`,
  color: WOOD_COLORS[name] || "#b08553"
}));

const allOptions = [
  {
    label: "RAL-kleuren",
    options: ralOptions
  },
  {
    label: "Houtkleuren",
    options: woodOptions
  }
];

const ColourOption = (props: OptionProps<any, false, GroupBase<any>>) => (
  <components.Option {...props}>
    <span
      style={{
        display: "inline-block",
        width: 20,
        height: 20,
        borderRadius: 4,
        background: props.data.color,
        marginRight: 8,
        border: "1px solid #ccc",
        verticalAlign: "middle"
      }}
    />
    {props.data.label}
  </components.Option>
);

interface KleurSelectProps {
  value: string | undefined;
  onChange: (kleur: string) => void;
  label: string;
  disabled?: boolean;
}

const KleurSelect: React.FC<KleurSelectProps> = ({ value, onChange, label, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label} *</label>
    <Select
      inputId={label}
      name={label}
      value={allOptions.flatMap(g => g.options).find(opt => opt.value === value) || null}
      onChange={opt => onChange(opt ? opt.value : "")}
      options={allOptions}
      placeholder="Kies kleur"
      isDisabled={disabled}
      components={{ Option: ColourOption }}
      isSearchable
      styles={{
        option: (provided, state) => ({
          ...provided,
          fontFamily: "inherit"
        }),
        menu: (provided) => ({
          ...provided,
          zIndex: 100
        })
      }}
    />
  </div>
);

export default KleurSelect;