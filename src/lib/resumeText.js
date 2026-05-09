import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.mjs',
  import.meta.url
).toString();

const extractPdfText = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    text += content.items.map((item) => item.str).join(' ') + '\n';
  }

  return text.trim();
};

const extractDocxText = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value.trim();
};

export const extractResumeText = async (file) => {
  if (!file) {
    return '';
  }

  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.pdf')) {
    return extractPdfText(file);
  }

  if (fileName.endsWith('.docx')) {
    return extractDocxText(file);
  }

  return file.text();
};
