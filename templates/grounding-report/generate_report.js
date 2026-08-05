/**
 * Generador de referencia para informes P.A.T. (workflow grounding-report).
 *
 * Encapsula el formato ya validado contra Informe_PAT_Girasol_Rev03 (portada
 * con logo, encabezado/pie replicados campo a campo del XML de Girasol, TOC
 * nativo de Word, portada+TOC sin encabezado en su propia sección, figuras
 * estándar de las secciones 1 y 3, colores de tabla NAVY/LIGHT_BLUE) para que
 * ensamblar el próximo informe -- otra planta, otro parque -- no dependa de
 * reconstruir esto a mano ni de que alguien recuerde pedirlo.
 *
 * No corre solo: quien arma el work item (integrator, o quien lo invoque)
 * junta los datos del caso (matriz, fotos ya en JPEG baseline -- ver
 * scripts/normalize_photos.py --, conclusiones aprobadas) en el objeto
 * `data` descrito abajo y llama a buildGroundingReportDocx(data).
 *
 * Uso como CLI:
 *   node generate_report.js <ruta-a-datos.json> <ruta-salida.docx>
 * El JSON de datos NUNCA debe commitearse a este repo si trae datos reales de
 * una planta/cliente (AGENTS.md / docs/governance.md) -- vive fuera del repo,
 * en la sesión o carpeta de trabajo local del caso.
 */
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, BorderStyle, AlignmentType, ImageRun, ShadingType, Header, Footer,
  PageNumber, VerticalAlign, TableOfContents, PageBreak,
} = require("docx");

const ASSETS_DIR = path.join(__dirname, "assets");
const NAVY = "1F4E79";
const LIGHT_BLUE = "D9EAF7";

// ---------- utilidades de imagen ----------

// Lee ancho/alto de PNG (chunk IHDR) o JPEG (escanea marcadores SOF) sin
// dependencias externas. Para JPEG, además detecta si es progresivo (SOF2,
// 0xFFC2) -- Word/LibreOffice lo renderizan mal (foto de lado o distorsionada,
// visto en el caso SIBA). Correr scripts/normalize_photos.py antes de usar
// este generador con fotos de teléfono o extraídas de un rich value de Excel.
function readImageMeta(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50) { // PNG
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), progressive: false, kind: "png" };
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) { // JPEG
    let offset = 2;
    let progressive = false;
    while (offset < buf.length) {
      if (buf[offset] !== 0xff) { offset++; continue; }
      const marker = buf[offset + 1];
      if (marker === 0xc2) progressive = true; // SOF2
      if ((marker >= 0xc0 && marker <= 0xcf) && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        const height = buf.readUInt16BE(offset + 5);
        const width = buf.readUInt16BE(offset + 7);
        if (marker === 0xc2) progressive = true;
        return { width, height, progressive, kind: "jpg" };
      }
      const len = buf.readUInt16BE(offset + 2);
      offset += 2 + len;
    }
    throw new Error("No se pudo leer el tamaño del JPEG (marcador SOF no encontrado)");
  }
  throw new Error("Formato de imagen no reconocido (solo PNG/JPEG)");
}

function loadImage(filePath, targetWidth) {
  const buf = fs.readFileSync(filePath);
  const meta = readImageMeta(buf);
  if (meta.kind === "jpg" && meta.progressive) {
    throw new Error(
      `${filePath} es JPEG progresivo -- Word lo va a renderizar de lado o distorsionado. ` +
      `Correr scripts/normalize_photos.py sobre la carpeta de fotos antes de generar el informe.`
    );
  }
  return {
    buf,
    type: meta.kind,
    transformation: { width: targetWidth, height: Math.round(targetWidth * (meta.height / meta.width)) },
  };
}

// ---------- helpers de texto/tabla ----------

const NORMAL = { size: 21 };
const border = { style: BorderStyle.SINGLE, size: 2, color: "999999" };
const cellBorders = { top: border, bottom: border, left: border, right: border };

function h(text, level) {
  return new Paragraph({ text, heading: level, spacing: { before: 240, after: 120 } });
}
function p(text, opts = {}) {
  return new Paragraph({ children: [new TextRun({ text, ...NORMAL, ...opts })], spacing: { after: 120 } });
}
function pBold(text) { return p(text, { bold: true }); }

function cell(text, opts = {}) {
  return new TableCell({
    borders: cellBorders,
    width: { size: opts.width || 2000, type: WidthType.DXA },
    shading: opts.fill ? { type: ShadingType.CLEAR, fill: opts.fill } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ children: [new TextRun({ text, bold: !!opts.bold, size: 18, color: opts.color })] })],
  });
}

// Fila de encabezado azul marino / texto blanco -- estilo "Registro de mediciones" de Girasol.
function dataTable(rows, widths) {
  return new Table({
    width: { size: 9350, type: WidthType.DXA },
    columnWidths: widths,
    rows: rows.map((r, i) => new TableRow({
      children: r.map((val, j) => cell(String(val), i === 0
        ? { bold: true, fill: NAVY, color: "FFFFFF", width: widths[j] }
        : { width: widths[j] })),
    })),
  });
}

// Campo/valor con columna de etiqueta azul claro -- estilo "Datos de la Ruta de mediciones" de Girasol.
function fieldValueTable(rows, widths) {
  return new Table({
    width: { size: 9350, type: WidthType.DXA },
    columnWidths: widths,
    rows: rows.map(([label, value]) => new TableRow({
      children: [cell(label, { bold: true, fill: LIGHT_BLUE, width: widths[0] }), cell(value, { width: widths[1] })],
    })),
  });
}

function figureBlock(imgPath, caption, width) {
  const img = loadImage(imgPath, width);
  return [
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120 }, children: [new ImageRun({ data: img.buf, transformation: img.transformation, type: img.type })] }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: caption, italics: true, size: 18 })] }),
  ];
}

function pendingPhotoBox(label) {
  return new Table({
    width: { size: 9350, type: WidthType.DXA },
    columnWidths: [9350],
    rows: [new TableRow({ children: [new TableCell({
      borders: cellBorders, shading: { type: ShadingType.CLEAR, fill: "F0F0F0" }, width: { size: 9350, type: WidthType.DXA },
      children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 300, after: 300 }, children: [
        new TextRun({ text: `${label} — pendiente de embeber (falta el archivo de imagen)`, italics: true, size: 18 }),
      ]})],
    })] })],
  });
}

// ---------- encabezado / pie (calcado del header1.xml de Girasol) ----------

function buildHeaderFooter(data) {
  const logoBuf = fs.readFileSync(path.join(ASSETS_DIR, "logo_egehaina_header.png"));
  const noBorder = { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } };
  const hc = (children, opts = {}) => new TableCell({ borders: noBorder, columnSpan: opts.span || 1, verticalMerge: opts.vMerge, verticalAlign: VerticalAlign.CENTER, children });
  const ht = (runs) => new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: runs });

  const header = new Header({
    children: [new Table({
      width: { size: 9774, type: WidthType.DXA },
      columnWidths: [2340, 2340, 2340, 2754],
      borders: {
        top: { style: BorderStyle.SINGLE, size: 6, color: "7F7F7F" }, bottom: { style: BorderStyle.SINGLE, size: 6, color: "7F7F7F" },
        left: { style: BorderStyle.SINGLE, size: 6, color: "7F7F7F" }, right: { style: BorderStyle.SINGLE, size: 6, color: "7F7F7F" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: "7F7F7F" }, insideVertical: { style: BorderStyle.SINGLE, size: 6, color: "7F7F7F" },
      },
      rows: [
        new TableRow({ children: [
          hc([new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 0 }, children: [new ImageRun({ data: logoBuf, transformation: { width: 82, height: 63 }, type: "png" })] })], { vMerge: "restart" }),
          hc([ht([new TextRun({ text: data.gerencia || "GERENCIA DE INGENIERÍA Y PROYECTOS", bold: true })])], { span: 3 }),
        ]}),
        new TableRow({ children: [
          hc([new Paragraph({ children: [] })], { vMerge: "continue" }),
          hc([ht([new TextRun({ text: `${data.plant} — S/E ${data.plantShortCode || data.plant}`, size: 17 })])]),
          hc([ht([new TextRun({ text: data.campaignDateLabel, size: 16, break: 1 })])]),
          hc([ht([
            new TextRun({ text: data.docCode, size: 15 }),
            new TextRun({ text: "Página ", size: 15, break: 1 }),
            new TextRun({ children: [PageNumber.CURRENT], size: 15 }),
          ])]),
        ]}),
      ],
    })],
  });

  const footer = new Footer({
    children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
      new TextRun({ text: data.footerLine || `Informe de verificación del sistema de puesta a tierra — ${data.plant}`, size: 16, italics: true, color: "646464" }),
    ]})],
  });

  return { header, footer };
}

// ---------- documento ----------

function buildGroundingReportDocx(data) {
  const { header, footer } = buildHeaderFooter(data);

  // --- Sección 1: portada + TOC, sin encabezado/pie (igual que Girasol) ---
  const coverChildren = [];
  const coverLogo = loadImage(path.join(ASSETS_DIR, "logo_egehaina_cover.png"), 260);
  coverChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 200 }, children: [new ImageRun({ data: coverLogo.buf, transformation: coverLogo.transformation, type: coverLogo.type })] }));
  coverChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 40 }, children: [new TextRun({ text: "INFORME DE VERIFICACIÓN DEL", bold: true, size: 30 })] }));
  coverChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: "SISTEMA DE PUESTA A TIERRA (P.A.T.)", bold: true, size: 30 })] }));
  coverChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: `${data.plant.toUpperCase()} — ${(data.scopeArea || "").toUpperCase()}`, bold: true, size: 26, color: "1F6F8B" })] }));
  coverChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: `Fecha de emisión: ${data.emissionDateLabel}`, size: 20 })] }));
  coverChildren.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: data.docCode, size: 18, italics: true })] }));
  coverChildren.push(new Paragraph({ children: [new PageBreak()] }));
  coverChildren.push(h("Tabla de contenido", HeadingLevel.HEADING_2));
  coverChildren.push(new TableOfContents("Tabla de contenido", { hyperlink: true, headingStyleRange: "1-1" }));
  coverChildren.push(p("(Campo de Word — clic derecho → \"Actualizar campo\" al abrir, para que pagine contra el documento real.)", { italics: true, size: 16 }));

  // --- Sección 2: cuerpo, con encabezado/pie ---
  const children = [];

  children.push(h("1. Descripción de los trabajos", HeadingLevel.HEADING_1));
  (data.section1.paragraphs || []).forEach((t) => children.push(p(t)));
  if (data.section1.includeFigure !== false) {
    children.push(...figureBlock(path.join(ASSETS_DIR, "figura_telurometro_fluke.png"), data.section1.figureCaption || "Figura 1. Telurómetro Fluke 1625-2 GEO empleado en la campaña.", 260));
  }
  (data.section1.notes || []).forEach((t) => children.push(p(t, { italics: true })));

  children.push(h("2. Datos de campaña", HeadingLevel.HEADING_1));
  children.push(fieldValueTable(data.datosCampana, [2600, 6750]));

  children.push(h("3. Método de medición", HeadingLevel.HEADING_1));
  (data.section3.paragraphs || [
    "Las mediciones se realizaron mediante el método de caída de potencial de tres puntos, aplicando la configuración del 62 %. El telurómetro inyecta corriente a través del electrodo bajo prueba y la pica auxiliar de corriente, mide la caída de tensión respecto de la pica de potencial y determina la resistencia mediante la relación tensión/corriente.",
    "Conexiones: E/C1 para el electrodo bajo prueba, S/P para la pica de potencial y H/C para la pica de corriente.",
  ]).forEach((t) => children.push(p(t)));
  if (data.section3.includeFigure !== false) {
    children.push(...figureBlock(path.join(ASSETS_DIR, "figura_metodo_tres_puntos.png"), data.section3.figureCaption || "Figura 2. Configuración de conexión para el método de tres puntos.", 220));
  }

  children.push(h("4. Registro de mediciones", HeadingLevel.HEADING_1));
  if (data.section4.intro) children.push(p(data.section4.intro));
  children.push(dataTable(
    [["ID", "Activo / electrodo", "R (Ω)", "Criterio", "Foto fuente", "Estado"],
      ...data.points.map((pt) => [pt.id, pt.activo, pt.r, pt.criterioLabel, pt.foto, pt.estado])],
    [900, 3700, 1200, 1300, 1200, 2050],
  ));

  children.push(h("5. Galería de evidencias", HeadingLevel.HEADING_1));
  if (data.section5.intro) children.push(p(data.section5.intro));
  data.points.forEach((pt) => {
    children.push(...figureBlock(pt.photoPath, pt.photoCaption, 260));
  });
  (data.extraGallery || []).forEach((item) => {
    if (item.photoPath) {
      children.push(...figureBlock(item.photoPath, item.caption, 260));
    } else {
      children.push(pendingPhotoBox(item.code));
      children.push(p(item.caption, { italics: true, size: 18 }));
    }
  });
  if (data.section5.closingNote) children.push(p(data.section5.closingNote, { italics: true }));

  children.push(h("6. Criterio de aceptación y análisis", HeadingLevel.HEADING_1));
  (data.section6.paragraphs || []).forEach((t) => children.push(p(t)));
  if (data.section6.critiqueRecords) {
    children.push(h("6.1 Registro de crítica de ingeniería (critique-grounding-safety-analysis)", HeadingLevel.HEADING_2));
    data.section6.critiqueRecords.forEach((rec) => {
      children.push(pBold(rec.title));
      rec.lines.forEach((t) => children.push(p(t)));
    });
  }

  children.push(h("7. Conclusiones", HeadingLevel.HEADING_1));
  children.push(pBold("7.1 Resultado de la verificación"));
  children.push(p(data.conclusions.resultado));
  children.push(pBold("7.2 Estado general del sistema"));
  children.push(p(data.conclusions.estadoGeneral));
  children.push(pBold("7.3 Recomendaciones"));
  data.conclusions.recomendaciones.forEach((t, i) => children.push(p(`${i + 1}. ${t}`)));

  children.push(h("Anexo A. Lista de cierre técnico", HeadingLevel.HEADING_1));
  data.anexoA.forEach(([box, text]) => children.push(p(`${box}  ${text}`)));

  children.push(h("Anexo B. Registro de orquestación de esta corrida (Ariel Agent OS)", HeadingLevel.HEADING_1));
  children.push(dataTable([["Rol", "Resultado"], ...data.anexoB], [2400, 6950]));

  const doc = new Document({
    sections: [
      { properties: { page: { size: { width: 12240, height: 15840 } } }, children: coverChildren },
      { properties: { page: { size: { width: 12240, height: 15840 } } }, headers: { default: header }, footers: { default: footer }, children },
    ],
  });

  return Packer.toBuffer(doc);
}

module.exports = { buildGroundingReportDocx, readImageMeta };

if (require.main === module) {
  const [, , dataPath, outPath] = process.argv;
  if (!dataPath || !outPath) {
    console.error("Uso: node generate_report.js <datos.json> <salida.docx>");
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  buildGroundingReportDocx(data).then((buf) => {
    fs.writeFileSync(outPath, buf);
    console.log("OK", outPath);
  }).catch((err) => {
    console.error("ERROR:", err.message);
    process.exit(1);
  });
}
