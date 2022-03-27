import React from 'react';
import {
  useColorModeValue,
  Button,
  ButtonGroup,
  Center,
  Heading,
  Spinner,
  VStack,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import SearchableSelect from '@/components/SearchableSelect';

import { shuffle } from '@/utils';
import { SONGLIST } from '@/songlist';

type GameState = {
  qNo: number,
  problemDisplay: string[],
  answerId: string,
  answerName: {
    jp: string,
    kr: string,
  },
  answerDisplay: string[],
  judgeResult: boolean | null, // Null means problem screen
};

const SONG_COUNT = SONGLIST.length;
const ZERO_ARRAY = new Array<number>(SONG_COUNT).fill(0);

function Game() {
  const navigate = useNavigate();
  const answerTextColor = useColorModeValue('blue.500', 'blue.200');
  const correctTextColor = useColorModeValue('green.500', 'green.200');
  const wrongTextColor = useColorModeValue('red.500', 'red.200');
  const songFreq = React.useRef([...ZERO_ARRAY]);
  const [gameState, setGameState] = React.useState<GameState | null>(null);
  const [selectedSongId, setSelectedSongId] = React.useState(SONGLIST[0]!.id);
  const [locale, setLocale] = React.useState<'jp' | 'kr'>('jp');

  const setNextGameState = (nextQNo: number) => {
    if (nextQNo === 1) songFreq.current = [...ZERO_ARRAY]; // Initialize on first question
    // Logic to select next problem
    // Select next song for problem. If song is selected more than average, it will have lower probability to be selected and vice versa.
    const totalFreq = songFreq.current.reduce((a, b) => a + b, 0);
    const softmax = songFreq.current.map((f) => Math.exp(Math.min((totalFreq - f * SONG_COUNT) / SONG_COUNT, 10)));
    const totalSoftmax = softmax.reduce((a, b) => a + b, 0);
    const ansIdx = (() => {
      const r = Math.random() * totalSoftmax;
      let acc = 0;
      for (let i = 0; i < SONG_COUNT - 1; i++) {
        acc += softmax[i]!;
        if (r < acc) {
          return i;
        }
      }
      return SONG_COUNT - 1;
    })();
    const ans = SONGLIST[ansIdx]!;
    songFreq.current[ansIdx] += 1;
    // Select section to use as problem
    const probLen = Math.floor(Math.random() * 5) + 8;
    const probStart = Math.floor(Math.random() * (ans.lyrics.kanji.length - probLen + 1));
    // Find permutation for problem
    let probOrder = shuffle(new Array(probLen).fill(null).map((_, i) => i));
    // If any of three are consecutive, find another one
    while (true) {
      let notSimilar = true;
      for (let i = 0; i < probOrder.length - 2; i += 1) {
        if (probOrder[i]! + 1 === probOrder[i + 1] && probOrder[i + 1]! + 1 === probOrder[i + 2]) {
          notSimilar = false;
          break;
        }
      }
      if (notSimilar) break;
      probOrder = shuffle(new Array(probLen).fill(null).map((_, i) => i));
    }
    const kanjiAnswer = ans.lyrics.kanji.slice(probStart, probStart + probLen);
    const kanaAnswer = ans.lyrics.kana.slice(probStart, probStart + probLen);
    const krAnswer = ans.lyrics.kr.slice(probStart, probStart + probLen);
    setGameState({
      qNo: nextQNo,
      problemDisplay: [
        probOrder.map((i) => kanjiAnswer[i]).join(' / '),
        probOrder.map((i) => kanaAnswer[i]).join(' / '),
        probOrder.map((i) => krAnswer[i]).join(' / '),
      ],
      answerId: ans.id,
      answerName: ans.name,
      answerDisplay: [kanjiAnswer.join(' / '), kanaAnswer.join(' / '), krAnswer.join(' / ')],
      judgeResult: null,
    });
  };

  React.useEffect(() => {
    if (gameState === null) {
      // Initialize game
      setNextGameState(1);
    }
  }, [gameState]);

  if (gameState === null) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  const {
    qNo, problemDisplay, answerId, answerName, answerDisplay, judgeResult,
  } = gameState;

  const onSubmission = () => {
    if (selectedSongId === answerId) {
      setGameState({
        ...gameState,
        judgeResult: true,
      });
    } else {
      setGameState({
        ...gameState,
        judgeResult: false,
      });
    }
  };

  const onNextClick = () => {
    setNextGameState(qNo + 1);
    setSelectedSongId(SONGLIST[0]!.id);
  };

  const onResetClick = () => {
    setNextGameState(1);
  };

  return (
    <VStack spacing={4}>
      <Button onClick={() => navigate('/')} colorScheme="blue">홈으로</Button>
      <Heading>{`문제 ${qNo}`}</Heading>
      <VStack wordBreak="keep-all" textAlign="center">
        {problemDisplay.map((line) => (
          <Text key={line}>{line}</Text>
        ))}
      </VStack>
      {judgeResult === null && (
        <>
          <SearchableSelect
            itemList={SONGLIST.map((e) => ({
              key: e.id,
              label: e.name[locale],
              searchKeywords: [e.name.jp, e.name.kr, ...e.alias],
            }))}
            selectedItemKey={selectedSongId}
            setSelectedItemKey={setSelectedSongId}
          />
          <Button onClick={onSubmission} colorScheme="blue">제출</Button>
        </>
      )}
      {judgeResult === true && (
        <>
          <Text color={correctTextColor} fontSize="lg">정답입니다 ٩(๑＞◡＜๑)۶</Text>
          <Heading size="sm">원래 가사</Heading>
          <VStack wordBreak="keep-all" textAlign="center">
            {answerDisplay.map((line) => (
              <Text key={line}>{line}</Text>
            ))}
          </VStack>
          <Button onClick={onNextClick} colorScheme="blue">다음 문제</Button>
        </>
      )}
      {judgeResult === false && (
        <>
          <Text color={wrongTextColor} fontSize="lg">틀렸습니다 ｡°(´∩ω∩\`)°｡</Text>
          <Text>
            정답은
            {' '}
            <Text as="span" color={answerTextColor}>{answerName[locale]}</Text>
            {' '}
            입니다 (*ﾟДﾟ)
          </Text>
          <Heading size="sm">원래 가사</Heading>
          <VStack wordBreak="keep-all" textAlign="center">
            {answerDisplay.map((line) => (
              <Text key={line}>{line}</Text>
            ))}
          </VStack>
          <Text fontSize="lg">게임이 종료되었습니다.</Text>
          <Text fontSize="lg">{`총 ${qNo - 1}개를 맞추셨어요!`}</Text>
          <Button onClick={onResetClick} colorScheme="green">찐막?</Button>
        </>
      )}
      <Heading size="sm">곡 제목 표기 언어</Heading>
      <ButtonGroup isAttached variant="outline">
        <Button isActive={locale === 'kr'} onClick={() => setLocale('kr')}>한국어</Button>
        <Button isActive={locale === 'jp'} onClick={() => setLocale('jp')}>일본어</Button>
      </ButtonGroup>
    </VStack>
  );
}

export default Game;
