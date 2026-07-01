function formatCurrency(amount) {
  return `Ghc ${Number(amount).toLocaleString("en-GH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default formatCurrency;
