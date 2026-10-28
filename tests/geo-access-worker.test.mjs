import assert from 'node:assert/strict';
import worker from '../geo-access-worker.js';

const originalFetch=globalThis.fetch;
const forwarded=[];
globalThis.fetch=async request=>{
  forwarded.push(request);
  return new Response('origin response',{status:201,headers:{'x-origin':'retained'}});
};
function request(country,verifiedBot,header){
  const req=new Request('https://gowild.one/longdong?source=test',{
    headers:{...(header===undefined?{}:{'x-gowild-verified-bot':header}),'x-example':'keep'}
  });
  if(country!==undefined||verifiedBot!==undefined){
    Object.defineProperty(req,'cf',{value:{country,...(verifiedBot===undefined?{}:{botManagement:{verifiedBot}})}});
  }
  return req;
}
function transformHeaders(req,clientBot){
  const next=new Request(req);
  next.headers.set('x-gowild-verified-bot','0');
  if(clientBot)next.headers.set('x-gowild-verified-bot','1');
  if(req.cf)Object.defineProperty(next,'cf',{value:req.cf});
  return next;
}
try{
  const countries='TW JP CN HK MO SG MY VN TH KR PH ID AU NZ AT BE DK FI FR DE IE IT NL PL PT ES SE GB CH NO IS LI AD MC SM VA'.split(' ');
  assert.equal(countries.length,36);
  for(const country of countries)assert.equal((await worker.fetch(request(country))).status,201,country);
  assert.equal(forwarded.length,36);
  for(const country of ['US','CA','BR','tw',undefined]){
    const count=forwarded.length;
    const response=await worker.fetch(request(country));
    assert.equal(response.status,404);
    assert.equal(forwarded.length,count,'Blocked requests must not reach origin');
    assert.equal(response.headers.get('cache-control'),'no-store');
    assert.equal(response.headers.get('x-robots-tag'),'noindex, nofollow');
    assert.equal(response.headers.get('content-type'),'text/html; charset=UTF-8');
    const body=await response.text();
    assert.match(body,/<meta name="robots" content="noindex, nofollow">/);
    assert.match(body,/<h1>404 Not Found<\/h1>/);
  }
  assert.equal((await worker.fetch(request('US',true))).status,201);
  assert.equal((await worker.fetch(request(undefined,true))).status,201);
  assert.equal((await worker.fetch(request('US',false,'1'))).status,404,'Explicit metadata false wins');
  assert.equal((await worker.fetch(request('US',undefined,'1'))).status,201,'Header fallback when metadata absent');
  assert.equal((await worker.fetch(request('US','not-a-boolean','1'))).status,201);
  for(const header of ['true','0','01'])assert.equal((await worker.fetch(request('US',undefined,header))).status,404);
  const visitor=transformHeaders(request('US',undefined,'1'),false);
  assert.equal(visitor.headers.get('x-gowild-verified-bot'),'0','Rule 1 overwrites a supplied header');
  assert.equal((await worker.fetch(visitor)).status,404);
  const bot=transformHeaders(request('US',undefined,'0'),true);
  assert.equal(bot.headers.get('x-gowild-verified-bot'),'1','Rule 2 follows rule 1 for verified bots');
  assert.equal((await worker.fetch(bot)).status,201);
  assert.equal(forwarded.at(-1).headers.get('x-gowild-verified-bot'),null);
  assert.equal((await worker.fetch(transformHeaders(request('US',false,'1'),true))).status,404,'Worker metadata still has precedence');
  const original=request('TW',false,'1');
  await worker.fetch(original);
  assert.equal(forwarded.at(-1).headers.get('x-gowild-verified-bot'),null);
  assert.equal(original.headers.get('x-gowild-verified-bot'),'1','Incoming request remains unchanged');
  assert.equal(forwarded.at(-1).headers.get('x-example'),'keep');
  assert.equal(forwarded.at(-1).url,original.url);
  const post=new Request('https://gowild.one/contact?lang=en',{method:'POST',headers:{'content-type':'text/plain','x-gowild-verified-bot':'1'},body:'test body'});
  Object.defineProperty(post,'cf',{value:{country:'TW'}});
  const result=await worker.fetch(post);
  assert.equal(result.status,201);
  assert.equal(result.headers.get('x-origin'),'retained');
  assert.equal(await result.text(),'origin response');
  assert.equal(forwarded.at(-1).method,'POST');
  assert.equal(await forwarded.at(-1).text(),'test body');
  assert.equal(forwarded.at(-1).headers.get('x-gowild-verified-bot'),null);
  console.log('PASS: 36 regions, verified-bot precedence, ordered Transform Rules, blocked responses, stripped internal header and preserved origin request/response');
}finally{
  globalThis.fetch=originalFetch;
}
