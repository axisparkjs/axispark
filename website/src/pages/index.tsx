import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import './index.css';

function HomePage(): React.ReactElement {
    return (
        <>
            <div className="hero">

                <h1 className="hero-title">
                    AxiSpark.js
                </h1>
                <div className="badge">
                    <span>✦</span>
                    The Ultimate Node.js Framework
                </div>

                <h2>
                    Build faster.
                    <br />
                    <span>Think sharper.</span>
                </h2>

                <p className="hero-description">
                    AxiSpark.js is a modern framework for building fast, scalable
                    applications without unnecessary complexity.
                </p>

                <div className="hero-actions">
                    <a href="/axispark/docs/category/getting-started" className="button primary">
                        Get Started →
                    </a>

                    <a href="/axispark/docs/intro" className="button secondary">
                        Documentation
                    </a>
                </div>

                <div className="install">
                    <span className="prompt">$</span>
                    <span>npm install -g @axisparkjs/cli</span>
                    <button aria-label="Copy command">⌘</button>
                </div>
            </div>

            <div className="spark-background">
                <div className="spark spark-1" />
                <div className="spark spark-2" />
                <div className="spark spark-3" />
                <div className="spark spark-4" />
            </div>

            <section className="code-section">
                <div className="code-copy">
                    <div className="section-label">A FAMILIAR EXPERIENCE</div>

                    <h2>
                        JavaScript
                        <br />
                        <span>without the friction.</span>
                    </h2>

                    <p>
                        If you know JavaScript or TypeScript, you already know most of
                        what you need to start building with AxiSpark.
                    </p>

                    <a href="/axispark/docs/category/getting-started" className="text-link">
                        Start building →
                    </a>
                </div>

                <div className="code-window">
                    <div className="window-header">
                        <div className="window-dots">
                            <span />
                            <span />
                            <span />
                        </div>

                        <div className="window-title">app.ts</div>
                    </div>

                    <div className="code">
                        <div>
                            <span className="keyword">import</span>{" "}
                            <span className="bracket">{"{"}</span>{" "}
                            <span className="function">AxiSparkFactory</span>{" "}
                            <span className="bracket">{"}"}</span>{" "}
                            <span className="keyword">from</span>{" "}
                            <span className="string">'@axisparkjs/core'</span>;
                        </div>

                        <div>
                            <span className="keyword">import</span>{" "}
                            <span className="bracket">{"{"}</span>{" "}
                            <span className="function">HttpPlugin</span>{" "}
                            <span className="bracket">{"}"}</span>{" "}
                            <span className="keyword">from</span>{" "}
                            <span className="string">'@axisparkjs/http'</span>;
                        </div>

                        <div>
                            <span className="keyword">import</span>{" "}
                            <span className="bracket">{"{"}</span>{" "}
                            <span className="function">HttpPluginOptionsFactory</span>{" "}
                            <span className="bracket">{"}"}</span>{" "}
                            <span className="keyword">from</span>{" "}
                            <span className="string">'@axisparkjs/http-express'</span>;
                        </div>

                        <div>&nbsp;</div>

                        <div>
                            <span className="keyword">export const</span>{" "}
                            <span className="variable">app</span>{" "}
                            <span className="operator">=</span>{" "}
                            <span className="function">AxiSparkFactory.create</span>
                            <span className="bracket">{"()"}</span>;
                        </div>

                        <div>&nbsp;</div>

                        <div>
                            <span className="variable">app</span>.
                            <span className="function">use</span>
                            <span className="bracket">{"("}</span>
                        </div>

                        <div className="indent">
                            <span className="function">HttpPlugin</span>,
                        </div>

                        <div className="indent">
                            <span className="function">HttpPluginOptionsFactory.create</span>
                            <span className="bracket">{"({"}</span>
                        </div>

                        <div className="indent-2">
                            <span className="property">basePath</span>:{" "}
                            <span className="string">'/api'</span>
                        </div>

                        <div className="indent">
                            <span className="bracket">{"})"}</span>
                        </div>

                        <div>
                            <span className="bracket">{")"}</span>;
                        </div>
                    </div>
                </div>
            </section>

            <section className="terminal-section">
                <div className="terminal">
                    <div className="terminal-header">
                        <div className="terminal-dots">
                            <span />
                            <span />
                            <span />
                        </div>

                        <span>terminal</span>
                    </div>

                    <div className="terminal-body">
                        <div>
                            <span className="terminal-prompt">$</span>{" "}
                            npm install -g @axispark/cli
                        </div>
                        <div>
                            <span className="terminal-prompt">$</span>{" "}
                            axispark create my-app
                        </div>

                        <div className="terminal-success">
                            ✓ Project created
                        </div>

                        <div className="terminal-success">
                            ✓ Dependencies installed
                        </div>

                        <div className="terminal-success">
                            ✓ Configuration ready
                        </div>

                        <div>&nbsp;</div>

                        <div>
                            <span className="terminal-muted">Local:</span>{" "}
                            <span>Application started</span>
                        </div>

                        <div className="terminal-cursor">█</div>
                    </div>
                </div>

                <div className="terminal-copy">
                    <div className="section-label">ZERO FRICTION</div>

                    <h2>
                        From zero
                        <br />
                        <span>to running.</span>
                    </h2>

                    <p>
                        Create a project, start the development server and get straight
                        to work.
                    </p>

                    <div className="mini-points">
                        <div>
                            <strong>01</strong>
                            <span>Create</span>
                        </div>

                        <div>
                            <strong>02</strong>
                            <span>Build</span>
                        </div>

                        <div>
                            <strong>03</strong>
                            <span>Ship</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="principles">
                <div className="section-label">THE AXISPARK WAY</div>

                <h2>
                    The framework should
                    <br />
                    <span>remove complexity.</span>
                </h2>

                <p className="principle-lead">Not add it.</p>

                <div className="principle-grid">
                    <div>
                        <span className="number">01</span>

                        <h3>Stay close to the platform</h3>

                        <p>
                            Use the web platform instead of hiding it behind layers of
                            unnecessary abstraction.
                        </p>
                    </div>

                    <div>
                        <span className="number">02</span>

                        <h3>Make the common path easy</h3>

                        <p>
                            Sensible defaults should make simple things simple while
                            keeping advanced use cases possible.
                        </p>
                    </div>

                    <div>
                        <span className="number">03</span>

                        <h3>Keep the core small</h3>

                        <p>
                            A focused foundation is easier to learn, maintain and extend.
                        </p>
                    </div>
                </div>
            </section>

            <section className="cta">
                <div className="cta-spark">✦</div>

                <div className="section-label">START BUILDING</div>

                <h2>
                    Your next project
                    <br />
                    <span>starts here.</span>
                </h2>

                <p>
                    No unnecessary complexity.
                    <br />
                    No configuration maze.
                    <br />
                    Just build.
                </p>

                <div className="cta-actions">
                    <a href="/axispark/docs/category/getting-started" className="button primary">
                        Get Started →
                    </a>

                    <a href="https://github.com/axisparkjs/axispark" className="button secondary">
                        View GitHub ↗
                    </a>
                </div>
            </section>
        </>
    );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <main>
        <HomePage />
      </main>
    </Layout>
  );
}
