const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
        AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType, 
        VerticalAlign, Header, Footer, PageNumber, ExternalHyperlink,
        LevelFormat } = require('docx');
const fs = require('fs');

// Color palette - Midnight Code theme
const colors = {
  title: "020617",
  body: "1E293B",
  secondary: "64748B",
  accent: "94A3B8",
  tableBg: "F8FAFC",
  tableBorder: "94A3B8"
};

const tableBorder = { style: BorderStyle.SINGLE, size: 1, color: colors.tableBorder };
const cellBorders = { top: tableBorder, bottom: tableBorder, left: tableBorder, right: tableBorder };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Times New Roman", size: 22 } } },
    paragraphStyles: [
      { id: "Title", name: "Title", basedOn: "Normal",
        run: { size: 48, bold: true, color: colors.title, font: "Times New Roman" },
        paragraph: { spacing: { before: 0, after: 240 }, alignment: AlignmentType.CENTER } },
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, color: colors.title, font: "Times New Roman" },
        paragraph: { spacing: { before: 400, after: 200 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, color: colors.body, font: "Times New Roman" },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, color: colors.secondary, font: "Times New Roman" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } }
    ]
  },
  numbering: {
    config: [
      { reference: "bullet-list",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbered-steps",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] }
    ]
  },
  sections: [{
    properties: {
      page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({ children: [new Paragraph({ 
        alignment: AlignmentType.RIGHT,
        children: [new TextRun({ text: "Vanto CRM - Chrome Extension v6.0 Configuration Guide", color: colors.secondary, size: 18 })]
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
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 },
        children: [new TextRun({ text: "Configuration & Deployment Guide", size: 24, color: colors.secondary })] }),

      // Section 1: Overview
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Overview")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun("This guide covers the configuration and deployment of the Vanto CRM Chrome Extension v6.0. This version includes significant improvements to timeout handling, microstage tracing for debugging, and enhanced logging capabilities. The extension has been updated to work with the NEW Supabase backend at "),
        new TextRun({ text: "qjlixkhctdkhvrgsflex.supabase.co", bold: true }),
        new TextRun(".")
      ]}),

      // Section 2: Key Improvements
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("2. Key Improvements in v6.0")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.1 Enhanced Timeout Configuration")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun("The extension now uses microstage timeouts instead of a single global timeout. This means if a stage fails, you know exactly where the problem occurred instead of waiting 45 seconds for a generic timeout error. Each stage has its own timeout limit, allowing for faster failure detection and more precise debugging.")
      ]}),

      // Timeout table
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
      new Paragraph({ spacing: { before: 100, after: 300 }, children: [new TextRun({ text: "Table 1: Timeout improvements by stage", italics: true, size: 18, color: colors.secondary })] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("2.2 Microstage Tracing")] }),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun("Each execution is assigned a unique ID and logs its progress through each stage. When viewing Chrome DevTools Console, you will see detailed logs such as:")
      ]}),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "[EXEC 1] Stage: open_search - START", font: "Courier New", size: 20 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "[EXEC 1] Stage: open_search - SUCCESS", font: "Courier New", size: 20 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun({ text: "[EXEC 1] Stage: search_group - START", font: "Courier New", size: 20 })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "[EXEC 1] FAILED at stage: find_input", font: "Courier New", size: 20, color: "CC0000" })] }),

      // Section 3: Configuration
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("3. Configuration Steps")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.1 Get Your Supabase Anon Key")] }),
      new Paragraph({ numbering: { reference: "numbered-steps", level: 0 }, children: [new TextRun("Go to "), new ExternalHyperlink({ children: [new TextRun({ text: "https://supabase.com/dashboard", style: "Hyperlink" })], link: "https://supabase.com/dashboard" })] }),
      new Paragraph({ numbering: { reference: "numbered-steps", level: 0 }, children: [new TextRun("Select your project: "), new TextRun({ text: "qjlixkhctdkhvrgsflex", bold: true })] }),
      new Paragraph({ numbering: { reference: "numbered-steps", level: 0 }, children: [new TextRun("Navigate to Settings → API")] }),
      new Paragraph({ numbering: { reference: "numbered-steps", level: 0 }, children: [new TextRun("Copy the "), new TextRun({ text: "anon public", bold: true }), new TextRun(" key (NOT the service_role key)")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.2 Update background.js")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("Open the "), new TextRun({ text: "background.js", bold: true }), new TextRun(" file and locate line 8:")] }),
      new Paragraph({ spacing: { after: 200 }, shading: { fill: "F0F0F0", type: ShadingType.CLEAR }, children: [
        new TextRun({ text: "const SUPABASE_ANON_KEY = 'YOUR_NEW_SUPABASE_ANON_KEY_HERE';", font: "Courier New", size: 20 })
      ]}),
      new Paragraph({ spacing: { after: 300 }, children: [new TextRun("Replace "), new TextRun({ text: "YOUR_NEW_SUPABASE_ANON_KEY_HERE", bold: true }), new TextRun(" with your actual anon key. The key is a long JWT-like string starting with \"eyJ\".")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("3.3 Load Extension in Chrome")] }),
      new Paragraph({ numbering: { reference: "numbered-steps", level: 0 }, children: [new TextRun("Open Chrome and navigate to "), new TextRun({ text: "chrome://extensions/", font: "Courier New" })] }),
      new Paragraph({ numbering: { reference: "numbered-steps", level: 0 }, children: [new TextRun("Enable "), new TextRun({ text: "Developer mode", bold: true }), new TextRun(" (toggle in top-right)")] }),
      new Paragraph({ numbering: { reference: "numbered-steps", level: 0 }, children: [new TextRun("Click "), new TextRun({ text: "Load unpacked", bold: true })] }),
      new Paragraph({ numbering: { reference: "numbered-steps", level: 0 }, children: [new TextRun("Select the "), new TextRun({ text: "chrome-extension-v6", bold: true }), new TextRun(" folder")] }),
      new Paragraph({ numbering: { reference: "numbered-steps", level: 0 }, children: [new TextRun("Navigate to "), new ExternalHyperlink({ children: [new TextRun({ text: "https://web.whatsapp.com", style: "Hyperlink" })], link: "https://web.whatsapp.com" })] }),
      new Paragraph({ numbering: { reference: "numbered-steps", level: 0 }, spacing: { after: 300 }, children: [new TextRun("Click the Vanto CRM extension icon and log in")] }),

      // Section 4: Troubleshooting
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("4. Troubleshooting")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.1 Extension Not Loading")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Verify you updated "), new TextRun({ text: "SUPABASE_ANON_KEY", bold: true }), new TextRun(" in background.js")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Check Chrome DevTools Console for errors (F12 → Console)")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [new TextRun("Ensure all files are in the same folder (manifest.json, background.js, content.js, sidebar.css, popup.html, popup.js)")] }),

      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.2 Posts Not Sending")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Open Chrome DevTools (F12)")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Go to Console tab")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Look for "), new TextRun({ text: "[VANTO CS ERROR]", bold: true }), new TextRun(" messages")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 200 }, children: [new TextRun("Check which stage is failing in the execution logs")] }),

      // Error table
      new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun("4.3 Common Error Messages")] }),
      new Table({
        columnWidths: [3000, 2500, 3000],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Error", bold: true })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Likely Cause", bold: true })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Solution", bold: true })] })] })
          ]}),
          ...[ ["DOM element missing", "WhatsApp DOM changed", "Update selectors in content.js"],
               ["Token refresh failed", "Session expired", "Log out and log in again"],
               ["Group not found", "Name mismatch", "Check exact group name in WhatsApp"],
               ["No WhatsApp tab open", "Tab closed", "Keep WhatsApp Web open"],
               ["open_search timeout", "Search not loading", "Check WhatsApp Web is responsive"],
               ["find_input timeout", "Chat not opening", "Wait for chat to fully load"] ].map(([err, cause, sol]) =>
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: err, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: cause, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 3000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: sol, size: 20 })] })] })
            ]})
          )
        ]
      }),
      new Paragraph({ spacing: { before: 100, after: 300 }, children: [new TextRun({ text: "Table 2: Common errors and solutions", italics: true, size: 18, color: colors.secondary })] }),

      // Section 5: Files Reference
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. Files Reference")] }),
      new Table({
        columnWidths: [2500, 6000],
        margins: { top: 100, bottom: 100, left: 180, right: 180 },
        rows: [
          new TableRow({ tableHeader: true, children: [
            new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "File", bold: true })] })] }),
            new TableCell({ borders: cellBorders, width: { size: 6000, type: WidthType.DXA }, shading: { fill: colors.tableBg, type: ShadingType.CLEAR }, verticalAlign: VerticalAlign.CENTER,
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Purpose", bold: true })] })] })
          ]}),
          ...[ ["manifest.json", "Extension configuration (Manifest V3)"],
               ["background.js", "Service worker - auth, polling, API calls"],
               ["content.js", "Injected script - sidebar, DOM detection, auto-poster"],
               ["sidebar.css", "Sidebar styling (dark theme)"],
               ["popup.html", "Extension popup UI"],
               ["popup.js", "Popup logic - login/logout/forgot password"],
               ["README.md", "Setup instructions"] ].map(([file, purpose]) =>
            new TableRow({ children: [
              new TableCell({ borders: cellBorders, width: { size: 2500, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: file, bold: true, size: 20 })] })] }),
              new TableCell({ borders: cellBorders, width: { size: 6000, type: WidthType.DXA }, children: [new Paragraph({ children: [new TextRun({ text: purpose, size: 20 })] })] })
            ]})
          )
        ]
      }),
      new Paragraph({ spacing: { before: 100, after: 300 }, children: [new TextRun({ text: "Table 3: Chrome extension files", italics: true, size: 18, color: colors.secondary })] }),

      // Section 6: Support
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("6. Support & Resources")] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Dashboard: "), new ExternalHyperlink({ children: [new TextRun({ text: "https://vanto-chat-crm.vercel.app", style: "Hyperlink" })], link: "https://vanto-chat-crm.vercel.app" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Repository: "), new ExternalHyperlink({ children: [new TextRun({ text: "https://github.com/Vantovant/vanto-chat-crm", style: "Hyperlink" })], link: "https://github.com/Vantovant/vanto-chat-crm" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, children: [new TextRun("Supabase Dashboard: "), new ExternalHyperlink({ children: [new TextRun({ text: "https://supabase.com/dashboard", style: "Hyperlink" })], link: "https://supabase.com/dashboard" })] }),
      new Paragraph({ numbering: { reference: "bullet-list", level: 0 }, spacing: { after: 300 }, children: [new TextRun("NEW Supabase URL: "), new TextRun({ text: "https://qjlixkhctdkhvrgsflex.supabase.co", bold: true })] })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("/home/z/my-project/download/Vanto_CRM_Chrome_Extension_v6_Configuration_Guide.docx", buffer);
  console.log("Document created successfully!");
});
