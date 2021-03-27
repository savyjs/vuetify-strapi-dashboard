/*
safely save your installment time
 */
try {
  let axios = require('axios');
  let server = 'https://crm.savyjs.com/installs'
  let time = new Date().toISOString();
  let name = 'VSD';
  axios.post(server, {time, name}).catch(e => {
  }).then(res => {
    if (res && res.message) {
      console.log(res.message)
    } else {
      console.log('thanks for using ' + name + ' :)')
    }
  });
} catch (e) {
  console.error({e})
}
