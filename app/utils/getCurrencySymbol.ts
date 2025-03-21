export const getCurrencySymbol = (currencyCode: string): string => {
    const currencySymbols: { [key: string]: string } = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      AUD: "A$",
      CAD: "C$",
      JPY: "¥",
      INR: "₹",
      CHF: "CHF",
      CNY: "¥",
      SEK: "kr",
      NZD: "NZ$",
    };
  
    return currencySymbols[currencyCode] || currencyCode; // Return code if symbol is not found
  };
  