export type SongEntry = {
  id: string,
  name: { jp: string, kr: string, },
  alias: string[],
  lyrics: {
    kanji: string[],
    kana: string[],
    kr: string[],
  },
};
