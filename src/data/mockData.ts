import { Learner, ParentProfile, ProgressReport, PaymentItem, ChatMessage, WeeklyTheme, SchoolEvent, JournalPost, EnrolmentApplication } from '../types';

export const initialLearners: Learner[] = [
  {
    id: 'student-leo',
    surname: 'Mbeki',
    firstNames: 'Leo',
    preferredName: 'Leo',
    dob: '2018-05-12',
    idNumber: '1805125345084',
    gender: 'Male',
    homeLanguage: 'English / Zulu',
    religion: 'Christian',
    gradeThisYear: 'Grade R',
    schoolAttending: 'Kiddies Town ECD & Academy',
    previousSchool: 'None',
    classType: 'Tigers',
    attendanceStatus: 'Present',
    arrivedTime: '07:45'
  },
  {
    id: 'student-thabo',
    surname: 'Junior',
    firstNames: 'Thabo',
    preferredName: 'Thabo',
    dob: '2019-11-20',
    idNumber: '1911205345089',
    gender: 'Male',
    homeLanguage: 'Sesotho',
    religion: 'Christian',
    gradeThisYear: 'Nursery',
    schoolAttending: 'Kiddies Town ECD & Academy',
    previousSchool: 'None',
    classType: 'Giraffes',
    attendanceStatus: 'Absent',
    arrivedTime: undefined
  },
  {
    id: 'student-amara',
    surname: 'Khumalo',
    firstNames: 'Amara',
    preferredName: 'Amara',
    dob: '2020-07-15',
    idNumber: '2007151345081',
    gender: 'Female',
    homeLanguage: 'isiZulu',
    religion: 'None',
    gradeThisYear: 'Toddler',
    schoolAttending: 'Kiddies Town ECD & Academy',
    previousSchool: 'None',
    classType: 'Roses',
    attendanceStatus: 'Present',
    arrivedTime: '08:12'
  },
  {
    id: 'student-kabo',
    surname: 'Molefe',
    firstNames: 'Kabo',
    preferredName: 'Kabo',
    dob: '2018-02-18',
    idNumber: '1802181234081',
    gender: 'Male',
    homeLanguage: 'Setswana',
    religion: 'Christian',
    classType: 'Tigers',
    attendanceStatus: 'Absent',
    arrivedTime: undefined
  },
  {
    id: 'student-sarah-smith',
    surname: 'Smith',
    firstNames: 'Sarah',
    preferredName: 'Sarah',
    dob: '2018-09-02',
    idNumber: '1809021234082',
    gender: 'Female',
    homeLanguage: 'English',
    classType: 'Tigers',
    attendanceStatus: 'Absent',
    arrivedTime: undefined
  },
  {
    id: 'student-david',
    surname: 'Jones',
    firstNames: 'David',
    preferredName: 'David',
    dob: '2018-04-10',
    idNumber: '1804101234083',
    gender: 'Male',
    homeLanguage: 'English',
    classType: 'Tigers',
    attendanceStatus: 'Absent',
    arrivedTime: undefined
  }
];

export const initialParentProfile: ParentProfile = {
  name: 'Sarah Mbeki',
  email: 'sarah.mbeki@mail.com',
  phone: '+27 81 545 3500',
  address: '7 Grimm Street, Ster Park, Polokwane',
  maritalStatus: 'Married',
  childLivesWith: 'Both Parents',
  mother: {
    title: 'Mrs.',
    surname: 'Mbeki',
    firstNames: 'Sarah',
    idNumber: '8610120150085',
    occupation: 'Financial Analyst',
    employer: 'Standard Bank',
    telWork: '015 023 0600',
    telHome: '015 023 1122',
    cellNo: '081 545 3500',
    email: 'sarah.mbeki@mail.com',
    homeAddress: '7 Grimm Street, Ster Park, Polokwane',
    postalAddress: 'P.O. Box 77, Polokwane, 0700',
    workAddress: '29 Hans Van Rensburg St, Polokwane'
  },
  father: {
    title: 'Mr.',
    surname: 'Mbeki',
    firstNames: 'Thabo',
    idNumber: '8402140134081',
    occupation: 'Software Consultant',
    employer: 'FTech Consulting',
    telWork: '015 023 0600',
    telHome: '015 023 1122',
    cellNo: '079 386 6233',
    email: 'thabo@ftechconsulting.co.za',
    homeAddress: '7 Grimm Street, Ster Park, Polokwane',
    postalAddress: 'P.O. Box 77, Polokwane, 0700',
    workAddress: '29 Hillside Manor, Pretoria North, 0182'
  }
};

export const initialProgressReports: ProgressReport[] = [
  {
    id: 'report-term1',
    learnerId: 'student-leo',
    academicYear: 2025,
    term: 1,
    released: true,
    releasedDate: '2025-03-24',
    recordedDaysAbsent: 1,
    indicators: {
      classroomBehavior: { A1_controlAndSafe: 'A', A2_bathroomIndependent: 'A' },
      communicationSkills: { B1_speaksClearly: 'A' },
      readingWritingSkills: { C1_recognizesLetters: 'D' },
      numbersMathArithmetic: { D1_countsRecognizes: 'A' },
      musicArtSkills: { E1_dancesMusicSings: 'A' },
      socialEmotionalSkills: { F1_sharesAndPlays: 'A' },
      coloursAndShapes: { G1_colorsShapes: 'A' },
      fineMotorSkills: {
        H1_pencilCrayonScissors: 'D',
        H2_blocksPuzzles: 'A',
        H3_bounceKickThrow: 'A',
        H4_buttonsShoesClothes: 'D'
      },
      approachesToLearn: { I1_enjoysLearning: 'A' },
      computerSkills: { J1_tabletLaptopVoice: 'A' }
    },
    shortSummary: 'K1',
    teacherComments: 'Leo had an outstanding first term! He adapts very well to group classroom dynamics and loves active play. He demonstrates strong mathematical indicators and loves counting.',
    teacherName: 'Teacher Anne',
    principalName: 'Mrs. Shineon'
  },
  {
    id: 'report-term2',
    learnerId: 'student-leo',
    academicYear: 2025,
    term: 2,
    released: true,
    releasedDate: '2025-06-22',
    recordedDaysAbsent: 0,
    indicators: {
      classroomBehavior: { A1_controlAndSafe: 'A', A2_bathroomIndependent: 'A' },
      communicationSkills: { B1_speaksClearly: 'A' },
      readingWritingSkills: { C1_recognizesLetters: 'A' },
      numbersMathArithmetic: { D1_countsRecognizes: 'A' },
      musicArtSkills: { E1_dancesMusicSings: 'A' },
      socialEmotionalSkills: { F1_sharesAndPlays: 'A' },
      coloursAndShapes: { G1_colorsShapes: 'A' },
      fineMotorSkills: {
        H1_pencilCrayonScissors: 'A',
        H2_blocksPuzzles: 'A',
        H3_bounceKickThrow: 'A',
        H4_buttonsShoesClothes: 'D'
      },
      approachesToLearn: { I1_enjoysLearning: 'A' },
      computerSkills: { J1_tabletLaptopVoice: 'A' }
    },
    shortSummary: 'K4',
    teacherComments: 'An exceptional second term for Leo! His reading and spelling skills have improved enormously. He is very kind to his peers and is a pleasure to have in the class.',
    teacherName: 'Teacher Anne',
    principalName: 'Mrs. Shineon'
  },
  {
    id: 'report-term3',
    learnerId: 'student-leo',
    academicYear: 2025,
    term: 3,
    released: true,
    releasedDate: '2025-09-28',
    recordedDaysAbsent: 2,
    indicators: {
      classroomBehavior: { A1_controlAndSafe: 'A', A2_bathroomIndependent: 'A' },
      communicationSkills: { B1_speaksClearly: 'A' },
      readingWritingSkills: { C1_recognizesLetters: 'A' },
      numbersMathArithmetic: { D1_countsRecognizes: 'A' },
      musicArtSkills: { E1_dancesMusicSings: 'A' },
      socialEmotionalSkills: { F1_sharesAndPlays: 'A' },
      coloursAndShapes: { G1_colorsShapes: 'A' },
      fineMotorSkills: {
        H1_pencilCrayonScissors: 'A',
        H2_blocksPuzzles: 'A',
        H3_bounceKickThrow: 'A',
        H4_buttonsShoesClothes: 'A'
      },
      approachesToLearn: { I1_enjoysLearning: 'A' },
      computerSkills: { J1_tabletLaptopVoice: 'A' }
    },
    shortSummary: 'K3',
    teacherComments: 'Fabulous third term. Leo behaves beautifully, handles all tools safely, and is very respectful towards staff and fellow learners. He is fully ready for school next year.',
    teacherName: 'Teacher Anne',
    principalName: 'Mrs. Shineon'
  },
  {
    id: 'report-term4',
    learnerId: 'student-leo',
    academicYear: 2025,
    term: 4,
    released: false,
    recordedDaysAbsent: 0,
    indicators: {
      classroomBehavior: { A1_controlAndSafe: 'E', A2_bathroomIndependent: 'E' },
      communicationSkills: { B1_speaksClearly: 'E' },
      readingWritingSkills: { C1_recognizesLetters: 'E' },
      numbersMathArithmetic: { D1_countsRecognizes: 'E' },
      musicArtSkills: { E1_dancesMusicSings: 'E' },
      socialEmotionalSkills: { F1_sharesAndPlays: 'E' },
      coloursAndShapes: { G1_colorsShapes: 'E' },
      fineMotorSkills: {
        H1_pencilCrayonScissors: 'E',
        H2_blocksPuzzles: 'E',
        H3_bounceKickThrow: 'E',
        H4_buttonsShoesClothes: 'E'
      },
      approachesToLearn: { I1_enjoysLearning: 'E' },
      computerSkills: { J1_tabletLaptopVoice: 'E' }
    },
    shortSummary: 'K1',
    teacherComments: '',
    teacherName: 'Teacher Anne',
    principalName: 'Mrs. Shineon'
  }
];

export const initialPaymentHistory: PaymentItem[] = [
  {
    id: 'pay-5',
    description: 'Monthly Fees / October Aftercare - Leo Mbeki',
    date: '2025-10-01',
    amount: 2500,
    status: 'In Arrears'
  },
  {
    id: 'pay-4',
    description: 'Monthly Fees / September - Leo Mbeki',
    date: '2025-09-01',
    amount: 2500,
    status: 'Paid',
    receiptNo: 'REC-202509-0021'
  },
  {
    id: 'pay-3',
    description: 'Monthly Fees / August - Leo Mbeki',
    date: '2025-08-01',
    amount: 2500,
    status: 'Paid',
    receiptNo: 'REC-202508-1112'
  },
  {
    id: 'pay-2',
    description: 'Excursion Fee / Peter Rabbit Stage Play',
    date: '2025-06-15',
    amount: 150,
    status: 'Paid',
    receiptNo: 'REC-202506-0033'
  },
  {
    id: 'pay-1',
    description: 'School Registration Fee (New Year 2025)',
    date: '2025-01-10',
    amount: 600,
    status: 'Paid',
    receiptNo: 'REC-202501-0001'
  }
];

export const initialChatHistory: ChatMessage[] = [
  {
    id: 'char-1',
    sender: 'Teacher',
    senderName: 'Teacher Anne',
    text: 'Leo is doing incredible in class today! He completed his counting exercises with 100% accuracy and helped clean up the play station afterward.',
    timestamp: '11:14 AM'
  },
  {
    id: 'char-2',
    sender: 'Parent',
    senderName: 'Sarah Mbeki',
    text: 'That is wonderful to hear, Anne! Thank you so much for the update. Does he need any emergency clothing items packed for Friday?',
    timestamp: '11:20 AM'
  },
  {
    id: 'char-3',
    sender: 'Teacher',
    senderName: 'Teacher Anne',
    text: 'Yes, please pack a light change of clothes and a water bottle just in case. We are doing mud finger-painting on Friday morning!',
    timestamp: '11:25 AM'
  }
];

export const initialWeeklyThemes: WeeklyTheme[] = [
  {
    weekNo: 1,
    title: 'Welcome to Kiddies Town & Daily Routines',
    description: 'Introducing young learners to the classroom, playground safety, and the daily school schedule at 7 Grimm Street. Emphasizing hygiene (toilet routine) and social interaction.',
    activities: [
      'Daily Programme walking tour',
      'Meet your classroom peers (Roses, Giraffes, Tigers)',
      'Classroom safety rules puppet show',
      'Proper hand washing with bubbles'
    ]
  },
  {
    weekNo: 2,
    title: 'Primary Colors, Shapes & Toy Block Magic',
    description: 'Aligning with our Kiddies Town primary brand colors (red, green, blue, yellow balloons). Learners master basic geometry, sorting blocks, and finger science.',
    activities: [
      'Messy finger painting with primary colors',
      'Triangles and circles block stacking',
      'Colored water drops mix-matching experiment',
      'Giant geometric puzzle completion'
    ]
  },
  {
    weekNo: 3,
    title: 'My Wonderful Family & Home Languages',
    description: 'Celebrating diversity in Polokwane! Learners share stories of Mrs./Mr. parent roles, occupations, and home patterns in English, Sesotho, isiZulu, and Setswana.',
    activities: [
      'Moms & Dads drawing frame',
      'My favorite home phrase in Sesotho or isiZulu',
      "Occupations roleplaying (teacher, software consultant, banker)",
      'Grandparents storytelling circle'
    ]
  },
  {
    weekNo: 4,
    title: 'Safari Adventures: Giraffes, Tigers & Roses',
    description: 'Inspired by our class names! Active studies on wild animals of Limpopo, identifying sounds, footprint markings in the sandbox, and sensory touch.',
    activities: [
      'Mock dinosaur bones sandbox hunt',
      'Paper plate lion head crafting with woolly manes',
      'Learning why tall giraffes reach tree-top leaves',
      'Safari animal footsteps muddy prints matching'
    ]
  },
  {
    weekNo: 5,
    title: 'Healthy Bodies, Active Sports & Oral Hygiene',
    description: 'Teaches clean habits, healthy fruits vs sweets, and physical activities on the outdoor soccer pitch to develop fine and gross motor indicators.',
    activities: [
      'Tooth brushing mock drills on cardboard faces',
      'Ster Park playground soccer mini friendly',
      'Vitamins sorting (apples vs sweet candies)',
      'Jungle-gym coordination balance race'
    ]
  }
];

export const initialSchoolEvents: SchoolEvent[] = [
  {
    id: 'event-1',
    title: 'Year End Photo Day',
    date: '2025-10-27',
    time: '08:30 AM',
    category: 'Event',
    description: 'Please ensure children wear full school uniform for the individual and class photographs.',
    rsvps: [
      { parentName: 'Sarah Mbeki', count: 1, status: 'Yes' },
      { parentName: 'Zanele Ndlovu', count: 1, status: 'Yes' }
    ]
  },
  {
    id: 'event-2',
    title: 'Soccer Extra-Mural Friendly',
    date: '2025-10-30',
    time: '14:00 PM',
    category: 'Extra-mural',
    description: 'Friendly match with Bluebird Academy. Parents are welcome to attend and cheer and offer support.',
    rsvps: [
      { parentName: 'Sarah Mbeki', count: 2, status: 'Yes' }
    ]
  },
  {
    id: 'event-3',
    title: 'Music Lesson & Recorder Day',
    date: '2025-11-03',
    time: '09:00 AM',
    category: 'Incursion',
    description: 'Special visiting multi-instrumentalist will show flutes, drums, and kids play standard triangles.',
    rsvps: []
  },
  {
    id: 'event-4',
    title: 'Graduation Ceremony 2025',
    date: '2025-11-15',
    time: '10:00 AM',
    category: 'Event',
    description: 'A grand celebration for our 5-year old Tigers graduating to Grade 1. All families invited.',
    rsvps: []
  }
];

export const initialJournalPosts: JournalPost[] = [
  {
    id: 'journal-1',
    date: '19 Oct 2025',
    title: 'Creative Arts: Finger Painting',
    description: 'Leo explored colors today using his fingers to create a beautiful savanna landscape with abstract trees.',
    imageUrl: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    postedBy: 'Teacher Anne'
  },
  {
    id: 'journal-2',
    date: '15 Oct 2025',
    title: 'Fine Motor: Block Building Castle',
    description: 'Active blocks work. The Tigers class worked together to build a grand castle with towers and drawbridges! Teamwork was beautiful.',
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    postedBy: 'Teacher Anne'
  },
  {
    id: 'journal-3',
    date: '12 Oct 2025',
    title: 'Science Exploration: Dinosaur Hunt',
    description: 'Kids searched in the sandbox sandbox utilizing brushes to uncover hidden bone replicas and dinosaur eggs!',
    imageUrl: 'https://images.unsplash.com/photo-1505673542670-a5e3ff5b14a3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    postedBy: 'Teacher Anne'
  }
];

export const initialEnrolments: EnrolmentApplication[] = [
  {
    id: 'enrol-1',
    childParticulars: {
      surname: 'Junior',
      firstNames: 'Thabo',
      preferredName: 'Thabo',
      dob: '2019-11-20',
      idNumber: '1911205345089',
      gender: 'Male',
      homeLanguage: 'Sesotho',
      classType: 'Giraffes'
    },
    parentParticulars: {
      maritalStatus: 'Single',
      childLivesWith: 'Mother',
      mother: {
        title: 'Ms.',
        surname: 'Zulu',
        firstNames: 'Nthabiseng',
        idNumber: '8911140120182',
        occupation: 'High School Teacher',
        employer: 'Dept of Education',
        telWork: '015 120 4422',
        telHome: '',
        cellNo: '072 120 4421',
        email: 'nthabi.zulu@educ.co.za',
        homeAddress: '15 Hospital Rd, Polokwane CBD',
        postalAddress: 'P.O Box 10, Polokwane',
        workAddress: 'Polokwane High School'
      }
    },
    medicalProfile: {
      diabetes: false,
      asthma: true,
      epilepsy: false,
      childhoodSicknesses: 'Chickenpox',
      lifeThreateningAllergies: 'Bee stings',
      immunisationUpToDate: true
    },
    transportDetails: {
      needed: true,
      pickUpPoint: '15 Hospital Road, CBD',
      pickUpTime: '07:00 AM'
    },
    consents: {
      indemnitySigned: true,
      popiActSigned: true,
      financialAgreementSigned: true,
      monthlyAmount: 2500,
      paymentDay: '20th',
      signedAt: 'Polokwane'
    },
    uploadedFiles: {
      birthCertificate: true,
      immunisationCard: true,
      parentIds: true,
      proofOfResidence: true
    },
    step: 5,
    status: 'Pending Approval',
    dateApplied: '2025-09-30'
  },
  {
    id: 'enrol-2',
    childParticulars: {
      surname: 'Khumalo',
      firstNames: 'Amara',
      preferredName: 'Amara',
      dob: '2020-07-15',
      idNumber: '2007151345081',
      gender: 'Female',
      homeLanguage: 'isiZulu',
      classType: 'Roses'
    },
    parentParticulars: {
      maritalStatus: 'Married',
      childLivesWith: 'Both Parents'
    },
    medicalProfile: {},
    transportDetails: { needed: false },
    consents: {},
    uploadedFiles: {
      birthCertificate: true,
      immunisationCard: false,
      parentIds: true,
      proofOfResidence: false
    },
    step: 2,
    status: 'In Review',
    dateApplied: '2025-10-02'
  }
];
