const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  HeadingLevel,
  Packer,
  PageBreak,
  PageNumber,
  Paragraph,
  Table,
  TableCell,
  TableOfContents,
  TableRow,
  TextRun,
  UnderlineType,
  WidthType,
} = require("docx");

const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "output", "doc");
const outputPath = path.join(outputDir, "Quick-Staff-Hiring-Portal-Internship-Report.docx");

function read(filePath) {
  return fs.readFileSync(path.join(rootDir, filePath), "utf8");
}

function extractSnippet(filePath, startMarker, endMarker, fallbackLines = 30) {
  const content = read(filePath);
  const lines = content.split(/\r?\n/);
  const startIndex = lines.findIndex((line) => line.includes(startMarker));
  if (startIndex === -1) {
    return lines.slice(0, fallbackLines).join("\n");
  }
  let endIndex = endMarker
    ? lines.findIndex((line, index) => index > startIndex && line.includes(endMarker))
    : -1;
  if (endIndex === -1) {
    endIndex = Math.min(lines.length, startIndex + fallbackLines);
  }
  return lines.slice(startIndex, endIndex).join("\n");
}

function text(value, options = {}) {
  return new Paragraph({
    spacing: { after: 120, line: 300 },
    ...options,
    children: [new TextRun({ text: value, ...(options.run || {}) })],
  });
}

function centered(value, options = {}) {
  return text(value, { alignment: AlignmentType.CENTER, ...options });
}

function bullet(value) {
  return new Paragraph({
    text: value,
    bullet: { level: 0 },
    spacing: { after: 80, line: 300 },
  });
}

function sectionHeading(value) {
  return new Paragraph({
    text: value,
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 180 },
  });
}

function subHeading(value) {
  return new Paragraph({
    text: value,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 120, after: 120 },
  });
}

function codeBlock(title, code) {
  const runs = [];
  const lines = code.replace(/\t/g, "  ").split("\n");
  lines.forEach((line, index) => {
    runs.push(
      new TextRun({
        text: line || " ",
        font: "Consolas",
        size: 18,
      })
    );
    if (index !== lines.length - 1) {
      runs.push(new TextRun({ break: 1 }));
    }
  });

  return [
    new Paragraph({
      spacing: { before: 80, after: 60 },
      children: [new TextRun({ text: title, bold: true })],
    }),
    new Paragraph({
      spacing: { after: 180 },
      shading: { fill: "F2F2F2" },
      border: {
        top: { style: BorderStyle.SINGLE, color: "C8C8C8", size: 6 },
        bottom: { style: BorderStyle.SINGLE, color: "C8C8C8", size: 6 },
        left: { style: BorderStyle.SINGLE, color: "C8C8C8", size: 6 },
        right: { style: BorderStyle.SINGLE, color: "C8C8C8", size: 6 },
      },
      indent: { left: 120, right: 120 },
      children: runs,
    }),
  ];
}

function placeholderBox(label) {
  return new Paragraph({
    spacing: { before: 120, after: 180 },
    border: {
      top: { style: BorderStyle.SINGLE, color: "7A7A7A", size: 6 },
      bottom: { style: BorderStyle.SINGLE, color: "7A7A7A", size: 6 },
      left: { style: BorderStyle.SINGLE, color: "7A7A7A", size: 6 },
      right: { style: BorderStyle.SINGLE, color: "7A7A7A", size: 6 },
    },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({ text: `${label}\n`, bold: true }),
      new TextRun({
        text: "Insert your screenshot or scanned certificate here before final submission.",
      }),
    ],
  });
}

function simpleTable(rows, widths) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map(
      (cells) =>
        new TableRow({
          children: cells.map(
            (cell, index) =>
              new TableCell({
                width: widths?.[index]
                  ? { size: widths[index], type: WidthType.PERCENTAGE }
                  : undefined,
                children: Array.isArray(cell) ? cell : [text(cell)],
              })
          ),
        })
    ),
  });
}

function dailyWorkRows() {
  return [
    ["10|11|2025 (Monday)", "Visited the company, understood internship expectations, and discussed the Quick Staff Hiring Portal project scope.", "Orientation"],
    ["11|11|2025 (Tuesday)", "Studied existing project architecture, folder structure, and database-driven workflow used by the team.", "React.js, Node.js"],
    ["12|11|2025 (Wednesday)", "Reviewed user roles, route structure, and authentication flow for worker and client access.", "Express.js, PostgreSQL"],
    ["13|11|2025 (Thursday)", "Started building the authorization module with registration and login validation requirements.", "React Hook Form, Yup"],
    ["14|11|2025 (Friday)", "Worked on secure authentication APIs and token-based access for the system.", "Node.js, Express.js, JWT"],
    ["15|11|2025 (Saturday)", "Connected frontend forms with backend authentication endpoints and tested error handling.", "React.js, Axios"],
    ["17|11|2025 (Monday)", "Reviewed public pages and started planning the Home module layout and navigation flow.", "React.js"],
    ["18|11|2025 (Tuesday)", "Designed the home page hero section, call-to-action buttons, and high-level information blocks.", "React.js, Tailwind CSS"],
    ["19|11|2025 (Wednesday)", "Added category cards, service highlights, and content sections for the landing page.", "React.js, Tailwind CSS"],
    ["20|11|2025 (Thursday)", "Improved page structure for desktop and mobile responsiveness in the Home module.", "CSS, Responsive Design"],
    ["21|11|2025 (Friday)", "Connected navigation links for signup, login, about, and category pages from the home interface.", "React Router"],
    ["24|11|2025 (Monday)", "Started analysis of the worker-side requirements including dashboard, jobs, and profile workflow.", "React.js, Express.js"],
    ["25|11|2025 (Tuesday)", "Implemented worker dashboard statistics using worker profile and booking data.", "PostgreSQL, Express.js"],
    ["26|11|2025 (Wednesday)", "Developed worker job listing pages with pending, accepted, active, and history states.", "React.js"],
    ["27|11|2025 (Thursday)", "Integrated worker APIs for status changes such as accept, reject, start, and complete job.", "Axios, Express.js"],
    ["28|11|2025 (Friday)", "Added undo support and toast feedback for selected worker job actions.", "React.js, API Integration"],
    ["01|12|2025 (Monday)", "Worked on worker profile details, saved client flow, and profile picture handling.", "React.js, Express.js"],
    ["02|12|2025 (Tuesday)", "Validated worker profile input fields such as skills, hourly rate, and availability.", "Express Validator"],
    ["03|12|2025 (Wednesday)", "Refined dashboard cards, schedule view, and history layout for better readability.", "Tailwind CSS"],
    ["04|12|2025 (Thursday)", "Tested role-based access flow between public, auth, and worker pages.", "JWT, Routing"],
    ["05|12|2025 (Friday)", "Fixed data-fetching issues and improved API response handling in worker screens.", "Axios, Debugging"],
    ["08|12|2025 (Monday)", "Performed end-to-end module testing for Home, Authorization, and Worker features.", "Manual Testing"],
    ["09|12|2025 (Tuesday)", "Reviewed code quality, reusable API helpers, and frontend state handling.", "React.js, Node.js"],
    ["10|12|2025 (Wednesday)", "Prepared module documentation and summarized technical contribution for report writing.", "Documentation"],
    ["11|12|2025 (Thursday)", "Collected final project notes and verified that key features were functioning properly.", "Project Review"],
    ["12|12|2025 (Friday)", "Completed report preparation and organized supporting code samples for submission.", "Documentation"],
  ];
}

function buildDailyWorkTable() {
  const rows = [["Date", "Work Done / Task", "Technology Used"], ...dailyWorkRows()];
  return simpleTable(rows, [20, 58, 22]);
}

function buildCoverTable() {
  return simpleTable(
    [
      ["Name of Student", "Sem.", "Roll No. TYBCA (SEM-6)", "SPID"],
      ["[YOUR NAME IN CAPITAL LETTERS]", "6th", "[YOUR ROLL NO.]", "[YOUR SPID]"],
    ],
    [44, 9, 25, 22]
  );
}

function moduleSection(title, bullets, codeSamples, outputLabel) {
  return [
    subHeading(title),
    ...bullets.map(bullet),
    ...codeSamples.flatMap(({ title: codeTitle, code }) => codeBlock(codeTitle, code)),
    placeholderBox(outputLabel),
  ];
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  const loginApiSnippet = extractSnippet("backend/src/routes/auth.js", "router.post(", "router.post(", 45);
  const registerUiSnippet = extractSnippet(
    "frontend/src/pages/auth/WorkerRegisterPage.jsx",
    "export default function WorkerRegisterPage",
    "}",
    65
  );
  const homeSnippet = extractSnippet(
    "frontend/src/pages/HomePage.jsx",
    "export default function HomePage()",
    "            <section className=\"py-10 md:py-16\">",
    80
  );
  const workerDashboardSnippet = extractSnippet(
    "frontend/src/pages/worker/Dashboard.jsx",
    "const WorkerDashboard = () => {",
    "  if (error) return",
    75
  );
  const workerJobsSnippet = extractSnippet(
    "backend/src/controllers/workersController.js",
    "export const getWorkerJobs = async",
    "export const updateJobStatus = async",
    60
  );

  const doc = new Document({
    creator: "Codex",
    title: "Internship Report - Quick Staff Hiring Portal",
    description: "Internship report drafted from the sample format and project source code.",
    styles: {
      default: {
        document: {
          run: {
            font: "Times New Roman",
            size: 24,
          },
          paragraph: {
            spacing: { line: 300, after: 120 },
          },
        },
      },
    },
    sections: [
      {
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({ children: [PageNumber.CURRENT] }),
                  new TextRun(" | Page"),
                ],
              }),
            ],
          }),
        },
        children: [
          centered("Internship Report", { spacing: { before: 400, after: 120 }, run: { bold: true, size: 30 } }),
          centered("At", { run: { bold: true } }),
          centered("LYNX SOFTECH", { run: { bold: true, size: 30 } }),
          centered("Submitted in partial Fulfilment of"),
          centered("The requirement for the Degree of"),
          centered("BACHELOR OF COMPUTER APPLICATION", { run: { bold: true } }),
          centered("SUBMITTED BY:", {
            spacing: { before: 120, after: 180 },
            run: { bold: true, underline: { type: UnderlineType.SINGLE } },
          }),
          buildCoverTable(),
          centered("UNDER THE GUIDANCE OF", {
            spacing: { before: 280, after: 80 },
            run: { bold: true, underline: { type: UnderlineType.SINGLE } },
          }),
          centered("Prof. Krishna Jariwala", { run: { bold: true } }),
          centered("SUBMITTED TO", {
            spacing: { before: 220, after: 80 },
            run: { bold: true, underline: { type: UnderlineType.SINGLE } },
          }),
          centered("SDJ INTERNATIONAL COLLEGE, VESU", { run: { bold: true } }),
          centered("Surat - 395007", { run: { bold: true } }),
          centered("(December - 2025)", { run: { bold: true } }),
          new Paragraph({ children: [new PageBreak()] }),

          sectionHeading("Index"),
          new Paragraph({
            text: "Right-click inside the table of contents in Word and choose Update Field after opening the document.",
            spacing: { after: 160 },
          }),
          new TableOfContents("Contents", {
            hyperlink: true,
            headingStyleRange: "1-3",
          }),
          new Paragraph({ children: [new PageBreak()] }),

          sectionHeading("Acknowledgement"),
          text("At the completion of my internship work, I feel privileged to express my sincere gratitude to everyone who supported me throughout this experience. Their encouragement, guidance, and cooperation played an important role in the successful completion of my internship project."),
          text("I would like to thank the Principal of SDJ International College, Vesu, Dr. Aditi Bhatt, for motivating students to achieve their goals and for creating a positive academic environment. I am also thankful to the IQAC Coordinator, Dr. Vaibhav Desai, for always working toward student growth and institutional excellence."),
          text("I am grateful to Mr. Dharmesh Patel and the team at LYNX SOFTECH for giving me the opportunity to complete my internship in a professional software development environment. Their guidance helped me understand real project workflows, practical coding standards, and collaborative problem solving."),
          text("I would like to express my sincere thanks to Dr. Vimal Vaiwala, Prof. Nainesh Gathiyawala, Dr. Priti Desai, Dr. Darshana Shah, and my internship guide Prof. Krishna Jariwala for their continuous support, valuable suggestions, and encouragement during the internship period."),
          text("Date: ____________"),
          text("Place: Surat"),
          text("[YOUR NAME]"),
          new Paragraph({ children: [new PageBreak()] }),

          sectionHeading("Certificate from Company"),
          placeholderBox("Company Certificate Page"),
          new Paragraph({ children: [new PageBreak()] }),

          sectionHeading("Certificate from College"),
          placeholderBox("College Certificate Page"),
          new Paragraph({ children: [new PageBreak()] }),

          sectionHeading("Declaration"),
          text("I, the undersigned student of TYBCA (Sem. VI) (A.Y. 2025-26), hereby declare that this Internship Report prepared by me at the below-mentioned company is the original work carried out by me. It is the result of my own effort, learning, and compliance with the policies and guidelines framed by the University, the College, and the company concerned."),
          text("I also declare that this report has been originally prepared by me and has not been published anywhere else other than for submission to SDJ International College, Vesu, Surat."),
          simpleTable(
            [
              ["TYBCA (Sem. 6) Roll No.", "SPID", "Name of Student", "Name of Company", "Signature"],
              ["[YOUR ROLL NO.]", "[YOUR SPID]", "[YOUR NAME]", "LYNX SOFTECH", "____________"],
            ],
            [16, 16, 26, 22, 20]
          ),
          text("Date: ____________"),
          text("Place: Surat"),
          new Paragraph({ children: [new PageBreak()] }),

          sectionHeading("Internship Details"),
          subHeading("Organization Profile"),
          simpleTable(
            [
              ["Name of Company", "LYNX SOFTECH"],
              ["Address of Company", "U-54, Atlanta Shopping Mall, Althan Canal Rd, Apcha Nagar, Surat, Gujarat 395017"],
              ["Website of Company", "lynxsoftech.com"],
              ["Year of Establishment", "2021"],
              ["Nature of Business", "IT / Software Service"],
              ["Vision and Mission", "Mission: To provide robust web solutions to customers across the globe.\nVision: To utilize technology with excellence of skills and create a smooth user experience."],
              ["Products / Services Offered", "Website Design and Development, Mobile Application Development, E-Commerce Website Development, Software Development, UI/UX Design, Digital Marketing, SEO, Website Support and Maintenance, IT Consultation and Training Services."],
              ["Departments", "Development Department, Digital Marketing Department, Designing Department, HR Department, Project Management Department"],
            ],
            [28, 72]
          ),
          subHeading("Department Details"),
          bullet("Web Development Department: Handles client-side design, backend development, maintenance, and testing of web applications."),
          bullet("Project Management Department: Coordinates requirements, timelines, and delivery quality."),
          bullet("Quality Assurance Support: Assists in reviewing functionality, defects, and usability before release."),
          subHeading("Supervisor / Mentor Details"),
          bullet("Name: Dharmesh Patel"),
          bullet("Designation: CEO"),
          bullet("Department: Web Development Department"),
          bullet("Supervisor's Role in the Project: Mentor and technical guide"),
          new Paragraph({ children: [new PageBreak()] }),

          sectionHeading("Objectives of Internship"),
          subHeading("Academic Objectives"),
          bullet("To apply theoretical knowledge of web development in a real software project."),
          bullet("To understand how frontend, backend, and database components work together in a production-style application."),
          bullet("To learn documentation and reporting practices followed during professional internship work."),
          subHeading("Skill Objectives"),
          bullet("To improve React.js, Node.js, Express.js, and PostgreSQL development skills."),
          bullet("To strengthen API integration, validation, debugging, and responsive UI implementation."),
          bullet("To gain practical experience in authentication flow and role-based module development."),
          subHeading("Personal Learning Objectives"),
          bullet("To improve time management and consistency in daily development work."),
          bullet("To develop confidence in solving technical issues independently."),
          bullet("To adapt to teamwork and professional communication in an IT company environment."),
          new Paragraph({ children: [new PageBreak()] }),

          sectionHeading("Introduction of Internship Work"),
          text("This internship was completed at LYNX SOFTECH in the Web Development Department. During the internship, I contributed to the Quick Staff Hiring Portal, a full-stack web application designed to connect clients with on-demand workers and service professionals."),
          text("My major contribution focused on the Home, Authorization, and Worker modules. I developed responsive user interfaces, integrated frontend pages with backend APIs, worked with role-based access flow, and helped implement worker-side job and profile management features using React.js, Node.js, Express.js, and PostgreSQL."),
          new Paragraph({ children: [new PageBreak()] }),

          sectionHeading("Description of Work Done"),
          subHeading("Daily Work Description"),
          buildDailyWorkTable(),
          new Paragraph({ children: [new PageBreak()] }),

          sectionHeading("Modules / Tasks Completed"),
          ...moduleSection(
            "1 - Authorization Module",
            [
              "The application includes worker and client registration with validation for required fields.",
              "The login module authenticates users using email and password and returns a secure JWT token.",
              "The flow includes OTP request and verification support, password change functionality, and protected access to authenticated routes.",
              "Frontend authentication state is stored and reused to maintain session flow across the application.",
            ],
            [
              { title: "Authentication API Sample", code: loginApiSnippet },
              { title: "Worker Registration UI Sample", code: registerUiSnippet },
            ],
            "Insert screenshots of Login, Register, and Auth Flow output here"
          ),
          ...moduleSection(
            "2 - Home Module",
            [
              "The Home module provides the landing experience for both clients and workers.",
              "It includes hero banners, call-to-action buttons, featured categories, navigation links, testimonials, and footer sections.",
              "The page was designed to be responsive and easy to navigate on desktop and mobile devices.",
              "The interface highlights the platform's main purpose of hiring staff quickly and enabling workers to find opportunities.",
            ],
            [{ title: "Home Page Component Sample", code: homeSnippet }],
            "Insert screenshots of the Home page output here"
          ),
          ...moduleSection(
            "3 - Worker Module",
            [
              "The Worker module includes dashboard statistics, scheduled jobs, job history, saved clients, and profile management.",
              "Workers can accept, reject, start, complete, and undo job status changes through integrated APIs.",
              "The module supports worker profile editing, availability validation, service details, and profile picture handling.",
              "Dashboard data is fetched dynamically from worker profile and booking records to show practical performance information.",
            ],
            [
              { title: "Worker Dashboard Sample", code: workerDashboardSnippet },
              { title: "Worker Jobs API Sample", code: workerJobsSnippet },
            ],
            "Insert screenshots of the Worker dashboard, jobs, and profile output here"
          ),
          subHeading("Tools and Technologies Used"),
          bullet("Frontend: React.js, Vite, Tailwind CSS"),
          bullet("Backend: Node.js, Express.js"),
          bullet("Database: PostgreSQL"),
          bullet("Authentication: JWT, Express Validator, React Hook Form, Yup"),
          bullet("Tools: VS Code, Postman, Git, GitHub"),
          new Paragraph({ children: [new PageBreak()] }),

          sectionHeading("Weekly Summary Report"),
          subHeading("Week 1"),
          bullet("Understood company workflow, internship expectations, and the project architecture."),
          bullet("Started analysis of authorization flow and user-role requirements."),
          bullet("Reviewed frontend and backend folder structure used in the project."),
          subHeading("Week 2"),
          bullet("Worked on login and registration forms with validation and API integration."),
          bullet("Studied secure authentication flow using JWT-based access control."),
          bullet("Improved form handling, route navigation, and error messages."),
          subHeading("Week 3"),
          bullet("Developed the Home module with hero section, categories, and informational content blocks."),
          bullet("Improved responsive design and public navigation structure."),
          bullet("Connected Home page actions to registration and login pages."),
          subHeading("Week 4"),
          bullet("Worked on Worker dashboard, job list views, and booking-based data display."),
          bullet("Integrated worker status update APIs and tested action flows."),
          bullet("Added user feedback handling for successful and failed operations."),
          subHeading("Week 5"),
          bullet("Completed worker-side enhancements including saved clients, profile features, and validation updates."),
          bullet("Performed testing, bug fixing, and final documentation work."),
          bullet("Prepared internship report content based on completed project modules."),
          new Paragraph({ children: [new PageBreak()] }),

          sectionHeading("Learning Outcomes"),
          subHeading("Technical Learning"),
          bullet("Gained hands-on experience in full-stack web development using React.js, Node.js, Express.js, and PostgreSQL."),
          bullet("Learned practical API integration, form validation, role-based access control, and database-backed feature design."),
          bullet("Improved understanding of responsive UI development and modular component structure."),
          subHeading("Professional Learning"),
          bullet("Improved time management, communication, and consistency while working on project tasks."),
          bullet("Understood the importance of documentation, review, and maintaining a clear development workflow."),
          subHeading("Industry Exposure"),
          bullet("Experienced how an IT company organizes web development work across planning, coding, testing, and reporting."),
          new Paragraph({ children: [new PageBreak()] }),

          sectionHeading("Challenges and Solutions"),
          bullet("Challenge: Integrating frontend authentication forms with backend APIs and handling validation errors correctly.\nSolution: Used structured validation on both frontend and backend, and tested request-response flows carefully."),
          bullet("Challenge: Managing different worker job states such as pending, accepted, in progress, completed, rejected, and cancelled.\nSolution: Implemented status-based APIs and organized UI screens around clear filters and actions."),
          bullet("Challenge: Fetching dashboard and worker data dynamically without breaking the user experience.\nSolution: Used dedicated API helper methods, error handling, and conditional rendering for loading states."),
          bullet("Challenge: Maintaining responsive design and clear navigation across public pages and worker screens.\nSolution: Used reusable layouts, Tailwind CSS utilities, and iterative UI refinement."),
          bullet("Challenge: Converting real development work into formal documentation for academic submission.\nSolution: Structured the report module-wise and summarized progress week by week."),
          new Paragraph({ children: [new PageBreak()] }),

          sectionHeading("Conclusions"),
          text("The internship at LYNX SOFTECH was a valuable learning experience that helped me understand full-stack web application development in a practical environment. Working on the Quick Staff Hiring Portal allowed me to apply academic knowledge to real development tasks and strengthen my technical foundation."),
          text("By contributing to the Home, Authorization, and Worker modules, I gained experience in frontend development, backend API integration, authentication flow, and worker-side feature implementation. I also improved my debugging ability, documentation skills, and understanding of professional software development practices."),
          text("Overall, this internship improved both my technical and professional skills and gave me confidence to work on real-world web development projects in the future."),
          subHeading("References"),
          bullet("https://react.dev/ - For React.js concepts and official documentation"),
          bullet("https://expressjs.com/ - For Express.js backend routing and middleware concepts"),
          bullet("https://www.postgresql.org/docs/ - For PostgreSQL database reference"),
          bullet("https://tailwindcss.com/docs - For utility-based frontend styling"),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
