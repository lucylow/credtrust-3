import { web3telegram } from './web3telegram.client';

export async function fetchMyContacts() {
  return web3telegram.fetchMyContacts();
}

export async function fetchUserContacts(user: string) {
  return (web3telegram as any).fetchUserContacts({ user });
}
