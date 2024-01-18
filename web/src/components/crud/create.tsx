import { Group, Stack, Box, Title, ScrollArea, Button } from '@mantine/core';
import { ReactNode } from 'react';

interface CreateProps {
  children: ReactNode;
  title: string;
  submitHandler?: () => void;
}

export const Create = (props: CreateProps) => {
  const { children, title, submitHandler } = props;
  return (
    <Stack h={{ base: 'calc(100vh - 60px)', md: '100vh' }} gap="0" bg="#F9FAFB">
      <Box
        px="md"
        py="md"
        bg="white"
        style={{
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Group justify="space-between" mt="0">
          <Title order={3}>{title}</Title>
          <Button onClick={submitHandler}>Tạo</Button>
        </Group>
      </Box>
      <ScrollArea h="100%">{children}</ScrollArea>
    </Stack>
  );
};
