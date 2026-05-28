// constants/i18n/app-copy.ts

export type Language = "en" | "fil";

export const appCopy = {
  en: {
    common: {
      appName: "DementiAware",
      language: "Language",
      english: "English",
      filipino: "Filipino",
      home: "Home",
      aboutDementia: "About Dementia",
      assessment: "Assessment",
      contact: "Contact",
      submit: "Submit",
      cancel: "Cancel",
      close: "Close",
      continue: "Continue",
      back: "Back",
      next: "Next",
      print: "Print",
      downloadPdf: "Download PDF Report",
      viewDetails: "View Details",
      score: "Score",
      totalScore: "Total Score",
      results: "Results",
      interpretation: "Interpretation",
      recommendation: "Recommendation",
      actions: "Actions",
      notes: "Notes",
      yes: "Yes",
      no: "No",
      male: "Male",
      female: "Female",
      age: "Age",
      date: "Date",
      patientId: "Patient ID",
      fullName: "Full Name",
      optional: "Optional",
      loading: "Loading...",
      noData: "No records found",
    },

    homepage: {
      heroTitle: "Public dementia screening and awareness portal",
      heroDescription:
        "Accessible to anyone on the internet. Houses the educational landing page and the two assessment tracks.",
      whatIsDementia: "What is Dementia?",
      takeAssessment: "Take the Assessment Test",
      triviaTitle: "Dementia Trivia Hub",
      triviaItems: [
        "Did you know? Dementia is not a normal part of aging.",
      ],
      trackSelectorTitle: "Choose an assessment track",
      medicalTrackTitle: "Medical Professional / Trained Specialist",
      medicalTrackDescription:
        "For clinician-led screening with clinical submission to the dashboard.",
      caregiverTrackTitle: "Family Member / Caregiver",
      caregiverTrackDescription:
        "For private on-screen screening guidance for families and caregivers.",
      privacyTitle: "Privacy and data flow",
      familyPrivacy:
        "Family track data is processed instantly on-screen and is not saved to the database to comply with Data Privacy laws.",
      medicalPrivacy:
        "Medical track data is securely transmitted to the Clinical Central Dashboard upon submission.",
      footerMission:
        "A bilingual public portal for dementia awareness, screening, and guided referral.",
    },

    medical: {
      title: "Medical Professional Workflow",
      demographicTitle: "Demographic Profile",
      patientIdCaseNumber: "Patient ID / Case Number",
      fullName: "Full Name",
      age: "Age",
      sexAssignedAtBirth: "Sex assigned at birth",
      yearsOfFormalEducation: "Years of Formal Education",
      educationHelp:
        "12 years or fewer triggers 1 bonus point on MoCA-P calculation. More than 12 years adds 0 points.",
      educationHighSchoolOrBelow: "12 years or fewer / High School Graduate or below",
      educationCollegeOrAbove: "More than 12 years / College Level or Graduate",
      clinicianNameId: "Clinician Name / ID",
      mocaTitle: "MoCA-P Assessment",
      mocaSubtitle: "30 Points Max",
      domainsTitle: "MoCA-P Domains",
      domains: {
        visuospatial: "Visuospatial",
        naming: "Naming",
        attention: "Attention",
        language: "Language",
        abstraction: "Abstraction",
        delayedRecall: "Delayed Recall",
        orientation: "Orientation",
      },
      katzTitle: "Katz ADL Test",
      katzSubtitle: "6 Points Max",
      katzItems: {
        bathing: "Bathing",
        dressing: "Dressing",
        toileting: "Toileting",
        transferring: "Transferring",
        continence: "Continence",
        feeding: "Feeding",
      },
      independent: "Independent",
      dependent: "Dependent",
      submitAssessment: "Submit Assessment",
      summaryTitle: "Clinical Summary",
      finalAdjustedMoca: "Final Adjusted MoCA-P Score out of 30",
      katzScore: "Katz ADL Score out of 6",
      domainBreakdown: "Domain Breakdown",
      clinicalInterpretation: "Clinical Interpretation",
      classifications: {
        normal: "Normal",
        mci: "MCI",
        moderateDementia: "Moderate Dementia",
        severeDementia: "Severe Dementia",
      },
      actionReferral: "Action / Referral",
      printExport: "Print / Export",
      printExportDescription:
        "A button to instantly print or download the page as a structured PDF.",
    },

    moca: {
      title: "Montreal Cognitive Assessment - Philippines (MoCA-P)",
      memoryInstruction:
        "This is a memory test. I am going to read a list of five words that you will have to remember. Listen carefully and repeat them back to me when I am through.",
      memoryWords: ["FACE", "BLUE", "CHURCH", "ROSE", "SILK"],
      memoryReminder:
        "I will ask you to remember these words again at the end of the test.",
      digitSpanForward:
        "I am going to say some numbers. When I am through, repeat them exactly as I said them.",
      digitSpanForwardValues: "2 - 1 - 8 - 5 - 4",
      digitSpanBackward:
        "Now I am going to say some more numbers, but when I am through, you must repeat them to me in the backward order.",
      digitSpanBackwardValues: "7 - 4 - 2",
      vigilanceInstruction:
        "I am going to read a sequence of letters. Every time I say the letter A, tap your hand once on the table. If I say a different letter, do not tap.",
      serial7sInstruction:
        "Now, I want you to count backward by subtracting 7 from the number 60, and keep subtracting 7 until I tell you to stop.",
      sentence1:
        "The child walked his dog in the park after midnight.",
      sentence2:
        "The cat always hid under the couch when dogs were in the room.",
      fluencyInstruction:
        "I want you to tell me as many words as you can think of that begin with a certain letter of the alphabet that I will give you now. You have one minute. The letter is B.",
      abstraction1: "Tell me how an orange and a banana are alike.",
      abstraction2: "Now tell me how a train and a bicycle are alike.",
      abstraction3: "Next, say tell me how a ruler and a watch are alike.",
      orientationInstruction:
        "Tell me today's date, the month, the year, and the day of the week. Then, tell me the name of this place and the city we are in.",
    },

    katz: {
      instructionsTitle: "Katz ADLs Assessment Instructions",
      instructions: [
        "Observe or Interview: Evaluate the patient by observing their daily routine or by interviewing them, their family members, or primary caregivers.",
        "Rate Current Ability: Score the patient based on their actual performance over the past 24 to 48 hours, not their potential ability.",
        "Apply Strict Scoring: Award 1 point ONLY if the patient performs the task completely independently. Award 0 points if they require any form of human assistance, supervision, or verbal prompting.",
      ],
    },

    medicalInterpretationMatrix: {
      title: "MoCA-P and Katz ADLs Assessment Interpretation Guide",
      rows: [
        {
          cognitive: "21 to 30 Normal",
          physical: "6 / 6 Fully Independent",
          interpretation: "Healthy Aging",
          action:
            "Routine Monitoring: Provide preventative wellness education. Re-screen annually or if new complaints surface.",
        },
        {
          cognitive: "21 to 30 Normal",
          physical: "3 to 5 Moderate Impairment",
          interpretation: "Isolated Physical Deconditioning",
          action:
            "Physical Rehabilitation: Refer to Physical Therapy (PT) or Occupational Therapy (OT) to regain strength. Request a home safety assessment to prevent falls.",
        },
        {
          cognitive: "21 to 30 Normal",
          physical: "2 or less Severe Impairment",
          interpretation: "Severe Physical Disability",
          action:
            "Long-Term Care Support: Refer to Home Health Care Services and social workers. Order specialized assistive devices and mobility aids.",
        },
        {
          cognitive: "20 or below Impaired",
          physical: "6 / 6 Fully Independent",
          interpretation: "Early Cognitive Decline / Mild MCI",
          action:
            "Neurological Diagnostic Panel: Refer to a Neurologist or Geriatric Psychiatrist. Order baseline labs TSH, B12, CBC. Initiate driving and medication safety counselling.",
        },
        {
          cognitive: "20 or below Impaired",
          physical: "3 to 5 Moderate Impairment",
          interpretation: "Cognitive Decline with Functional Deficits",
          action:
            "Geriatric Co-Management: Refer to a Geriatrician for pharmacological evaluation. Engage Occupational Therapy (OT) for highly structured routines at home.",
        },
        {
          cognitive: "20 or below Impaired",
          physical: "2 or less Severe Impairment",
          interpretation: "Advanced Neurodegenerative State",
          action:
            "Comprehensive Care / Palliative Services: Immediate referral to a Multidisciplinary Geriatric Palliative Team or memory care institution. Implement 24/7 supervision and support family caregivers against burnout.",
        },
      ],
    },

    caregiver: {
      title: "Family / Caregiver Workflow",
      demographicTitle: "Simplified Demographic Profile",
      patientInitials: "Patient's Initial or Nickname",
      patientAge: "Patient's Age",
      patientSex: "Patient's Sex",
      relationship: "Your Relationship to the Patient",
      relationshipOptions: [
        "Spouse",
        "Child",
        "Sibling",
        "Professional Caregiver",
      ],
      privacyNotice:
        "This data is purely displayed on-screen and never pushed to the medical professional's private dashboard.",
      miniCogTitle: "Mini-Cog Assessment",
      miniCogSubtitle: "5 Points Max",
      step1: "Step 1: 3-Word Registration",
      step2: "Step 2: Clock Drawing Test",
      step3: "Step 3: 3-Word Recall",
      step1Instruction:
        "Please listen carefully. I am going to say three words that I want you to repeat back to me now and try to remember.",
      step2Instruction:
        "Next, I want you to draw a clock for me. First, put in all of the numbers where they go. Now, set the hands to 10 past 11.",
      step3Instruction:
        "What were the three words I asked you to remember?",
      clockNormal: "Normal Clock",
      clockAbnormal: "Abnormal Clock",
      lawtonTitle: "Lawton IADL Test",
      lawtonSubtitle: "8 Points Max for Women / 5 Max for Men",
      resultLabels: {
        miniCog: "Mini-Cog Score",
        lawton: "Lawton Scale Summary",
      },
      interpretationLabels: {
        furtherEvaluation: "Further medical evaluation recommended",
        lowRisk: "Low risk of cognitive impairment",
      },
      referral: {
        furtherEvaluation:
          "Schedule an appointment with a Neurologist or Geriatrician. Take a screenshot or print this page to show them.",
        lowRisk:
          "Retake after a few weeks if necessary.",
      },
      summaryBoxTitle: "Daily task summary",
      summaryBoxDescription:
        "A clean bulleted checklist summarizing what specific daily tasks the patient struggles with.",
    },

    minicog: {
      wordLists: {
        version1: ["Banana", "Sunrise", "Chair"],
        version2: ["Leader", "Season", "Table"],
        version3: ["Village", "Kitchen", "Baby"],
        version4: ["River", "Nation", "Finger"],
        version5: ["Captain", "Garden", "Picture"],
        version6: ["Daughter", "Heaven", "Mountain"],
      },
      scoreGuide: {
        wordRecall: "Word Recall: 0-3 points. 1 point for each word spontaneously recalled without cueing.",
        clockDraw:
          "Clock Draw: 0 or 2 points. A normal clock has all numbers in the correct sequence and approximately correct position. Hands point to 11 and 2.",
        total:
          "Total Score: 0-5 points. A cut point of 3 has been validated for dementia screening. A cut point of 4 may be used when greater sensitivity is desired.",
      },
    },

    lawton: {
      title: "Lawton-Brody Instrumental Activities of Daily Living Scale",
      scoring:
        "For each category, circle the item description that most closely resembles the client's highest functional level.",
      categories: {
        telephone: "Ability to Use Telephone",
        shopping: "Shopping",
        foodPreparation: "Food Preparation",
        housekeeping: "Housekeeping",
        laundry: "Laundry",
        transportation: "Mode of Transportation",
        medications: "Responsibility for Own Medications",
        finances: "Ability to Handle Finances",
      },
    },

    caregiverIntegratedMatrix: {
      title: "Mini-Cog + Lawton IADL Integrated Interpretation Matrix",
      rows: [
        {
          cognitive: "3 to 5 Points / Low Risk",
          functional: "Full Score",
          interpretation:
            "Low Risk Independent: No current indicators of major memory problems; fully capable of managing complex daily tasks independently.",
          action:
            "Home Monitoring: Encourage healthy aging habits. Re-screen in 12 months, or sooner if the family notices sudden behavioral changes.",
        },
        {
          cognitive: "3 to 5 Points / Low Risk",
          functional: "Partial Impairment / Struggles with 2 to 4 tasks",
          interpretation:
            "Isolated Functional Support Need: Mental clarity appears steady, but the patient struggles with specific independent daily tasks.",
          action:
            "Home Safety / Task Assistance: Assign a family member to supervise or assist with the difficult tasks. Schedule a routine check-up with a Family Physician.",
        },
        {
          cognitive: "3 to 5 Points / Low Risk",
          functional: "Severe Impairment / Struggles with 5 or more tasks",
          interpretation:
            "Severe Physical / Functional Limitations",
          action:
            "Primary Care Review / Caregiver Setup: Consult a Family Physician or General Internist immediately and organize persistent daily help at home.",
        },
        {
          cognitive: "0 to 2 Points / High Risk",
          functional: "Full Score",
          interpretation:
            "Early Cognitive Risk / High Alert",
          action:
            "Specialist Diagnostic Evaluation: Schedule an appointment with a Neurologist or Geriatrician for a formal medical assessment.",
        },
        {
          cognitive: "0 to 2 Points / High Risk",
          functional: "Partial Impairment / Struggles with 2 to 4 tasks",
          interpretation:
            "Cognitive Decline with Daily Struggles",
          action:
            "Urgent Medical Workup / Safety Safeguards: Immediate referral to a Neurologist or Geriatrician. The family must step in with medications and financial management.",
        },
        {
          cognitive: "0 to 2 Points / High Risk",
          functional: "Severe Impairment / Struggles with 5 or more tasks",
          interpretation:
            "Advanced Cognitive / Functional Decline",
          action:
            "Comprehensive Geriatric Care / Family Support: Seek urgent guidance from a Memory Clinic or Geriatric Medical Team. Establish round-the-clock supervision.",
        },
      ],
    },

    dashboard: {
      title: "Clinical Central Dashboard",
      restrictedAccess: "Restricted Access",
      restrictedAccessDescription: "Limited access to those who have links.",
      filtersTitle: "Filters",
      filterPatientId: "Patient ID",
      filterAge: "Age",
      filterDiagnosticCategory: "Diagnostic Category",
      demographics: "Demographic Profile",
      mocaBreakdown: "MoCA-P Breakdown",
      katzScores: "Katz Scores",
      interpretation: "Interpretation",
      assessmentDate: "Date of Assessment",
      emptyState: "No medical records match the selected filters.",
    },
  },

  fil: {
    common: {
      appName: "DementiAware",
      language: "Wika",
      english: "Ingles",
      filipino: "Filipino",
      home: "Home",
      aboutDementia: "Tungkol sa Dementia",
      assessment: "Pagsusuri",
      contact: "Contact",
      submit: "Ipasa",
      cancel: "Kanselahin",
      close: "Isara",
      continue: "Magpatuloy",
      back: "Bumalik",
      next: "Susunod",
      print: "I-print",
      downloadPdf: "I-download ang PDF Report",
      viewDetails: "Tingnan ang Detalye",
      score: "Puntos",
      totalScore: "Kabuuang Puntos",
      results: "Resulta",
      interpretation: "Interpretasyon",
      recommendation: "Rekomendasyon",
      actions: "Mga Aksyon",
      notes: "Mga Tala",
      yes: "Oo",
      no: "Hindi",
      male: "Lalaki",
      female: "Babae",
      age: "Edad",
      date: "Petsa",
      patientId: "Patient ID",
      fullName: "Buong Pangalan",
      optional: "Opsyonal",
      loading: "Naglo-load...",
      noData: "Walang nahanap na records",
    },

    homepage: {
      heroTitle: "Pampublikong portal para sa dementia screening at kaalaman",
      heroDescription:
        "Maaaring ma-access ng kahit sino sa internet. Dito matatagpuan ang educational landing page at ang dalawang assessment track.",
      whatIsDementia: "Ano ang Dementia?",
      takeAssessment: "Simulan ang Assessment Test",
      triviaTitle: "Dementia Trivia Hub",
      triviaItems: [
        "Alam mo ba? Ang dementia ay hindi natural na bahagi ng pagtanda.",
      ],
      trackSelectorTitle: "Pumili ng assessment track",
      medicalTrackTitle: "Medical Professional / Trained Specialist",
      medicalTrackDescription:
        "Para sa clinician-led screening na may clinical submission papunta sa dashboard.",
      caregiverTrackTitle: "Family Member / Caregiver",
      caregiverTrackDescription:
        "Para sa pribadong on-screen screening gabay para sa pamilya at caregiver.",
      privacyTitle: "Privacy at daloy ng data",
      familyPrivacy:
        "Ang family track data ay agad na pinoproseso sa screen at hindi sine-save sa database upang sumunod sa Data Privacy laws.",
      medicalPrivacy:
        "Ang medical track data ay ligtas na ipinapadala sa Clinical Central Dashboard kapag naisumite na.",
      footerMission:
        "Isang bilingual public portal para sa dementia awareness, screening, at guided referral.",
    },

    medical: {
      title: "Medical Professional Workflow",
      demographicTitle: "Demographic Profile",
      patientIdCaseNumber: "Patient ID / Case Number",
      fullName: "Buong Pangalan",
      age: "Edad",
      sexAssignedAtBirth: "Kasarian mula kapanganakan",
      yearsOfFormalEducation: "Taon ng Pormal na Edukasyon",
      educationHelp:
        "Kapag 12 taon o mas mababa, may dagdag na 1 bonus point sa MoCA-P. Kapag higit sa 12 taon, 0 ang dagdag.",
      educationHighSchoolOrBelow: "12 taon o mas mababa / High School Graduate o mas mababa",
      educationCollegeOrAbove: "Higit sa 12 taon / College Level o Graduate",
      clinicianNameId: "Pangalan / ID ng Clinician",
      mocaTitle: "MoCA-P Assessment",
      mocaSubtitle: "30 Puntos Max",
      domainsTitle: "Mga Domain ng MoCA-P",
      domains: {
        visuospatial: "Visuospatial",
        naming: "Naming",
        attention: "Atensyon",
        language: "Wika",
        abstraction: "Abstraksyon",
        delayedRecall: "Naantalang Pag-alaala",
        orientation: "Oryentasyon",
      },
      katzTitle: "Katz ADL Test",
      katzSubtitle: "6 Puntos Max",
      katzItems: {
        bathing: "Pagligo",
        dressing: "Pagbihis",
        toileting: "Paggamit ng Kubeta",
        transferring: "Paglipat ng Puwesto",
        continence: "Pagpigil sa Pagdumi / Pag-ihi",
        feeding: "Pagkain",
      },
      independent: "Independent",
      dependent: "Dependent",
      submitAssessment: "Ipasa ang Assessment",
      summaryTitle: "Clinical Summary",
      finalAdjustedMoca: "Final Adjusted MoCA-P Score mula 30",
      katzScore: "Katz ADL Score mula 6",
      domainBreakdown: "Domain Breakdown",
      clinicalInterpretation: "Clinical Interpretation",
      classifications: {
        normal: "Normal",
        mci: "MCI",
        moderateDementia: "Katamtamang Dementia",
        severeDementia: "Malubhang Dementia",
      },
      actionReferral: "Aksyon / Referral",
      printExport: "Print / Export",
      printExportDescription:
        "Button para agad ma-print o ma-download ang pahina bilang structured PDF.",
    },

    moca: {
      title: "Montreal Cognitive Assessment - Philippines (MoCA-P)",
      memoryInstruction:
        "Ito ay isang pagsusulit ng memorya. Mayroon akong babasahin na listahan ng mga salita na kailangan mong tandaan. Makinig nang mabuti at ulitin ang mga ito pagkatapos kong basahin.",
      memoryWords: ["MUKHA", "ASUL", "SIMBAHAN", "ROSAS", "SEDA"],
      memoryReminder:
        "Tatanungin muli kita para sabihin ang mga salitang iyan sa kahulian ng test.",
      digitSpanForward:
        "May sasabihin akong mga numero. Pagkatapos ko, ulitin mo nang eksakto ang mga ito katulad ng aking pagkakasabi.",
      digitSpanForwardValues: "2 - 1 - 8 - 5 - 4",
      digitSpanBackward:
        "Ngayon, may sasabihin ulit akong mga panibagong numero. Pagkatapos ko, sabihin mo sa akin nang pabaliktad.",
      digitSpanBackwardValues: "7 - 4 - 2",
      vigilanceInstruction:
        "Magsasabi ako ng letrang magkakasunod-sunod. Tuwing sasabihin ko ang letrang A, tapikin mo ang mesa ng isang beses. Kapag ibang letra ang aking sasabihin, huwag tumapik.",
      serial7sInstruction:
        "Ngayon, bawasan ng pito ang one hundred. Sa bawat sagot, magbawas ka ng pito hanggang sabihin ko na tama na.",
      sentence1:
        "Ang alam ko lang, si Juan ang siyang tutulong ngayong araw.",
      sentence2:
        "Ang pusa ay palaging nagtatago sa ilalim ng supa kapag nasa kuwarto ang mga aso.",
      fluencyInstruction:
        "Sabihin sa akin ang lahat ng maiisip mong salitang Filipino na nagsisimula sa letrang B. Mayroon kang isang minuto.",
      abstraction1:
        "Sabihin mo sa akin kung paano magkapareho ang orange at saging.",
      abstraction2:
        "Ngayon, sabihin mo sa akin kung paano magkapareho ang tren at bisikleta.",
      abstraction3:
        "Ngayon, sabihin mo sa akin kung paano magkapareho ang ruler at timbangan.",
      orientationInstruction:
        "Ano ang petsa ngayon? Sabihin sa akin ang taon, buwan, eksaktong petsa at araw ng linggo. Ngayon, sabihin sa akin kung nasaan kang lugar at kung saang bayan, siyudad o munisipyo.",
    },

    katz: {
      instructionsTitle: "Mga Tagubilin sa Katz ADLs Assessment",
      instructions: [
        "Mag-obserba o Magtanong: Suriin ang pasyente sa pamamagitan ng pagmamasid sa kanilang kilos o pagtatanong sa kanila, sa pamilya, o sa kanilang tagapag-alaga.",
        "Ibase sa Kasalukuyang Kakayahan: Bigyan ng marka ang pasyente ayon sa aktwal nilang ginawa sa nakalipas na 24 hanggang 48 oras, hindi sa kung ano ang kaya lang nilang gawin.",
        "Maging Mahigpit sa Pagpuntos: Magbigay ng 1 puntos KUNG KAYA LANG nilang gawin ang buong aktibidad nang mag-isa. Magbigay ng 0 puntos kung kailangan nila ng anumang tulong, gabay, o paalala mula sa ibang tao.",
      ],
    },

    medicalInterpretationMatrix: {
      title: "Gabay sa Interpretasyon ng MoCA-P at Katz ADLs Assessment",
      rows: [
        {
          cognitive: "21 hanggang 30 Normal",
          physical: "6 / 6 Ganap na Malaya",
          interpretation: "Malusog na Pagtanda",
          action:
            "Karaniwang Pagsubaybay: Magbigay ng gabay sa kalusugan. Ulitin ang screening taon-taon o kung may bagong mapunang kakaiba sa pasyente.",
        },
        {
          cognitive: "21 hanggang 30 Normal",
          physical: "3 hanggang 5 Bahagyang May Kahirapan",
          interpretation: "Pisikal na Panghihina Lamang",
          action:
            "Rehabilitasyon ng Katawan: I-refer sa Physical Therapist (PT) o Occupational Therapist (OT) para lumakas. Suriin ang bahay upang maiwasan ang pagkadulas o pagkatumba.",
        },
        {
          cognitive: "21 hanggang 30 Normal",
          physical: "2 o mas mababa Malalang Kahirapan",
          interpretation: "Malalang Kapansanan sa Pisikal",
          action:
            "Pangmatagalang Pag-aalaga: I-refer sa Home Health Care Services o Social Worker para sa paggabay sa tagapag-alaga. Maghanda ng assistive devices tulad ng wheelchair o walker.",
        },
        {
          cognitive: "20 o mas mababa May Kakulangan",
          physical: "6 / 6 Ganap na Malaya",
          interpretation: "Maagang Senyales ng Pagkaulyanin / MCI",
          action:
            "Pagsusuri sa Utak at Nerbyos: I-refer sa Neurologist o Geriatric Psychiatrist para sa mas malalim na pagsusuri. Magpasuri ng dugo TSH, B12, CBC. Paalalahanan ukol sa kaligtasan sa pagmamaneho o pag-inom ng gamot.",
        },
        {
          cognitive: "20 o mas mababa May Kakulangan",
          physical: "3 hanggang 5 Bahagyang May Kahirapan",
          interpretation: "Pagkaulyanin na May Epekto sa Kilos",
          action:
            "Paggabay ng Geriatric Doctor: I-refer sa isang Geriatrician para sa angkop na gamot. Kumonsulta sa Occupational Therapy (OT) upang gumawa ng simpleng rutina at gabay sa loob ng bahay.",
        },
        {
          cognitive: "20 o mas mababa May Kakulangan",
          physical: "2 o mas mababa Malalang Kahirapan",
          interpretation: "Malalang Paghina ng Isip at Katawan",
          action:
            "Palliative Care at Puspusang Pag-aalaga: Agarang i-refer sa isang Multidisciplinary Geriatric Palliative Team o Memory Care Facility. Kailangan ng 24/7 na pagbabantay at suporta sa pamilya upang maiwasan ang burnout.",
        },
      ],
    },

    caregiver: {
      title: "Family / Caregiver Workflow",
      demographicTitle: "Pinasimpleng Demographic Profile",
      patientInitials: "Inisyal o Palayaw ng Pasyente",
      patientAge: "Edad ng Pasyente",
      patientSex: "Kasarian ng Pasyente",
      relationship: "Relasyon mo sa Pasyente",
      relationshipOptions: [
        "Asawa",
        "Anak",
        "Kapatid",
        "Professional Caregiver",
      ],
      privacyNotice:
        "Ang data na ito ay ipinapakita lamang sa screen at hindi kailanman ipinapadala sa private dashboard ng medical professionals.",
      miniCogTitle: "Mini-Cog Assessment",
      miniCogSubtitle: "5 Puntos Max",
      step1: "Hakbang 1: Pagrehistro sa Tatlong Salita",
      step2: "Hakbang 2: Pagguhit ng Orasan",
      step3: "Hakbang 3: Pag-alala sa Tatlong Salita",
      step1Instruction:
        "Pakisuyong makinig nang mabuti. May sasabihin akong tatlong salitang nais kong ulitin ninyo sa akin ngayon at subukang tandaan.",
      step2Instruction:
        "Sunod, nais kong gumuhit ka ng orasan para sa akin. Una, ilagay ang lahat ng numero kung saan dapat nakapwesto ang mga ito. Ngayon, ilagay ang mga kamay sa 10 minuto makalipas ang 11.",
      step3Instruction:
        "Ano ang tatlong salitang sinabi kong tandaan mo?",
      clockNormal: "Normal na orasan",
      clockAbnormal: "Hindi normal na orasan",
      lawtonTitle: "Lawton IADL Test",
      lawtonSubtitle: "8 Puntos Max para sa Babae / 5 Max para sa Lalaki",
      resultLabels: {
        miniCog: "Mini-Cog Score",
        lawton: "Lawton Scale Summary",
      },
      interpretationLabels: {
        furtherEvaluation: "Kinakailangan ng karagdagang pagsusuri ng doktor",
        lowRisk: "Mababang panganib sa pagkaulianin",
      },
      referral: {
        furtherEvaluation:
          "Mag-iskedyul ng patingin sa isang Neurologist o Geriatrician. Kuhanan ng larawan screenshot o i-print ang pahinang ito para ipakita sa doktor.",
        lowRisk:
          "Ulitin ang test pagkalipas ng ilang linggo kung kinakailangan.",
      },
      summaryBoxTitle: "Buod ng araw-araw na gawain",
      summaryBoxDescription:
        "Isang malinis na bulleted checklist ng mga partikular na gawaing nahihirapan ang pasyente.",
    },

    minicog: {
      wordLists: {
        version1: ["Saging", "Umaga", "Upuan"],
        version2: ["Pinuno", "Panahon", "Mesa"],
        version3: ["Nayon", "Kusina", "Sanggol"],
        version4: ["Ilog", "Bansa", "Daliri"],
        version5: ["Kapitan", "Hardin", "Litrato"],
        version6: ["Anak", "Langit", "Bundok"],
      },
      scoreGuide: {
        wordRecall:
          "Pag-alala sa Salita: 0-3 puntos. 1 puntos para sa bawat salitang kusang naalala nang hindi binibigyan ng palatandaan.",
        clockDraw:
          "Pagguhit ng Orasan: 0 o 2 puntos. Ang normal na orasan ay may lahat ng numero sa wastong pagkakasunod-sunod at humigit-kumulang tamang posisyon. Ang mga kamay ay nakaturo sa 11 at 2.",
        total:
          "Kabuuang Puntos: 0-5 puntos. Ang cut point na 3 ay napatotohanan para sa dementia screening. Kung nais ng higit pang sensitivity, maaaring gamitin ang cut point na 4.",
      },
    },

    lawton: {
      title: "Lawton-Brody Instrumental Activities of Daily Living Scale",
      scoring:
        "Sa bawat kategorya, piliin ang paglalarawan na pinakaangkop sa pinakamataas na functional level ng pasyente.",
      categories: {
        telephone: "Kakayahang Gumamit ng Telepono",
        shopping: "Kakayahang Mamili",
        foodPreparation: "Kakayahang Maghanda ng Pagkain",
        housekeeping: "Kakayahang Gumawa ng Gawaing Bahay",
        laundry: "Kakayahang Maglaba",
        transportation: "Kakayahang Paglalakbay",
        medications: "Pangangasiwa sa Pansariling Medikasyon",
        finances: "Kakayahang Mangasiwa ng mga Gastusin",
      },
    },

    caregiverIntegratedMatrix: {
      title: "Mini-Cog + Lawton IADL Integrated Interpretation Matrix",
      rows: [
        {
          cognitive: "3 hanggang 5 Puntos / Mababang Panganib",
          functional: "Buong Score",
          interpretation:
            "Mababang Panganib Malaya: Walang nakikitang malaking problema sa memorya sa ngayon; kayang-kaya mag-isa ang mga gawaing-bahay at personal na buhay.",
          action:
            "Karaniwang Pagsubaybay: Ipagpatuloy ang malusog na pamumuhay. Ulitin ang test paglipas ng isang taon, o mas maaga kung may mapansing biglang pagbabago.",
        },
        {
          cognitive: "3 hanggang 5 Puntos / Mababang Panganib",
          functional: "Bahagyang Kapansanan / Nahihirapan sa 2 hanggang 4 na gawain",
          interpretation:
            "Kailangan ng Tulong sa Gawaing-Bahay: Maayos ang takbo ng isip, ngunit nahihirapan sa ilang partikular na gawain.",
          action:
            "Pag-alalay at Kaligtasan sa Bahay: Magtalaga ng kapamilya na tutulong sa mga gawaing nahihirapan siya. Dalhin sa Family Doctor para masuri kung may panlalata o pananakit ng kasukasuan.",
        },
        {
          cognitive: "3 hanggang 5 Puntos / Mababang Panganib",
          functional: "Malalang Kapansanan / Nahihirapan sa 5 o higit pang gawain",
          interpretation:
            "Malubhang Limitasyon sa Kilos",
          action:
            "Konsulta sa Doktor at Pag-ayos ng Tagapag-alaga: Ipatingin agad sa Family Doctor o Internist at ayusin ang tuloy-tuloy na tulong sa bahay.",
        },
        {
          cognitive: "0 hanggang 2 Puntos / Mataas na Panganib",
          functional: "Buong Score",
          interpretation:
            "Maagang Panganib sa Memorya / Mataas ang Babala",
          action:
            "Patingin sa Espesyalistang Doktor: Magpa-iskedyul agad ng patingin sa isang Neurologist o Geriatrician para sa pormal na pagsusuri.",
        },
        {
          cognitive: "0 hanggang 2 Puntos / Mataas na Panganib",
          functional: "Bahagyang Kapansanan / Nahihirapan sa 2 hanggang 4 na gawain",
          interpretation:
            "Pagkaulianin na may Kahirapan sa Gawain",
          action:
            "Agarang Patingin at Ligtas na Pamamahala: Ipatingin agad sa Neurologist o Geriatrician. Kailangan nang makialam ng pamilya sa pagpapainom ng gamot at paghawak ng pera ng pasyente.",
        },
        {
          cognitive: "0 hanggang 2 Puntos / Mataas na Panganib",
          functional: "Malalang Kapansanan / Nahihirapan sa 5 o higit pang gawain",
          interpretation:
            "Malubhang Pagkaulianin at Panghihina",
          action:
            "Buong Alaga at Suporta sa Pamilya: Humingi ng agarang tulong sa isang Memory Clinic o pangkat ng mga Geriatrician. Magtalaga ng 24/7 na magbabantay at suporta para sa caregiver.",
        },
      ],
    },

    dashboard: {
      title: "Clinical Central Dashboard",
      restrictedAccess: "Restricted Access",
      restrictedAccessDescription: "Limitado lamang sa may access na link.",
      filtersTitle: "Mga Filter",
      filterPatientId: "Patient ID",
      filterAge: "Edad",
      filterDiagnosticCategory: "Diagnostic Category",
      demographics: "Demographic Profile",
      mocaBreakdown: "MoCA-P Breakdown",
      katzScores: "Katz Scores",
      interpretation: "Interpretation",
      assessmentDate: "Petsa ng Assessment",
      emptyState: "Walang medical records na tugma sa napiling filters.",
    },
  },
} as const;