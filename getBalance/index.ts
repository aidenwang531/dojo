import axios from "axios";
const myHeaders = {
  "content-type": "application/json",
};

var raw = JSON.stringify({
  "id": 2,
  "jsonrpc": "2.0",
  "method": "get_cells",
  "params": [
    {
      "script": {
        "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
        "hash_type": "type",
        "args": "0x4e9d00c34423f567029475c2c523772a1fb38c4d"
      },
      "script_type": "lock"
    },
    "asc",
    "0x64"
  ]
});
const getRaw = (lastCursor?: string) => {
  const body = {
    "id": 2,
    "jsonrpc": "2.0",
    "method": "get_cells",
    "params": [
      {
        "script": {
          "code_hash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
          "hash_type": "type",
          "args": "0x4e9d00c34423f567029475c2c523772a1fb38c4d"
        },
        "script_type": "lock"
      },
      "asc",
      "0x64"
    ]
  }
  if(lastCursor) {
    body.params.push(lastCursor)
  }
  return JSON.stringify(body);
}

const getData = (lastCursor?: string) => {
  const raw = getRaw(lastCursor);
  return axios.post('http://localhost:8116', raw, {
    headers: myHeaders
  }).then(function (response) {
    return response.data.result
  }).catch(function (error) {
    console.log(error)
    console.log(error);
  });
}
async function* collect() {
  let result = await getData()
  let lastCursor = result.lastCursor
  let objects = result.objects
  let resultLength = objects.length;
  for(let i=0; i < resultLength; i++) {
      if(i === resultLength - 1) {
          result = await getData(lastCursor)
          lastCursor = result.lastCursor
          objects = objects.concat(result.objects)
          resultLength = objects.length;
      }
      yield objects[i];
  }
}

async function fetch() {
  let balance = BigInt(0)
  for await (const cell of collect()) {
    balance += BigInt(cell.output.capacity);
    //1千万ckb
    if(balance > BigInt(1000000000000000)) {
      break
    }
  }
  console.log(balance);
}
fetch()



