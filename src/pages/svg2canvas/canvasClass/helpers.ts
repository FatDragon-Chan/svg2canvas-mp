// 获取canvas 对象
export const getContainer = (id) => new Promise((resolve, reject) => {
  const query = wx.createSelectorQuery();
  query
    .select(id)
    .fields({ node: true, size: true })
    .exec(res => {
      if (res && res.length > 0) {
        resolve(res[0]);
      } else {
        reject(new Error('获取canvas对象失败'));
      }
    });
});

// id转换成rgb色值
export function idToRgba(id: string) {
  return id.split('-');
}

// rgb色值转换成id
export function rgbaToId(rgba: [number, number, number, number]) {
  return rgba.join('-');
}

const idPool = {};

// 通过随机0 - 255 的色值转换成rgb做唯一色值生成
function createOnceId(): string {
  return Array(3)
    .fill(0)
    .map(() => Math.ceil(Math.random() * 255))
    .concat(255)
    .join('-');
}

// 生成唯一id
export function createId(): string {
  let id = createOnceId();

  while (idPool[id]) {
    id = createOnceId();
  }

  return id;
}
