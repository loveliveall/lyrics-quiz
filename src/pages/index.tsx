import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';

function Home() {
  const navigate = useNavigate();
  const onStartClick = () => {
    navigate('/game');
  };

  return (
    <VStack spacing={4}>
      <VStack>
        <Heading size="lg">러브라이브 선샤인</Heading>
        <Heading size="md">가사로 음악 맞추기</Heading>
      </VStack>
      <VStack>
        <Text>곡의 일부분 가사를 무작위로 섞은 가사가 제시됩니다.</Text>
        <Text>제시되는 가사를 보고 곡을 맞춰주세요.</Text>
        <Text>가사는 원어, 독음, 해석의 세 가지로 제공됩니다.</Text>
        <Text color="red">※ 주의: 브라우저를 종료하거나 새로고침하면 게임이 초기화 됩니다.</Text>
      </VStack>
      <Button onClick={onStartClick} colorScheme="blue">
        출발!
      </Button>
    </VStack>
  );
}

export default Home;
