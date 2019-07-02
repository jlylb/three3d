const drPng = require('../assets/door_right.png')
const dlPng = require('../assets/door_left.png')
const floorJpg = require('../assets/floor.jpg')

const plantJpg = require('../assets/plant.png')
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
      box: [2000, 10, 1600], // x y z
      rotation: [0, 0, 0],
      position: [0, 0, 0],
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
            color: 0xb0cee0,
            path: floorJpg,
            repeat: true
          },
          down: {
            color: 0xb0cee0
          },
          after: {
            color: 0xb0cee0
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
          rotation: [0, 0, 0],
          position: [0, 0, 0],
          start:[-500, 120, -350],
          end:[500,120,-350],
          visible: true,
          style: {
            color: 0x8ac9e2,
            skin: {
              left: {
                color: 0xb0cee0
              },
              right: {
                color: 0xb0cee0
              },
              up: {
                color: 0xdddddd
              },
              down: {
                color: 0xb0cee0
              },
              after: {
                color: 0xb0cee0
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
              op: '-',
              box: [60, room.thick, 60],
              position: [(room.width - 60) / 3, 0, 0],
              start:[-400, 120, -350],
              end: [-100, 120, -350],
              height: 200,
              rotation: [0, 0, 0],
              visible: true
            },
            {
              name: '',
              modelType: 'hole',
              op: '-',
              box: [60, room.thick, 60],
              position: [-(room.width - 60) / 3, 0, 0],
              rotation: [0, 0, 0],
              start:[400, 120, -350],
              end: [100, 120, -350],
              height: 200,
              visible: true
            }
          ]
        },
        {
          name: 'wall2',
          rotation: [0, 0, 0],
          position: [0, 0, 0],
          start:[-500, 120, 450],
          end:[500,120,450],
          visible: true,
          style: {
            color: 0x8ac9e2,
            skin: {
              left: {
                color: 0xb0cee0
              },
              right: {
                color: 0xb0cee0
              },
              up: {
                color: 0xdddddd
              },
              down: {
                color: 0xb0cee0
              },
              after: {
                color: 0xb0cee0
              },
              before: {
                color: 0xb0cee0
              }
            }
          },
          childrens: []
        },
        {
          name: 'wall3',
          rotation: [0, 0, 0],
          position: [0, 0, 0],
          start:[490, 120, -350],
          end:[490,120,450],
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
                color: 0xdddddd
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
              op: '-',
              rotation: [0, 0, 0],
              visible: true,
              box: [80, 80, room.thick],
              position: [(room.height - 80) / 2, 0, 0],
              start:[490, 110, -60],
              end:[490,110,160],
              height: 220,
              style: {
                color: 0x8ac9e2,
                skin: {
                  left: {
                    color: 0xffdddd
                  },
                  right: {
                    color: 0xffdddd
                  },
                  up: {
                    color: 0xffdddd
                  },
                  down: {
                    color: 0xdddddd
                  },
                  after: {
                    color: 0xffdddd
                  },
                  before: {
                    color: 0xffdddd
                  }
                }
              }
            },
            {
              modelType: 'door',
              // width: 80,
              // height: 80,
              position: [(room.height - 80) / 2, 80 / 4, 0],
              start:[0, 0, -110],
              end:[0,0,0],
              height: 220,
              thick: 4,
              visible: true,
              name: 'leftdoor',
             // rotation: [0, 0, Math.PI / 2],
              direction: 'left',
              enabledAxes: true,
              style: {
                skin: {
                  left: {
                    color: 0xdddddd,
                    path: drPng
                  },
                  right: {
                    color: 0xdddddd,
                    path: dlPng
                  },
                  up: {
                    color: 0xb0cee0
                  },
                  down: {
                    color: 0xb0cee0
                  },
                  after: {
                    color: 0xdeeeee,
                   
                  },
                  before: {
                    color: 0xb0cee0,
                   
                  }
                }
              }
            },
            {
              modelType: 'door',
              width: 80,
              height: 80,
              // position: [0,0,0],
              position: [(room.height - 80) / 2, -80 / 4, 0],
              start:[0, 0, 0],
              end:[0,0,110],
              height: 220,
              thick: 4,
              visible: true,
              name: 'rightdoor',
             // rotation: [0, 0, Math.PI / 2],
              direction: 'right',
              enabledAxes: true,
              style: {
                skin: {
                  left: {
                    color: 0xdddddd,
                    path: dlPng
                  },
                  right: {
                    color: 0xdddddd,
                    path: drPng
                  },
                  up: {
                    color: 0xb0cee0,
                   
                  },
                  down: {
                    color: 0xb0cee0,
                   
                  },
                  after: {
                    color: 0xdeeeee,
                    
                  },
                  before: {
                    color: 0xb0cee0,
                 
                  }
                }
              }
            }
          ]
        },
        {
          name: 'wall4',
          rotation: [0, 0, 0],
          position: [0, 0, 0],
          start:[-490, 120, -350],
          end:[-490,120,450],
          visible: true,
          style: {
            color: 0x8ac9e2,
            skin: {
              left: {
                color: 0xb0cee0
              },
              right: {
                color: 0xb0cee0
              },
              up: {
                color: 0xdddddd
              },
              down: {
                color: 0xb0cee0
              },
              after: {
                color: 0xb0cee0
              },
              before: {
                color: 0xb0cee0
              }
            }
          },
          childrens: []
        }
      ]
    },
    //桌子
    {
      name: 'desk',
      modelType: 'desk',
      box: [60, 100, 30], // x y z
      rotation: null,
      position: [0, 0, 30 / 2 + 3],
      sideHoles: [25, 80, 20],
      holes: [10, 80, 30],
      visible: true,
      style: {
        color: 0x8ac9e2,
        skin: {
          left: {
            color: 0xb0cee0
          },
          right: {
            color: 0xb0cee0
          },
          up: {
            color: 0xb0cee0
          },
          down: {
            color: 0xb0cee0
          },
          after: {
            color: 0xb0cee0
          },
          before: {
            color: 0xb0cee0
          }
        }
      },
      childrens: []
    },
    // 椅子
    {
      name: 'chair',
      modelType: 'chair',
      box: [20, 20, 2], // x y z
      rotation: null,
      holes: [2, 2, 20],
      board: [2, 20, 10],
      height: 20,
      visible: true,

      childrens: []
    },
    {
      name: 'plant',
      modelType: 'plant',
      width: 180, // x y z
      offset: 5,
      style: plantJpg
    }
  ]
}
