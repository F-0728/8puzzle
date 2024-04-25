"use client";

import React from 'react';
import { searchNull, shuffle, isMovable, initialPieces, minSteps, minStepColor } from './utilities';
import { Box, Button, HStack, Stack, Text } from '@chakra-ui/react';

export default function Home() {
  const [pieces, setPieces] = React.useState(initialPieces);
  const [counter, setCounter] = React.useState(0);

  const handleClick = (rowIndex: number, colIndex: number) => {
    const nullPos = searchNull(pieces);
    const newPieces = [...pieces];
    newPieces[nullPos[0]][nullPos[1]] = pieces[rowIndex][colIndex];
    newPieces[rowIndex][colIndex] = null;
    setPieces(newPieces);
    setCounter(counter + 1);
  };

  const currentMinSteps = minSteps(pieces);

  return (
    <>
      <Stack spacing={4} alignContent='center' justifyContent='center' alignItems='center'>
        <HStack justifyContent='center' alignItems='center'>
          <div className="grid">
            {pieces.map((block: (number | null)[], rowIndex: number) => (
              block.map((piece: number | null, colIndex: number) => (
                <Button
                  key={String(piece)}
                  isDisabled={!isMovable(pieces, rowIndex, colIndex)}
                  className="piece"
                  onClick={() => { handleClick(rowIndex, colIndex) }}
                  style={{ width: '80px', height: '80px' }}
                  colorScheme='gray'>
                  {piece}
                </Button>
              ))
            )
            )}
          </div>
          <Stack>
            <Box p={4} color="white" bg="blackAlpha.500" rounded="md" shadow="md" maxW="240px">
              <Text fontSize="xl" fontWeight="bold">Counter: {counter}</Text>
            </Box>
            <Box mt={4} p={4} color="white" bg={minStepColor(currentMinSteps)+".500"} rounded="md" shadow="md" maxW="240px">
              <Text fontSize="xl" fontWeight="bold">Min Steps: {currentMinSteps}</Text>
            </Box>
          </Stack>
        </HStack>
        <div><Button
          className="shuffle"
          onClick={() => { setPieces(shuffle(pieces)); setCounter(0) }}
          colorScheme='teal'>shuffle!</Button></div>
      </Stack>
    </>
  )
}
