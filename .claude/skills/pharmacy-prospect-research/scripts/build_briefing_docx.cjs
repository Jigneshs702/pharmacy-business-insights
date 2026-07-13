#!/usr/bin/env node
/**
 * Renders a pharmacy-prospect-research briefing into a Word doc.
 *
 * Usage: node build_briefing_docx.js <input.json> <output.docx>
 *
 * Input JSON shape:
 * {
 *   "ownerName": "Akash Ahmed",
 *   "pharmacyName": "Khan Pharmacy",
 *   "subtitle": "168 Roundhay Road, Harehills, Leeds LS8 5PL",
 *   "sections": [
 *     { "heading": "Ownership-currency flag", "paragraphs": ["...markdown-lite text..."] },
 *     { "heading": "Who they are", "paragraphs": ["...", "..."] },
 *     { "heading": "Digital gaps", "bullets": ["...", "..."] }
 *   ],
 *   "caveat": "..."
 * }
 *
 * Paragraph/bullet text supports a small markdown-lite subset inline:
 * **bold**, *italic*. Everything else is written as plain text.
 */

const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle,
} = require("docx");

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  console.error("Usage: node build_briefing_docx.js <input.json> <output.docx>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));

// Splits "text with **bold** and *italic*" into TextRun[] preserving emphasis.
function toRuns(text) {
  const runs = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  let last = 0;
  let m;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) runs.push(new TextRun(text.slice(last, m.index)));
    if (m[1] !== undefined) runs.push(new TextRun({ text: m[1], bold: true }));
    else runs.push(new TextRun({ text: m[2], italics: true }));
    last = re.lastIndex;
  }
  if (last < text.length) runs.push(new TextRun(text.slice(last)));
  return runs.length ? runs : [new TextRun(text)];
}

const hr = () => new Paragraph({
  text: "",
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "999999" } },
  spacing: { before: 200, after: 200 },
});

const children = [
  new Paragraph({
    text: "Pharmapresence Sales-Prep Briefing",
    heading: HeadingLevel.TITLE,
    spacing: { after: 80 },
  }),
  new Paragraph({
    children: [new TextRun({ text: `${data.ownerName} / ${data.pharmacyName}${data.subtitle ? ", " + data.subtitle : ""}`, italics: true })],
    spacing: { after: 320 },
  }),
];

for (const section of data.sections || []) {
  children.push(new Paragraph({ text: section.heading, heading: HeadingLevel.HEADING_1, spacing: { before: 320, after: 160 } }));
  for (const para of section.paragraphs || []) {
    children.push(new Paragraph({ children: toRuns(para), spacing: { after: 160 } }));
  }
  for (const b of section.bullets || []) {
    children.push(new Paragraph({ children: toRuns(b), bullet: { level: 0 }, spacing: { after: 100 } }));
  }
}

if (data.caveat) {
  children.push(hr());
  children.push(new Paragraph({ children: [new TextRun({ text: "Caveat: ", bold: true }), ...toRuns(data.caveat)], spacing: { after: 80 } }));
}

children.push(new Paragraph({
  children: [new TextRun({ text: "Prepared via the pharmacy-prospect-research skill · Pharmapresence", italics: true })],
  alignment: AlignmentType.RIGHT,
}));

const doc = new Document({
  sections: [{ properties: { page: { size: { width: 12240, height: 15840 } } }, children }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(outputPath, buf);
  console.log(`Written: ${outputPath}`);
});
