import { fetchUtils, DataProvider } from 'react-admin';
import { stringify } from 'query-string';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function httpClient(url: string, options: fetchUtils.Options = {}) {
  const tieneHeaders = options.headers;
  if (!tieneHeaders) {
    const headersNuevos = new Headers({ Accept: 'application/json' });
    options.headers = headersNuevos;
  }

  const token = localStorage.getItem('token');

  if (token) {
    const headers = options.headers as Headers;
    headers.set('Authentication', token);
  }

  const resultado = fetchUtils.fetchJson(url, options);
  return resultado;
}

function removeUndefinedFields(obj: any): any {
  if (obj === null) {
    return obj;
  }
  if (obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    const arregloLimpio = [];
    for (let i = 0; i < obj.length; i++) {
      const elementoLimpio = removeUndefinedFields(obj[i]);
      arregloLimpio.push(elementoLimpio);
    }
    return arregloLimpio;
  }

  if (typeof obj === 'object') {
    const objetoLimpio: any = {};
    const llaves = Object.keys(obj);

    for (let i = 0; i < llaves.length; i++) {
      const llave = llaves[i];
      const valor = obj[llave];

      if (valor !== undefined) {
        objetoLimpio[llave] = removeUndefinedFields(valor);
      }
    }

    return objetoLimpio;
  }

  return obj;
}

export const dataProvider: DataProvider = {
  getList: async function (resource, params) {
    const paginacion = params.pagination;
    const pagina = paginacion.page;
    const elementosPorPagina = paginacion.perPage;

    const ordenamiento = params.sort;
    const campoOrdenamiento = ordenamiento.field;
    const direccionOrdenamiento = ordenamiento.order;

    const inicio = (pagina - 1) * elementosPorPagina;
    const fin = pagina * elementosPorPagina;

    const consulta: any = {
      _sort: campoOrdenamiento,
      _order: direccionOrdenamiento,
      _start: inicio,
      _end: fin,
    };

    const filtros = params.filter;
    const llavesFiltros = Object.keys(filtros);
    for (let i = 0; i < llavesFiltros.length; i++) {
      const llave = llavesFiltros[i];
      consulta[llave] = filtros[llave];
    }

    const parametrosTexto = stringify(consulta);
    const url = API_URL + '/' + resource + '?' + parametrosTexto;

    const respuesta = await httpClient(url);
    const headers = respuesta.headers;
    const datos = respuesta.json;

    const totalTexto = headers.get('X-Total-Count');
    let total = 0;
    if (totalTexto) {
      total = parseInt(totalTexto, 10);
    }

    const resultado = {
      data: datos,
      total: total,
    };
    return resultado;
  },

  getOne: async function (resource, params) {
    const id = params.id;

    const url = API_URL + '/' + resource + '/' + id;

    const respuesta = await httpClient(url);
    const datos = respuesta.json;

    const resultado = { data: datos };
    return resultado;
  },

  getMany: async function (resource, params) {
    const ids = params.ids;

    const consulta = {
      id: ids,
    };

    const parametrosTexto = stringify(consulta);
    const url = API_URL + '/' + resource + '?' + parametrosTexto;

    const respuesta = await httpClient(url);
    const datos = respuesta.json;

    const resultado = { data: datos };
    return resultado;
  },

  getManyReference: async function (resource, params) {
    const paginacion = params.pagination;
    const pagina = paginacion.page;
    const elementosPorPagina = paginacion.perPage;

    const ordenamiento = params.sort;
    const campoOrdenamiento = ordenamiento.field;
    const direccionOrdenamiento = ordenamiento.order;

    const inicio = (pagina - 1) * elementosPorPagina;
    const fin = pagina * elementosPorPagina;

    const consulta: any = {
      _sort: campoOrdenamiento,
      _order: direccionOrdenamiento,
      _start: inicio,
      _end: fin,
    };

    const filtros = params.filter;
    const llavesFiltros = Object.keys(filtros);
    for (let i = 0; i < llavesFiltros.length; i++) {
      const llave = llavesFiltros[i];
      consulta[llave] = filtros[llave];
    }

    const campoTarget = params.target;
    const idReferencia = params.id;
    consulta[campoTarget] = idReferencia;

    const parametrosTexto = stringify(consulta);
    const url = API_URL + '/' + resource + '?' + parametrosTexto;

    const respuesta = await httpClient(url);
    const headers = respuesta.headers;
    const datos = respuesta.json;

    const totalTexto = headers.get('X-Total-Count');
    let total = 0;
    if (totalTexto) {
      total = parseInt(totalTexto, 10);
    }

    const resultado = {
      data: datos,
      total: total,
    };
    return resultado;
  },

  create: async function (resource, params) {
    const url = API_URL + '/' + resource;

    const datos = params.data;
    const datosLimpios = removeUndefinedFields(datos);
    const datosTexto = JSON.stringify(datosLimpios);

    const respuesta = await httpClient(url, {
      method: 'POST',
      body: datosTexto,
    });
    const datosRespuesta = respuesta.json;

    const resultado = { data: datosRespuesta };
    return resultado;
  },

  update: async function (resource, params) {
    const id = params.id;

    const url = API_URL + '/' + resource + '/' + id;

    const datos = params.data;
    const datosLimpios = removeUndefinedFields(datos);
    const datosTexto = JSON.stringify(datosLimpios);

    const respuesta = await httpClient(url, {
      method: 'PUT',
      body: datosTexto,
    });

    const datosRespuesta = respuesta.json;

    const resultado = { data: datosRespuesta };
    return resultado;
  },

  updateMany: async function (resource, params) {
    const ids = params.ids;

    const datos = params.data;
    const datosLimpios = removeUndefinedFields(datos);
    const datosTexto = JSON.stringify(datosLimpios);

    const promesas = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const url = API_URL + '/' + resource + '/' + id;
      const promesa = httpClient(url, {
        method: 'PUT',
        body: datosTexto,
      });
      promesas.push(promesa);
    }

    const respuestas = await Promise.all(promesas);

    const idsActualizados = [];
    for (let i = 0; i < respuestas.length; i++) {
      const respuesta = respuestas[i];
      const datosRespuesta = respuesta.json;
      const id = datosRespuesta.id;
      idsActualizados.push(id);
    }

    const resultado = { data: idsActualizados };
    return resultado;
  },

  delete: async function (resource, params) {
    const id = params.id;

    const url = API_URL + '/' + resource + '/' + id;

    const respuesta = await httpClient(url, {
      method: 'DELETE',
    });
    const datosRespuesta = respuesta.json;

    const resultado = { data: datosRespuesta };
    return resultado;
  },

  deleteMany: async function (resource, params) {
    const ids = params.ids;

    const promesas = [];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const url = API_URL + '/' + resource + '/' + id;
      const promesa = httpClient(url, {
        method: 'DELETE',
      });
      promesas.push(promesa);
    }

    const respuestas = await Promise.all(promesas);

    const idsEliminados = [];
    for (let i = 0; i < respuestas.length; i++) {
      const respuesta = respuestas[i];
      const datosRespuesta = respuesta.json;
      const id = datosRespuesta.id;
      idsEliminados.push(id);
    }

    const resultado = { data: idsEliminados };
    return resultado;
  },
};
