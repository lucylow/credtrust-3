import { IExecWeb3telegram, getWeb3Provider } from '@iexec/web3telegram';

const provider = getWeb3Provider(process.env.IEXEC_PRIVATE_KEY!);

export const web3telegram = new IExecWeb3telegram(provider, {
  ipfsGateway: 'https://ipfs.iex.ec',
});
