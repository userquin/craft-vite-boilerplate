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
  return {
    name: 'Create partials',
    async buildStart() {
      if (fs.existsSync(`${outputDir}/scripts.twig`)) {
        fs.unlinkSync(`${outputDir}/scripts.twig`);
      }
      if (fs.existsSync(`${outputDir}/links.twig`)) {
        fs.unlinkSync(`${outputDir}/links.twig`);
      }
    },

    async writeBundle(output, bundle) {
      const files = getFiles(bundle);
      const scripts = (files.js || [])
        .map(({ fileName }) => {
          return fileName
            ? `<script type="module" src="${publicPath}${fileName}"></script>\n`
            : '';
        })
        .join('');

      fs.appendFile(`${outputDir}/scripts.twig`, scripts, (err) => {
        if (err) throw err;
      });

      const links = (files.css || [])
        .map(({ fileName }) => {
          return `<link href="${publicPath}${fileName}" rel="stylesheet">\n`;
        })
        .join('');

      fs.appendFile(`${outputDir}/links.twig`, links, (err) => {
        if (err) throw err;
      });
    },
  };
}