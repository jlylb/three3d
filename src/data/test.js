const drPng = require("../assets/door_right.png");
const dlPng = require("../assets/door_left.png");
const floorJpg = require("../assets/floor.jpg");
export const room = { 
  length: 300,
  width: 240,
  height: 120,
  thick: 3 
}

export default {
   //房间设置
    room: {
      length: 300,
      width: 240,
      height: 120,
      thick: 3
    }, //房间长 宽  高, 墙厚
    floor: 10,
    models: [
      //地面
        {
            name: 'floor',
            modelType: 'floor',
            box: [200, 160, 300], // x y z
            rotation: [0,0,0],
            position: [0,0,0],
            visible: true,
            style: {
                color: 0x8ac9e2,
                skin: {
                    left: {
                        color: 0xdddddd,

                      },
                      right: {
                        color: 0xdddddd
                      },
                      up: {
                        color: 0xb0cee0,
                        path: floorJpg,
                        repeat: true,

                      },
                      down: {
                        color: 0xb0cee0,

                      },
                      after: {

                        color: 0xdeeeee
                      },
                      before: {
                        color: 0xb0cee0
                      }
                }
            }
        },
        //墙面
        {
          name: 'room',
          modelType: 'room',
          room: {
            length: 300,
            width: 240,
            height: 120,
            thick: 3
          }, //房间长 宽  高, 墙厚
          walls: [
            {
              name: 'wall1',
              rotation: [0,0,0],
              position: [0,0,0],
              visible: true,
              style: {
                  color: 0x8ac9e2,
                  skin: {
                      left: {
                          color: 0xdddddd
                        },
                        right: {
                          color: 0xdddddd
                        },
                        up: {
                          color: 0xb0cee0
                        },
                        down: {
                          color: 0xb0cee0
                        },
                        after: {
                          color: 0xdeeeee
                        },
                        before: {
                          color: 0xb0cee0
                        }
                  }
              },
              childrens: [
                {
                  name: '',
                  modelType: 'hole',
                  op: "-",
                  box: [60, room.thick, 60],
                  position: [(room.width - 60) / 3, 0, 0],
                  rotation: [0,0,0],
                  visible: true,
                },
                {
                  name: '',
                  modelType: 'hole',
                  op: "-",
                  box: [60, room.thick, 60],
                  position: [-(room.width - 60) / 3, 0, 0],
                  rotation: [0,0,0],
                  visible: true,
                },
              ]
          },
          {
            name: 'wall2',
            rotation: [0,0,0],
            position: [0,0,0],
            visible: true,
            style: {
                color: 0x8ac9e2,
                skin: {
                    left: {
                        color: 0xdddddd
                      },
                      right: {
                        color: 0xdddddd
                      },
                      up: {
                        color: 0xb0cee0
                      },
                      down: {
                        color: 0xb0cee0
                      },
                      after: {
                        color: 0xdeeeee
                      },
                      before: {
                        color: 0xb0cee0
                      }
                }
            },
            childrens: [

            ]
        },
        {
          name: 'wall3',
          rotation: [0,0,0],
          position: [0,0,0],
          visible: true,
          style: {
              color: 0x8ac9e2,
              skin: {
                  left: {
                      color: 0xdddddd
                    },
                    right: {
                      color: 0xdddddd
                    },
                    up: {
                      color: 0xb0cee0
                    },
                    down: {
                      color: 0xb0cee0
                    },
                    after: {
                      color: 0xdeeeee
                    },
                    before: {
                      color: 0xb0cee0
                    }
              }
          },
          childrens: [
            {
              name: '',
              modelType: 'hole',
              op: "-",
              rotation: [0,0,0],
              visible: true,
              box: [80, 80, room.thick],
              position: [(room.height - 80) / 2, 0, 0]
            },
            {
              modelType: 'door',
              width: 80,
              height: 80,
              position: [
                (room.height - 80) / 2,
                80 / 4,
                0
              ],
              visible: true,
              name: "leftdoor",
              rotation: [0, 0, Math.PI / 2],
              direction:"left",
              enabledAxes: true,
              style: {
                skin: {
                  left: {
                      color: 0xdddddd
                    },
                    right: {
                      color: 0xdddddd
                    },
                    up: {
                      color: 0xb0cee0
                    },
                    down: {
                      color: 0xb0cee0
                    },
                    after: {
                      color: 0xdeeeee,
                      path: drPng,
                    },
                    before: {
                      color: 0xb0cee0,
                      path: dlPng,
                    }
              }
              }
            },
            {
              modelType: 'door',
              width: 80,
              height: 80,
             // position: [0,0,0],
              position: [
                (room.height - 80) / 2,
                -80 / 4,
                0
              ],
              visible: true,
              name: "rightdoor",
              rotation: [0, 0, Math.PI / 2],
              direction:"right",
              enabledAxes: true,
              style: {
                skin: {
                  left: {
                      color: 0xdddddd
                    },
                    right: {
                      color: 0xdddddd
                    },
                    up: {
                      color: 0xb0cee0
                    },
                    down: {
                      color: 0xb0cee0
                    },
                    after: {
                      color: 0xdeeeee,
                      path: dlPng,
                    },
                    before: {
                      color: 0xb0cee0,
                      path: drPng,
                    }
              }
              }
            },
          ]
      },
      {
        name: 'wall4',
        rotation: [0,0,0],
        position: [0,0,0],
        visible: true,
        style: {
            color: 0x8ac9e2,
            skin: {
                left: {
                    color: 0xdddddd
                  },
                  right: {
                    color: 0xdddddd
                  },
                  up: {
                    color: 0xb0cee0
                  },
                  down: {
                    color: 0xb0cee0
                  },
                  after: {
                    color: 0xdeeeee
                  },
                  before: {
                    color: 0xb0cee0
                  }
            }
        },
        childrens: [

        ]
    },
          ]
        }
    ]
}