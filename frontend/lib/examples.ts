export type Example = {
  name: string;
  description: string;
  code: string;
};

export const EXAMPLES: Example[] = [
  {
    name: "Standup simulator",
    description: "Everyone is \"almost done\" and blocked on something.",
    code: `-- Daily standup: circle the wagons, align the synergies

BANDWIDTH team ALIGN ["Priya", "Marcus", "Dana", "Chen"]
BANDWIDTH blockers ALIGN [
    "the API",
    "a merge conflict",
    "waiting on design",
    "my will to live",
]

BANDWIDTH i ALIGN 0
FOR EACH name IN team
    PING name + ": Yesterday I made progress. Today I'll wrap it up."
    PING "   Blocked on " + blockers[i] + "."
    i ALIGN i + 1
THANKS

PING ""
PING "Cool. Let's take that offline and circle back."
`,
  },
  {
    name: "Meeting cost calculator",
    description: "Proves the meeting could have been an email.",
    code: `-- Finance would like a word

DELIVERABLE burn(people, minutes)
    BANDWIDTH hourly_rate ALIGN 75
    CIRCLE BACK TO OFFICE round(people * minutes / 60 * hourly_rate)
THANKS

BANDWIDTH attendees ALIGN 9
BANDWIDTH length ALIGN 55
BANDWIDTH cost ALIGN burn(attendees, length)

PING str(attendees) + " people trapped for " + str(length) + " minutes"
PING "Cost to the business: $" + str(cost)
PING "Cost as an email: $0"
PING "Action items produced: " + str(cost * 0)
`,
  },
  {
    name: "Buzzword bingo",
    description: "Generates synergy until morale improves.",
    code: `-- Leverage the low-hanging fruit on the roadmap

BANDWIDTH verbs ALIGN ["leverage", "socialize", "operationalize", "unlock", "double-click on"]
BANDWIDTH nouns ALIGN ["the roadmap", "core competencies", "the North Star", "key learnings"]

BANDWIDTH card ALIGN 1
FOR EACH v IN verbs
    FOR EACH n IN nouns
        TOUCH BASE (len(v) + len(n)) % 2 == 0
            PING str(card) + ". Action item: " + v + " " + n
            card ALIGN card + 1
THANKS

PING ""
PING "BINGO. Meeting adjourned. Recap to follow (it won't)."
`,
  },
  {
    name: "Out-of-office auto-reply",
    description: "Says nothing, professionally, for four days.",
    code: `-- The most honest auto-reply ever deployed

BANDWIDTH days ALIGN 4

PING "Thanks for your email!"
PING "I am currently away with limited access to email."
PING "I will circle back within " + str(days) + " business days."
PING ""

FOR EACH d IN range(1, days + 1)
    PING "Day " + str(d) + ": still not reading this."
THANKS

PING ""
PING "For anything urgent, please loop in someone who also won't reply."
`,
  },
  {
    name: "Performance review translator",
    description: "Turns honest scores into HR-safe language.",
    code: `-- Calibration season

BANDWIDTH scores ALIGN {
    "communication": 2,
    "shipping": 5,
    "teamwork": 3,
    "meetings survived": 9001,
}

FOR EACH area IN scores
    BANDWIDTH s ALIGN scores[area]
    TOUCH BASE s >= 9000
        PING area + ": a true culture add"
    OTHERWISE IF s >= 4
        PING area + ": consistently exceeds expectations"
    OTHERWISE IF s == 3
        PING area + ": meets expectations (for now)"
    OTHERWISE
        PING area + ": significant growth opportunity"
THANKS
`,
  },
  {
    name: "The eternal roadmap",
    description: "A while-true loop that always descopes just in time.",
    code: `-- The roadmap is a living document

BANDWIDTH quarter ALIGN 1

CIRCLE BACK LOCKED IN
    PING "Q" + str(quarter) + ": this is the quarter we finally ship it"
    quarter ALIGN quarter + 1
    TOUCH BASE quarter > 6
        PING "..."
        PING "Descoped. Pushed to H2. Thanks everyone!"
        TAKE THIS OFFLINE
THANKS
`,
  },
  {
    name: "Incident retrospective",
    description: "A SEV-1, a rollback that's also on fire, and zero owners.",
    code: `-- Incident #4823: "the dashboard is just white now"

LOOP IN random AS chaos
chaos.seed(4823)

BANDWIDTH severity ALIGN chaos.choice(["SEV-1", "SEV-2", "SEV-3"])
PING "Declaring " + severity + ". Assembling the war room."
PING ""

RISK
    PING "Rolling back the deploy..."
    TOUCH BASE severity == "SEV-1"
        ESCALATE RuntimeError("rollback is also on fire")
    PING "Rollback complete. Dashboard restored."
DAMAGE CONTROL RuntimeError AS e
    PING "Rollback failed: " + str(e)
    PING "Paging the one person who actually understands the pipeline."
RETRO
    PING ""
    PING "Blameless post-mortem booked for a slot nobody can make."
    PING "Action items: 6. Owners: 0."
`,
  },
];
