"use strict";

var api = require('./server2'); // api.database('content/')


api.write('content/');
api.start('content/'); // async function getContent() {
//     return await api.get(`pages/about`, null);
// }
// getContent().then((content) => {
//     console.log(content)
// })