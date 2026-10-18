export interface Stats {
  props: number
  kills: number
  bones: number
  bowl: number
}

export interface Mission {
  title: string
  goal: string
  intro: string
  outro: string
  done: (s: Stats) => boolean
  progress: (s: Stats) => string
}

export const EMPTY_STATS: Stats = { props: 0, kills: 0, bones: 0, bowl: 0 }

export const BONES_TOTAL = 3

export const MISSIONS: Mission[] = [
  {
    title: 'Aufwärmen',
    goal: 'Wirf 5 Gegenstände um',
    intro:
      'Kapitel eins. Timmi Tatz hat Hunger, doch der Napf ist leer. Jemand hat das Abendessen gestohlen. Beginne damit, das Mobiliar zu verhören. Kratze fünf Gegenstände um.',
    outro: 'Die Gegenstände schweigen. Sehr verdächtig.',
    done: (s) => s.props >= 5,
    progress: (s) => `${Math.min(s.props, 5)}/5`,
  },
  {
    title: 'Hundefrust',
    goal: 'Besiege 3 Wachhunde',
    intro: 'Die Wachhunde der Nachbarschaft wissen mehr, als sie zugeben. Erkläre ihnen die Lage. Mit Krallen.',
    outro: 'Die Hunde sind jetzt deutlich gesprächiger. Und ein wenig kleinlauter.',
    done: (s) => s.kills >= 3,
    progress: (s) => `${Math.min(s.kills, 3)}/3`,
  },
  {
    title: 'Hoch hinaus',
    goal: 'Sammle 3 goldene Fischgräten (Dach, Kratzpfosten, Garten). Klettern: W gegen eine Wand',
    intro:
      'Die Spuren führen nach oben. Drei goldene Fischgräten liegen verstreut auf Dächern und Pfosten. Katzen klettern. Halte W gegen eine Wand.',
    outro: 'Drei Fischgräten. Das Dosenöffner-Syndikat ist beeindruckt und leicht beunruhigt.',
    done: (s) => s.bones >= BONES_TOTAL,
    progress: (s) => `${Math.min(s.bones, BONES_TOTAL)}/${BONES_TOTAL}`,
  },
  {
    title: 'Das Abendessen',
    goal: 'Erreiche den Napf im Haus',
    intro: 'Der Napf steht im Haus. Geh hinein und hole dir, was dir zusteht.',
    outro: 'Der Napf. Endlich. Timmi Tatz frisst. Das Chaos kann warten. Vorerst.',
    done: (s) => s.bowl >= 1,
    progress: (s) => (s.bowl >= 1 ? '1/1' : '0/1'),
  },
]

/** Nächster Missionsindex: überspringt alle bereits erfüllten Missionen. */
export function advance(index: number, stats: Stats, missions: readonly Mission[] = MISSIONS): number {
  let i = index
  while (i < missions.length && missions[i].done(stats)) i++
  return i
}
