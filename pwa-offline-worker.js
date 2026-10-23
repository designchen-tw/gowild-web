/** Deploy as a separate Worker, routed ONLY to gowild.one/gw-offline/*.
 * It does not proxy Webflow pages or replace the weather Worker.
 * Set OFFLINE_ASSET_COMMIT to the verified GitHub release commit when deploying.
 */
export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(!['GET','HEAD'].includes(request.method))return new Response('Method not allowed',{status:405,headers:{Allow:'GET, HEAD'}});
    if(url.pathname==='/gw-offline/health')return Response.json({service:'gowild-offline',release:'2026.10.24.1'},{headers:{'Cache-Control':'no-store'}});
    if(url.pathname!=='/gw-offline/sw.js')return new Response('Not found',{status:404});
    const commit=env.OFFLINE_ASSET_COMMIT;
    if(!/^[0-9a-f]{40}$/.test(commit||''))return new Response('Offline release not configured',{status:503});
    const file=env.OFFLINE_DISABLED==='true'?'offline-disable-v1.js':'offline-sw-v1.js';
    const upstream=await fetch('https://cdn.jsdelivr.net/gh/designchen-tw/gowild-web@'+commit+'/pwa/'+file);
    if(!upstream.ok)return new Response('Offline release unavailable',{status:502,headers:{'Cache-Control':'no-store'}});
    return new Response(request.method==='HEAD'?null:upstream.body,{headers:{'Content-Type':'application/javascript; charset=utf-8','Cache-Control':'no-cache','Service-Worker-Allowed':'/','X-Content-Type-Options':'nosniff'}});
  }
};
