const SYMPTOMS = [
  { key: 'bleeding', pts: 3 },
  { key: 'eyelid',   pts: 3 },
  { key: 'breath',   pts: 2 },
  { key: 'heart',    pts: 2 },
  { key: 'nails',    pts: 2 },
  { key: 'fatigue',  pts: 1 },
  { key: 'dizzy',    pts: 1 },
  { key: 'days',     pts: 1 },
]

export function calculateRisk(answers) {
  if (answers.bleeding && answers.eyelid) {
    return { score: 99, level: 'red', action: 'REFER NOW — send to PHC immediately', override: true }
  }
  const score = SYMPTOMS.reduce((sum, s) => sum + (answers[s.key] ? s.pts : 0), 0)
  if (score >= 7) return { score, level: 'red',   action: 'Refer to PHC today. Send WhatsApp alert now.', override: false }
  if (score >= 4) return { score, level: 'amber', action: 'Revisit in 2 days. Start iron immediately.', override: false }
  return               { score, level: 'green', action: 'Give iron tablets. Revisit in 7 days.', override: false }
}