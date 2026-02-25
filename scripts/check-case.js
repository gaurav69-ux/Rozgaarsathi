#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const CODE_EXTS = ['.js', '.jsx', '.ts', '.tsx'];
const ALL_EXTS = ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.png', '.jpg', '.jpeg', '.svg'];

function usage() {
  console.log('Usage: node scripts/check-case.js <path-to-scan>');
  process.exit(1);
}

const root = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve('.');
if (!fs.existsSync(root)) usage();

function walk(dir, exts, fileList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      walk(full, exts, fileList);
    } else {
      if (exts.includes(path.extname(e.name).toLowerCase())) fileList.push(full);
    }
  }
  return fileList;
}

function caseInsensitiveLookup(dir, name) {
  // return { foundName, exactMatch }
  if (!fs.existsSync(dir)) return null;
  const list = fs.readdirSync(dir);
  for (const entry of list) {
    if (entry === name) return { foundName: entry, exact: true };
    if (entry.toLowerCase() === name.toLowerCase()) return { foundName: entry, exact: false };
  }
  return null;
}

function resolveWithCase(baseDir, rel) {
  // Attempt to resolve rel (relative path) from baseDir and detect case mismatches
  // Normalize and remove leading ./ so traversal segments are clean
  const target = path.join(baseDir, rel);
  const relPath = path.relative(baseDir, target);
  const parts = relPath.split(path.sep).filter(Boolean);
  let cur = baseDir;
  let mismatches = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === '.' ) continue;
    if (part === '..') { cur = path.dirname(cur); continue; }
    const candidate = path.join(cur, part);
    // If this is the last segment, we may need to try extensions or index files
    if (i === parts.length - 1) {
      // If path exists as-is, check case
      if (fs.existsSync(candidate)) {
        const name = path.basename(candidate);
        const lookup = caseInsensitiveLookup(path.dirname(candidate), name);
        if (lookup && !lookup.exact) mismatches.push({ expected: part, actual: lookup.foundName });
        return { found: candidate, mismatches };
      }
      // Try with extensions
      for (const ext of ALL_EXTS) {
        const alt = candidate + ext;
        if (fs.existsSync(alt)) {
          const lookup = caseInsensitiveLookup(path.dirname(alt), path.basename(alt));
          if (lookup && !lookup.exact) mismatches.push({ expected: part + ext, actual: lookup.foundName });
          return { found: alt, mismatches };
        }
      }
      // Try as directory with index
      if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
        for (const ext of CODE_EXTS) {
          const idx = path.join(candidate, 'index' + ext);
          if (fs.existsSync(idx)) return { found: idx, mismatches };
        }
      }
      // Not found
      // But we can attempt case-insensitive traversal to see what exists and report mismatched segments
      const parent = path.dirname(candidate);
      const lookup = caseInsensitiveLookup(parent, part);
      if (lookup) {
        mismatches.push({ expected: part, actual: lookup.foundName });
        // try to continue resolution with the found name
        parts[i] = lookup.foundName;
        return resolveWithCase(baseDir, parts.join(path.sep));
      }
      return { found: null, mismatches };
    }
    // Intermediate segment: must be directory
    const lookup = caseInsensitiveLookup(cur, part);
    if (!lookup) return { found: null, mismatches };
    if (!lookup.exact) mismatches.push({ expected: part, actual: lookup.foundName });
    cur = path.join(cur, lookup.foundName);
    if (!fs.existsSync(cur) || !fs.statSync(cur).isDirectory()) return { found: null, mismatches };
  }
  return { found: null, mismatches };
}

const importPattern = /from\s+['"](?<p>\.\.?[\/][^'"\)]+)['"]|require\(\s*['"](?<p>\.\.?[\/][^'"\)]+)['"]\s*\)|import\(\s*['"](?<p>\.\.?[\/][^'"\)]+)['"]\s*\)/g;

const files = walk(root, ['.js', '.jsx', '.ts', '.tsx']);
let results = [];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  let m;
  while ((m = importPattern.exec(content)) !== null) {
    const relImport = m.groups.p;
    if (!relImport) continue;
    // resolve relative to file's directory
    const baseDir = path.dirname(file);
    const resolved = resolveWithCase(baseDir, relImport);
    if (!resolved.found) {
      results.push({ file, import: relImport, status: 'NOT_FOUND', mismatches: resolved.mismatches });
    } else if (resolved.mismatches && resolved.mismatches.length > 0) {
      results.push({ file, import: relImport, status: 'CASE_MISMATCH', path: resolved.found, mismatches: resolved.mismatches });
    }
  }
}

if (results.length === 0) {
  console.log('NO_ISSUES');
  process.exit(0);
}

for (const r of results) {
  if (r.status === 'NOT_FOUND') {
    console.log(`${r.file} -> import '${r.import}' NOT FOUND`);
    if (r.mismatches && r.mismatches.length) {
      for (const mm of r.mismatches) console.log(`  segment mismatch: expected '${mm.expected}' actual '${mm.actual}'`);
    }
  } else if (r.status === 'CASE_MISMATCH') {
    console.log(`${r.file} -> import '${r.import}' resolves to '${r.path}' (case mismatch)`);
    for (const mm of r.mismatches) console.log(`  segment mismatch: expected '${mm.expected}' actual '${mm.actual}'`);
  }
}

process.exit(0);
