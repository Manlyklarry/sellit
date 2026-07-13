import { MARKET_DEFAULTS } from "../config/constants";

function formatCurrency(amount) {
  return new Intl.NumberFormat(MARKET_DEFAULTS.locale, {
    currency: MARKET_DEFAULTS.currencyCode,
    currencyDisplay: "narrowSymbol",
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

export default formatCurrency;
