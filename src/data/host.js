const serverJpg = require("../assets/server2.jpg");
const insideJpg = require("../assets/rack_inside.jpg");

const host =  {
    show: true,
    uuid: "",
    name: 'equipment_card_1',
    objType: 'cube',
    width: 60,
    depth: 65,
    height: 10,
    x: 0,
    y: -20,
    z: -180,
    style: {
        skinColor: 0xff0000,
        skin: {
            up: {
                skinColor: 0xff0000,
                imgurl: insideJpg,
            },
            down: {
                skinColor: 0xff0000,
                imgurl: insideJpg,
            },
            before: {
                skinColor: 0xff0000,
                imgurl: insideJpg,
            },
            after: {
                skinColor: 0xff0000,
                imgurl: serverJpg,
            },
            left: {
                skinColor: 0xff0000,
                imgurl: insideJpg,
            },
            right: {
                skinColor: 0xff0000,
                imgurl: insideJpg,
            }
        }
    }
};

export default host;