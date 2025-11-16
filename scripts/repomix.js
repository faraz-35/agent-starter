#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { glob } from "glob";

/**
 * Intelligent Repomix Script for Next.js Production Starter Template
 *
 * This script automatically detects feature files and their dependencies
 * based on the architectural principles defined in CLAUDE.md
 *
 * Usage: node scripts/repomix.js <feature-name>
 * Example: node scripts/repomix.js settings
 * Example: node scripts/repomix.js auth
 */

const CONFIG_FILE = "repomix.json";
const APP_DIR = "app";

// Load the base configuration
function loadConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
  }
  return {
    exclude: [
      "**/node_modules/**",
      "**/.next/**",
      "**/.vercel/**",
      "**/.git/**",
      "**/dist/**",
      "**/build/**",
      ".env*",
      "package-lock.json",
      "pnpm-lock.yaml",
      "**/*.map",
      "**/*.min.js",
    ],
  };
}

/**
 * Find the feature directory in app/ folder
 * Handles nested features like "dashboard/settings"
 */
function findFeatureDirectory(featureName) {
  // Handle nested features like "dashboard/settings"
  const pathParts = featureName.split("/");
  const mainFeature = pathParts[0];
  const subFeature = pathParts[1];

  const possiblePaths = [
    path.join(APP_DIR, featureName),
    path.join(APP_DIR, `(${featureName})`),
  ];

  // First try exact matches
  for (const featurePath of possiblePaths) {
    if (fs.existsSync(featurePath)) {
      return featurePath;
    }
  }

  // For nested features, look for main feature directory first
  if (subFeature) {
    const mainFeaturePaths = [
      path.join(APP_DIR, mainFeature),
      path.join(APP_DIR, `(${mainFeature})`),
    ];

    for (const mainPath of mainFeaturePaths) {
      if (fs.existsSync(mainPath)) {
        const subPath = path.join(mainPath, subFeature);
        if (fs.existsSync(subPath)) {
          return subPath;
        }
      }
    }
  }

  // Search for any directory containing the feature name
  const allDirs = fs
    .readdirSync(APP_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const dirName of allDirs) {
    if (dirName.toLowerCase().includes(mainFeature.toLowerCase())) {
      const fullPath = path.join(APP_DIR, dirName);
      if (fs.existsSync(fullPath)) {
        // If we have a subFeature, look for it within this directory
        if (subFeature) {
          const subPath = path.join(fullPath, subFeature);
          if (fs.existsSync(subPath)) {
            return subPath;
          }
        } else {
          return fullPath;
        }
      }
    }
  }

  throw new Error(`Feature directory not found for "${featureName}"`);
}

/**
 * Get all parent (common) directories that need to be included
 * Based on the architecture, we need to include all parent common directories
 */
function getParentCommonDirectories() {
  const parentCommonPath = path.join(APP_DIR, "(common)");
  return fs.existsSync(parentCommonPath) ? [parentCommonPath] : [];
}

/**
 * Recursively find all (common) directories within a feature
 */
function findFeatureCommonDirectories(featurePath) {
  const commonDirs = [];

  function findCommonDirs(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory()) {
        const fullPath = path.join(dir, item.name);

        // If it's a (common) directory, add it
        if (item.name === "(common)") {
          commonDirs.push(fullPath);
        } else {
          // Recursively search subdirectories
          findCommonDirs(fullPath);
        }
      }
    }
  }

  findCommonDirs(featurePath);
  return commonDirs;
}

/**
 * Find all API routes that belong to this feature
 */
function findFeatureApiRoutes(featurePath, featureName) {
  const apiRoutes = [];

  // Check for API route in app/api/ that proxies to feature
  const globalApiPath = path.join(APP_DIR, "api", featureName);
  if (fs.existsSync(globalApiPath)) {
    apiRoutes.push(`${globalApiPath}/**`);
  }

  // Check for API routes within the feature directory
  const featureApiPath = path.join(featurePath, "api");
  if (fs.existsSync(featureApiPath)) {
    apiRoutes.push(`${featureApiPath}/**`);
  }

  return apiRoutes;
}

/**
 * Find all files and directories for a given feature
 */
function getFeatureFiles(featureName) {
  const featurePath = findFeatureDirectory(featureName);
  console.log(`🔍 Found feature directory: ${featurePath}`);

  const files = [];

  // 1. Include all files in the feature directory
  files.push(`${featurePath}/**`);

  // 2. Include all feature (common) directories
  const featureCommonDirs = findFeatureCommonDirectories(featurePath);
  files.push(...featureCommonDirs.map((dir) => `${dir}/**`));

  // 3. Include parent (common) directory
  const parentCommonDirs = getParentCommonDirectories();
  files.push(...parentCommonDirs.map((dir) => `${dir}/**`));

  // 4. Include API routes
  const apiRoutes = findFeatureApiRoutes(featurePath, featureName);
  files.push(...apiRoutes);

  // 5. Include related files in root app/ directory
  const rootFiles = ["app/layout.tsx", "app/(home)/page.tsx"];
  files.push(...rootFiles.filter((file) => fs.existsSync(file)));

  // 6. Include configuration files
  const configFiles = [
    "tailwind.config.*",
    "next.config.*",
    "tsconfig.json",
    "package.json",
  ];
  files.push(...configFiles);

  // 7. Include environment example
  if (fs.existsSync(".env.local.example")) {
    files.push(".env.local.example");
  }

  return files;
}

/**
 * Generate a descriptive output filename
 */
function generateOutputFilename(featureName) {
  const timestamp = new Date().toISOString().split("T")[0];
  return `repomix-${featureName}-${timestamp}.xml`;
}

/**
 * Create temporary repomix configuration and run it
 */
function runRepomix(featureName, files, config) {
  const tempConfig = {
    $schema: "https://repomix.dev/schema.json",
    exclude: config.exclude || [],
    include: files,
    output: {
      filePath: generateOutputFilename(featureName),
      style: "xml",
      removeComments: false, // Keep comments for context
      removeEmptyLines: true,
      topFilesLength: 10, // Show important files first
      headerText: `# Repomix for Feature: ${featureName}

Generated by intelligent repomix script based on Next.js Production Starter Template architecture.

## Feature Structure
This bundle contains:
- Complete feature directory with all sub-features
- All (common) directories within the feature (shared components, hooks, utils)
- Parent (common) directory with truly shared utilities
- Related API routes and proxy files
- Configuration files for context

## Architecture Notes
- Features are self-contained with complete business logic
- (common) directories contain only shared components to avoid duplication
- All necessary imports and dependencies are included
- Follows adaptive self-containment principles from CLAUDE.md

Generated on: ${new Date().toISOString()}
`,
    },
  };

  const tempConfigPath = "repomix.temp.json";
  fs.writeFileSync(tempConfigPath, JSON.stringify(tempConfig, null, 2));

  console.log(`📦 Running repomix for ${featureName}`);
  console.log(`📄 Output: ${tempConfig.output.filePath}`);
  console.log(`📁 Including ${files.length} file/directory patterns\n`);

  try {
    execSync(`repomix --config ${tempConfigPath}`, { stdio: "inherit" });
    console.log(`\n✅ Successfully generated repomix for ${featureName}`);
    console.log(`📁 Output file: ${tempConfig.output.filePath}`);
  } catch (error) {
    console.error(`\n❌ Error running repomix: ${error.message}`);
    process.exit(1);
  } finally {
    if (fs.existsSync(tempConfigPath)) {
      fs.unlinkSync(tempConfigPath);
    }
  }
}

/**
 * List all available features
 */
function listAvailableFeatures() {
  console.log("🔍 Available features:");

  if (!fs.existsSync(APP_DIR)) {
    console.log("❌ app/ directory not found");
    return;
  }

  // Get all directories in app/
  const items = fs
    .readdirSync(APP_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .sort();

  // Filter out infrastructure directories and find actual features
  const features = [];
  const infrastructureDirs = ["(common)", "api"];

  items.forEach((item) => {
    // Skip infrastructure directories (but keep (home) since it's a page)
    if (infrastructureDirs.includes(item)) {
      return;
    }

    const itemPath = path.join(APP_DIR, item);

    // Check if this is a feature directory (has subdirectories or pages)
    const subItems = fs.readdirSync(itemPath, { withFileTypes: true });

    // Check if this directory has a page.tsx directly
    const hasDirectPage = subItems.some((dirent) => dirent.name === "page.tsx");

    // Check if this has sub-features (subdirectories with pages)
    const hasSubFeatures = subItems.some(
      (dirent) =>
        dirent.isDirectory() &&
        (fs.existsSync(path.join(itemPath, dirent.name, "page.tsx")) ||
          fs.existsSync(path.join(itemPath, dirent.name, "layout.tsx"))),
    );

    if (hasSubFeatures && !hasDirectPage) {
      // This is a multi-page feature, add sub-features
      const subFeatures = subItems
        .filter((dirent) => dirent.isDirectory())
        .filter((dirent) => !dirent.name.startsWith("("))
        .map((dirent) => dirent.name)
        .sort();

      features.push(`📁 ${item}`);
      subFeatures.forEach((subFeature) => {
        features.push(`  📄 ${item}/${subFeature}`);
      });
    } else if (hasDirectPage) {
      // This is a single-page feature (including route groups like (home))
      if (item.startsWith("(")) {
        features.push(`📄 ${item}`);
      } else {
        features.push(`📁 ${item}`);
      }
    }
  });

  if (features.length === 0) {
    console.log("No feature directories found");
    return;
  }

  features.forEach((feature) => console.log(`  ${feature}`));

  // Generate usage examples based on actual features
  console.log("\nUsage examples:");

  // Find examples from the features we found
  const featureNames = [];
  features.forEach((feature) => {
    const match = feature.match(/📁\s([^/]+)/);
    if (match && !match[1].startsWith("(")) {
      featureNames.push(match[1]);
    }
  });

  if (featureNames.includes("dashboard")) {
    console.log("  pnpm repomix dashboard");
    console.log("  pnpm repomix dashboard/settings");
  }
  if (featureNames.length > 0) {
    featureNames.forEach((name) => {
      if (name !== "dashboard") {
        console.log(`  pnpm repomix ${name}`);
      }
    });
  }

  // Check if (home) exists and add it as example
  if (items.includes("(home)")) {
    console.log("  pnpm repomix (home)");
  }
}

/**
 * Main execution
 */
function main() {
  const featureName = process.argv[2];

  if (!featureName) {
    console.error("❌ Please provide a feature name");
    console.log("\nUsage:");
    console.log("  pnpm repomix <feature-name>");
    console.log("  pnpm repomix --list");
    console.log("\nExamples:");
    console.log("  pnpm repomix dashboard");
    console.log("  pnpm repomix auth");
    console.log("  pnpm repomix settings");
    process.exit(1);
  }

  if (featureName === "--list" || featureName === "-l") {
    listAvailableFeatures();
    return;
  }

  if (featureName === "--help" || featureName === "-h") {
    console.log(`
🔧 Intelligent Repomix Script for Next.js Production Starter Template

This script automatically finds all relevant files for a given feature based on
the project's architecture principles.

Usage:
  pnpm repomix <feature-name>    Generate repomix for specific feature
  pnpm repomix --list           List all available features
  pnpm repomix --help           Show this help message

Features:
  🔍 Auto-detects feature directories
  📦 Includes all dependencies and common utilities
  🎯 Follows adaptive self-containment principles
  📄 Generates descriptive XML output with timestamps
  🔄 Handles complex folder structures automatically

Examples:
  pnpm repomix dashboard     # Bundle dashboard feature
  pnpm repomix auth         # Bundle authentication feature
  pnpm repomix settings     # Bundle settings feature
`);
    return;
  }

  try {
    const config = loadConfig();
    const files = getFeatureFiles(featureName);
    runRepomix(featureName, files, config);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { main, getFeatureFiles, findFeatureDirectory };
