export const formElements = [
  {
    name: "name",
    label: "Name",
    inputType: "Input",
    placeholder: "Enter Name",
  },
  {
    name: "username",
    label: "Username",
    inputType: "Input",
    placeholder: "Enter Username",
  },
  {
    name: "phone_number",
    type: "number",
    label: "Contact Number",
    inputType: "Input",
    placeholder: "Enter Contact Number",
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    inputType: "Input",
    placeholder: "Enter Email",
  },
  {
    name: "roles",
    label: "Roles",
    inputType: "Multiselect",
    dropdown: [{ name: "SalesExpert" }, { name: "SalesExecutive" }],
  },
];
