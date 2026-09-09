export const DYNAMIC_PRICING_ADMIN_EMAILS = [
  "rofep35802@calunia.com",
  "tgiroti@yahoo.com",
  "vinu988031@gmail.com",
  "rafi496@yopmail.com",
  "tony@ecostance.com",
  "chiranjib.jena@gmail.com",
  "rpkmrroopkumar8@gmail.com",
];

export const isDynamicPricingAdmin = (email) =>
  !!email && DYNAMIC_PRICING_ADMIN_EMAILS.includes(email);
