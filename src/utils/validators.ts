export const FIELD_REQUIRE_MESSAGE = "This field is required"
export const NAME_RULE = /^[\p{L}0-9\s]{4,}$/u
export const CATEGORY_RULE = /^[A-Za-z\s]{4,}$/
export const PHONE_RULE = /^(0[1-9][0-9]{8,9})$/
export const EMAIL_RULE = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
export const EMAIL_RULE_MESSAGE =
  "Email is invalid. (example:lehung020903@gmail.com)"
export const PASSWORD_RULE =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
export const PASSWORD_RULE_MESSAGE =
  "Password must include at least 1 letter, a number, and at least 8 characters"
export const PHONE_RULE_MESSAGE = "Please enter the correct phone number format"
export const NAME_RULE_MESSAGE = "Fullname must be at least 4 characters"
