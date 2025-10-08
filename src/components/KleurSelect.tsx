import React from "react";
import Select, { components, OptionProps, GroupBase } from "react-select";

// Plak hier je volledige RAL_CODES en WOOD_NAMES en KNOWN_RAL_HEX (uit je eigen Configurator.tsx)
const WOOD_NAMES = [
  'Stone Pine','Walnut','Wenge','Oak','Dark Chestnut','Cypress','Afromosia',
  'Cherry Tree','Forest Green','Framire','Light Green','Mahogany','Old Pine',
  'Sapelli','Golden Sun','Chestnut','Iroko','Acajou','Ash Gray','Brown Chocolate',
  'Beige','Tan','Calvados','Dark Brown','Milky White','Mocha','Frosty White','Kempas'
] as const;

const RAL_CODES = [
  'RAL 1000','RAL 1001','RAL 1002','RAL 1003','RAL 1004','RAL 1005','RAL 1006','RAL 1007',
  'RAL 1016','RAL 1017','RAL 1019','RAL 1020','RAL 1023','RAL 1024','RAL 1026','RAL 1027','RAL 1028',
  'RAL 1032','RAL 1033','RAL 1034','RAL 1035','RAL 1036','RAL 1037',
  'RAL 2000','RAL 2001','RAL 2002','RAL 2003','RAL 2004','RAL 2005','RAL 2007',
  'RAL 3000','RAL 3001','RAL 3002','RAL 3003','RAL 3004','RAL 3005','RAL 3007','RAL 3009','RAL 3011',
  'RAL 3012','RAL 3013','RAL 3014','RAL 3015','RAL 3016','RAL 3017','RAL 3018','RAL 3020','RAL 3022',
  'RAL 3027','RAL 3028','RAL 3031',
  'RAL 4001','RAL 4002','RAL 4003','RAL 4004','RAL 4005','RAL 4006','RAL 4007','RAL 4008','RAL 4009','RAL 4010',
  'RAL 5000','RAL 5001','RAL 5002','RAL 5003','RAL 5004','RAL 5005','RAL 5007','RAL 5008','RAL 5009','RAL 5010',
  'RAL 5011','RAL 5012','RAL 5013','RAL 5014','RAL 5015','RAL 5017','RAL 5018','RAL 5019','RAL 5020','RAL 5021',
  'RAL 5022','RAL 5023','RAL 5024',
  'RAL 6000','RAL 6001','RAL 6002','RAL 6003','RAL 6004','RAL 6005','RAL 6006','RAL 6007','RAL 6008','RAL 6009',
  'RAL 6010','RAL 6011','RAL 6012','RAL 6013','RAL 6014','RAL 6015','RAL 6016','RAL 6017','RAL 6018','RAL 6019',
  'RAL 6020','RAL 6021','RAL 6022','RAL 6024','RAL 6025','RAL 6026','RAL 6027','RAL 6028','RAL 6029','RAL 6032',
  'RAL 6033','RAL 6034','RAL 6035','RAL 6036',
  'RAL 7000','RAL 7001','RAL 7002','RAL 7003','RAL 7004','RAL 7005','RAL 7006','RAL 7008','RAL 7009','RAL 7010',
  'RAL 7011','RAL 7012','RAL 7013','RAL 7015','RAL 7016','RAL 7019','RAL 7021','RAL 7022','RAL 7023','RAL 7024',
  'RAL 7026','RAL 7030','RAL 7031','RAL 7032','RAL 7033','RAL 7034','RAL 7035','RAL 7038','RAL 7040','RAL 7042',
  'RAL 7043','RAL 7044','RAL 7045','RAL 7046','RAL 7047','RAL 7048',
  'RAL 8000','RAL 8001','RAL 8002','RAL 8003','RAL 8004','RAL 8007','RAL 8008','RAL 8016','RAL 8017','RAL 8019',
  'RAL 8022','RAL 8023','RAL 8024','RAL 8025','RAL 8028','RAL 8029',
  'RAL 9001','RAL 9002','RAL 9003','RAL 9004','RAL 9005','RAL 9006','RAL 9007','RAL 9010','RAL 9016','RAL 9017',
  'RAL 9022','RAL 9023'
] as const;

const KNOWN_RAL_HEX: Record<string, string> = {
  'RAL 9005': '#0A0A0A','RAL 9016': '#F2F2F2','RAL 9010': '#F5F1DF','RAL 9001': '#E6DCC7',
  'RAL 7016': '#373F43','RAL 7035': '#D7D7D7','RAL 7039': '#6D6F6A','RAL 8017': '#3B2B20',
  'RAL 8019': '#3E3B39','RAL 9006': '#A7A9AC','RAL 9007': '#8F8F8F'
}

// Unieke houtkleuren, je mag de kleuren aanpassen naar wens!
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