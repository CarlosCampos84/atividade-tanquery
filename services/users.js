import axios from 'axios';
import { API_URL, USERS_ENDPOINT } from '../constants';

const api = axios.create({
  baseURL: API_URL,
  timeout: 8000, // evita “loading infinito” se a rede travar
});

/** ==== FLAGS DE TESTE ==== */
export const TEST_FORCE_ERROR = false; // mude p/ true para simular ERRO
export const TEST_DELAY_MS = 800;      // atraso p/ ver "Carregando..."
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/** ======================== */

export const getUsers = async ({ signal } = {}) => {
  // atraso artificial para exibir o loading
  await sleep(TEST_DELAY_MS);

  // erro proposital para testes
  if (TEST_FORCE_ERROR) {
    throw new Error('Erro proposital para teste');
  }

  const res = await api.get(USERS_ENDPOINT, { signal });
  return res.data;
};
