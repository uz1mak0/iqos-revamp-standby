const updateGTIN = (gtin: string, sku: string) => {
  switch (sku) {
    case "DK001692.00":
      return "4806504616572";
    default:
      return gtin;
  }
};
export const formatCodentify = (codentify: any) => {
  /**
     * Codentify - 010 gtin 21 serial 240 sku
        010 04806504615001 21 123456789012 240 DK000753.01
        sample 0100480650461500121123456789012240DK000753.01
        010 
        Ean13 code/gtin - 13
        21
        SUPI 12 Char alphanumeric/serial - (12-16)
        240
        Product code/sku - 11

        

        01004806504615032 21 123456789001 240 DK001207.00
        01004806504615049 21 TZNQBH095B3WGD 240 DK001213.00
     */

  codentify = codentify.trim().replace(/\t/g, "");

  const regex = /^010(\d{13})21([A-Z0-9]{12,16})240(.+)$/i;
  const match = codentify.match(regex);

  if (!match) return false;

  const [, gtinRaw, serial, sku] = match;

  return {
    gtin: updateGTIN(gtinRaw, sku),
    serial: serial.toUpperCase(),
    sku,
  };
};

export const checkScanRestrictions = (scanValue: string) => {
  if (scanValue.includes(".")) return true;
  return false;
};
