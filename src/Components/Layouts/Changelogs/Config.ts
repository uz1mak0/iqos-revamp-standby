export const getChangelogs = [
  {
    version: "v.1.9.49b",
    date: "October 15, 2026",
    logs: [
      {
        title: "📦 Indirect Channel Record Sales",
        sub_list: ["Added IR automation", "Added Error Tagging field"],
      },
      {
        title: "📝 Indirect Channel Sales Logs",
        sub_list: ["Added Badge Error Tagging"],
      },
      {
        title: "🗂️ Reports:",
        sub_list: ["Added new tab to Sales extraction (Incident Tab)"],
      },
    ],
  },
  {
    version: "v.1.9.49a",
    date: "July 30, 2026",
    logs: [
      {
        title: "🌐 HR Module Update :",
        sub_list: [
          "Added Validation to check and avoid duplicate cv's",
          "Added Notification for extracting and screening process",
          "Added Automated email for failed cv's during screening process",
          "Added CC or Co-Interviewer to the Initial interview invitation email",
          "Added download or view CV's button",
          "Refactored Date and time duration for Initial interview invitation email",
          "Fixed Unknown Sender in Subject of the Initial interview invitation email",
        ],
      },
    ],
  },
  {
    version: "v.1.9.49",
    date: "July 16, 2026",
    logs: [
      {
        title: "🌐 Ecommerce Pick&Pack:",
        sub_list: ["Added SI Print", "Added free pack tagging"],
      },
      {
        title: "🗂️ Reports:",
        sub_list: [
          "Added Free packs column to new order summary",
          "Updated OSA report WH selection to multi select",
        ],
      },
      {
        title: "👥 User Mngt Channel:",
        sub_list: ["Added new User mngt (HR Users)"],
      },
    ],
  },
  {
    version: "v.1.9.48b",
    date: "June 10, 2026",
    logs: [
      {
        title: "🗂️ SKU:",
        sub_list: ["Added SKU Status (ACTIVE & INACTIVE)"],
      },
      {
        title: "📦 Transmittal:",
        sub_list: [
          "Upon Scan of Bar code, automatically Add the NEW GTIN/SKU",
          "Filtered the Inactives GTINS/SKUS on codentify dropdown",
        ],
      },
      {
        title: "👥 HR Channel:",
        sub_list: [
          "Added Assign to me button",
          "Added status field on edit source",
          "Added resend OTP codes for manager access",
        ],
      },
    ],
  },
  {
    version: "v.1.9.48a",
    date: "June 02, 2026",
    logs: [
      {
        title: "🗂️ EOD Seperation:",
        sub_list: [
          "Seperated the finance declaration",
          "Seperated the DC and IC EOD",
          "updated the input fields to EOD Direct Retail",
          "updated the input fields to EOD Indirect Channel",
        ],
      },
    ],
  },
  {
    version: "v.1.9.48",
    date: "May 20, 2026",
    logs: [
      {
        title: "🌐 New HR Channel:",
        sub_list: ["Applicant Mangt", "Report Downloads"],
      },
      {
        title: "🗂️ OSA new input fields:",
        sub_list: [
          "Added new device, electric purple",
          "Added terea russet and sienna",
          "Added zyn tropical and cool breeze 1.5mg",
        ],
      },
      {
        title: "🔄 PMFTC Delivery Declarations",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.47a",
    date: "April 30, 2026",
    logs: [
      {
        title: "📦 OSA feature:",
        sub_list: ["OSA declaration", "OSA mangt"],
      },
      {
        title: "🗂️ Reports:",
        sub_list: ["OSA report download"],
      },
    ],
  },
  {
    version: "v.1.9.47",
    date: "April 16, 2026",
    logs: [
      {
        title: "📦 Stcok Request Form Feature:",
        sub_list: [
          "Stock Request for stores/warehouses",
          "Stock Request mngt",
          "Stock Reuqest transfer automation",
        ],
      },
      {
        title: "🗂️ Reports:",
        sub_list: [
          "Stock Request report download",
          "New Order Summary report download",
        ],
      },
      {
        title: "📝 Transactions:",
        sub_list: [
          "Minor Update for Printed Transaction (Transfer & Transmittal)",
          "Added Date created and updated to transaction details",
        ],
      },
      {
        title: "🔄 SFTP:",
        sub_list: ["i09 SFTP Stocks Rework"],
      },
    ],
  },
  {
    version: "v.1.9.46",
    date: "March 03, 2026",
    logs: [
      {
        title: "📦 PO Delivery Declarations Feature:",
        sub_list: [
          "Data Collection for Stores",
          "Reports",
          "Status Movements per PO Delivery",
        ],
      },
      {
        title: "📝 User Management: FOM Logs Report:",
        sub_list: ["Download FOM Logs movement"],
      },
      {
        title: "🔄 Lending Features Revamp :",
        sub_list: ["Lending Creation", "Lending Return", "Lending Dashboard"],
      },
    ],
  },
  {
    version: "v.1.9.45a",
    date: "January 29, 2026",
    logs: [
      {
        title: "🗂️ FOM Logs:",
        sub_list: [
          "Granted FOM user roles access to User Management",
          "Added the FOM Logs tab and profile",
        ],
      },
      {
        title: "📦 Cegid Upload:",
        sub_list: [
          "GTINs with or without PMIs no longer trigger an “not enough stock” error",
        ],
      },
    ],
  },
  {
    version: "v.1.9.45a",
    date: "January 29, 2025",
    logs: [
      {
        title: "🗂️ FOM Logs:",
        sub_list: [
          "Granted FOM user roles access to User Management",
          "Added the FOM Logs tab and profile",
        ],
      },
      {
        title: "📦 Cegid Upload:",
        sub_list: [
          "GTINs with or without PMIs no longer trigger an “not enough stock” error",
        ],
      },
    ],
  },
  {
    version: "v.1.9.45",
    date: "January 14, 2026",
    logs: [
      {
        title: "📝 User Access and Roles:",
        sub_list: ["New User Access Matrix - Remodeled to current workflow"],
      },
      {
        title: "🌐 Channel Seperation:",
        sub_list: [
          "DC and IC Separation of segment partition within the system",
        ],
      },
    ],
  },
  {
    version: "v.1.9.44a",
    date: "December 18, 2025",
    logs: [
      {
        title: "🛒 Ecom Update:",
        sub_list: [
          "Old and New SI Template pop-up selection",
          "Seller Center ID field",
        ],
      },
    ],
  },
  {
    version: "v.1.9.44",
    date: "October 15, 2025",
    logs: [
      {
        title: "🌐 General Update",
        sub_list: [
          "Applied type to search to all barcode scanner input fields",
        ],
      },
      {
        title: "🖨️ Printable AR",
        sub_list: ["Combine Dispatch and Gate Pass sections into one page"],
      },
      {
        title: "🏭 Warehouse Transaction",
        sub_list: ["Conversion 2.0 - Class Conversion"],
      },
      {
        title: "🛒 Ecommerce:",
        sub_list: ["Fraud Check feature bug fixed"],
      },
      {
        title: "🔍 DC/IC-Record Sales:",
        sub_list: [
          "Fixed issue where Cegid upload success was not reflecting in Sales Logs",
        ],
      },
    ],
  },
  {
    version: "v.1.9.43a",
    date: "October 1, 2025",
    logs: [
      {
        title: "🖨️ Printable AR",
        sub_list: [
          "Refined and updated overall layout for better readability",
          "Added Gate Pass page",
          "Added Dispatch page",
        ],
      },
      {
        title: "📊 Reports",
        sub_list: [
          "File exports for Inventory Movements and Daily Stock now include a timestamp in the filename",
        ],
      },
    ],
  },
  {
    version: "v.1.9.43",
    date: "September 24, 2025",
    logs: [
      {
        title:
          "📦 SKU Ranking (for SKU/GTIN flexibility in receiving orders from DCE)",
        sub_list: [],
      },
      {
        title: "📝 Printable AR update:",
        sub_list: [
          "Added new Field: ”Box Count” ",
          "Renamed: ”Box/Bag Count” → ”Bag Count”",
          "Added new Field: ”AR Number” (For Direct/Transfers only)",
          "Added new Field: ”Sales Invoice” (For Transmittals only)",
        ],
      },
      {
        title: "🛒 Ecommerce:",
        sub_list: [
          "Added ”Sub-warehouse Tag” column in OMS Dashboard",
          "Updated Default Value of Sub-Tag to: IQOS.com",
        ],
      },
      {
        title: "🔍 DC/IC-Record Sales:",
        sub_list: [
          "Updated Scanner behavior from scan-and-enter → type-to-search",
        ],
      },
    ],
  },
  {
    version: "v.1.9.42",
    date: "September 11, 2025",
    logs: [
      {
        title: "🔄 Transaction Updates",
        sub_list: [],
      },
      {
        title: "Convert UOM” Transaction: Reworked to “Conversion",
        sub_list: ["Added Bundling Feature (for PK to CT Conversions)"],
      },
      {
        title: "Inventory Transactions: Printable AR Update",
        sub_list: [
          "Source/Destination: Warehouse ID and Name",
          "Invoice ID: Changed from input to System-generated (WH ID-XXXXX)",
          "Removed “Requested by:” and “Date:” field",
        ],
      },
      {
        title: "🏭 Warehouse & Inventory",
        sub_list: [
          "Warehouse > Inventory: Added Warehouse name and ID in Submitted Transfers and Receivable Stocks Pages",
          "Warehouse Logs: Optimized Pagination",
          "WMS-Inventory: Delete “Drafts” Feature",
        ],
      },
      {
        title: "🌐 E-commerce / OMS",
        sub_list: ["Sub-warehouse Tagging"],
      },
      {
        title: "📊 Direct/Indirect Channel",
        sub_list: [
          "Record Sale Date Restriction Changes",
          "DC/IC Sales Report: Added GTIN and Date Created Timestamp",
          "Error Handling Update: “Inventory Already Exists”",
          "WMS-CEGID Update: Negative (-1) QTY Error Response Behavior",
        ],
      },
    ],
  },
  {
    version: "v.1.9.41a",
    date: "September 3, 2025",
    logs: [
      {
        title: "DC/IC Report",
        sub_list: ["Submitted Date Column"],
      },
      {
        title: "LSN Update: All warehouse extractable report",
        sub_list: [],
      },
      {
        title: "SKU Database Page: Pagination Update",
        sub_list: [],
      },
      {
        title: "WMS-Transactions: Printables",
        sub_list: ["New Fields for Bundle Count"],
      },
      {
        title: "WMS-Inventory > Home: Active Warehouse Default View",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.41",
    date: "August 6, 2025",
    logs: [
      {
        title: "Added warehouse status attribute",
        sub_list: [],
      },
      {
        title: "Improved the codentify layout",
        sub_list: [],
      },
      {
        title: "Fixed the conversion transaction date_updated column bug",
        sub_list: [],
      },
      {
        title: "Changed the low stock notification content",
        sub_list: [],
      },
      {
        title: "Removed the type column to low stock notification report",
        sub_list: [],
      },
      {
        title: "Warehouse inventory tab",
        sub_list: [
          "Added destination warehouse column to submitted transfer tab",
          "Added origin warehouse column to receiveable stock tab",
        ],
      },
    ],
  },
  {
    version: "v.1.9.40a",
    date: "July 30, 2025",
    logs: [
      {
        title: "Print button/function in Transaction",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.40",
    date: "July 16, 2025",
    logs: [
      {
        title: "Codentify Scanner: Redirect Transaction on click",
        sub_list: [],
      },
      {
        title: "EOD Report: Date Picker Update",
        sub_list: [],
      },
      {
        title: "Dropdown Field: Upgrade to Type-to-search",
        sub_list: [],
      },
      {
        title: "Added Invoice ID Column in Transaction Report",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.39",
    date: "June 14, 2025",
    logs: [
      {
        title: "Return Order: Fixed issue on missing GTIN value",
        sub_list: [],
      },
      {
        title: "Removed CLS/CRM Module",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.38",
    date: "June 10, 2025",
    logs: [
      {
        title: "Users",
        sub_list: ["Added change user status for Rider"],
      },
    ],
  },
  {
    version: "v.1.9.37",
    date: "June 03, 2025",
    logs: [
      {
        title: "EOD Report",
        sub_list: [
          "Added new non-sellable input fields",
          "Fixed issue on Finance upload button text",
          "Added access for executive and coach roles",
          "Added select all warehouse on download report",
          "Added accept PDF file for additional upload",
        ],
      },
    ],
  },
  {
    version: "v.1.9.36",
    date: "April 26, 2025",
    logs: [
      {
        title: "CEGID Upload",
        sub_list: [
          "Added searchable warehouse list",
          "Updated warehouse assignment access for each user",
        ],
      },
      {
        title: "EOD Report",
        sub_list: [
          "Added searchable warehouse list",
          "Updated submit button functionality for non-sellable and finance",
          "Updated Form fields",
        ],
      },
    ],
  },
  {
    version: "v.1.9.35",
    date: "April 21, 2025",
    logs: [
      {
        title: "IMS Report: Updated date selections",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.34",
    date: "April 14, 2025",
    logs: [
      {
        title: "User Management: Added filter by user status",
        sub_list: [],
      },
      {
        title: "Report: Added download EOD report",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.33",
    date: "April 08, 2025",
    logs: [
      {
        title: "CEGID Upload: Added date picker",
        sub_list: [],
      },
      {
        title: "Warehouse: Added Submitted Transfers tab",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.32",
    date: "Mar 25, 2025",
    logs: [
      {
        title: "Record Sales: Fixed warehouse assigned issue",
        sub_list: [],
      },
      {
        title:
          "Low Stock Notification: Added access for Direct & Indirect Channel",
        sub_list: [],
      },
      {
        title: "Return Order: Added new device status",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.31",
    date: "Mar 24, 2025",
    logs: [
      {
        title: "Inventory: Added Low Stock Notification",
        sub_list: [],
      },
      {
        title: "Reports: Updated EOD form",
        sub_list: [],
      },
      {
        title: "Return Order: Added new device status",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.30",
    date: "Mar 13, 2025",
    logs: [
      {
        title: "Fixed issue on FULL ADMIN role access",
        sub_list: [],
      },
      {
        title: "Warehouse logs: Updated Date Modified date format",
        sub_list: [],
      },
      {
        title: "Reports: Added new report type IMS",
        sub_list: [],
      },
      {
        title: "Transactions: Fixed expiration date for devices",
        sub_list: [],
      },
      {
        title: "Transmittal: Fixed issue on missing delivery source",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.28b",
    date: "Feb 14, 2025",
    logs: [
      {
        title: "Added new tabs for User Management",
        sub_list: [
          "E-commerce Portal",
          "Direct and Indirect Channel",
          "Full Admin",
        ],
      },
    ],
  },
  {
    version: "v.1.9.27",
    date: "Feb 05, 2025",
    logs: [
      {
        title: "Pick & Pack: Added quick scan quantities",
        sub_list: [],
      },
      {
        title:
          "Order Management: Added select all orders for assigning warehouse and SMS",
        sub_list: [],
      },
      {
        title: "Create Order: Updated price input field",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.26",
    date: "Jan 23, 2025",
    logs: [
      {
        title: "Reports: Updated reports function",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.25",
    date: "Jan 20, 2025",
    logs: [
      {
        title: "DCE Inventory: Updated users access",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.24",
    date: "Jan 05, 2025",
    logs: [
      {
        title: "Record Sales: Added records sales upload portal",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.23",
    date: "Dec 18, 2024",
    logs: [
      {
        title: "Order Management: Fixed issue of missing orders on the list",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.22",
    date: "Nov 07, 2024",
    logs: [
      {
        title: "SMS Settings: Updated message body limit",
        sub_list: [],
      },
      {
        title:
          "Verification: Added verification reason selection for CANCELLED and FLAGGED status",
        sub_list: [],
      },
      {
        title:
          "Record Sales: Added Club status input and Remittance slip upload",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.21",
    date: "Oct 02, 2024",
    logs: [
      {
        title: "Order Management: Added new SMS settings",
        sub_list: [
          "Marketplace SMS: updated layout",
          "Ecommerce SMS: Warehouse/Hub list and Created SMS",
        ],
      },
    ],
  },
  {
    version: "v.1.9.20",
    date: "Sept 30, 2024",
    logs: [
      {
        title: "Order Management: Added fraud checker",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.19",
    date: "Sept 25, 2024",
    logs: [
      {
        title: "Manual Order: Updated SKU list selection",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.18",
    date: "Sept 24, 2024",
    logs: [
      {
        title: "Manual Order: Added devices on select items",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.17",
    date: "Sept 18, 2024",
    logs: [
      {
        title: "Transaction: Fixed issue on editing batch items for non device",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.16",
    date: "Sept 17, 2024",
    logs: [
      {
        title:
          "Transaction: Added auto batch id fill and new delivery source dropdown",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.15",
    date: "Sept 02, 2024",
    logs: [
      {
        title: "Record Sales: Optimized mobile view",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.14",
    date: "Aug 28, 2024",
    logs: [
      {
        title: "Order: Added age verification display",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.13",
    date: "Aug 05, 2024",
    logs: [
      {
        title: "Transactions: Fixed issue on quantities while scanning",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.12",
    date: "Aug 01, 2024",
    logs: [
      {
        title: "Record Sales: Added lead source field",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.11",
    date: "July 30, 2024",
    logs: [
      {
        title: "Order Management: Added Redaction logs",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.10",
    date: "June 25, 2024",
    logs: [
      {
        title: "Record sales: Updated access for Executive and Coach roles",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.9",
    date: "June 24, 2024",
    logs: [
      {
        title: "Order Management: Added SMS template settings",
        sub_list: [],
      },
      {
        title: "Direct Retail Updates:",
        sub_list: [
          "Record sales: Added error message for duplicate invoice ID upon submit",
          "Transaction: Added delivery source input for transmittal",
          "Updated user access",
          "Record sales and Guided trial: Removed name fields",
        ],
      },
    ],
  },
  {
    version: "v.1.9.8",
    date: "May 29, 2024",
    logs: [
      {
        title: "Transfer: Fixed issue on device expiration date value",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.7",
    date: "May 22, 2024",
    logs: [
      {
        title: "Record Sales: Updated date created value",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.6",
    date: "May 20, 2024",
    logs: [
      {
        title: "Updated GTIN scanning restriction",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.4",
    date: "April 23, 2024",
    logs: [
      {
        title: "Record Sales: Added Notes input",
        sub_list: [],
      },
      {
        title: "Sales Logs updates:",
        sub_list: ["Added Replacement list tab", "Added view receipt on list"],
      },
    ],
  },
  {
    version: "v.1.9.3",
    date: "April 17, 2024",
    logs: [
      {
        title: "Transaction: Added direct transfer",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.2",
    date: "April 16, 2024",
    logs: [
      {
        title: "Order: Fixed ZYN order incorrect GTIN display",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.1",
    date: "April 08, 2024",
    logs: [
      {
        title: "Order: Added CSC manual create order",
        sub_list: [],
      },
      {
        title: "Scanner: Added Codentify warehouse name display",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.9.0",
    date: "Febuary 20, 2024",
    logs: [
      {
        title: "Reports: Updated DR sales reports",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.99",
    date: "Febuary 05, 2024",
    logs: [
      {
        title: "3rd Party Management: Added ZYN",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.98",
    date: "January 31, 2024",
    logs: [
      {
        title: "Updated user roles access",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.97",
    date: "January 16, 2024",
    logs: [
      {
        title: "Order: Fixed issue on BLENDS incorrect GTIN.",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.96",
    date: "January 09, 2024",
    logs: [
      {
        title: "Inventory: Added DCE Inventory and SFTP trigger",
        sub_list: [],
      },
      {
        title: "Order: Added order reply trigger",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.95",
    date: "January 04, 2024",
    logs: [
      {
        title: "Return Order: Fixed issue on return order scanning",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.94",
    date: "December 12, 2023",
    logs: [
      {
        title:
          "Transaction: Fixed issue on device quantity not equal to serial count",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.93",
    date: "December 07, 2023",
    logs: [
      {
        title: "Order: Fixed TEREA pack GTIN issue",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.92",
    date: "November 20, 2023",
    logs: [
      {
        title: "Order: Added ZYN SMS template",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.91",
    date: "November 17, 2023",
    logs: [
      {
        title:
          "Order Scanning: Fixed issue on item with same sku but different GTIN",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.90",
    date: "October 13, 2023",
    logs: [
      {
        title:
          "Dispatch Management: Fixed issue on getting orders when selecting date",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.89",
    date: "October 10, 2023",
    logs: [
      {
        title: "Device Tab: Fixed issue of some device not showing,",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.88",
    date: "October 04, 2023",
    logs: [
      {
        title: "CLS: Added edit trial function",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.87",
    date: "October 02, 2023",
    logs: [
      {
        title:
          "Transaction: Added scanning condition for IQOS Iluma pebble grey",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.86",
    date: "September 24, 2023",
    logs: [
      {
        title: "Item Editor: Added Zyn items",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.85",
    date: "September 13, 2023",
    logs: [
      {
        title: "Trial Management: Added sort list",
        sub_list: [],
      },
      {
        title: "P5/CLS: Added download report",
        sub_list: [],
      },
      {
        title: "Record Sales: Added TDSK menthol variant",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.84",
    date: "September 07, 2023",
    logs: [
      {
        title: "Order: Fixed issue on Zyn orders not showing on the list",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.83",
    date: "September 05, 2023",
    logs: [
      {
        title: "Activations: Fixed issue on scanning vouchers",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.82",
    date: "September 04, 2023",
    logs: [
      {
        title: "Trial Management: Added search and filter list",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.81",
    date: "August 18, 2023",
    logs: [
      {
        title:
          "Codentify Scanner: Fixed issue on scanning codentify/serial on some device.",
        sub_list: [],
      },
      {
        title:
          "Return Unpack: Fixed unable to scan multiple serial in one line item",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.80",
    date: "August 16, 2023",
    logs: [
      {
        title: "Added new module: CLS",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.79",
    date: "June 29, 2023",
    logs: [
      {
        title: "Direct Retail Updates: ",
        sub_list: [
          "Reports: Added download guided trial",
          "Guided trial: Added guided trial type field",
        ],
      },
    ],
  },
  {
    version: "v.1.8.78",
    date: "June 29, 2023",
    logs: [
      {
        title: "Transactions: Added no cache policy",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.77",
    date: "June 29, 2023",
    logs: [
      {
        title: "Added new lending fee: LP06",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.76",
    date: "June 29, 2023",
    logs: [
      {
        title: "Order Tracking: Updated order status display",
        sub_list: [],
      },
    ],
  },
  {
    version: "v.1.8.75",
    date: "June 21, 2023",
    logs: [
      {
        title:
          "Assign Rider: Added change rider option and cancel rider order confirmation.",
        sub_list: [],
      },
      {
        title: "Warehouse logs: Added new tab on click.",
        sub_list: [],
      },
      {
        title: "Ecomm Reports: Added transaction type report download.",
        sub_list: [],
      },
      {
        title: "Users: Updated user access restrictions",
        sub_list: [],
      },
    ],
  },
];
