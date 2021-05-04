import { LoremIpsum } from "lorem-ipsum";
import data from "./data.json";

export interface Athlete {
  id: number;
  athlete: string;
  age: number;
  country: string;
  sport: string;
  bronze: number;
  silver: number;
  gold: number;
  total: number;
  date: string;
  year: number;
  description?: string;
}

function* getId(reset: boolean = false) {
  let id = 0;
  while (true) {
    if (reset) id = 0;
    yield ++id;
  }
  return -1;
}
const idGenerator = getId();
const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 1
  },
  wordsPerSentence: {
    max: 5,
    min: 1
  }
});

function attachId(data: Omit<Athlete, "id">[]): Athlete[] {
  return data.map((a) => ({
    ...a,
    id: idGenerator.next().value,
    description: lorem.generateParagraphs(1)
  }));
}

export function fetchData(): Promise<Athlete[]> {
  return Promise.resolve(data).then((data) => attachId(data));
}

export function fetchLargeData() {
  const dataUrl =
    "https://raw.githubusercontent.com/ag-grid/ag-grid-docs/master/src/olympicWinnersSmall.json";
  return fetch(dataUrl)
    .then((r) => r.json())
    .then((data) => attachId(data));
}
