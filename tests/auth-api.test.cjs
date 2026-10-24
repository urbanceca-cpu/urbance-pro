const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
test('application client retains HTTP status so outages cannot masquerade as signed-out sessions',async()=>{
 for(const status of [401,503]){
  const mod={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/components/ops/AuthForm.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText,{module:mod,exports:mod.exports,require:()=>({}),fetch:async()=>({ok:false,status,json:async()=>({error:'fixture failure'})}),Error,JSON});
  await assert.rejects(mod.exports.api('application'),error=>error instanceof mod.exports.ApiError&&error.status===status&&error.message==='fixture failure');
 }
});
