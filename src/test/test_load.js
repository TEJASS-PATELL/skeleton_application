const http = require('k6/http');
const { check, sleep } = require('k6');

export let options = {
  vus: 100,
  duration: '30s',
};

export default function () {
  const res = http.get('https://all-in-one-study-hub.onrender.com/api/discussion/getdiscussion'); 

  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  
  sleep(1); // 1 second ka wait (real user ki tarah)
}