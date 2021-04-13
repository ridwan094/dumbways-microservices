const axios = require('axios');
const { plural } = require('pluralize');
const config = require('./config.json');

module.exports = (service) => async ({type, body = {}, id = '', headers}) => {
  const httpRequester = axios.create({
    baseURL: config[service.toUpperCase() + '_URL'] + '/api',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    }
  })
  try {
    if(type == 'find'){
      const { data } = await httpRequester.get('/' + plural(service))
      return data.data
    }
    if(type == 'get'){
      const { data } = await httpRequester.get('/' + service + '/' + id)
      return data.data
    }
    if(type == 'create'){
      const { data } = await httpRequester.post('/' + service, body)
      return data.data
    }
    if(type == 'update'){
      const { data } = await httpRequester.patch('/' + service + '/' + id, body)
      return data.data
    }
    if(type == 'delete'){
      const { data } = await httpRequester.delete('/' + service + '/' + id)
      return data.data
    }
    if(type == 'register'){
      const { data } = await httpRequester.post('/register', body)
      return data.data
    }
    if(type == 'login'){
      const { data } = await httpRequester.post('/login', body)
      return data.data
    }
  } catch (e) {
    console.log(e);
    throw e.response.data.message;
  }
  
}