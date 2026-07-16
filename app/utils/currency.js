import { MARKET_DEFAULTS } from "../config/constants";

function formatCurrency(amount, currencyCode = MARKET_DEFAULTS.currencyCode) {
  return new Intl.NumberFormat(MARKET_DEFAULTS.locale, {
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
    style: "currency",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

export default formatCurrency;
