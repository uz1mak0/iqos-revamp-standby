export const getIndustryProfession = [
  "Accounting",
  "Administration & Office Support",
  "Advertising, Arts & Media",
  "Banking & Financial Services",
  "Call Centre & Customer Service",
  "Community Services & Development",
  "Construction",
  "Consulting & Strategy",
  "Design & Architechture",
  "Education & Training",
  "Engineering",
  "Farming, Animals & Conservation",
  "Government & Defence",
  "Healthcare & Medical",
  "Hospitality & Tourism",
  "Human Resources & Recruitment",
  "Information & Communication Technology",
  "Insurance & Superannuation",
  "Legal",
  "Manufacturing & Logistics",
  "Marketing & Communications",
  "Mining, Resources & Energy",
  "Real Estate & Property",
  "Retail & Consumer Products",
  "Sales",
  "Science & Technology",
  "Sport & Recreation",
  "Trades & Services",
  "Public Transportation",
];

export const getCRMLeadType = ["TEST DRIVE", "VIRTUAL DEMO"];

export interface Trials {
  customer_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  age: number;
  contact_no: string;
  gender: string;
  email?: string;
  primary_nicotine_product: string;
  marketing_opt_in: string;
  privacy_notice: string;
  registration_channel: string;
}

export const getZynVariants = [
  {
    sku: "ZYN0001",
    variant: "Peppermint",
    description: "Mint Flavor ZYN",
    uom: "Pack",
    quantity: "1",
  },
  {
    sku: "ZYN0002",
    variant: "Spearmint",
    description: "Mint Flavor ZYN",
    uom: "Pack",
    quantity: "1",
  },
  {
    sku: "ZYN0003",
    variant: "Wintergreen",
    description: "Mint Flavor ZYN",
    uom: "Pack",
    quantity: "1",
  },
  {
    sku: "ZYN0004",
    variant: "Mentol",
    description: "Mint Flavor ZYN",
    uom: "Pack",
    quantity: "1",
  },
  {
    sku: "ZYN0005",
    variant: "Chill",
    description: "Mint Flavor ZYN",
    uom: "Pack",
    quantity: "1",
  },
];
