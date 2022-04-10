import { parse } from 'node-html-parser';
import fs from 'fs';
import path from 'path';

/**
 * Separate our HTML string into the parts we care about
 * @param html
 * @returns {{meta: HTMLElement[], links: HTMLElement[], scripts: HTMLElement[]}}
 */
function parseHtml(html) {
  const root = parse(html);
  const scripts = root.querySelectorAll('script');
  const links = root.querySelectorAll('link');
  const meta = root.querySelectorAll('meta');

  return {
    scripts,
    links,
    meta,
  };
}

export default function craftPartials(options = {}) {
  const { outputFile, template } = Object.assign(
    {},
    {
      // Path to the Twig partial that will be included by Craft
      outputFile: './templates/_partials/vite.twig',

      // Template to use when generating Twig partials
      template({ scripts, links, meta, proxyUrl, mode = 'production' }) {
        const scriptTags = scripts.map(script => {
          script.setAttribute(
            'src',
            script.getAttribute('src').replace('./', `${proxyUrl}/src/`),
          );
          return script;
        });

        const linkTags = links.map(link => {
          link.setAttribute(
            'href',
            link.getAttribute('href').replace('./', `${proxyUrl}/src/`),
          );
          return link;
        });

        let templateString = `{% html at head %}${meta.toString()}${linkTags.toString()}{% endhtml %}
{% html at endBody %}${scriptTags.toString()}{% endhtml %}`;

        return mode === 'development'
          ? `<script type="module" src="${proxyUrl}/@vite/client"></script>${templateString}`
          : templateString;
      },
    },
    options,
  );

  let config = null;
  let proxyUrl = null;

  return {
    name: 'craft-twig-partials',

    /**
     * Set the resolved vite config
     */
    configResolved(resolvedConfig) {
      config = resolvedConfig;
      proxyUrl = `http://localhost:${config.server.port}`;
    },

    /**
     * Write Twig partial in development mode
     */
    buildStart({ input }) {
      const { mode } = config;
      if (mode === 'production') return;

      const inputFile = fs.readFileSync(input);
      console.log(inputFile);
      const { scripts, links, meta } = parseHtml(inputFile.toString(), {});

      fs.writeFileSync(
        outputFile,
        template({ scripts, links, meta, mode, proxyUrl }),
      );
    },

    /**
     * Write Twig partial in production mode
     */
    transformIndexHtml(html) {
      const { mode } = config;
      if (mode !== 'production') return;

      const { scripts, links, meta } = parseHtml(html);
      fs.writeFileSync(outputFile, template({ scripts, links, meta, mode }));
    },

    /**
     * Remove `src` files from `dist`
     */
    closeBundle() {
      fs.rmSync(path.resolve(config.publicDir, './src'), {
        recursive: true,
        force: true,
      });
    },
  };
}
