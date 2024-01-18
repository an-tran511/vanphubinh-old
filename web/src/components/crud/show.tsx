import {
  Group,
  Stack,
  Box,
  Title,
  Text,
  Button,
  em,
  ActionIcon,
  Card,
  Flex,
  Tabs,
  Avatar,
  Textarea,
  Container,
  Divider,
  Popover,
  ScrollArea,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { CaretDown, Plus } from '@phosphor-icons/react';
import { ReactNode } from 'react';
import classes from './Crud.module.css';
import tabClasses from '../tab/Tab.module.css';

interface CreateProps {
  children: ReactNode;
  title: string;
  submitHandler?: () => void;
}

export const Show = (props: CreateProps) => {
  const { children, title, submitHandler } = props;
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);

  return (
    <Stack h={{ base: 'calc(100vh - 60px)', md: '100vh' }} gap="0">
      <Box
        p="md"
        style={{
          borderBottom: '1px solid var(--mantine-color-gray-3)',
          position: 'sticky',
          top: 0,
        }}
      >
        <Group justify="space-between">
          <Group>
            <Title order={isMobile ? 4 : 2}>{title}</Title>
          </Group>

          <Group justify="flex-end" gap="xs">
            {isMobile ? (
              <ActionIcon size="md" aria-label="Settings">
                <Plus size={14} weight="bold" />
              </ActionIcon>
            ) : (
              <Button
                size={isMobile ? 'xs' : 'sm'}
                variant="filled"
                radius="md"
                justify="space-between"
              >
                Thêm mới
              </Button>
            )}
          </Group>
        </Group>
      </Box>
      <Box className={classes.wrapper}>
        <Box className={classes.main}>
          <ScrollArea h="100%">{children}</ScrollArea>
        </Box>
        <Box className={classes.aside} visibleFrom="md">
          <Card px="md" bg="gray.0">
            <Group>
              <Popover width="target" position="bottom" withArrow shadow="md">
                <Popover.Target>
                  <Button
                    color="gray.0"
                    autoContrast
                    justify="space-between"
                    rightSection={<CaretDown size={14} />}
                    size="compact-md"
                  >
                    <Text fw={500}>Bình luận</Text>
                  </Button>
                </Popover.Target>
                <Popover.Dropdown p="xs">
                  <Stack gap="xs">
                    <Button variant="subtle" autoContrast size="compact-md">
                      <Text fw={500}>Tất cả</Text>
                    </Button>
                    <Button variant="subtle" autoContrast size="compact-md">
                      <Text fw={500}>Bình luận</Text>
                    </Button>
                    <Button variant="subtle" autoContrast size="compact-md">
                      <Text fw={500}>Lịch sử</Text>
                    </Button>
                  </Stack>
                </Popover.Dropdown>
              </Popover>
            </Group>
            <Divider my="sm" />
          </Card>
        </Box>
      </Box>
    </Stack>
  );
};
