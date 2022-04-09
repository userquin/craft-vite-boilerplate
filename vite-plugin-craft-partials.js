import path, { extname } from 'path';
import fs from 'fs';

const defaults = {
  outputDir: path.resolve(process.cwd(), './templates/_partials'),
  publicPath: '/dist/',
};

const getFiles = (bundle) => {
  const files = Object.values(bundle).filter(
    (file) =>
      file.type === 'chunk' ||
      (typeof file.type === 'string' ? file.type === 'asset' : file.isAsset),
  );
  const result = {};
  for (const file of files) {
    const { fileName } = file;
    const extension = extname(fileName).substring(1);

    result[extension] = [file].concat(result[extension] || []);
  }

  return result;
};

export default function(options = {}) {
  const { outputDir, publicPath } = Object.assign({}, defaults, options);

  const outputFilePath = `${outputDir}/vite-dist.twig`;

  return {
    name: 'Create partials',
    async buildStart() {
      if (fs.existsSync(outputFilePath)) {
        fs.unlinkSync(outputFilePath);
      }
    },

    async writeBundle(output, bundle) {
      const files = getFiles(bundle);
      let fileContents = '';

      // Add style links
      const links = (files.css || [])
        .reduce((linksString, file) => {
          return file.fileName
            ? linksString + `<link href="${publicPath}${file.fileName}" rel="stylesheet">\n`
            : linksString;
        }, '');
      fileContents += `{% html at head %}\n${links}{% endhtml %}\n`;

      // Add scripts
      const scripts = (files.js || [])
        .reduce((importsString, file) => {
          return file.fileName && file.isEntry
            ? importsString + `<script type="module" src="${publicPath}${file.fileName}"></script>\n`
            : importsString;
        }, '');
      fileContents += `\n{% html at endBody %}\n${scripts}{% endhtml %}\n`;

      // Write to file
      fs.appendFile(outputFilePath, fileContents, (err) => {
        if (err) throw err;
      });
    },
  };
}
