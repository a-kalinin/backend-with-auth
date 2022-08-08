/* eslint-disable max-len */
export function stringLiteralArray<T extends string>(a: T[]) {
  return a;
}

/**
 * Stringified UUIDv4.
 * See [RFC 4112](https://tools.ietf.org/html/rfc4122)
 * @pattern [0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-4[0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}
 * @format uuid
 * @example "4f5620c0-d793-4ba4-b97f-17ba00c2cd7b"
 */
export type UUID = string;

/**
 * E-mail string.
 * See the [W3C HTML5 specification](http://www.w3.org/TR/html5/forms.html#valid-e-mail-address)
 * @pattern [a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*
 * @format email
 * @example "user@example.com"
 */
export type EmailT = string;

/**
 * Password
 * See [RFC 4112](https://tools.ietf.org/html/rfc4122)
 * @minLength 5 Password should contain as least 5 characters
 * @example "secretPassword"
 */
export type PasswordT = string;
