import { apiCall } from '@/helpers/axios';
import { Endpoints } from '@/helpers/constants';

/**
 * Function to fetch all products
 * @returns {Promise} A promise that resolves with the response data
 */
const getAllProducts = () =>
  apiCall({
    method: 'GET',
    url: `${Endpoints.GET_ALL_POKEMONS}`,
    withCredentials: false,
  });

export { getAllProducts };
