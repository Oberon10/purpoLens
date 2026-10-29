const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'node_modules', 'next', 'dist', 'lib', 'recursive-delete.js');

try {
  if (fs.existsSync(targetFile)) {
    let content = fs.readFileSync(targetFile, 'utf8');

    const oldBlock = `        let isDirectory = part.isDirectory();
        const isSymlink = part.isSymbolicLink();
        if (isSymlink) {
            const linkPath = await _fs.promises.readlink(absolutePath);
            try {
                const stats = await _fs.promises.stat((0, _path.isAbsolute)(linkPath) ? linkPath : (0, _path.join)((0, _path.dirname)(absolutePath), linkPath));
                isDirectory = stats.isDirectory();
            } catch  {}
        }`;

    const newBlock = `        let isDirectory = part.isDirectory();
        let isSymlink = part.isSymbolicLink();
        if (isSymlink) {
            const linkPath = await _fs.promises.readlink(absolutePath).catch(() => null);
            if (linkPath) {
                try {
                    const stats = await _fs.promises.stat((0, _path.isAbsolute)(linkPath) ? linkPath : (0, _path.join)((0, _path.dirname)(absolutePath), linkPath));
                    isDirectory = stats.isDirectory();
                } catch  {}
            } else {
                isSymlink = false;
            }
        }`;

    if (content.includes(oldBlock)) {
      content = content.replace(oldBlock, newBlock);
      fs.writeFileSync(targetFile, content, 'utf8');
      console.log('✓ Successfully patched Next.js recursive-delete.js for Windows/OneDrive');
    } else if (content.includes('readlink(absolutePath).catch')) {
      console.log('✓ Next.js recursive-delete.js is already patched');
    }
  }
} catch (err) {
  console.warn('Note: Could not patch next/dist/lib/recursive-delete.js:', err.message);
}
