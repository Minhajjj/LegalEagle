export interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  downloads: number;
  content: string;
}

export const templates: Template[] = [
  {
    id: 1,
    name: "Employment Agreement",
    description: "Comprehensive employment contract with compensation, duties, and termination terms.",
    category: "Employment",
    downloads: 1243,
    content: `EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into as of {{Date}}, by and between {{Company_Name}} (the "Company") and {{Employee_Name}} (the "Employee").

1. POSITION AND DUTIES
The Company agrees to employ the Employee as a {{Job_Title}}. The Employee agrees to perform the duties and responsibilities associated with this role, and such other duties as may be assigned by the Company from time to time.

2. COMPENSATION
The Employee will be paid a base salary of {{Salary_Amount}} per year, payable in accordance with the Company's standard payroll practices.

3. CONFIDENTIALITY
The Employee agrees to keep confidential all proprietary information and trade secrets of the Company, both during and after their employment.

4. TERMINATION
This Agreement may be terminated by either party upon {{Notice_Period_Days}} days' written notice.

IN WITNESS WHEREOF, the parties have executed this Employment Agreement as of the date first written above.

COMPANY: {{Company_Name}}
By: ___________________________

EMPLOYEE: {{Employee_Name}}
By: ___________________________`,
  },
  {
    id: 2,
    name: "Mutual NDA",
    description: "Two-way non-disclosure template to protect confidential business and technical information.",
    category: "Confidentiality",
    downloads: 892,
    content: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement (the "Agreement") is entered into on {{Date}} by and between {{Party_A_Name}} ("Party A") and {{Party_B_Name}} ("Party B").

1. PURPOSE
The parties wish to explore a potential business relationship in connection with {{Purpose_of_Disclosure}} (the "Purpose").

2. CONFIDENTIAL INFORMATION
"Confidential Information" means any non-public information disclosed by one party to the other party, either directly or indirectly, in writing, orally, or by inspection of tangible objects.

3. OBLIGATIONS
Each party agrees to hold the other party's Confidential Information in strict confidence and not to disclose such Confidential Information to any third party without prior written consent.

4. TERM
The obligations under this Agreement shall survive for a period of {{Term_Years}} years from the date of disclosure.

By: ___________________________
{{Party_A_Name}}

By: ___________________________
{{Party_B_Name}}`,
  },
  {
    id: 3,
    name: "Service Agreement",
    description: "Professional services template with scope, milestones, payment, and change-request handling.",
    category: "Services",
    downloads: 654,
    content: `SERVICE AGREEMENT

This Service Agreement ("Agreement") is made on {{Date}} between {{Client_Name}} ("Client") and {{Provider_Name}} ("Provider").

1. SERVICES
Provider agrees to provide the following services: {{Description_of_Services}} (the "Services").

2. PAYMENT
Client agrees to pay Provider a total fee of {{Total_Fee}} for the Services. Payment shall be made within {{Payment_Terms_Days}} days of receiving an invoice.

3. INDEPENDENT CONTRACTOR
Provider is an independent contractor. Nothing contained in this Agreement shall be construed to create a partnership, joint venture, or employer-employee relationship.

4. GOVERNING LAW
This Agreement shall be governed by the laws of {{State_or_Jurisdiction}}.

By: ___________________________
{{Client_Name}}

By: ___________________________
{{Provider_Name}}`,
  },
  // We will provide generic content for the remaining templates to make them usable.
  ...Array.from({ length: 17 }).map((_, i) => ({
    id: i + 4,
    name: `Standard Legal Template ${i + 4}`,
    description: "Generic legal template ready to be customized for your specific business needs.",
    category: ["Business", "Technology", "Real Estate", "Finance"][i % 4],
    downloads: Math.floor(Math.random() * 500) + 100,
    content: `GENERIC LEGAL AGREEMENT

This Agreement is made on {{Effective_Date}} between {{First_Party}} and {{Second_Party}}.

1. TERMS AND CONDITIONS
The parties agree to the standard terms and conditions relating to {{Subject_Matter}}.

2. OBLIGATIONS
{{First_Party}} shall perform all duties in a timely manner.
{{Second_Party}} shall provide necessary compensation and support.

3. LIABILITY
Neither party shall be liable for indirect or consequential damages.

By: ___________________________
{{First_Party}}

By: ___________________________
{{Second_Party}}`
  }))
];

// Let's replace the first 20 generated with the actual names from the old file to match exactly
const actualNames = [
  "Commercial Lease Agreement", "Partnership Agreement", "Asset Purchase Agreement", "Independent Contractor Agreement",
  "Consulting Agreement", "Software Development Agreement", "SaaS Terms of Service", "Data Processing Addendum (DPA)",
  "Freelance Statement of Work", "Vendor Agreement", "Shareholder Agreement", "Founders Agreement",
  "Loan Agreement", "Licensing Agreement", "Trademark Assignment", "Settlement Agreement", "Website Privacy Policy"
];

const categories = [
  "Real Estate", "Business", "Commercial", "Employment",
  "Services", "Technology", "Technology", "Privacy",
  "Services", "Commercial", "Business", "Business",
  "Finance", "Intellectual Property", "Intellectual Property", "Disputes", "Privacy"
];

for(let i = 0; i < actualNames.length; i++) {
  templates[i + 3].name = actualNames[i];
  templates[i + 3].category = categories[i];
}
