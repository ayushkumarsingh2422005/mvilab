import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import postcss from "postcss";
import prefixSelector from "postcss-prefix-selector";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const sourcePath = path.join(root, "node_modules", "@chaibuilder", "sdk", "dist", "sdk.css");
const publicDir = path.join(root, "public");
const stylesDir = path.join(root, "styles");

const CHAI_SCOPE = ".mvilab-chaibuilder-root";

function transformSelector(prefix, selector, prefixedSelector) {
  if (selector === ":root") {
    return CHAI_SCOPE;
  }

  if (selector === ".dark") {
    return `${CHAI_SCOPE}.dark`;
  }

  if (selector === "html" || selector === "body") {
    return CHAI_SCOPE;
  }

  if (selector.startsWith("html ")) {
    return selector.replace(/^html(?=\s|$|[>+~[:.#[])/, CHAI_SCOPE);
  }

  if (selector.startsWith("body ")) {
    return selector.replace(/^body(?=\s|$|[>+~[:.#[])/, CHAI_SCOPE);
  }

  if (selector.startsWith("html,")) {
    return selector.replace(/^html,/, `${CHAI_SCOPE},`);
  }

  if (selector.startsWith("body,")) {
    return selector.replace(/^body,/, `${CHAI_SCOPE},`);
  }

  return prefixedSelector;
}

async function buildScopedCss(source) {
  const result = await postcss([
    prefixSelector({
      prefix: CHAI_SCOPE,
      transform: transformSelector,
    }),
  ]).process(source, { from: undefined });

  return result.css;
}

async function main() {
  if (!fs.existsSync(sourcePath)) {
    console.error("ChaiBuilder CSS not found:", sourcePath);
    process.exit(1);
  }

  const source = fs.readFileSync(sourcePath, "utf8");

  fs.mkdirSync(publicDir, { recursive: true });
  fs.mkdirSync(stylesDir, { recursive: true });

  fs.writeFileSync(path.join(publicDir, "chaibuilder.editor.css"), source);
  fs.writeFileSync(path.join(stylesDir, "chaibuilder.scoped.css"), await buildScopedCss(source));

  console.log("Built ChaiBuilder CSS:");
  console.log("  public/chaibuilder.editor.css");
  console.log("  styles/chaibuilder.scoped.css");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
