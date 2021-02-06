this.options = {
  // see documentation for options reference
  root_mode: "survival",
  survival_level:8,
  map_size: 30
};
var setPicker = function(ship, isActive) {
  isActive = !!isActive;
  ship.custom.isActive = isActive;
  ship.setUIComponent({
    id: "chooser",
    position: [2,40,8,14],
    visible: true,
    clickable: true,
    shortcut: "P",
    components: [
      { type: "box",position:[0,0,100,100],fill:"#456",stroke:"#CDE",width:2},
      { type: "text",position:[10,35,80,30],value:isActive?"Cancel":"Pick a ship",color:"#CDE"},
      { type: "text",position:[20,70,60,20],value:"[P]",color:"#CDE"}
    ]
  });
  if (isActive) {
    ship.setUIComponent({
      id: "revert",
      position: [2,60,8,14],
      visible: true,
      clickable: true,
      shortcut: "L",
      components: [
        { type: "box",position:[0,0,100,100],fill:"#456",stroke:"#CDE",width:2},
        { type: "text",position:[10,35,80,30],value:"Backspace",color:"#CDE"},
        { type: "text",position:[20,70,60,20],value:"[L]",color:"#CDE"}
      ]
    });
    for (let i=0;i<10;i++) ship.setUIComponent({
      id: "k"+i.toString(),
      position: [0,0,0,0],
      visible: false,
      clickable: isActive,
      shortcut: i.toString()
    })
  }
  else {
    ship.setUIComponent({id:"revert",visible:false});
    for (let i=0;i<10;i++) ship.setUIComponent({id:"k"+i.toString(),visible:false});
    ship.setUIComponent({id:"chooser-notif",visible: false})
  }
  setRequest(ship, null);
}
var setRequest = function (ship, add) {
  ship.custom.request = ship.custom.request||"";
  if (!ship.custom.isActive) ship.custom.request = "";
  else {
    let request = ship.custom.request;
    if (add != null) {
      if (add === -1) request = request.slice(0,request.length-1);
      else request += add;
    }
    ship.setUIComponent({
      id: "chooser-notif",
      position: [25,10,50,30],
      visible: true,
      clickable: false,
      components: [
        {type: "text", position: [0,0,100,30], value: "Enter ship code to pick:", color: "#cde"},
        {type: "text", position: [0,30,100,30], value: "Ship code = ship level * 100 + ship model", color: "#cde"},
        {type: "text", position: [0,60,100,40], value: request||"", color: "#cde"}
      ]
    });
    if (request.length >= 3) {
      request = parseInt(request);
      ship.set({type: request});
      request = "";
      setPicker(ship, false);
    }
    ship.custom.request = request;
  }
}
this.tick = function(game) {
  // do mod stuff here ; see documentation
  for (let ship of game.ships) {
    if (!ship.custom.init) {
      ship.custom.init = true;
      setPicker(ship,false);
    }
  }
}

this.event = function(event, game) {
  let ship = event.ship;
  if (ship != null) switch (event.name) {
    case "ui_component_clicked":
      let id = event.id;
      switch (id) {
        case "chooser":
          setPicker(ship,!ship.custom.isActive);
          break;
        case "revert":
          setRequest(ship, -1);
          break;
        default:
          if (id.match(/^k\d$/) != null) setRequest(ship,id[1]);
      }
      break;
  }
  console.log(event);
}
