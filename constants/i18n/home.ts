import type { Language } from "@/lib/i18n/language-types";

export const homeCopy = {
  en: {
    brand: {
      name: "DementiAware",
      logoAlt: "DementiAware logo",
      subtitle: "Screening portal",
      shortMission:
        "Helping Filipino families and care teams start dementia awareness and screening conversations earlier.",
      institution: "Placeholder partner institution",
    },
    nav: {
      home: "Home",
      about: "About Dementia",
      assessment: "Assessment",
      contact: "Contact",
      openMenu: "Open navigation menu",
      closeMenu: "Close navigation menu",
      language: "Language",
    },
    cta: {
      takeAssessment: "Take the Assessment Test",
      whatIsDementia: "What is Dementia?",
      chooseTrack: "Choose an assessment track",
      close: "Close assessment choices",
      start: "Start here",
      learnMore: "Learn more",
      selectTrack: "Select track",
      switchToEnglish: "Switch to English",
      switchToFilipino: "Switch to Filipino",
    },
    hero: {
      eyebrow: "Public dementia screening and awareness portal",
      headline: "Public dementia screening and awareness portal",
      description:
        "Accessible to anyone on the internet. Houses the educational landing page and the two assessment tracks.",
      note: "Two tracks are available: one for medical professionals and trained specialists, and one for family members or caregivers.",
      assurance: "Simple language. Privacy-aware. Built for Filipino users.",
      visualTitle: "Screening pathways",
      visualSubtitle: "Choose the track that matches your role.",
      visualItems: ["Awareness", "Guided screening", "Next-step clarity"],
    },
    assessment: {
      eyebrow: "Assessment access",
      title: "Choose the right screening path",
      description:
        "Select the track that best describes you. Full assessment forms are intentionally not built yet, but this entry point is ready for expansion.",
      modalTitle: "Who will complete the assessment?",
      modalDescription:
        "Pick one path so DementiAware can show the right questions and privacy handling in the next step.",
      entryModal: {
        eyebrow: "Assessment entry",
        title: "Select Assessment Track",
        description:
          "Choose the screening path that best matches your role. Each track uses different tools and handles data differently.",
        closeLabel: "Close assessment track selection",
        comparisonLabels: {
          intendedUser: "Intended user",
          dataHandling: "Data handling",
          screeningType: "Screening type",
          privacyLevel: "Privacy level",
          recommendedUse: "Recommended use",
        },
        noticeTitle: "Important screening notice",
        noticeText:
          "DementiAware supports awareness and early screening only. It does not replace diagnosis, treatment, or advice from a licensed doctor.",
        selectedLabel: "Selected",
        continueSelected: "Continue to selected track",
        chooseFirst: "Choose a track to continue",
      },
      tracks: {
        professional: {
          label: "Medical Professional / Trained Specialist",
          description:
            "For clinicians, barangay health workers, and trained screeners who may submit screening data to the clinical dashboard.",
          badge: "Dashboard submission ready",
          route: "/assessment/medical",
          continueLabel: "Continue as Medical Professional",
          highlights: [
            "For doctors, clinicians, and trained healthcare personnel",
            "Securely submits assessment data after completion",
            "Supports clinical review and reporting",
          ],
          details: {
            intendedUser:
              "Clinicians, trained specialists, and authorized screeners",
            dataHandling:
              "Submitted results are securely transmitted to the restricted Clinical Central Dashboard after completion.",
            screeningType:
              "Full demographic profile with MoCA-P and Katz ADL workflow later.",
            privacyLevel:
              "Restricted clinical access for authorized dashboard users only.",
            recommendedUse:
              "Best for formal cognitive screening and clinical documentation.",
          },
        },
        caregiver: {
          label: "Family Member / Caregiver",
          description:
            "For relatives and caregivers who want immediate on-screen guidance. Results are displayed instantly and are not saved.",
          badge: "Not saved",
          route: "/assessment/family",
          continueLabel: "Continue as Family Caregiver",
          highlights: [
            "For home-based observation and caregiver-guided screening",
            "Results stay on-screen and are not saved",
            "Helpful for deciding whether further medical consultation is needed",
          ],
          details: {
            intendedUser: "Family members, guardians, and caregivers",
            dataHandling:
              "Results are processed instantly on-screen only and are not saved to the database.",
            screeningType:
              "Simplified demographic profile with Mini-Cog and Lawton IADL workflow later.",
            privacyLevel:
              "Private public flow with no database storage for family results.",
            recommendedUse:
              "Best for private home-based preliminary screening.",
          },
        },
      },
      trustTitle: "What this public portal does",
      trustItems: [
        "Supports dementia awareness and early screening conversations.",
        "Shows family track results on screen only and does not save them.",
        "Allows medical track data to be sent to the clinical dashboard when that workflow is added.",
      ],
    },
    trivia: {
      eyebrow: "Dementia trivia hub",
      title: "Quick facts for everyday awareness",
      description:
        "Short, practical reminders can help families notice changes earlier and seek the right support.",
      next: "Next fact",
      previous: "Previous fact",
      items: [
        {
          title: "Did you know?",
          text: "Dementia is not a normal part of aging.",
        },
        {
          title: "Family signs matter",
          text: "Repeated questions, getting lost in familiar places, or trouble managing routine tasks may be worth discussing with a health worker.",
        },
        {
          title: "Early conversations help",
          text: "Screening is not a diagnosis, but it can guide families toward timely medical advice and support.",
        },
      ],
    },
    footer: {
      quickLinks: "Quick links",
      copyright: "© 2026 DementiAware. Educational screening portal prototype.",
    },
  },
  fil: {
    brand: {
      name: "DementiAware",
      logoAlt: "Logo ng DementiAware",
      subtitle: "Screening portal",
      shortMission:
        "Tumutulong sa mga pamilyang Pilipino at health teams na mas maagang simulan ang usapan tungkol sa dementia awareness at screening.",
      institution: "Placeholder partner institution",
    },
    nav: {
      home: "Home",
      about: "Tungkol sa Dementia",
      assessment: "Assessment",
      contact: "Contact",
      openMenu: "Buksan ang navigation menu",
      closeMenu: "Isara ang navigation menu",
      language: "Wika",
    },
    cta: {
      takeAssessment: "Sagutan ang Assessment Test",
      whatIsDementia: "Ano ang Dementia?",
      chooseTrack: "Pumili ng assessment track",
      close: "Isara ang pagpipilian",
      start: "Magsimula rito",
      learnMore: "Matuto pa",
      selectTrack: "Piliin ang track",
      switchToEnglish: "Lumipat sa English",
      switchToFilipino: "Lumipat sa Filipino",
    },
    hero: {
      eyebrow: "Pampublikong portal para sa dementia screening at kaalaman",
      headline: "Pampublikong portal para sa dementia screening at kaalaman",
      description:
        "Maaaring ma-access ng kahit sino sa internet. Dito matatagpuan ang educational landing page at ang dalawang assessment track.",
      note: "May dalawang track: para sa medical professionals o trained specialists, at para sa family members o caregivers.",
      assurance:
        "Madaling salita. Maingat sa privacy. Gawa para sa Filipino users.",
      visualTitle: "Screening pathways",
      visualSubtitle: "Piliin ang track na tugma sa iyong role.",
      visualItems: ["Awareness", "Guided screening", "Malinaw na next step"],
    },
    assessment: {
      eyebrow: "Assessment access",
      title: "Piliin ang tamang screening path",
      description:
        "Piliin ang track na pinakamalapit sa iyong role. Hindi pa binubuo ang buong assessment forms, pero handa na ang entry point para sa susunod na development.",
      modalTitle: "Sino ang sasagot ng assessment?",
      modalDescription:
        "Pumili ng path para maipakita ng DementiAware ang tamang tanong at privacy handling sa susunod na hakbang.",
      entryModal: {
        eyebrow: "Assessment entry",
        title: "Piliin ang Assessment Track",
        description:
          "Piliin ang screening path na tugma sa iyong role. Magkaiba ang tools at data handling ng bawat track.",
        closeLabel: "Isara ang pagpili ng assessment track",
        comparisonLabels: {
          intendedUser: "Para kanino",
          dataHandling: "Data handling",
          screeningType: "Uri ng screening",
          privacyLevel: "Privacy level",
          recommendedUse: "Pinakamainam gamitin para sa",
        },
        noticeTitle: "Mahalagang paalala sa screening",
        noticeText:
          "Ang DementiAware ay para sa awareness at maagang screening lamang. Hindi nito pinapalitan ang diagnosis, gamutan, o payo ng lisensyadong doktor.",
        selectedLabel: "Napili",
        continueSelected: "Magpatuloy sa napiling track",
        chooseFirst: "Pumili muna ng track para magpatuloy",
      },
      tracks: {
        professional: {
          label: "Medical Professional / Trained Specialist",
          description:
            "Para sa clinicians, barangay health workers, at trained screeners na maaaring magsumite ng screening data sa clinical dashboard.",
          badge: "Ready para sa dashboard submission",
          route: "/assessment/medical",
          continueLabel: "Magpatuloy bilang Medical Professional",
          highlights: [
            "Para sa doctors, clinicians, at trained healthcare personnel",
            "Secure na isinusumite ang assessment data pagkatapos makumpleto",
            "Sumusuporta sa clinical review at reporting",
          ],
          details: {
            intendedUser:
              "Clinicians, trained specialists, at authorized screeners",
            dataHandling:
              "Pagkatapos makumpleto, secure na ipinapadala ang resulta sa restricted Clinical Central Dashboard.",
            screeningType:
              "Full demographic profile na may MoCA-P at Katz ADL workflow sa susunod.",
            privacyLevel:
              "Restricted clinical access para lamang sa authorized dashboard users.",
            recommendedUse:
              "Pinakamainam para sa formal cognitive screening at clinical documentation.",
          },
        },
        caregiver: {
          label: "Family Member / Caregiver",
          description:
            "Para sa relatives at caregivers na gustong magkaroon ng agarang on-screen guidance. Ipinapakita agad ang resulta at hindi sine-save.",
          badge: "Hindi sine-save",
          route: "/assessment/family",
          continueLabel: "Magpatuloy bilang Family Caregiver",
          highlights: [
            "Para sa home-based observation at caregiver-guided screening",
            "Nananatili sa screen at hindi sine-save ang resulta",
            "Makakatulong para magpasya kung kailangan ng konsultasyon sa doktor",
          ],
          details: {
            intendedUser: "Family members, guardians, at caregivers",
            dataHandling:
              "Ipinoproseso agad ang resulta sa screen lamang at hindi sine-save sa database.",
            screeningType:
              "Pinasimpleng demographic profile na may Mini-Cog at Lawton IADL workflow sa susunod.",
            privacyLevel:
              "Pribadong public flow na walang database storage para sa family results.",
            recommendedUse:
              "Pinakamainam para sa pribadong home-based preliminary screening.",
          },
        },
      },
      trustTitle: "Ano ang ginagawa ng public portal na ito",
      trustItems: [
        "Sumusuporta sa dementia awareness at maagang screening conversations.",
        "Ipinapakita sa screen lamang ang family track results at hindi sine-save.",
        "Pinapayagang maipadala ang medical track data sa clinical dashboard kapag naidagdag ang workflow.",
      ],
    },
    trivia: {
      eyebrow: "Dementia trivia hub",
      title: "Mabilisang kaalaman para sa araw-araw na awareness",
      description:
        "Ang maiikling paalala ay nakakatulong sa pamilya para mapansin ang pagbabago at makahanap ng suporta.",
      next: "Susunod na fact",
      previous: "Nakaraang fact",
      items: [
        {
          title: "Alam mo ba?",
          text: "Ang dementia ay hindi natural na bahagi ng pagtanda.",
        },
        {
          title: "Mahalaga ang senyales sa pamilya",
          text: "Paulit-ulit na tanong, pagkawala sa pamilyar na lugar, o hirap sa routine tasks ay dapat ikonsulta sa health worker.",
        },
        {
          title: "Makakatulong ang maagang usapan",
          text: "Ang screening ay hindi diagnosis, ngunit nakakatulong itong gumabay sa pamilya para sa tamang payo at suporta.",
        },
      ],
    },
    footer: {
      quickLinks: "Quick links",
      copyright: "© 2026 DementiAware. Educational screening portal prototype.",
    },
  },
} as const satisfies Record<Language, Record<string, unknown>>;

export type HomeCopy = (typeof homeCopy)[Language];
