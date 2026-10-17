import { AnatomyLayer, Hotspot, SymptomArea, ConditionInfo } from '../types/anatomy';

export const ANATOMY_LAYERS: AnatomyLayer[] = [
  {
    id: 'surface',
    label: 'Surface',
    sublabel: 'Skin & Contour',
    description: 'The protective cutaneous layer with dense sensory innervation allowing tactile discrimination and protective reflexes.',
    clinicalNote: 'Draft proposal pending surgeon review: Palmar skin is specialized, hairless, and tethered to the underlying palmar aponeurosis for firm grasp.'
  },
  {
    id: 'bones',
    label: 'Bones',
    sublabel: 'Structure & Support',
    description: 'The skeletal framework consisting of 8 carpal bones, 5 metacarpals, and 14 phalanges, articulating with the distal radius and ulna.',
    clinicalNote: 'Draft proposal pending surgeon review: Precise alignment of the carpal arches is essential for balanced load transmission and wrist mobility.'
  },
  {
    id: 'tendons',
    label: 'Tendons',
    sublabel: 'Movement & Grip',
    description: 'Flexor and extensor tendon networks gliding through specialized synovial sheaths and pulleys to transmit muscular power to the digits.',
    clinicalNote: 'Draft proposal pending surgeon review: Gliding excursions can be disrupted by inflammation, annular pulley thickening, or traumatic lacerations.'
  },
  {
    id: 'nerves',
    label: 'Nerves',
    sublabel: 'Sensation & Control',
    description: 'The median, ulnar, and radial nerve pathways delivering fine motor signals and sensory feedback from fingertips to the spinal cord.',
    clinicalNote: 'Draft proposal pending surgeon review: The median nerve is particularly vulnerable within the unyielding confines of the carpal tunnel.'
  },
  {
    id: 'joints',
    label: 'Joints',
    sublabel: 'Motion & Stability',
    description: 'Complex ligamentous capsules, triangular fibrocartilage complex (TFCC), and articulating cartilage facilitating multidirectional wrist and finger articulation.',
    clinicalNote: 'Draft proposal pending surgeon review: Joint stability depends on both intrinsic carpal ligaments and extrinsic radiocarpal bands.'
  }
];

export const ANATOMY_HOTSPOTS: Hotspot[] = [
  {
    id: 'median-nerve',
    name: 'Median Nerve',
    position: [0.0, -0.6, 0.4],
    layer: 'nerves',
    region: 'wrist',
    clinicalSummary: 'Travels beneath the transverse carpal ligament. Supplies sensation to the thumb, index, middle, and radial half of the ring finger, and motor supply to the thenar muscles.',
    commonSymptoms: ['Nocturnal numbness', 'Tingling in thumb and index finger', 'Weakened grip strength']
  },
  {
    id: 'carpal-tunnel',
    name: 'Carpal Tunnel',
    position: [-0.1, -0.7, 0.35],
    layer: 'joints',
    region: 'wrist',
    clinicalSummary: 'An inelastic fibro-osseous canal bounded by the carpal bones posteriorly and the transverse carpal ligament anteriorly.',
    commonSymptoms: ['Ache radiating up the forearm', 'Clumsiness with small objects', 'Morning stiffness']
  },
  {
    id: 'a1-pulley',
    name: 'A1 Pulley (Flexor Sheath)',
    position: [0.4, 0.2, 0.3],
    layer: 'tendons',
    region: 'fingers',
    clinicalSummary: 'The first annular pulley at the metacarpophalangeal joint level. Thickening of this pulley can impede flexor tendon glide.',
    commonSymptoms: ['Catching or locking of the finger', 'Tenderness at base of finger', 'Clicking upon extension']
  },
  {
    id: 'cmc-joint',
    name: 'First CMC Joint (Thumb Base)',
    position: [-0.9, -0.3, 0.25],
    layer: 'joints',
    region: 'thumb',
    clinicalSummary: 'The trapeziometacarpal saddle joint enabling thumb opposition, circumduction, and pinch force generation.',
    commonSymptoms: ['Pain when opening jars or turning keys', 'Tenderness at the base of the thumb', 'Bony prominence']
  },
  {
    id: 'scaphoid',
    name: 'Scaphoid Bone',
    position: [-0.4, -0.9, 0.3],
    layer: 'bones',
    region: 'wrist',
    clinicalSummary: 'Key link between proximal and distal carpal rows. Has retrograde blood supply entering distally, making proximal pole healing vulnerable.',
    commonSymptoms: ['Tenderness in anatomical snuffbox', 'Pain following fall on outstretched hand', 'Swelling on radial wrist']
  }
];

export const SYMPTOM_AREAS: Record<string, SymptomArea> = {
  wrist: {
    id: 'wrist',
    label: 'Wrist',
    eyebrow: 'WRIST DISCOMFORT',
    description: 'The wrist links forearm power to the hand through 8 small carpal bones and intricate ligamentous networks. Discomfort often relates to nerve compression, ligament injury, or inflammatory changes.',
    commonComplaints: [
      'Numbness or tingling waking you up at night',
      'A dull ache that radiates upward into the forearm',
      'Pain when pushing up from a chair or bearing weight on the palm',
      'Persistent swelling or stiffness following a fall'
    ],
    anatomicalStructures: ['Median nerve', 'Transverse carpal ligament', 'Scaphoid and lunate bones', 'Triangular fibrocartilage complex (TFCC)'],
    whenToSeekCare: 'Seek prompt clinical evaluation if you experience persistent loss of sensation, progressive thumb weakness, visible deformity, or acute pain following trauma.',
    hotspots: [
      {
        title: 'Carpal Tunnel (Volar Wrist)',
        description: 'Vulnerability zone for median nerve compression beneath the transverse ligament.',
        x: 48,
        y: 65
      },
      {
        title: 'Radial Snuffbox (Thumb Side)',
        description: 'Site of scaphoid bone palpation and de Quervain tenosynovitis tenderness.',
        x: 35,
        y: 60
      },
      {
        title: 'Ulnar Wrist (Little Finger Side)',
        description: 'Area of TFCC and ulnar styloid articulation, active during rotation and grip.',
        x: 62,
        y: 62
      }
    ]
  },
  thumb: {
    id: 'thumb',
    label: 'Thumb',
    eyebrow: 'THUMB BASE & OPPOSITION',
    description: 'The human thumb accounts for up to 40 percent of total hand function. The basal joint allows wide circumduction but endures immense mechanical stress during pinch and grasp.',
    commonComplaints: [
      'Sharp or aching pain at the base of the thumb when turning keys or doorknobs',
      'Difficulty opening tightly sealed jars or holding a book',
      'A feeling of instability, grinding, or clicking at the thumb joint',
      'Localized swelling or a prominent bump near the wrist junction'
    ],
    anatomicalStructures: ['First carpometacarpal (CMC) saddle joint', 'Trapezium bone', 'Abductor and extensor pollicis tendons', 'Ulnar collateral ligament (UCL)'],
    whenToSeekCare: 'Consult a hand specialist if thumb pain limits daily tasks, pinch strength declines noticeably, or an acute bend backward caused sudden joint instability.',
    hotspots: [
      {
        title: 'Basal Joint (CMC)',
        description: 'Saddle joint enduring high compressive loads during everyday pinch grips.',
        x: 32,
        y: 52
      },
      {
        title: 'Thumb MCP Joint',
        description: 'Location of the ulnar collateral ligament and flexor tendon pulleys.',
        x: 26,
        y: 42
      }
    ]
  },
  fingers: {
    id: 'fingers',
    label: 'Fingers',
    eyebrow: 'DIGITAL MOBILITY & GLIDE',
    description: 'Fingers contain no internal muscles; movement is produced by forearm flexor and extensor tendons sliding through protective fibrous pulleys like a fishing line on a rod.',
    commonComplaints: [
      'A finger that catches, clicks, or locks in a bent position upon waking',
      'Tender knot or nodule in the palm near the base of the finger',
      'Gradual thickening or cord formation that pulls a finger toward the palm',
      'Stiffness or swelling in the knuckle joints after repetitive use'
    ],
    anatomicalStructures: ['A1 annular pulley', 'Flexor digitorum tendons', 'Palmar aponeurosis', 'Collateral ligaments'],
    whenToSeekCare: 'Schedule an evaluation if a finger locks and requires the other hand to straighten it, or if progressive contracture interferes with placing your hand flat.',
    hotspots: [
      {
        title: 'A1 Pulley (Palmar Crease)',
        description: 'Primary friction zone where tendon sheath thickening creates trigger finger symptoms.',
        x: 52,
        y: 45
      },
      {
        title: 'Proximal Interphalangeal (PIP) Joint',
        description: 'Central knuckle joint providing critical digital flexion arc.',
        x: 54,
        y: 30
      },
      {
        title: 'Distal Interphalangeal (DIP) Joint',
        description: 'Terminal digit joint subject to osteoarthritic nodes or extensor avulsions.',
        x: 55,
        y: 18
      }
    ]
  },
  nerves: {
    id: 'nerves',
    label: 'Nerves',
    eyebrow: 'SENSATION & INNERVATION',
    description: 'Three peripheral nerves govern the hand. Compressive neuropathies produce distinct maps of numbness, pins and needles, and muscle weakness depending on the affected trunk.',
    commonComplaints: [
      'Tingling or loss of feeling in the thumb, index, and middle fingers',
      'Numbness isolated to the small finger and outer ring finger',
      'Dropping items or difficulty buttoning shirts due to impaired fingertip feedback',
      'Burning sensations or electric shocks when flexing the wrist or resting elbows'
    ],
    anatomicalStructures: ['Median nerve (carpal tunnel)', 'Ulnar nerve (Guyon canal & cubital tunnel)', 'Superficial radial sensory nerve'],
    whenToSeekCare: 'Constant numbness, visible thinning of the muscles at the base of the thumb or between bones, or progressive loss of coordination warrants specialist review.',
    hotspots: [
      {
        title: 'Median Nerve Distribution',
        description: 'Palmar sensation across thumb, index, long finger, and radial ring finger.',
        x: 44,
        y: 35
      },
      {
        title: 'Ulnar Nerve Distribution',
        description: 'Sensory territory of small finger and ulnar half of ring finger.',
        x: 65,
        y: 38
      }
    ]
  }
};

export const CONDITIONS_DATA: ConditionInfo[] = [
  {
    id: 'carpal-tunnel-syndrome',
    title: 'Carpal Tunnel Syndrome',
    category: 'Nerve Compression',
    shortDescription: 'Compression of the median nerve within the carpal canal at the wrist, leading to numbness, tingling, and grip weakness.',
    overview: 'Carpal tunnel syndrome occurs when increased pressure inside the narrow fibro-osseous carpal canal impedes blood flow and signal transmission along the median nerve. This section provides proposal educational content regarding anatomy, presentation, and conservative versus surgical pathways.',
    symptoms: [
      'Numbness or pins and needles in the thumb, index, middle finger, and half of the ring finger',
      'Symptoms frequently waking the patient from sleep, relieved by shaking out the hand',
      'Radiation of discomfort into the wrist, forearm, and occasionally up to the shoulder',
      'Loss of dexterity, difficulty with buttons, or dropping small objects',
      'Thinning (atrophy) of thenar muscles at the thumb base in advanced stages'
    ],
    causes: [
      'Repetitive flexion/extension loading of the wrist',
      'Anatomical variations in carpal canal dimensions',
      'Tenosynovitis of the adjacent flexor tendons',
      'Fluid retention related to endocrine, thyroid, or metabolic conditions',
      'Previous distal radius or carpal fractures'
    ],
    treatment: [
      'Conservative: Neutral wrist splinting at night to minimize canal pressure',
      'Conservative: Activity modification and ergonomic assessment',
      'Conservative: Targeted corticosteroid injection under clinical guidance',
      'Surgical: Carpal tunnel release (endoscopic or mini-open) dividing the transverse carpal ligament'
    ],
    faqs: [
      {
        question: 'Will carpal tunnel syndrome resolve on its own?',
        answer: 'Mild early symptoms may fluctuate with rest and nocturnal splinting. Persistent numbness or muscle weakness indicates progressive nerve compression requiring clinical evaluation.'
      },
      {
        question: 'How is carpal tunnel syndrome diagnosed?',
        answer: 'Diagnosis relies on clinical history, physical examination tests (such as Phalen and Tinel maneuvers), and may be confirmed with electrodiagnostic nerve conduction studies.'
      },
      {
        question: 'What is the recovery timeframe following release surgery?',
        answer: 'Many patients notice improvement in nighttime tingling within days. Full palm comfort and grip strength rehabilitation typically progress over several weeks to months.'
      }
    ]
  },
  {
    id: 'thumb-arthritis',
    title: 'Thumb Basal Joint Arthritis',
    category: 'Degenerative Joint Disease',
    shortDescription: 'Degeneration of cartilage at the first carpometacarpal (CMC) joint, producing pain during pinch and grasp activities.',
    overview: 'Basal joint arthritis (carpometacarpal osteoarthritis) involves the breakdown of protective articular cartilage between the trapezium and the first metacarpal. Because this saddle joint withstands high multipliers of pinch force, cartilage wear creates joint stiffness and pain.',
    symptoms: [
      'Aching pain at the base of the thumb during pinch or twist motions',
      'Difficulty turning door keys, opening jars, or unfastening containers',
      'Tenderness and bony enlargement at the base of the thumb',
      'Decreased grip strength and thumb range of motion'
    ],
    causes: [
      'Age-related articular cartilage wear',
      'Past ligamentous laxity or thumb sprains',
      'High cumulative mechanical stress on the first CMC joint'
    ],
    treatment: [
      'Conservative: Custom thumb spica splinting to stabilize the joint during tasks',
      'Conservative: Topical or oral anti-inflammatory medications under medical guidance',
      'Conservative: Image-guided intra-articular steroid or viscosupplement injections',
      'Surgical: Trapeziectomy with or without ligament reconstruction and tendon interposition (LRTI)'
    ],
    faqs: [
      {
        question: 'Can thumb arthritis be managed without surgery?',
        answer: 'Yes. Many individuals achieve substantial comfort and maintain function through splinting, joint protection strategies, and targeted injections.'
      },
      {
        question: 'When should surgical intervention be considered?',
        answer: 'Surgery is typically evaluated when conservative therapies no longer control pain or when joint instability significantly interferes with daily self-care.'
      }
    ]
  },
  {
    id: 'trigger-finger',
    title: 'Trigger Finger',
    category: 'Tendon & Pulley',
    shortDescription: 'Stenosing tenosynovitis causing catching, clicking, or locking of a digit during flexion and extension.',
    overview: 'Trigger finger develops when inflammation or microtrauma thickens the flexor tendon sheath or its first annular (A1) pulley. The discrepancy between tendon caliber and pulley diameter prevents smooth gliding, leading to painful snapping or entrapment.',
    symptoms: [
      'Snapping, clicking, or popping sensation when bending or straightening the digit',
      'Stiffness or locking, particularly pronounced in the morning',
      'Palpable tender nodule in the palm at the base of the affected finger',
      'Digit may become locked in a flexed posture requiring manual release'
    ],
    causes: [
      'Repetitive forceful gripping or prolonged hand tool use',
      'Localized inflammatory tenosynovitis',
      'Higher incidence in association with diabetes or rheumatoid conditions'
    ],
    treatment: [
      'Conservative: Resting splints to limit knuckle flexion',
      'Conservative: Corticosteroid injection into the flexor tendon sheath',
      'Surgical: A1 pulley release to restore unobstructed tendon excursion'
    ],
    faqs: [
      {
        question: 'Does a steroid injection cure trigger finger?',
        answer: 'A corticosteroid injection can reduce swelling and resolve symptoms in a substantial portion of patients, particularly in early stages.'
      },
      {
        question: 'What does surgical release involve?',
        answer: 'A brief outpatient procedure under local anesthesia wherein the constricted A1 pulley is divided, immediately freeing the tendon.'
      }
    ]
  },
  {
    id: 'wrist-injuries',
    title: 'Wrist Injuries & Fractures',
    category: 'Trauma & Instability',
    shortDescription: 'Fractures, scaphoid injuries, and ligament tears resulting from acute falls or sporting impacts.',
    overview: 'A fall onto an outstretched hand (FOOSH) is the most frequent cause of traumatic wrist injuries, which range from distal radius fractures and scaphoid fractures to scapholunate ligament dissociations and triangular fibrocartilage complex (TFCC) tears.',
    symptoms: [
      'Immediate pain, swelling, and localized bruising around the wrist joint',
      'Tenderness focused over the radial snuffbox or ulnar wrist border',
      'Reduced ability to bear weight or rotate the forearm (supination/pronation)',
      'Visible contour alteration in displaced fractures'
    ],
    causes: [
      'High or low-energy falls onto an extended wrist',
      'Athletic collision or vehicular trauma',
      'Torsional stress from power equipment or racquet sports'
    ],
    treatment: [
      'Assessment: Detailed clinical exam and multi-view radiographic imaging (X-ray, CT, or MRI)',
      'Conservative: Rigid cast immobilization for non-displaced stable fractures',
      'Surgical: Open reduction and internal fixation (ORIF) with low-profile titanium plates',
      'Surgical: Arthroscopic repair of TFCC tears or ligament reconstruction'
    ],
    faqs: [
      {
        question: 'Why is a scaphoid fracture considered critical?',
        answer: 'The scaphoid possesses a retrograde vascular supply. Undiagnosed or untreated fractures carry an elevated risk of delayed healing or nonunion.'
      },
      {
        question: 'How quickly should a suspected fracture be evaluated?',
        answer: 'Prompt evaluation within days of injury ensures correct anatomical alignment, reduces swelling complications, and safeguards long-term wrist function.'
      }
    ]
  }
];
