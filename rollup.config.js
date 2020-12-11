import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.js",
  output: {
    file: "dist/map-widget.js",
    format: "iife",
    name: "MapWidget",
  },
  plugins: [nodeResolve(), commonjs()],
};
