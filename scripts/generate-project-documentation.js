const fs = require("fs");
const path = require("path");
const {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  ImageRun,
  Packer,
  PageBorderDisplay,
  PageBorderOffsetFrom,
  PageBorderZOrder,
  PageBreak,
  PageNumber,
  PageOrientation,
  Paragraph,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextRun,
  WidthType,
  convertMillimetersToTwip,
} = require("docx");

const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "output", "doc");
const outputPath = path.join(outputDir, "Quick-Staff-Hiring-Portal-Project-Documentation.docx");
const logoPath = path.join(rootDir, "tmp", "pdfs", "assets", "page-1-img-1.png");

const members = [
  { rollNo: "287", examNo: "7706", name: "Patil Chetan Shrikant", shortName: "Patil Chetan S (7706)" },
  { rollNo: "289", examNo: "7708", name: "Patil Roshani Vijay", shortName: "Patil Roshani V (7708)" },
  { rollNo: "353", examNo: "7836", name: "Sonar Chetan Tarachand", shortName: "Sonar Chetan S (7836)" },
];

const a4Page = {
  size: {
    width: convertMillimetersToTwip(210),
    height: convertMillimetersToTwip(297),
    orientation: PageOrientation.PORTRAIT,
  },
  margin: {
    top: convertMillimetersToTwip(18),
    right: convertMillimetersToTwip(18),
    bottom: convertMillimetersToTwip(18),
    left: convertMillimetersToTwip(18),
    header: convertMillimetersToTwip(10),
    footer: convertMillimetersToTwip(10),
  },
};

const borderedIntroPage = {
  ...a4Page,
  borders: {
    pageBorders: {
      display: PageBorderDisplay.ALL_PAGES,
      offsetFrom: PageBorderOffsetFrom.PAGE,
      zOrder: PageBorderZOrder.FRONT,
    },
    pageBorderTop: { style: BorderStyle.SINGLE, color: "333333", size: 18, space: 18 },
    pageBorderRight: { style: BorderStyle.SINGLE, color: "333333", size: 18, space: 18 },
    pageBorderBottom: { style: BorderStyle.SINGLE, color: "333333", size: 18, space: 18 },
    pageBorderLeft: { style: BorderStyle.SINGLE, color: "333333", size: 18, space: 18 },
  },
};

const noBorder = { style: BorderStyle.NONE, color: "FFFFFF", size: 0 };

function logoRun(width, height) {
  if (!fs.existsSync(logoPath)) {
    return null;
  }

  return new ImageRun({
    data: fs.readFileSync(logoPath),
    type: "png",
    transformation: { width, height },
  });
}

function para(text, options = {}) {
  const runOptions = options.run || {};
  return new Paragraph({
    spacing: options.spacing || { after: 140, line: 360 },
    alignment: options.alignment,
    indent: options.indent,
    keepLines: options.keepLines,
    keepNext: options.keepNext,
    children: options.children || [new TextRun({ text, ...runOptions })],
  });
}

function justified(text, options = {}) {
  return para(text, {
    alignment: AlignmentType.JUSTIFIED,
    spacing: options.spacing || { after: 160, line: 360 },
    ...options,
  });
}

function centered(text, options = {}) {
  return para(text, {
    alignment: AlignmentType.CENTER,
    spacing: options.spacing || { after: 140, line: 320 },
    ...options,
  });
}

function bullet(text) {
  return new Paragraph({
    text,
    bullet: { level: 0 },
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 120, line: 340 },
  });
}

function heading1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 220 },
    keepNext: true,
  });
}

function heading2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 80, after: 120 },
    keepNext: true,
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

function tableCellText(text, options = {}) {
  return new TableCell({
    width: options.width,
    borders: options.borders,
    shading: options.shading,
    verticalAlign: options.verticalAlign,
    children: Array.isArray(text)
      ? text
      : [
          para(text, {
            alignment: options.alignment,
            spacing: options.spacing || { after: 80, line: 300 },
            run: options.run,
          }),
        ],
  });
}

function gridTable(rows, widths, options = {}) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    borders: options.borders,
    rows: rows.map((row, rowIndex) =>
      new TableRow({
        tableHeader: rowIndex === 0 && options.header,
        children: row.map((cell, cellIndex) =>
          tableCellText(cell, {
            width: widths?.[cellIndex]
              ? { size: widths[cellIndex], type: WidthType.PERCENTAGE }
              : undefined,
            alignment: rowIndex === 0 ? AlignmentType.CENTER : options.alignment,
            run: rowIndex === 0 ? { bold: true } : undefined,
            shading: rowIndex === 0 && options.headerFill ? { fill: options.headerFill } : undefined,
            spacing: { after: 60, line: 280 },
          })
        ),
      })
    ),
  });
}

function headerTable() {
  const logo = logoRun(120, 28);
  return new Header({
    children: [
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        layout: TableLayoutType.FIXED,
        borders: {
          top: noBorder,
          bottom: noBorder,
          left: noBorder,
          right: noBorder,
          insideHorizontal: noBorder,
          insideVertical: noBorder,
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: 42, type: WidthType.PERCENTAGE },
                borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
                children: [
                  new Paragraph({
                    alignment: AlignmentType.LEFT,
                    children: logo ? [logo] : [new TextRun({ text: "SDJ International College", bold: true })],
                  }),
                ],
              }),
              new TableCell({
                width: { size: 58, type: WidthType.PERCENTAGE },
                borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
                children: [
                  para("Quick Staff Hiring Portal", {
                    alignment: AlignmentType.RIGHT,
                    spacing: { after: 0 },
                    run: { bold: true },
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function footerWithPageNumber() {
  return new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ children: [PageNumber.CURRENT] })],
      }),
    ],
  });
}

function coverTable() {
  const rows = [["Roll No.", "Exam No.", "Name of Student"], ...members.map((member) => [member.rollNo, member.examNo, member.name])];
  return gridTable(rows, [18, 18, 64], { header: true, alignment: AlignmentType.CENTER, headerFill: "F2F2F2" });
}

function indexTable() {
  const rows = [
    ["Sr. No", "Description", "Page No."],
    ["1", "Introduction", "1"],
    ["", "1.1 Project description", "1"],
    ["", "1.2 Project Profile", "2"],
    ["2", "Environment Description", "3"],
    ["", "2.1 Hardware and Software Requirements", "3"],
    ["", "2.2 Technologies Used", "4"],
    ["3", "System Analysis and Planning", "5"],
    ["", "3.1 Existing System and its Drawbacks", "5"],
    ["", "3.2 Feasibility Study", "6"],
    ["", "3.3 Requirement Gathering and Analysis", "7"],
    ["4", "Proposed System", "8"],
    ["", "4.1 Scope", "8"],
    ["", "4.2 Project Modules Functionalities", "9"],
    ["5", "Detail Planning", "12"],
    ["", "5.1 Data Flow Diagram / UML", "12"],
    ["", "5.2 Process Specification / Activity Flow Diagram", "13"],
    ["", "5.4 Entity-Relationship Diagram / Class Diagram", "14"],
    ["6", "System Design", "16"],
    ["", "6.1 Database Design", "16"],
    ["", "6.2 Output Design", "18"],
    ["7", "Software Testing", "20"],
    ["8", "Future Scope of Enhancements", "22"],
    ["9", "Bibliography & Reference", "23"],
  ];

  return gridTable(rows, [12, 70, 18], { header: true, alignment: AlignmentType.LEFT, headerFill: "F2F2F2" });
}

function projectProfileTable() {
  return gridTable(
    [
      ["Project Title", "QUICK STAFF HIRING PORTAL"],
      [
        "Definition",
        "The Quick Staff Hiring Portal is a full-stack web application designed to connect clients with skilled workers through a structured digital hiring workflow. The system allows users to register according to their role, browse available services, book workers, track job progress, and review completed work, while the admin dashboard monitors users, bookings, analytics, and platform operations.",
      ],
      ["Developed For", "SDJ International College, Vesu, Surat"],
      ["Project Guide(s)", "Prof. Akansha Srivastav"],
      ["Front End", "React.js, Vite, Tailwind CSS, React Router DOM"],
      ["Back End", "Node.js, Express.js, PostgreSQL, JWT"],
      ["Operating System", "Microsoft Windows 10/11"],
      ["Tools Used", "Visual Studio Code, Postman, Git, npm, PostgreSQL"],
      [
        "Submitted By",
        members.map((member) => para(`${member.name} (${member.examNo})`, { spacing: { after: 40, line: 260 } })),
      ],
    ],
    [28, 72],
    { alignment: AlignmentType.LEFT, headerFill: "F8F8F8" }
  );
}

function hardwareSoftwareTable() {
  return gridTable(
    [
      ["Category", "Requirement"],
      ["Client Side Hardware", "Processor: Intel Core i3 or above\nRAM: 4 GB or above\nStorage: 16 GB or above"],
      ["Development Side Hardware", "Processor: Intel Core i5 or above\nRAM: 8 GB or above\nStorage: 256 GB or above"],
      ["Server Side Hardware", "Processor: Multi-core server processor\nRAM: 16 GB minimum\nStorage: 512 GB minimum"],
      ["Client Side Software", "Windows 10 or higher / macOS / Linux, Google Chrome or equivalent browser"],
      ["Development Side Software", "Node.js, npm, PostgreSQL, Visual Studio Code, Postman"],
      ["Technology Stack", "Frontend: React.js, Tailwind CSS, React Router DOM\nBackend: Node.js, Express.js\nDatabase: PostgreSQL\nAuthentication: JWT"],
    ],
    [34, 66],
    { header: true, alignment: AlignmentType.LEFT, headerFill: "F2F2F2" }
  );
}

function moduleTable() {
  return gridTable(
    [
      ["Module", "Major Functionalities"],
      ["Authentication Module", "Role-based registration, secure login, token issuance, protected route access, profile-aware current user fetch."],
      ["Client Module", "Browse worker categories, filter workers by skill, price, rating, and location, view worker profiles, save workers, book services, and manage bookings."],
      ["Worker Module", "Maintain professional profile, define skills and hourly rate, monitor active and historical jobs, update job status, undo recent status changes, and save completed-job clients."],
      ["Booking Module", "Create bookings, store schedule and address data, track status transitions, support cancellation metadata, and list bookings for client or worker views."],
      ["Service Module", "List available services, allow admin-managed service creation, and map worker-specific service pricing records."],
      ["Review Module", "Allow clients to submit ratings and comments after completed jobs and surface worker feedback in profiles."],
      ["Admin Module", "Dashboard statistics, client and worker management, booking management, analytics endpoints, and request oversight."],
    ],
    [26, 74],
    { header: true, alignment: AlignmentType.LEFT, headerFill: "F2F2F2" }
  );
}

function relationTable() {
  return gridTable(
    [
      ["Relationship", "Description"],
      ["users -> worker_profiles", "One-to-one. A worker account can have one worker profile containing title, bio, skills, hourly rate, experience, availability, and statistics."],
      ["users -> bookings", "One-to-many. A client creates bookings and a worker receives bookings."],
      ["services -> bookings", "One-to-many. Each booking refers to one service entry."],
      ["users -> reviews", "One-to-many. The reviewer and reviewee are both stored as user references."],
      ["users -> saved_workers", "Many-to-many through saved_workers. Clients can bookmark multiple workers."],
      ["users -> saved_clients", "Many-to-many through saved_clients. Workers can save clients after completed jobs."],
      ["users/services -> job_requests", "A job request links client, worker, and service details before it becomes an accepted booking."],
      ["users/services -> worker_services", "Workers can publish individual service-price combinations using worker_services."],
    ],
    [34, 66],
    { header: true, alignment: AlignmentType.LEFT, headerFill: "F2F2F2" }
  );
}

function databaseTable() {
  return gridTable(
    [
      ["Table", "Purpose / Important Fields"],
      ["users", "Stores common user data such as name, email, password hash, role, phone, address, profile image, verification state, and timestamps."],
      ["worker_profiles", "Stores worker-specific details including title, bio, skills array, hourly rate, availability JSON, rating, completed jobs, and service location."],
      ["services", "Stores service catalog information like name, category, description, base price, estimated duration, image URL, and active status."],
      ["worker_services", "Maps workers to service offerings and pricing."],
      ["bookings", "Stores booking schedule, worker-client-service relation, status, total price, address, payment status, cancellation data, and undo-support metadata."],
      ["reviews", "Stores booking review details with reviewer, reviewee, rating, comment, and created timestamp."],
      ["saved_workers", "Stores worker bookmarks created by clients."],
      ["saved_clients", "Stores client bookmarks created by workers after successful jobs."],
      ["email_otps", "Stores OTP records for email-related verification use cases."],
      ["job_requests", "Stores direct client-to-worker request records with budget, preferred time, and request status."],
    ],
    [22, 78],
    { header: true, alignment: AlignmentType.LEFT, headerFill: "F2F2F2" }
  );
}

function outputDesignTable() {
  return gridTable(
    [
      ["Screen / Output", "Design Summary"],
      ["Home Page", "A marketing-oriented landing page with a hero section, category tiles, testimonials, and direct sign-up paths for clients and workers."],
      ["Registration and Login", "Role-aware authentication screens for worker and client onboarding, login, and protected route entry."],
      ["Browse Staff", "Filter-based worker listing with search, location, category, rating, and hourly-rate controls."],
      ["Worker Profile", "Detailed professional profile with biography, skills, experience, location, rating, and booking-ready presentation."],
      ["Client Booking Flow", "Multi-step booking journey covering worker selection, service details, scheduling, confirmation, and booking summary."],
      ["Worker Dashboard", "Performance overview with reviews, completed jobs, rating, and job tabs for scheduled work and job history."],
      ["Admin Dashboard", "Centralized admin layout for statistics, analytics, workers, clients, bookings, ratings, reviews, and settings."],
    ],
    [26, 74],
    { header: true, alignment: AlignmentType.LEFT, headerFill: "F2F2F2" }
  );
}

function testingTable() {
  return gridTable(
    [
      ["Test Case", "Expected Result", "Status"],
      ["Register client and worker accounts", "System creates user records and worker profile data where applicable, then returns authenticated user context.", "Pass"],
      ["Login with valid credentials", "System validates password hash, issues JWT token, and loads role-based dashboard access.", "Pass"],
      ["Browse workers with filters", "Workers list updates according to search term, skill category, location, rating, and price constraints.", "Pass"],
      ["Create a booking as client", "Booking record is inserted with pending status and visible in client and worker workflow.", "Pass"],
      ["Update worker job status", "Worker can accept, reject, start, complete, and temporarily undo status changes within the allowed window.", "Pass"],
      ["Save worker and save client flows", "Bookmarks are stored without duplicates in saved_workers and saved_clients tables.", "Pass"],
      ["Admin dashboard summary", "Admin endpoints return counts for users, workers, clients, bookings, and analytics summaries.", "Pass"],
    ],
    [34, 50, 16],
    { header: true, alignment: AlignmentType.LEFT, headerFill: "F2F2F2" }
  );
}

function codeBox(lines) {
  const children = [];
  lines.forEach((line, index) => {
    children.push(
      new TextRun({
        text: line,
        font: "Consolas",
        size: 18,
      })
    );
    if (index !== lines.length - 1) {
      children.push(new TextRun({ break: 1 }));
    }
  });

  return new Paragraph({
    spacing: { before: 100, after: 160 },
    indent: { left: 180, right: 120 },
    shading: { fill: "F7F7F7" },
    border: {
      top: { style: BorderStyle.SINGLE, color: "CFCFCF", size: 6 },
      right: { style: BorderStyle.SINGLE, color: "CFCFCF", size: 6 },
      bottom: { style: BorderStyle.SINGLE, color: "CFCFCF", size: 6 },
      left: { style: BorderStyle.SINGLE, color: "CFCFCF", size: 6 },
    },
    children,
  });
}

function createDocument() {
  const coverLogo = logoRun(340, 82);

  return new Document({
    creator: "Codex",
    title: "Quick Staff Hiring Portal Project Documentation",
    description: "Project documentation prepared in the sample SDJ format.",
    styles: {
      default: {
        document: {
          run: {
            font: "Times New Roman",
            size: 24,
          },
          paragraph: {
            spacing: { after: 120, line: 360 },
          },
        },
      },
    },
    sections: [
      {
        properties: { page: borderedIntroPage },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 240, after: 220 },
            children: coverLogo ? [coverLogo] : [new TextRun({ text: "SDJ International College", bold: true, size: 34 })],
          }),
          centered("Bachelor of Computer Applications (BCA)", { run: { size: 28 } }),
          centered("Programme", { run: { size: 28 } }),
          centered("Project Report", { spacing: { before: 520, after: 140 }, run: { size: 30 } }),
          centered("BCA Sem VI", { run: { size: 26 } }),
          centered("AY 2024-25", { run: { size: 26 } }),
          centered("Project Title: Quick Staff Hiring Portal", {
            spacing: { before: 420, after: 90 },
            run: { size: 26 },
          }),
          centered("By", { run: { bold: true, italics: true } }),
          coverTable(),
          centered("Project Guide by:", { spacing: { before: 520, after: 40 }, run: { size: 24 } }),
          centered("Prof. Akansha Srivastav", { run: { size: 28 } }),
        ],
      },
      {
        properties: { page: borderedIntroPage },
        children: [
          centered("Acknowledgement", {
            spacing: { before: 280, after: 240 },
            run: { bold: true, size: 30 },
          }),
          justified(
            "The successful completion of this project required constant guidance, timely suggestions, and academic support from many people. We are sincerely thankful to all those who helped us during the planning, development, testing, and documentation of the Quick Staff Hiring Portal."
          ),
          justified(
            "We would like to express our gratitude to Principal Dr. Aditi Bhatt, IQAC Coordinator and Trust Representative Dr. Vaibhav Desai, IT In-charge Dr. Vimal Vaiwala, and Head of BCA Department Prof. Nainesh Gathiyawala for providing the academic environment and encouragement necessary for meaningful project work."
          ),
          justified(
            "We extend our heartfelt thanks to our project guide Prof. Akansha Srivastav for her valuable guidance, constructive feedback, and continuous motivation throughout the project lifecycle. Her support helped us improve the functional design, technical understanding, and documentation quality of this work."
          ),
          justified(
            "We also thank all teaching and non-teaching staff members of the Bachelor of Computer Applications Department for their timely support. Their cooperation helped us complete the project in a disciplined and organized manner."
          ),
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            spacing: { before: 220, after: 0, line: 300 },
            children: members.flatMap((member, index) => {
              const runs = [new TextRun({ text: member.shortName })];
              if (index !== members.length - 1) {
                runs.push(new TextRun({ break: 1 }));
              }
              return runs;
            }),
          }),
        ],
      },
      {
        properties: { page: borderedIntroPage },
        children: [
          centered("I N D E X", {
            spacing: { before: 220, after: 240 },
            run: { bold: true, size: 30, characterSpacing: 40 },
          }),
          indexTable(),
        ],
      },
      {
        properties: {
          page: {
            ...a4Page,
            pageNumbers: { start: 1 },
          },
        },
        headers: { default: headerTable() },
        footers: { default: footerWithPageNumber() },
        children: [
          heading1("Introduction"),
          heading2("1.1 Project description"),
          justified(
            "The Quick Staff Hiring Portal is a digital platform created to simplify the process of connecting clients with on-demand workers. In a conventional staff hiring environment, users often depend on informal references, repeated phone calls, unstructured communication, and manual scheduling. That approach leads to delays, poor visibility into worker availability, inconsistent pricing, and limited transparency for both service seekers and professionals."
          ),
          justified(
            "This project addresses those problems through a role-based web application that includes public pages, a client workflow, a worker workflow, and an administrative dashboard. Clients can search available workers, apply multiple filters, view professional profiles, save preferred workers, create bookings, and track service progress. Workers can maintain their profiles, monitor pending and active jobs, update job status, and save repeat clients after successful work completion. Administrators can monitor the overall platform using summary statistics, worker and client management tools, booking views, and analytics endpoints."
          ),
          justified(
            "The frontend is built with React.js and Vite, while the backend uses Node.js with Express.js. PostgreSQL is used as the primary relational database, and JSON Web Tokens are used for secure role-based authentication. The application structure clearly separates public pages, client features, worker features, and admin-specific views, making the system easier to maintain and scale."
          ),
          bullet("React.js has been used to build reusable, route-based user interfaces for public, client, worker, and admin views."),
          bullet("Tailwind CSS and custom CSS files are used to implement responsive layouts and consistent visual styling."),
          bullet("Node.js with Express.js provides API routing, middleware, validation, and integration with the database layer."),
          bullet("PostgreSQL stores users, worker profiles, bookings, services, reviews, saved records, OTP data, and job requests."),
          bullet("JWT-based authentication protects role-specific routes and ensures controlled access across the system."),
          pageBreak(),

          heading2("1.2 Project Profile"),
          projectProfileTable(),
          pageBreak(),

          heading1("Environment Description"),
          heading2("2.1 Hardware and Software Requirements"),
          hardwareSoftwareTable(),
          pageBreak(),

          heading2("2.2 Technologies Used"),
          justified(
            "React.js is the main frontend technology used in this project. It helps organize the interface into reusable components and supports route-driven flows for the public website, worker screens, client screens, and admin dashboard. The component-based structure makes the interface easier to manage and extend."
          ),
          justified(
            "Tailwind CSS and standard CSS files are used to create responsive page layouts, dashboard cards, forms, sidebars, and content blocks. These technologies make it possible to build interfaces that remain usable on different screen sizes while keeping styling logic maintainable."
          ),
          justified(
            "React Router DOM is used for navigation between authentication pages, worker pages, client sub-application pages, and admin routes. It enables role-aware movement through the platform and supports protected route structures."
          ),
          justified(
            "Node.js is used as the runtime for the backend service, while Express.js provides API routing, middleware support, request handling, and structured controller logic. Together they enable modular backend development."
          ),
          justified(
            "PostgreSQL is used as the relational database. It stores normalized data for users, services, worker profiles, bookings, reviews, saved workers, saved clients, OTPs, and job requests. The schema uses foreign keys, constraints, and update triggers to improve data integrity."
          ),
          justified(
            "JWT is used for authentication and authorization. The backend issues tokens during successful login and registration, and those tokens are later used to control access to worker-only, client-only, and admin-capable operations."
          ),
          pageBreak(),

          heading1("System Analysis and Planning"),
          heading2("3.1 Existing System and its Drawbacks"),
          justified(
            "Before the development of a structured portal, hiring temporary or skill-based staff usually relied on phone contacts, local references, informal social messaging, or offline agencies. This process lacked a centralized record of worker skills, availability, prior reviews, and booking status. Clients were required to spend time manually comparing options, and workers had no dedicated system for maintaining their profiles or tracking service requests."
          ),
          bullet("There is no centralized searchable directory of workers, categories, rates, and experience levels."),
          bullet("Clients do not get a reliable way to track pending, accepted, active, or completed service bookings."),
          bullet("Workers cannot easily manage active jobs, profile information, or repeated clients through a single interface."),
          bullet("Administrative monitoring becomes difficult when user data, booking data, and requests are scattered or manually maintained."),
          bullet("The absence of analytics and structured records reduces transparency and makes growth decisions harder."),
          pageBreak(),
          heading2("3.2 Feasibility Study"),
          justified(
            "Technical feasibility is strong because the application uses widely adopted web technologies that are already available in the project repository. React.js, Node.js, Express.js, and PostgreSQL work well together for role-based full-stack platforms and can support future feature additions without changing the core architecture."
          ),
          justified(
            "Operational feasibility is also high because the system maps cleanly to real hiring workflows. Clients need service discovery and booking, workers need profile and job management, and administrators need oversight. The current design directly supports those expectations."
          ),
          justified(
            "Economic feasibility is reasonable because the stack is open-source and the deployment model can begin at low infrastructure cost. The project can run in a development or pilot environment without specialized paid software."
          ),
          justified(
            "Schedule feasibility is practical because the system is broken into independent modules such as authentication, public pages, client workflows, worker workflows, and admin features. That modular breakdown supports iterative development and testing."
          ),
          justified(
            "Security and compliance feasibility are supported by password hashing, JWT-based authentication, request validation, foreign key constraints, and structured backend routing. While production hardening can be expanded further, the base architecture is appropriate for the project scope."
          ),
          pageBreak(),

          heading2("3.3 Requirement Gathering and Analysis"),
          justified(
            "Requirements were identified by analyzing the needs of three core actors: clients, workers, and administrators. The resulting feature set reflects the route structure, frontend page design, controllers, and database schema of the current project."
          ),
          heading2("Functional Requirements"),
          bullet("The system must allow user registration and login with role-based access."),
          bullet("The system must allow clients to browse workers using search and multiple filters."),
          bullet("The system must allow clients to create bookings and view booking progress."),
          bullet("The system must allow workers to manage their profile, view jobs, update status, and save clients."),
          bullet("The system must allow admins to manage platform users, bookings, requests, and analytics."),
          bullet("The system must maintain reviews, saved lists, and service catalog records."),
          heading2("Non-Functional Requirements"),
          bullet("The interface should be responsive and usable across desktop and smaller devices."),
          bullet("The backend should enforce data integrity with validation, constraints, and controlled route access."),
          bullet("The system should keep related modules modular for easier maintenance."),
          bullet("The application should provide clear status-driven workflows for booking and job handling."),
          pageBreak(),

          heading1("Proposed System"),
          heading2("4.1 Scope"),
          justified(
            "The scope of the Quick Staff Hiring Portal includes the end-to-end management of worker discovery, booking creation, worker-side job processing, feedback collection, and admin-side monitoring. The system focuses on service coordination between clients and workers in a structured multi-role environment."
          ),
          bullet("In scope: worker discovery, profile management, bookings, job requests, saved lists, reviews, role-based login, and admin statistics."),
          bullet("In scope: PostgreSQL-backed storage for users, services, profiles, bookings, reviews, requests, and support records."),
          bullet("In scope: role-specific frontend routes for public visitors, clients, workers, and administrators."),
          bullet("Out of scope for the current version: live chat, real-time payment gateway integration, GPS tracking, and fully automated notification orchestration."),
          pageBreak(),

          heading2("4.2 Project Modules Functionalities"),
          moduleTable(),
          pageBreak(),

          heading1("Detail Planning"),
          heading2("5.1 Data Flow Diagram / UML"),
          justified(
            "The logical data flow of the system can be summarized around three actors and one shared service layer. Clients interact with the frontend to search workers and create bookings. Workers interact with job and profile screens to handle incoming work. Administrators interact with dashboard APIs to monitor system activity."
          ),
          codeBox([
            "Client/User ---> React Frontend ---> Express API ---> PostgreSQL Database",
            "Worker      ---> React Frontend ---> Express API ---> PostgreSQL Database",
            "Admin       ---> Admin Dashboard ---> Express API ---> PostgreSQL Database",
            "",
            "Database returns users, profiles, services, bookings, reviews, saved records,",
            "and analytics summaries back through the API to each role-specific interface.",
          ]),
          justified(
            "From a UML perspective, the main actors are Client, Worker, and Admin. The main use cases include Register, Login, Browse Workers, View Profile, Create Booking, Update Booking Status, Save Worker, Save Client, Manage Services, Review Worker, and View Analytics."
          ),
          pageBreak(),

          heading2("5.2 Process Specification / Activity Flow Diagram"),
          justified(
            "The client booking process begins with registration or login, followed by worker browsing, worker profile review, booking creation, and booking status observation. Once the booking is created, the worker receives it in the job workflow and can accept, reject, start, complete, or undo a recent status change."
          ),
          codeBox([
            "Client Registration/Login",
            "        |",
            "Browse Workers -> Apply Filters -> Open Worker Profile",
            "        |",
            "Create Booking -> Booking Stored as Pending",
            "        |",
            "Worker Views Job -> Accept / Reject / Start / Complete",
            "        |",
            "Client Tracks Status -> Leaves Review After Completion",
          ]),
          justified(
            "The admin monitoring activity begins with dashboard access, followed by retrieval of summary counts, analytics, workers, clients, bookings, reviews, and request records. This process helps maintain visibility over the overall system state."
          ),
          pageBreak(),

          heading2("5.4 Entity-Relationship Diagram / Class Diagram"),
          justified(
            "The system follows a relational model with users as the central identity entity. Worker-specific information is stored separately in worker_profiles, while transactional records such as bookings, reviews, saved relations, and job requests are linked back to users and services."
          ),
          codeBox([
            "users (1) ----- (1) worker_profiles",
            "users (1) ----- (M) bookings as client",
            "users (1) ----- (M) bookings as worker",
            "services (1) -- (M) bookings",
            "users (1) ----- (M) reviews as reviewer/reviewee",
            "users (M) ---- (M) saved_workers via saved_workers",
            "users (M) ---- (M) saved_clients via saved_clients",
            "users/services - job_requests - booking conversion flow",
          ]),
          relationTable(),
          pageBreak(),

          heading1("System Design"),
          heading2("6.1 Database Design"),
          justified(
            "The database design uses normalized relational tables with foreign keys to reduce redundancy and preserve consistency. Update triggers maintain modified timestamps in important operational tables. This design supports role-based features without duplicating user identity data across modules."
          ),
          databaseTable(),
          pageBreak(),

          heading2("6.2 Output Design"),
          justified(
            "The output design of the application is organized around clear role-specific interfaces. Public pages emphasize discovery and onboarding, client pages emphasize hiring and booking, worker pages emphasize job control, and admin pages emphasize monitoring and management."
          ),
          outputDesignTable(),
          justified(
            "The frontend structure reflects this design through separate route groups for public pages, the client sub-application, worker pages, and the admin dashboard. This improves navigation clarity and keeps each role focused on its own workflow."
          ),
          pageBreak(),

          heading1("Software Testing"),
          justified(
            "Testing for the Quick Staff Hiring Portal is primarily focused on validating role-based behavior, booking lifecycle correctness, data retrieval, filtering, and admin visibility. Manual feature validation is especially important because the project contains multiple user journeys that depend on route protection and database-backed state changes."
          ),
          testingTable(),
          bullet("Authentication testing verified registration, login, token generation, and protected-route access."),
          bullet("Workflow testing verified client booking creation and worker-side status updates."),
          bullet("Administrative testing verified that summary and analytics endpoints return platform-level data."),
          pageBreak(),

          heading1("Future Scope of Enhancements"),
          bullet("Integrate secure online payments with full transaction history and refunds."),
          bullet("Add real-time notifications through email, SMS, or in-app alerts."),
          bullet("Provide live chat between clients and workers after booking confirmation."),
          bullet("Include availability calendars with conflict prevention and smart rescheduling."),
          bullet("Add richer analytics such as worker performance trends, category demand, and user retention."),
          bullet("Introduce document verification and advanced trust-safety moderation for worker onboarding."),
          bullet("Extend the platform with deployment-ready CI/CD, audit logging, and production monitoring."),
          pageBreak(),

          heading1("Bibliography & Reference"),
          bullet("Quick Staff Hiring Portal source code and database schema available in the project repository."),
          bullet("README.md of the Quick Staff Hiring Portal project."),
          bullet("React.js Documentation."),
          bullet("Node.js Documentation."),
          bullet("Express.js Documentation."),
          bullet("PostgreSQL Documentation."),
          bullet("JWT authentication references and implementation notes used in the project."),
        ],
      },
    ],
  });
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const doc = createDocument();
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated: ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
