const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../src/components/tools/tool-tool.tsx");
let content = fs.readFileSync(filePath, "utf8");

// 1. Add useParams import and useIsRtl hook at the top
const importTarget = 'import { useState, useCallback, useEffect, useRef } from "react";';
const importReplacement = `import { useState, useCallback, useEffect, useRef } from "react";\nimport { useParams } from "next/navigation";\n\nfunction useIsRtl() {\n  const params = useParams();\n  return params?.locale === "ar";\n}`;

if (content.includes(importTarget)) {
  content = content.replace(importTarget, importReplacement);
}

// 2. Replace all instances of the window-based isRtl check
const searchStr = 'const isRtl = typeof window !== "undefined" && document.documentElement.dir === "rtl";';
const replacementStr = 'const isRtl = useIsRtl();';

content = content.split(searchStr).join(replacementStr);

fs.writeFileSync(filePath, content, "utf8");
console.log("Replaced all isRtl occurrences successfully!");
