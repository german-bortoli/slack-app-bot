/**
 * Extract domain from an email
 *
 * @param email User Email
 * @returns string Can return an empty string if the domain is not found
 */
export const extractEmailDomain = (email: string): string => {
  const emailParts = email.split('@');

  if (emailParts.length === 2) {
    return emailParts[1];
  }

  return '';
};

/**
 * Check if the email is from the organization domain
 * @param email
 * @param domain
 * @returns boolean
 */
const isEmailFromOrganizationDomain = (
  email: string,
  domain: string,
): boolean => {
  return extractEmailDomain(email).toLowerCase() === domain.toLowerCase();
};

/**
 * Check if the user email domain is different from the team domain
 * @param userEmail
 * @param teamDomain
 * @returns boolean
 */
export const isExternalEmailFromDomain = (
  email: string,
  domain: string,
): boolean => {
  return !isEmailFromOrganizationDomain(email, domain);
};
