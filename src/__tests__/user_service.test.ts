import { isExternalEmailFromDomain } from '../services';

describe('User service methods', () => {
  it('Email is from the organization domain', () => {
    expect(
      isExternalEmailFromDomain('Jhon@myorG.com', 'Myorg.com'),
    ).toBeFalsy();
  });

  it('Email is not from the organization domain', () => {
    expect(
      isExternalEmailFromDomain('jhon@example.com', 'myorg.com'),
    ).toBeTruthy();
  });

  it('Undefined user email', () => {
    expect(isExternalEmailFromDomain(undefined, 'myorg.com')).toBeTruthy();
  });

  it('Undefined domain', () => {
    expect(isExternalEmailFromDomain('jhon@myOrg.com', undefined)).toBeTruthy();
  });

  it('Undefined user email and domain', () => {
    expect(isExternalEmailFromDomain(undefined, undefined)).toBeTruthy();
  });

  it('Email is not a valid one', () => {
    expect(isExternalEmailFromDomain('justOneString', 'myorg.com')).toBeTruthy();
  });
});
