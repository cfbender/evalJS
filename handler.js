'use strict';
const evalJS = require("./lib/eval");

module.exports.test = async (event, context, callback) => {

  let { code, tests } = JSON.parse(event.body);

  if(event.query){
    tests = event.query.submit
      ? `
    expect(flatten([1, 2, [3, 4, [5, 6], 7, 8], 9, 10])).to.eql([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    expect(flatten([])).to.eql([]);
    expect(flatten([1])).to.eql([1]);
    expect(flatten([[[[[[5]]]]]])).to.eql([5]);
    `
      : tests;
  }

    let response;
  try {
    let result = await evalJS({ code, tests });
    if (result.result instanceof Error) {
      result.result = result.result.toString();
    }
    response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error(error);
    response = {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
      },
      body: JSON.stringify(error),
    };
  }

  callback(null, response);
};
