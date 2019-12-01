// functions
let getScenesInZone = () => {
  let records = responseData.result.records;
  let scenesInZone = {};
  // each record loop
  for (let i=0; i<records.length; i++) {
    let zone = records[i].Zone;
    // push record data into scenesInZone with key 'zone'
    if (scenesInZone[zone]) {
      // key 'zone' is exist
      scenesInZone[zone].push(records[i]);
    }
    else {
      // new key
      scenesInZone[zone] = [records[i]];
    }
  }
  return scenesInZone;
};


// main code
let xhr = new XMLHttpRequest();
xhr.open('get',
         'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',
         false);    // wait for data
console.log('xhr.open()');

xhr.send();
console.log('xhr.send()');

let responseData = JSON.parse(xhr.responseText);  // trace json data

let scenesInZone = getScenesInZone();             // analysis scenes in every zone
console.log(Object.keys(scenesInZone));





