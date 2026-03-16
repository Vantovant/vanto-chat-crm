const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, 
        VerticalAlign, Header, Footer, PageNumber, LevelFormat } = require('docx');
const fs = require('fs');

// Color palette
const colors = {
  title: "0B1220",
  body: "0F172A",
  secondary: "64748B",
  accent: "94A3B8",
  tableBg: "F1F5F9",
  tableBorder: "94A3B8",
  warning: "C19A6B"
  success: "22C55E5"
};

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: colors.tableBorder };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 22 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 44, bold: true, color: colors.title, font: "Times New Roman" },
        paragraph: { spacing: { before: 0, after: 200 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: colors.title, font: "Times New Roman" },
        paragraph: { spacing: { before: 300, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, color: colors.body, font: "Times New Roman" },
        paragraph: { spacing: { before: 200, after: 150 }, outlineLevel: 1 } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }] }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({ 
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "Vanto CRM - Chrome Extension v6.0 - Dual Environment Guide", color: colors.secondary, size: 18 })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ 
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Page ", size: 18 }), new TextRun({ children: [PageNumber.CURRENT], size: 18 }), new TextRun({ text: " of ", size: 18 }), new TextRun({ children: [PageNumber.TOTAL_PAGES], size: 18 })]
      })] })
    },
    children: [
      // Title
      new Paragraph({ heading: HeadingLevel.TITLE, children: [new TextRun("Vanto CRM Chrome Extension v6.0")] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "Dual Environment Configuration Guide", size: 24, color: colors.secondary })] }),

      // Overview
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Overview")] }),
      new Paragraph({ spacing: { after: 150 }, children: [
        new TextRun("This document outlines the two parallel Chrome extension environments for Vanto CRM. Each environment has its own Supabase backend, dashboard URL, and configuration requirements. The extensions are designed to run in parallel during the migration period, allowing you to test the Vercel deployment while maintaining the existing Lovable production environment.")
      ] }),

      // Environment Comparison Table
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Environment Comparison")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The following table summarizes the key differences between the two environments:")] }),

      new Table({
        columnWidths: [2300, 3000, 3000],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders: cellBorders, width: { size: 2300, type: WidthType.DXA }, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Setting", bold: true })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Vercel (NEW)", bold: true })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Lovable (OLD)", bold: true })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2300, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Dashboard URL", bold: true })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "vanto-chat-crm.vercel.app", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "crm.onlinecourseformlm.com", size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2300, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Supabase URL", bold: true })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "qjlixkhctdkhvrgsflex", size: 20 })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "nqyyvqcmcyggvlcswkio", size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2300, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Supabase Type", bold: true })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "NEW", color: colors.success, bold: true, size: 20 })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "OLD", color: colors.warning, bold: true, size: 20 })] })] })
          ]}),
          new TableRow({ children: [
            new TableCell({ borders: cellBorders, width: { size: 2300, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "Extension Folder", bold: true })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "chrome-extension-v6-vercel", size: 18 })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: "chrome-extension-v6-lovable", size: 18 })] })] })
          ]})
        ]
      }),
      new Paragraph({ spacing: { before: 100, after: 300 }, children: [new TextRun({ text: "Table 1: Environment comparison", italics: true, size: 18, color: colors.secondary })] }),

      // Vercel Version Details
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Vercel (NEW) Configuration")] }),
      new Paragraph({ spacing: { after: 150 }, children: [
        new TextRun("The Vercel version connects to the NEW Supabase instance. Use this version for testing the new deployment at "),
        new TextRun({ text: "vanto-chat-crm.vercel.app", bold: true }),
        new TextRun(". This is the recommended version for future development.")
      ] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 Required Configuration")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Open "), new TextRun({ text: "background.js", bold: true }), new TextRun(" in the chrome-extension-v6-vercel folder")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Replace "), new TextRun({ text: "YOUR_NEW_SUPABASE_ANON_KEY_HERE", bold: true }), new TextRun(" on line 8")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Get the key from: "), new TextRun({ text: "Supabase Dashboard → qjlixkhctdkhvrgsflex → Settings → API → anon public", size: 20 })] }),

      // Lovable Version Details
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Lovable (OLD) Configuration")] }),
      new Paragraph({ spacing: { after: 150 }, children: [
        new TextRun("The Lovable version connects to the OLD Supabase instance. Use this version for production traffic at "),
        new TextRun({ text: "crm.onlinecourseformlm.com", bold: true }),
        new TextRun(". This maintains backward compatibility during the migration period.")
      ] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Required Configuration")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Open "), new TextRun({ text: "background.js", bold: true }), new TextRun(" in the chrome-extension-v6-lovable folder")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Replace "), new TextRun({ text: "YOUR_OLD_SUPABASE_ANON_KEY_HERE", bold: true }), new TextRun(" on line 8")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Get the key from: "), new TextRun({ text: "Supabase Dashboard → nqyyvqcmcyggvlcswkio → Settings → API → anon public", size: 20 })] }),

      // Timeout Improvements
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. Timeout Improvements (Both Versions)")] }),
      new Paragraph({ spacing: { after: 150 }, children: [new TextRun("Both versions now use microstage timeouts instead of a single global timeout. This allows for faster failure detection and more precise debugging.")] }),

      new Table({
        columnWidths: [3500, 2500, 2500],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders: cellBorders, width: { size: 3500, type: WidthType.DXA }, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Stage", bold: true })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Old Timeout", bold: true })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "New Timeout", bold: true })] })] })
          ]}),
          ...[ ["Open Search", "5s", "10s"], ["Search Group", "8s", "15s"], ["Select Group", "5s", "8s"],
               ["Wait Chat Open", "8s", "12s"], ["Find Input", "5s", "10s"], ["Inject Message", "5s", "8s"],
               ["Find Send Button", "5s", "10s"], ["Click Send", "5s", "8s"], ["Confirm Sent", "8s", "12s"],
               ["Total Execution", "45s", "90s"] ].map(([stage, old, newT]) =>
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, width: { size: 3500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun(stage)] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun(old)] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: newT, bold: stage === "Total Execution" })] })] })
            ]})
          )
        ]
      }),
      new Paragraph({ spacing: { before: 100, after: 300 }, children: [new TextRun({ text: "Table 2: Timeout improvements by stage", italics: true, size: 18, color: colors.secondary })] }),

      // Migration Timeline
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("6. Recommended Migration Timeline")] }),
      new Paragraph({ spacing: { after: 150 }, children: [
        new TextRun("The recommended parallel operation period is 1-2 months. During this time, monitor both environments for stability and data integrity. Once confident in the Vercel deployment, transition users from the Lovable to the Vercel version.")
      ] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Week 1-2:", bold: true }), new TextRun(" Run both versions in parallel")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "Week 3-4:", bold: true }), new TextRun(" Monitor logs and user feedback")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 300 }, children: [new TextRun({ text: "Week 5-8:", bold: true }), new TextRun(" Gradually transition users to Vercel version")] })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/download/Vanto_CRM_Chrome_Extension_Dual_Environment_Guide.docx", buffer);
  console.log("Document created successfully!");
});
