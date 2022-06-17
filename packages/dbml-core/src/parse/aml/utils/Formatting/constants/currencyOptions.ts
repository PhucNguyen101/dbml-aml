export interface Option {
  label: string,
  value: string,
}

export const SYMBOL_CURRENCIES: Option[] = [
  { value: '$', label: '($) US Dollar / MEX Peso' },
  { value: '€', label: '(€) Euro' },
  { value: '¥', label: '(¥) Yen' },
  { value: '£', label: '(£) Pound' },
  { value: '元', label: '(元) Renminbi' },
  { value: '₺', label: '(₺) Lira' },
  { value: '₩', label: '(₩) Won' },
  { value: '₽', label: '(₽) RUS Ruble' },
  { value: '₹', label: '(₹ ) IND Rupee' },
  { value: '₨', label: '(₨) PAK Rupee' },
  { value: '₱', label: '(₱) PHL Peso' },
  { value: 'A$', label: '(A$) AUS Dollar' },
  { value: 'C$', label: '(C$) CAN Dollar' },
  { value: 'S$', label: '(S$) SGP Dollar' },
  { value: 'NZ$', label: '(NZ$) NZ Dollar' },
  { value: 'HK$', label: '(HK$) HK Dollar' },
  { value: '₪', label: '(₪) Shekel' },
  { value: 'R$', label: '(R$) Real' },
  { value: '฿', label: '(฿ )) Thai Baht' },
  { value: 'R', label: '(R) South African Rand' },
];

export const NON_SYMBOL_CURRENCIES: Option[] = [
  { value: 'Fr', label: '(Fr) Franc' },
  { value: 'kr', label: '(kr) Krona / Krone' },
  { value: 'Ft', label: '(Ft) Forint' },
  { value: 'Rp', label: '(Rp) Rupiah' },
  { value: 'RM', label: '(RM) Ringgit' },
  { value: 'VND', label: '(VND) VN Dong' },
  { value: 'Tk', label: '(Tk) BGD Taka' },
];

export const CURRENCIES: Option[] = [...SYMBOL_CURRENCIES, ...NON_SYMBOL_CURRENCIES];
