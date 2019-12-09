const { NodeVM } = require("vm2");

module.exports =  async function evalJS(
  { code, tests },
  timeout = 10000
) {
  const vm = new NodeVM({
    console: "redirect",
    sandbox: {},
    require: {
      context: "sandbox",
      builtin: ["*"],
      external: true,
      import: ["chai"]
    },
    timeout
  });

  let logs = [];

  vm.on("console.log", (data) => {
    logs.push(data);
  });

  let result = await vm.run(
    `const {expect} = require('chai'); 
        ${code} 
      
        try{
            ${tests}
            
            module.exports = {passed: true}
        } catch(error){
            module.exports = error
            }`,
    "test.ts"
  );

  return { result, logs, tests, code };
}
