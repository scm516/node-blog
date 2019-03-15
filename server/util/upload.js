const fs = require('fs');
const path = require('path');
const upload = function(file, id) {
  const reader = fs.createReadStream(file.path);
  let dirPath = path.join(__dirname, '../', `/public/upload/${id}`);
  let filePath = dirPath + `/${file.name}`;
  if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
  }
  // 创建可写流
  const upStream = fs.createWriteStream(filePath)
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  return `/upload/${id}/${file.name}`
}

module.exports = upload;