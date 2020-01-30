/// variables ///
let scenesInAllZones = null;    // scenes in zones
let currentZoneName = '';       // current selected zone name
const cardsPerPage = 8;         // cards number per page
let currentPageIdx = 0;         // current page indxe (0~) of scene list


/// functions ///

// get scenes from response text
let getScenesInZone = (responseText) => {
  let records = responseText.result.records;
  let scenesInAllZones = {};
  // each record loop
  for (let i=0; i<records.length; i++) {
    let zone = records[i].Zone;
    // push record data into scenesInAllZones with key 'zone'
    if (scenesInAllZones[zone]) {
      // key 'zone' is exist
      scenesInAllZones[zone].push(records[i]);
    }
    else {
      // new key
      scenesInAllZones[zone] = [records[i]];
    }
  }
  return scenesInAllZones;
};

// update the zone selection
let updateZoneList = () => {
  let el = document.querySelector('#zones');
  let keys = Object.keys(scenesInAllZones);
  let html = '<option value="default"><div class="area-name">-- 請選擇行政區 --</div></option>';

  for (let i=0; i<keys.length; i++) {
    console.log(`${i} ${keys[i]}`);
    let subEl = `<option value="${keys[i]}"><div class="area-name">${keys[i]}</div></option>`;
    html += subEl;
  }
  el.innerHTML = html;
};

// update scene list
let updateSceneList = (idxPage) => {
  console.log(`${currentZoneName} (${scenesInCurZone.length})`);

  // update the zone name
  let elCurrentZoneName = document.querySelector('#cur-zone-name');
  elCurrentZoneName.textContent = currentZoneName;

  // check range of scenes according to page index to display
  let iStart = idxPage * cardsPerPage;
  iStart = (iStart >= scenesInCurZone.length) ? Math.floor(scenesInCurZone.length / cardsPerPage) * cardsPerPage : iStart;
  let iEnd = iStart + cardsPerPage;
  iEnd = (iEnd >= scenesInCurZone.length) ? scenesInCurZone.length - 1 : iEnd;
  console.log(`show scene ${iStart} ~ ${iEnd}`);

  // update the scene cards in the list
  let elSceneListContent = document.querySelector('#scene-list');
  elSceneListContent.innerHTML = '';
  for (let i=iStart; i<iEnd; i++) {
    elSceneListContent.appendChild(genSceneCard(scenesInCurZone[i]));
  }
}

// scene card
let genSceneCard = (scene) => {
  // <li class="scene-card">
  //   <div class="card-top">
  //     <div class="bg"></div>
  //     <div class="name">高雄願景館</div>
  //     <div class="zone">三民區</div>
  //   </div>
  //   <div class="card-bottom flex-ccl">
  //     <div class="info flex-rlc"><span class="icon-opentime"></span> 週二至週日10:00-18:00，每週一公休</div>
  //     <div class="info flex-rlc"><span class="icon-add"></span> 高雄市三民區建國二路318號</div>
  //     <div class="info flex-rlc"><span class="icon-tel"></span> 886-7-2363357</div>
  //     <div class="tag flex-rlc"><span class="icon-tag"></span> 免費參觀</div>
  //   </div>
  // </li>

  let el = document.createElement('li');
  el.setAttribute('class', 'scene-card');

  // top part of card
  let elTop = document.createElement('div');
  elTop.setAttribute('class', 'card-top');
  el.appendChild(elTop);

  let elPicture = document.createElement('div');
  elPicture.setAttribute('class', 'bg');
  elPicture.setAttribute('style', `background-image: url(${scene.Picture1})`);
  elTop.appendChild(elPicture);

  let elName = document.createElement('div');
  elName.setAttribute('class', 'name');
  elName.textContent = scene.Name;
  elTop.appendChild(elName);

  let elZone = document.createElement('div');
  elZone.setAttribute('class', 'zone');
  elZone.textContent = scene.Zone;
  elTop.appendChild(elZone);

  // bottom part of card
  let elBottom = document.createElement('div');
  elBottom.setAttribute('class', 'card-bottom flex-ccl');
  el.appendChild(elBottom);

  let elOpenTime = document.createElement('div');
  elOpenTime.setAttribute('class', 'info flex-rlc');
  let elOpenTimeIcon = document.createElement('span');
  elOpenTimeIcon.setAttribute('class', 'icon-opentime');
  elOpenTime.appendChild(elOpenTimeIcon);
  let elOpenTimeText = document.createElement('span');
  elOpenTimeText.textContent = scene.Opentime;
  elOpenTime.appendChild(elOpenTimeText);
  elBottom.appendChild(elOpenTime);

  let elAdd = document.createElement('div');
  elAdd.setAttribute('class', 'info flex-rlc');
  let elAddIcon = document.createElement('span');
  elAddIcon.setAttribute('class', 'icon-add');
  elAdd.appendChild(elAddIcon);
  let elAddText = document.createElement('span');
  elAddText.textContent = scene.Add;
  elAdd.appendChild(elAddText);
  elBottom.appendChild(elAdd);

  let elTel = document.createElement('div');
  elTel.setAttribute('class', 'info flex-rlc');
  let elTelIcon = document.createElement('span');
  elTelIcon.setAttribute('class', 'icon-tel');
  elTel.appendChild(elTelIcon);
  let elTelText = document.createElement('span');
  elTelText.textContent = scene.Tel;
  elTel.appendChild(elTelText);
  elBottom.appendChild(elTel);

  if (scene.Ticketinfo) {
    let elTag = document.createElement('div');
    elTag.setAttribute('class', 'tag flex-rlc');
    let elTagIcon = document.createElement('span');
    elTagIcon.setAttribute('class', 'icon-tag');
    elTag.appendChild(elTagIcon);
    let elTagText = document.createElement('span');
    elTagText.textContent = scene.Ticketinfo;
    elTag.appendChild(elTagText);
    elBottom.appendChild(elTag);
  }

  return el;
}


/// main code ///

// get the data from Internet
let xhr = new XMLHttpRequest();
xhr.open('get',
         'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97',
         false);    // wait for data
xhr.send();

// analysis data
let responseText = JSON.parse(xhr.responseText);              // trace json data
scenesInAllZones = getScenesInZone(responseText);                 // analysis scenes in every zone

// update UI
updateZoneList();

// add listener
let scenesInCurZone = [];                                     // scenes of the current selected zone
let domSelectZone = document.querySelector('#zones');         // select UI DOM
if (domSelectZone) {
  // use addEventListener
  domSelectZone.addEventListener('change', () => {
    currentZoneName = domSelectZone.value;
    scenesInCurZone = scenesInAllZones[currentZoneName];
    // update the scene list
    updateSceneList(currentPageIdx);
  });
}




