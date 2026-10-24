export const policies: Record<
  string,
  { title: string; intro: string; sections: [string, string][] }
> = {
  terms: {
    title: "Provider terms",
    intro:
      "Effective 21 October 2026 · Urbance Technologies Inc. · British Columbia, Canada",
    sections: [
      [
        "The platform and your business",
        "Urbance connects customers with independently operated service businesses. You choose whether to accept eligible requests. Account approval does not guarantee jobs, revenue or a particular assignment. Service availability and customer bookings are subject to confirmation.",
      ],
      [
        "Access and verification",
        "Complete the application truthfully, verify your email, provide the required documents and accept the current agreements. Submitted applications can view their review status. Only approved, active providers and authorized team members may access jobs. We may request updated credentials and restrict access when documents expire, safety concerns arise or terms are breached.",
      ],
      [
        "Jobs, price and commission",
        "Review the service scope, location, schedule and displayed gross amount, 7% Urbance commission and estimated net amount before accepting. One provider can accept each job. Taxes, refunds, disputes, approved adjustments and payment processing can affect the final settlement. No extra work or charge is authorized without the customer’s explicit agreement through an approved process. Payout is not promised instantly.",
      ],
      [
        "Your team",
        "The business owner controls invitations and permissions and is responsible for team conduct, worker classification, compensation, safety, licences and required insurance. Each person must use their own account. Do not share passwords. Remove access when it is no longer needed. Role changes take effect on subsequent authorized requests.",
      ],
      [
        "Customer information and photos",
        "Access only the information needed for your assigned work. Do not reuse customer data for marketing, unrelated contact or disclosure. Obtain the customer’s permission before photographing the job area; avoid people, ID, valuables and unrelated private spaces. Photos support scope, quality review and disputes. Report privacy or security incidents promptly.",
      ],
      [
        "Cancellations, disputes and support",
        "If a job becomes unsafe, outside your qualifications, materially different from its scope or impossible to attend, stop and contact support@urbance.ca promptly. Document the issue. Do not mark unfinished work complete. Urbance may investigate complaints and pause access while facts are reviewed. Customer cancellation/refund terms are available on the customer website.",
      ],
      [
        "Invoices and liability",
        "Provider-issued invoices identify your business as supplier. You are responsible for correct tax registration, invoice information and payment arrangements. The invoice tool does not charge a card or constitute an Urbance-issued tax invoice. Each party remains responsible for its own negligence and obligations under applicable law. Nothing excludes a right or liability that cannot lawfully be excluded.",
      ],
      [
        "Changes, termination and governing law",
        "We may update policies with notice and require renewed acceptance for material changes. Either party may end participation subject to existing obligations, record-retention requirements and unresolved bookings. BC law and applicable Canadian federal law govern. Contact support@urbance.ca for a copy of your accepted policy version or a complaint.",
      ],
    ],
  },
  "contractor-agreement": {
    title: "Independent contractor agreement",
    intro:
      "Effective 21 October 2026 · Read together with the provider terms. Accept only if you are authorized to bind your business.",
    sections: [
      [
        "Independent operation",
        "You operate your own business and control how accepted work is performed, subject to the agreed scope, schedule, safety standards and applicable law. You supply appropriate tools and competent personnel. You may accept or decline offers and work with other clients. This agreement does not decide statutory worker status; actual circumstances and applicable law govern.",
      ],
      [
        "Your responsibilities",
        "Maintain required business registration, municipal licences, trade qualifications, permits, insurance and WorkSafeBC registration/clearance where required. You are responsible for your personnel, lawful hiring, wages, payroll, income tax and applicable sales taxes. Do not take regulated work outside your authorization.",
      ],
      [
        "Compensation",
        "The Urbance commission is 7% on completed Urbance marketplace jobs, with the breakdown shown before acceptance. No signup or monthly fee applies. Settlement depends on the booking payment, completion review and any lawful refund or dispute adjustments. Do not collect the same booking amount again directly from a customer.",
      ],
      [
        "Subcontracting and personnel",
        "Only authorized, appropriately qualified team members may work a job. The business remains responsible for supervision, customer privacy, insurance and safety. Adding a team member does not itself verify their licence or background; confirm required credentials before assignment.",
      ],
      [
        "Standards and incidents",
        "Arrive prepared, communicate delays, protect property and record work truthfully. Report injury, damage, unsafe conditions, suspected fraud or a privacy incident immediately. Emergency services take priority when necessary. Work may be paused for safety or a scope dispute.",
      ],
      [
        "Records, confidentiality and ending work",
        "Keep accurate service and tax records as required by law. Use customer and Urbance confidential information only for authorized work. On termination, return or securely delete information unless law requires retention. Outstanding fees, claims and confidentiality obligations survive as applicable.",
      ],
    ],
  },
  privacy: {
    title: "Provider privacy policy",
    intro: "Effective 21 October 2026 · Privacy contact: support@urbance.ca",
    sections: [
      [
        "What we collect and why",
        "We collect contact and business information, application answers, credential/insurance documents, verification status, agreement acceptances, job records, invoice information and support communications to assess providers, operate bookings, prevent fraud and resolve issues. Do not upload a SIN, banking login, full card details or immigration documents unless a separate lawful and secure process specifically requests them.",
      ],
      [
        "Consent and access",
        "Required application information supports provider assessment and the requested services. Optional marketing consent is separate and can be withdrawn. You may request access, correction or information about our practices at support@urbance.ca. Withdrawing necessary consent can limit the services we can provide.",
      ],
      [
        "Location and job photos",
        "Location sharing is optional, visible to the assigned customer and authorized business staff during an active job, and stops on completion or when you turn it off. We display the last update time. Photos should show the work area with customer permission. Do not photograph people or unrelated private information. The customer and authorized staff can view relevant job evidence.",
      ],
      [
        "Who receives information",
        "We share necessary job information with the customer and authorized team members. Verification documents are restricted to the applicant and authorized reviewers. Supabase hosts account, database and file services; Vercel hosts the websites; the configured email provider delivers operational messages; Stripe handles relevant platform payments. When you choose Vision or Shadow and confirm permission, the notes and optional photo you submit are processed by OpenAI through our existing company API account to prepare a draft. Do not include access codes, identification documents or unnecessary personal details. AI output requires your review and does not automatically contact clients, approve work or move money. Service providers may process data outside Canada; applicable contracts and safeguards apply. We disclose information where legally required.",
      ],
      [
        "Security and retention",
        "We use access controls, private storage and expiring file links. No system is risk-free. Financial records are generally retained for seven years under company policy; support records for two years; provider verification records for up to three years after closure, unless a shorter period, legal hold or other requirement applies. Active location coordinates are cleared when sharing stops or the job completes. Request deletion or correction through support; we retain records where law or unresolved claims require it.",
      ],
      [
        "BC and Canadian law",
        "Our BC private-sector practices are governed by applicable BC PIPA and applicable Canadian federal privacy law. You may raise concerns with our privacy contact and the appropriate privacy regulator, including the Office of the Information and Privacy Commissioner for BC. This policy does not waive statutory rights.",
      ],
    ],
  },
  safety: {
    title: "Safety & documentation standards",
    intro:
      "Effective 21 October 2026 · Requirements depend on your services, personnel and circumstances.",
    sections: [
      [
        "Company requirements",
        "Urbance requires identity documentation, an eligibility-to-work declaration, a current liability insurance certificate showing at least CAD $2 million, and background-check documentation. These are company requirements and do not mean the same documents are legally mandatory for every Canadian business. Applications are reviewed by a person; uploads alone are not approval.",
      ],
      [
        "WorkSafeBC and licences",
        "Declare your WorkSafeBC status. Registered businesses provide a current clearance letter. If you believe registration is not required, request review and explain why; an unchecked assertion is not a determination by WorkSafeBC. Provide municipal business and applicable trade licences. Regulated electrical/gas work requires the appropriate authorization and permits.",
      ],
      [
        "On the job",
        "Confirm scope and site hazards before starting. Use suitable PPE, safe lifting and appropriate tools. Do not perform hazardous-material removal, structural, electrical, gas or other regulated tasks outside your qualifications. Stop if conditions are unsafe. Call 911 for an emergency, then notify Urbance when safe.",
      ],
      [
        "Evidence and completion",
        "Record arrival and start time accurately. With customer permission, upload before, during and after photos. Avoid faces, documents and private unrelated areas. Explain an incident or a photo-consent issue to support rather than fabricating evidence. The workspace requires evidence stages before completion; support can resolve exceptional circumstances.",
      ],
      [
        "Renewals and reporting",
        "Keep expiry dates accurate and provide replacement documents before expiry. Report expired or cancelled coverage, licence restrictions, injuries, property damage and privacy incidents promptly. Team owners must confirm each assigned worker is qualified and covered.",
      ],
    ],
  },
};
