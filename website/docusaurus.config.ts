import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
    title: 'AxiSpark.js',
    tagline: 'The Ultimate Node.js Framework',
    favicon: 'img/icon.svg',
    baseUrl: '/axispark/',
    url: 'https://axisparkjs.github.io',
    future: {
        v4: true
    },

    // GitHub pages deployment config.
    organizationName: 'axisparkjs',
    projectName: 'axispark',

    onBrokenLinks: 'throw',
    i18n: {
        defaultLocale: 'en',
        locales: ['en']
    },

    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts'
                },
                blog: {
                    showReadingTime: true,
                    feedOptions: {
                        type: ['rss', 'atom'],
                        xslt: true
                    },
                    // Useful options to enforce blogging best practices
                    onInlineTags: 'warn',
                    onInlineAuthors: 'warn',
                    onUntruncatedBlogPosts: 'warn'
                },
                theme: {
                    customCss: './src/css/custom.css'
                }
            } satisfies Preset.Options
        ]
    ],

    themeConfig: {
        // Replace with your project's social card
        image: 'img/docusaurus-social-card.jpg',
        colorMode: {
            respectPrefersColorScheme: true
        },
        navbar: {
            title: 'AxiSpark.js',
            logo: {
                alt: 'AxiSpark.js Logo',
                src: 'img/icon.svg'
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'tutorialSidebar',
                    position: 'left',
                    label: 'Docs'
                },
                { to: '/blog', label: 'Blog', position: 'left' },
                {
                    href: 'https://github.com/axisparkjs/axispark',
                    label: 'GitHub',
                    position: 'right'
                }
            ]
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Tutorial',
                            to: '/docs/intro'
                        }
                    ]
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'Blog',
                            to: '/blog'
                        },
                        {
                            label: 'GitHub',
                            href: 'https://github.com/axisparkjs/axispark'
                        }
                    ]
                }
            ],
            copyright: `Copyright © ${new Date().getFullYear()} AxiSpark.js`
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula
        }
    } satisfies Preset.ThemeConfig
};

export default config;
