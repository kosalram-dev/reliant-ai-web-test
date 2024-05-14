import { apiCall } from '@/helpers/axios';
import { Endpoints } from '@/helpers/constants';

const getAllProducts = () =>
  apiCall({
    method: 'GET',
    url: `${Endpoints.GET_ALL_POKEMONS}`,
    withCredentials: false,
  });

export { getAllProducts };