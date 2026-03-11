const API_URL = 'https://api.novaposhta.ua/v2.0/json/';
const apiKey = import.meta.env.VITE_NP_API_KEY as string | undefined;

type SettlementAddress = {
  Present: string;
  Warehouses: string;
  MainDescription: string;
  Area: string;
  Region: string;
  DeliveryCity: string;
  Ref: string;
};

type SearchSettlementsResponse = {
  success: boolean;
  data: {
    TotalCount: number;
    Addresses: SettlementAddress[];
  }[];
};

type Warehouse = {
  Description: string;
  ShortAddress: string;
  Phone: string;
  Ref: string;
  Number: string;
};

type WarehousesResponse = {
  success: boolean;
  data: Warehouse[];
};

async function callNovaPoshta<T>(modelName: string, calledMethod: string, methodProperties: Record<string, any>) {
  if (!apiKey) {
    throw new Error('Nova Poshta API key is missing (VITE_NP_API_KEY)');
  }
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ apiKey, modelName, calledMethod, methodProperties }),
  });
  if (!res.ok) throw new Error('Nova Poshta API request failed');
  return (await res.json()) as { success: boolean; data: T };
}

export async function searchCities(query: string) {
  const { data } = await callNovaPoshta<SearchSettlementsResponse['data']>(
    'Address',
    'searchSettlements',
    { CityName: query, Limit: 8, Page: 1 }
  );
  const addresses = (data?.[0]?.Addresses ?? []) as SettlementAddress[];
  return addresses.map((a) => ({
    label: a.Present,
    ref: a.Ref,
    warehouses: Number(a.Warehouses) || 0,
  }));
}

export async function getWarehouses(cityRef: string) {
  const { data } = await callNovaPoshta<WarehousesResponse['data']>(
    'AddressGeneral',
    'getWarehouses',
    { CityRef: cityRef, Language: 'ru' }
  );
  const list = (data ?? []) as Warehouse[];
  return list.map((w) => ({
    label: `${w.Number}. ${w.Description}`,
    ref: w.Ref,
    short: w.ShortAddress,
  }));
}
