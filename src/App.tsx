import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  useColorMode,
  Container,
  Center,
  FormControl,
  FormLabel,
  Switch,
} from '@chakra-ui/react';

import Home from '@/pages';
import Game from '@/pages/game';

function App() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Container maxW="container.lg" pt={4}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
      </Routes>
      <Center py={6}>
        <FormControl display="flex" alignItems="center" w="auto">
          <FormLabel htmlFor="colormode" mb={0}>다크 모드</FormLabel>
          <Switch
            id="colormode"
            colorScheme="blue"
            isChecked={colorMode === 'dark'}
            onChange={toggleColorMode}
          />
        </FormControl>
      </Center>
    </Container>
  );
}

export default App;
