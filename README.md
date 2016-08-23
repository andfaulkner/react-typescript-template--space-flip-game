# react-typescript-template--space-flip-game
Simple WIP space 'shooting' and board flipping game.

Built (and being built) to act as a template for future React applications written in Typescript along with a wide variety of tools in the React ecosystem. This application has the followign wired in:

*   primary language: Typescript
*   package management: npm
*   type definition handling: typings
*   frontend UI library: ReactJS
*   frontend data store: Redux (todo: requires wiring in)
*   frontend asset bundler and build orchestrator: Webpack
*   transpiler: Babel (along with Typescript itself)
    *   Babel used to acquire extra es6 featuers in Typescript
*   css preprocessor: postcss & a wide variety of plugins (todo: finish wiring in remaining plugins of interest)
*   HTML templating: Handlebars
*   task runner: npm, along with Bash
    *   an active choice: after working with Gulp for over 2 years, I've come to the conclusion that it's mostly, and often overcomplicates things that are simple when done in shell scripts
*   backend database: postgres (still requires wiring into the app)
*   frontend dev server: webpack-dev-server
*   full-stack dev server: ExpressJS (not yet wired in - webpack-dev-server is covering all current needs)
*   intended deployment target: Heroku (not yet deployed)
*   linter: eslint
*   utility libraries:
    *   jquery (minimally used, may be removed in the near future)
    *   lodash (extensively used)
*   frontend unit testing: enzyme (requires integrating)
*   system testing: Mocha (requires wiring in)
*   Assertion library: Chai (requires wiring in)
*   Component libraries (so far): Bootstrap (minimally used)
