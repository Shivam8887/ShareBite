const fs = require('fs');
const path = require('path');

const dir = 'frontend/src';

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = fs.statSync(dirFile).isDirectory() ? walkSync(dirFile, filelist) : filelist;
    } catch (err) {
      if (err.code === 'OOM' || err.code === 'EMFILE') throw err;
    }
    if (dirFile.endsWith('.jsx')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
};

const files = walkSync(dir);
let changedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/(?<![\w:-])text-dark-50(?![\w-])/g, 'text-gray-900 dark:text-dark-50');
  content = content.replace(/(?<![\w:-])text-dark-300(?![\w-])/g, 'text-gray-700 dark:text-dark-300');
  content = content.replace(/(?<![\w:-])text-dark-400(?![\w-])/g, 'text-gray-500 dark:text-dark-400');
  
  content = content.replace(/(?<![\w:-])bg-dark-900(?![\w-])/g, 'bg-gray-50 dark:bg-dark-900');
  content = content.replace(/(?<![\w:-])bg-dark-800(?![\w-])/g, 'bg-white dark:bg-dark-800');
  content = content.replace(/(?<![\w:-])bg-dark-800\/50(?![\w-])/g, 'bg-gray-100/50 dark:bg-dark-800/50');
  
  content = content.replace(/(?<![\w:-])border-dark-700(?![\w-])/g, 'border-gray-200 dark:border-dark-700');
  content = content.replace(/(?<![\w:-])border-dark-700\/50(?![\w-])/g, 'border-gray-200/50 dark:border-dark-700/50');
  content = content.replace(/(?<![\w:-])border-dark-800(?![\w-])/g, 'border-gray-300 dark:border-dark-800');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    changedCount++;
  }
});
console.log('Updated ' + changedCount + ' files.');
