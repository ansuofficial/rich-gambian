export const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GMD",
    maximumFractionDigits: 0,
  }).format(amount);
};
