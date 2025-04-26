export const process_code_Map = {
  G20900: '交通運輸活動',
  370004: '水肥處理程序',
  G20901: '消防活動',
  G00099: '冷媒補充',
  '000999': '其他未分類製程',
}

export const device_code_Map = {
  '0020': '汽油引擎',
  9795: '化糞池',
  9798: '消防設施',
  4091: '住宅及商業建築冷氣機',
  9999: '其他未歸類設施',
}

export const fuel_code_Map = {
  170001: '車用汽油',
  170006: '柴油',
  GG1814: '冷媒－R410a，R32/125（50/50）',
  350099: '其他電力',
  A00033: '類別3.3員工通勤(機車)',
  A00034: '類別3.3員工通勤(汽車)',
  A00036: '類別3.5商務旅行',
}

export const emission_category_Map = {
  1: '類別1',
  2: '類別2',
  3: '類別3',
}

export const emission_pattern_Map = {
  1: ['固定', '移動', '製程', '逸散'],
  2: ['外購電力', '外購蒸氣'],
  3: ['員工通勤', '商務旅行', '廢棄物處置'],
}

export const process_category_Map = {
  1: '水泥製程',
  2: '鋼鐵製程-使用造渣劑',
  3: '鋼鐵製程-使用添加劑',
  4: '鋼鐵製程-金屬進料',
  5: '鋼鐵製程-外售含碳產品(已知CO2排放係數',
  6: '鋼鐵製程-使用添加劑(預焙陽極炭塊與煤碳電極',
  7: '鋼鐵製程--外售含碳產品(已知含碳率)',
  8: '半導體光電製程',
  9: '石灰製程',
  10: '碳酸鈉製程-碳酸鈉製造',
  11: '碳酸鈉製程-碳酸鈉使用',
  12: '碳化物鈉製程-碳化矽製造',
  13: '碳化物鈉製程-碳化鈣製造',
  14: '碳化物鈉製程-碳化鈣使用',
  15: '碳酸製程',
  16: '已二酸製程',
  17: '二氟一氯甲烷',
  18: '乙炔-焊接維修製程',
  19: '濕式排煙脫硫-石灰石製程',
  20: '其他',
}

export const escape_category_Map = {
  1: '廢棄物排放源',
  2: '廢水排放源',
  3: '廢棄污泥排放源',
  4: '溶劑、噴霧劑及冷媒排放源',
  5: 'VOCs未經燃燒且含CH4',
  6: '已知VOCs濃度',
  7: '未知VOCs濃度已知CO2排放係數',
  8: '化糞池排放源',
  9: '其他',
}

export const power_category_Map = {
  1: '併網',
  2: '離網',
}

export const getSourcePower = (source) => {
  if (source.emission_category === 1 && source.emission_pattern === 3) {
    return process_category_Map[source.process_category]
  }
  if (source.emission_category === 1 && source.emission_pattern === 4) {
    return escape_category_Map[source.escape_category]
  }
  if (source.emission_category === 2 && source.emission_pattern === 1) {
    return power_category_Map[source.power_category]
  }
  return ''
}

// 七大溫室氣體
export const gas_type_map = {
  1: 'CO2',
  2: 'CH4',
  3: 'N2O',
  4: 'HFCS',
  5: 'PFCS',
  6: 'SF6',
  7: 'NF3',
}

// 活動數據單位
export const activity_data_unit_map = {
  1: '公噸',
  2: '公秉',
  3: '千立方公尺',
  4: '千度',
  5: '人小時',
  6: 'tkm',
  7: 'pkm',
  8: 'tCO2e',
  9: '其他',
}

// 活動數據種類
export const data_type_map = {
  1: '連續量測',
  2: '定期(間歇)量測',
  3: '財務會計推估',
  4: '自行評估',
}
