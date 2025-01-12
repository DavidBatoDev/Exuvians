const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json"); // Replace with your JSON key file path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const eservices = [
    {
      title: "Public Employment Service Inquiry",
      description: "Inquiry about public employment services",
      link: "",
      barangayId: "LnbXpjlCb1Zj4jwb0wkS",
    },
    {
      title: "Person with Disability Verification Service",
      description: "Verification services for persons with disabilities",
      link: "",
      barangayId: "LnbXpjlCb1Zj4jwb0wkS",
    },
    {
      title: "Occupational Permit/Health Certificates",
      description: "Occupational health certificates issuance",
      link: "",
      barangayId: "LnbXpjlCb1Zj4jwb0wkS",
    },
    {
      title: "Community Tax Certificate",
      description: "Issuance of community tax certificates",
      link: "",
      barangayId: "LnbXpjlCb1Zj4jwb0wkS",
    },
    {
      title: "Real Property Tax (RPTAX)",
      description: "Manage real property tax-related tasks",
      link: "",
      barangayId: "LnbXpjlCb1Zj4jwb0wkS",
    },
    {
      title: "Notice of Violations",
      description: "Track notices of violations",
      link: "",
      barangayId: "LnbXpjlCb1Zj4jwb0wkS",
    },
    {
      title: "Business Permit Licensing",
      description: "Apply for business permits and licenses",
      link: "",
      barangayId: "LnbXpjlCb1Zj4jwb0wkS",
    },
    {
      title: "Business Tax (BTAX)",
      description: "Manage business tax payments",
      link: "",
      barangayId: "LnbXpjlCb1Zj4jwb0wkS",
    },
    {
      title: "Skills and Livelihood Programs",
      description: "Enroll in skills and livelihood programs",
      link: "",
      barangayId: "LnbXpjlCb1Zj4jwb0wkS",
    },
    {
      title: "Building Permit Management System",
      description: "Manage building permits",
      link: "",
      barangayId: "LnbXpjlCb1Zj4jwb0wkS",
    },
    {
      title: "Single Ticketing System",
      description: "Ticketing services for local ordinances",
      link: "",
      barangayId: "LnbXpjlCb1Zj4jwb0wkS",
    },
    {
      title: "Office of the Senior Citizen ID System",
      description: "Apply for senior citizen IDs",
      link: "",
      barangayId: "LnbXpjlCb1Zj4jwb0wkS",
    },
    {
      title: "Sanitary Permit Application",
      description: "Apply for sanitary permits",
      link: "",
      barangayId: "LnbXpjlCb1Zj4jwb0wkS",
    },
    {
      title: "Barangay Clearance",
      description: "Obtain a Barangay Clearance",
      link: "",
      barangayId: "LnbXpjlCb1Zj4jwb0wkS",
    },
    {
      title: "Barangay ID Issuance",
      description: "Request a Barangay Identification Card",
      link: "",
      barangayId: "LnbXpjlCb1Zj4jwb0wkS",
    },
    {
      title: "Barangay Certificate of Residency",
      description: "Certification for Barangay Residency",
      link: "",
      barangayId: "LnbXpjlCb1Zj4jwb0wkS",
    },
    {
      title: "Barangay Certificate for Business Closure",
      description: "Certification for closing a business in the Barangay",
      link: "",
      barangayId: "LnbXpjlCb1Zj4jwb0wkS",
    },
    {
      title: "Barangay Certificate for Business Renewal",
      description: "Certification for business renewal in the Barangay",
      link: "",
      barangayId: "LnbXpjlCb1Zj4jwb0wkS",
    },
  ];

async function uploadEservices() {
const collectionRef = db.collection("BarangayEServices");
for (const service of eservices) {
    try {
    await collectionRef.add(service);
    console.log(`Uploaded: ${service.title}`);
    } catch (error) {
    console.error(`Failed to upload ${service.title}:`, error);
    }
}
}

uploadEservices()
.then(() => console.log("All e-services uploaded successfully"))
.catch((err) => console.error("Error uploading e-services:", err));
