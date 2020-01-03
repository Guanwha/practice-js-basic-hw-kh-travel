/// variables ///
let scenesInZone = null;    // scenes in zones

/// functions ///

// get scenes from response text
let getScenesInZone = (responseText) => {
  let records = responseText.result.records;
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

// update the zone selection
let updateZoneList = () => {
  let el = document.querySelector('#zones');
  let keys = Object.keys(scenesInZone);
  let html = '<option value="default"><div class="area-name">-- 請選擇行政區 --</div></option>';

  for (let i=0; i<keys.length; i++) {
    console.log(`${i} ${keys[i]}`);
    let subEl = `<option value="${keys[i]}"><div class="area-name">${keys[i]}</div></option>`;
    html += subEl;
  }
  el.innerHTML = html;
};

/// main code ///

// get the data from Internet
let xhr = new XMLHttpRequest();
xhr.open('get',
         'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',
         false);    // wait for data
xhr.send();

// analysis data
let responseText = JSON.parse(xhr.responseText);              // trace json data
scenesInZone = getScenesInZone(responseText);                 // analysis scenes in every zone

// update UI
updateZoneList();





